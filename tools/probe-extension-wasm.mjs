// Research probe only: creates a disposable MV3 extension/profile and removes both afterwards.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const root = await mkdtemp(join(tmpdir(), 'ojpp-wasm-probe-'));
const extension = join(root, 'extension');
await mkdir(extension);
const pyodideDir = process.env.OJPP_PYODIDE_DIR;
if (pyodideDir) await cp(pyodideDir, join(extension, 'pyodide'), { recursive: true });
const clangdDir = process.env.OJPP_CLANGD_DIR;
if (clangdDir) {
  await cp(clangdDir, join(extension, 'clangd'), { recursive: true });
  await cp(new URL('./probes/clangd-probe.mjs', import.meta.url), join(extension, 'clangd-probe.mjs'));
}
const files = {
  'manifest.json': JSON.stringify({
    manifest_version: 3, name: 'OJ++ WASM research probe', version: '0.0.1',
    permissions: ['offscreen'], background: { service_worker: 'background.js' },
    cross_origin_opener_policy: { value: 'same-origin' },
    cross_origin_embedder_policy: { value: 'require-corp' },
    content_security_policy: { extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" },
    web_accessible_resources: [{ resources: ['frame.html', 'frame.js'], matches: ['http://127.0.0.1/*'] }],
  }),
  'background.js': `chrome.runtime.onMessage.addListener(message => { if(message.type==='result') globalThis.probeResult=message.result; });`,
  'host.html': '<!doctype html><meta charset="utf-8"><script src="host.js"></script>',
  'host.js': `
    const worker=new Worker('runner.js');
    worker.onmessage=async ({data})=>{
      worker.terminate();
      const spin=new Worker('spin.js');
      await new Promise(resolve=>spin.onmessage=resolve);
      const start=performance.now();
      await new Promise(resolve=>setTimeout(()=>{spin.terminate();resolve();},60));
      chrome.runtime.sendMessage({type:'result',result:{documentIsolated:crossOriginIsolated,
        ...data,terminationMs:performance.now()-start}});
    };
    worker.onerror=event=>chrome.runtime.sendMessage({type:'result',result:{error:event.message}});
  `,
  'runner.js': `
    (async()=>{
      const bytes=new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,2,1,0,7,7,1,3,97,100,100,0,0,10,9,1,7,0,32,0,32,1,106,11]);
      const {instance}=await WebAssembly.instantiate(bytes);
      const shared=new WebAssembly.Memory({initial:1,maximum:2,shared:true});
      let pyodideResult;
      ${pyodideDir ? `
      try {
        const start=performance.now();
        importScripts('pyodide/pyodide.js');
        const py=await loadPyodide({indexURL:new URL('pyodide/',self.location.href).href});
        const loadMs=performance.now()-start;
        const inputs=['20 22'];const stdout=[];const stderr=[];
        py.setStdin({stdin:()=>inputs.shift()??null});
        py.setStdout({batched:line=>stdout.push(line)});
        py.setStderr({batched:line=>stderr.push(line)});
        await py.runPythonAsync('import sys\\na,b=map(int,input().split())\\nprint(a+b)\\nprint("debug-stderr", file=sys.stderr)');
        pyodideResult={version:py.version,loadMs,stdout,stderr};
      } catch(error) {pyodideResult={error:String(error)}}
      ` : ''}
      let clangdResult;
      ${clangdDir ? `
      try {clangdResult=await (await import('./clangd-probe.mjs')).probeClangd();}
      catch(error){clangdResult={error:String(error)}}
      ` : ''}
      postMessage({workerIsolated:crossOriginIsolated,sharedArrayBuffer:typeof SharedArrayBuffer==='function',
        sharedMemory:shared.buffer instanceof SharedArrayBuffer,wasmResult:instance.exports.add(20,22),
        ...(pyodideResult?{pyodide:pyodideResult}:{}),...(clangdResult?{clangd:clangdResult}:{})});
    })().catch(error=>postMessage({error:String(error)}));
  `,
  'spin.js': `postMessage('started');while(true){}`,
  'frame.html': '<!doctype html><script src="frame.js"></script>',
  'frame.js': `parent.postMessage({probe:'iframe',isolated:crossOriginIsolated,sharedArrayBuffer:typeof SharedArrayBuffer==='function'},'*');`,
};
await Promise.all(Object.entries(files).map(([name, content]) => writeFile(join(extension, name), content)));
const candidates = [process.env.OJPP_CHROME, `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, chromium.executablePath()].filter(Boolean);
let context;
let server;
try {
  context = await chromium.launchPersistentContext(join(root, 'profile'), {
    executablePath: candidates.find(p => existsSync(p)), headless: true,
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  });
  const background = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', { timeout: 15000 });
  const extensionId = new URL(background.url()).hostname;
  await background.evaluate(() => chrome.offscreen.createDocument({ url: 'host.html', reasons: ['WORKERS'], justification: 'Verify local WASM execution in a worker.' }));
  const deadline = Date.now() + (pyodideDir || clangdDir ? 45000 : 15000);
  let offscreen;
  while (Date.now() < deadline) {
    offscreen = await background.evaluate(() => globalThis.probeResult);
    if (offscreen) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(offscreen, 'offscreen worker did not report a result');
  assert.equal(offscreen.error, undefined);
  assert.equal(offscreen.wasmResult, 42);
  assert.equal(offscreen.documentIsolated, true);
  assert.equal(offscreen.workerIsolated, true);
  assert.equal(offscreen.sharedMemory, true);
  assert.ok(offscreen.terminationMs < 2000);
  if (pyodideDir) {
    assert.equal(offscreen.pyodide?.error, undefined);
    assert.deepEqual(offscreen.pyodide?.stdout, ['42']);
    assert.deepEqual(offscreen.pyodide?.stderr, ['debug-stderr']);
  }
  if (clangdDir) {
    assert.equal(offscreen.clangd?.error, undefined);
    assert.equal(offscreen.clangd?.hasSquare, true);
  }

  server = createServer((_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(`<!doctype html><script>addEventListener('message',e=>{if(e.data?.probe==='iframe')window.frameResult=e.data;});</script><iframe src="chrome-extension://${extensionId}/frame.html"></iframe>`);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.frameResult, undefined, { timeout: 10000 }).catch(() => undefined);
  const embedded = await page.evaluate(() => ({ pageIsolated: crossOriginIsolated, frame: window.frameResult ?? null }));
  const report = { browser: context.browser()?.version(), testedAt: new Date().toISOString(), offscreen, embedded };
  console.log(JSON.stringify(report, null, 2));
  if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(report, null, 2) + '\n');
} finally {
  await context?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  await rm(root, { recursive: true, force: true });
}
