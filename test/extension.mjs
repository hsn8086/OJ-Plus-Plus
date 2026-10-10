import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, cp, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const sourceExtension = resolve('dist-extension');
const profile = await mkdtemp(join(tmpdir(), 'ojpp-extension-test-'));
const extension = join(profile, 'extension');
await cp(sourceExtension, extension, { recursive: true });
// Only the disposable test copy pre-grants the local fixture endpoint.
const testManifest = JSON.parse(await readFile(join(extension, 'manifest.json'), 'utf8'));
testManifest.host_permissions = ['http://127.0.0.1/*'];
await writeFile(join(extension, 'manifest.json'), JSON.stringify(testManifest));
const server = createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const stream = JSON.parse(body).stream;
    if (!stream) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ choices: [{ message: { content: 'Extension AI bridge works.' } }] })); return; }
    res.setHeader('Content-Type', 'text/event-stream');
    res.write('data: ' + JSON.stringify({ choices: [{ delta: { content: 'Extension AI ' } }] }) + '\n\n');
    setTimeout(() => res.end('data: ' + JSON.stringify({ choices: [{ delta: { content: 'bridge works.' } }] }) + '\n\ndata: [DONE]\n\n'), 30);
  });
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const providerUrl = `http://127.0.0.1:${server.address().port}`;
const draftServer = createServer(server.listeners('request')[0]);
await new Promise(resolve => draftServer.listen(0, '127.0.0.1', resolve));
const draftUrl = `http://127.0.0.1:${draftServer.address().port}`;
const candidates = [process.env.OJPP_CHROME, `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, chromium.executablePath()].filter(Boolean);
let context;
try {
  context = await chromium.launchPersistentContext(join(profile, 'profile'), { executablePath: candidates.find(p => existsSync(p)), headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  const background = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await background.evaluate(baseUrl => chrome.storage.local.set({ 'ojpp:settings': {
    locale: 'en', targetLang: 'English', theme: 'dark', editorLanguage: { atcoder: '6082' }, autoTranslate: {},
    providers: [{ id: 'fixture', name: 'Fixture', baseUrl, protocol: 'openai-chat', model: 'fixture', apiKey: '' }], activeProviderId: 'fixture', stream: true,
  } }), providerUrl);
  const page = await context.newPage();
  const fixture = await readFile(new URL('./fixtures/atcoder-task.html', import.meta.url), 'utf8');
  const url = 'https://atcoder.jp/contests/abc350/tasks/abc350_a';
  await page.route('https://atcoder.jp/**', route => route.request().url() === url
    ? route.fulfill({ body: fixture, contentType: 'text/html' }) : route.abort());
  await page.goto(url);
  await page.waitForSelector('.ojpp-editor');
  assert.equal(await page.locator('.ojpp-editor-backend').inputValue(), 'local');
  await page.locator('.lang-en .ojpp-translate-btn').first().click();
  await page.waitForFunction(() => document.querySelector('.lang-en .ojpp-translate-btn')?.dataset.state === 'done');
  assert.match(await page.locator('.lang-en').innerText(), /Extension AI bridge works/);
  console.log('✓ extension storage and streaming AI HTTP bridge');
  await page.locator('.ojpp-settings-btn').click();
  await page.locator('.ojpp-provider-summary + button').click();
  await page.locator('.ojpp-provider-edit').first().click();
  await page.getByPlaceholder('https://api.openai.com/v1').fill(draftUrl + '/v1');
  await page.getByRole('button', { name: 'Test connection', exact: true }).click();
  await page.waitForSelector('.ojpp-status[data-kind="ok"]');
  assert.equal(await background.evaluate(async () => (await chrome.storage.local.get('ojpp:settings'))['ojpp:settings'].providers[0].baseUrl), providerUrl);
  console.log('✓ unsaved provider draft tests successfully without saving settings');

  const options = await context.newPage();
  const extensionOrigin = background.url().replace(/\/[^/]*$/, '/');
  await options.goto(extensionOrigin + 'options.html');
  const denied = await options.evaluate(url => new Promise(resolve => {
    const port = chrome.runtime.connect({ name: 'ojpp' });
    port.onMessage.addListener(message => { resolve(message); port.disconnect(); });
    port.postMessage({ id: 'unconfigured-origin', type: 'http', request: { method: 'POST', url, body: '{}' } });
  }), draftUrl + '/v1/chat/completions');
  assert.equal(denied.kind, 'error');
  assert.match(denied.error, /not configured/);
  await options.close();

  const unauthorizedUrl = `http://localhost:${draftServer.address().port}`;
  await page.getByPlaceholder('https://api.openai.com/v1').fill(unauthorizedUrl + '/v1');
  const authorizationTab = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Test connection', exact: true }).click();
  const authorization = await authorizationTab;
  await authorization.waitForSelector('[data-requested-origin]');
  assert.equal(await authorization.locator('[data-requested-origin]').getAttribute('data-requested-origin'), unauthorizedUrl);
  await authorization.close();
  await page.waitForSelector('.ojpp-status[data-kind="error"]');
  assert.match(await page.locator('.ojpp-status[data-kind="error"]').textContent(), /authorization cancelled/);
  await page.locator('.ojpp-panel-close').click();
  console.log('✓ missing permission opens a targeted authorization tab; closing it cancels the test');
  async function code(text) {
    await page.locator('.ojpp-editor .cm-content').focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.insertText(text);
  }
  const first = page.locator('.ojpp-test').first();
  async function runOne(expected, timeout = 45000) {
    await first.locator('.ojpp-test-run').click();
    await page.waitForFunction(expected => document.querySelector('.ojpp-test-status')?.textContent === expected, expected, { timeout });
  }
  await code('import sys\ns = input()\nprint("Yes" if s == "ABC349" else "No")\nprint("debug-stderr", file=sys.stderr)');
  await runOne('Accepted');
  assert.equal((await first.locator('.ojpp-test-stderr').textContent()).trim(), 'debug-stderr');
  assert.equal(await first.locator('.ojpp-test-stderr').isVisible(), true);
  console.log('✓ extension Python/WASI: real stdin, stdout, stderr');
  await page.locator('.ojpp-editor-actions button').first().click();
  await page.waitForFunction(() => [...document.querySelectorAll('.ojpp-test-status')].every(e => e.textContent === 'Accepted'));
  console.log('✓ extension local run-all: 3 samples');
  await page.locator('.ojpp-editor-actions button').nth(1).click();
  await page.locator('.ojpp-test-custom .ojpp-test-input').fill('你好🙂\n');
  await page.locator('.ojpp-test-custom .ojpp-test-expected').fill('你好🙂');
  await code('print(input())');
  await runOne('Accepted');
  await page.locator('.ojpp-test-custom .ojpp-test-del').click();
  console.log('✓ UTF-8 standard input/output');

  await page.locator('.ojpp-editor-lang').selectOption('6017');
  await code('#include <bits/stdc++.h>\nusing namespace std;\nint main(){string s;cin>>s;cout<<(s=="ABC349"?"Yes":"No")<<"\\n";cerr<<"cpp-stderr\\n";}');
  await runOne('Accepted', 65000);
  assert.match(await first.locator('.ojpp-test-stderr').textContent(), /cpp-stderr/);
  console.log('✓ extension C++17/WASI: real compile/link, bits/stdc++.h, stdin/stdout/stderr');
  await page.locator('.ojpp-editor-actions button').first().click();
  await page.waitForFunction(() => [...document.querySelectorAll('.ojpp-test-status')].every(e => e.textContent === 'Accepted'));

  await code('int main(){ this_is_not_cpp; }');
  await runOne('COMPILATION_ERROR');
  assert.match(await first.locator('.ojpp-test-stderr').textContent(), /this_is_not_cpp/);
  console.log('✓ extension compilation errors reach the test row');

  await page.locator('.ojpp-editor-lang').selectOption('6082');
  await page.locator('.ojpp-editor-timeout').selectOption('1000');
  await code('while True: pass');
  await runOne('TIME_LIMIT_EXCEEDED');
  await page.locator('.ojpp-editor-timeout').selectOption('30000');
  await first.locator('.ojpp-test-run').click();
  await page.waitForTimeout(300);
  await first.locator('.ojpp-test-run').click();
  await page.waitForFunction(() => document.querySelector('.ojpp-test-status')?.textContent === 'Cancelled');
  await code('print("Yes")');
  await runOne('Accepted');
  console.log('✓ extension timeout, cancellation and recovery');
  await code('while True: print("x" * 4096)');
  await runOne('OUTPUT_LIMIT_EXCEEDED');
  console.log('✓ extension output limit');
  await code('raise ValueError("fixture failure")');
  await runOne('RUNTIME_ERROR');
  assert.match(await first.locator('.ojpp-test-stderr').textContent(), /fixture failure/);

  const qojUrl = 'https://qoj.ac/problem/1';
  const qojFixture = await readFile(new URL('./fixtures/qoj.html', import.meta.url), 'utf8');
  await page.route(qojUrl, route => route.fulfill({ body: qojFixture, contentType: 'text/html' }));
  await page.goto(qojUrl);
  await page.waitForSelector('.ojpp-editor');
  assert.equal(await page.locator('.ojpp-editor-submit').count(), 0);
  await page.locator('.ojpp-editor-lang').selectOption('local-python311');
  await code('n=int(input())\nprint(sum(map(int,input().split())))');
  await runOne('Accepted');
  console.log('✓ QOJ extension-only local editor and HTML samples');
  await page.locator('.ojpp-editor-lang').selectOption('local-c11');
  await code('#include <stdio.h>\nint main(){int n,x,s=0;scanf("%d",&n);while(n--){scanf("%d",&x);s+=x;}printf("%d\\n",s);return 0;}');
  await runOne('Accepted');
  console.log('✓ extension C11/WASI compile and execution');

  const luoguUrl = 'https://www.luogu.com.cn/problem/P1001';
  const luoguFixture = (await readFile(new URL('./fixtures/luogu.html', import.meta.url), 'utf8')).replace('"pid":"P1001"', '"pid":"P1001","samples":[["20 30","50"]]');
  await page.route(luoguUrl, route => route.fulfill({ body: luoguFixture, contentType: 'text/html' }));
  await page.goto(luoguUrl);
  await page.waitForSelector('.ojpp-editor');
  await page.locator('.ojpp-editor-lang').selectOption('local-python311');
  await code('print(sum(map(int,input().split())))');
  await runOne('Accepted');
  console.log('✓ Luogu extension-only local editor and samples');

  const manifest = JSON.parse(await readFile(join(extension, 'manifest.json'), 'utf8'));
  assert.ok(!JSON.stringify(manifest).includes('clangd'));
  assert.ok(manifest.content_security_policy.extension_pages.includes('wasm-unsafe-eval'));
  console.log('Extension integration passed (real packaged WASM; no remote judge or bundled LSP).');
} catch (error) {
  if (context) for (const page of context.pages()) {
    const statuses = await page.locator('.ojpp-test').allTextContents().catch(() => []);
    if (statuses.length) console.error(statuses.map(s => s.slice(0,2000)));
  }
  throw error;
} finally { await context?.close(); await Promise.all([new Promise(resolve => server.close(resolve)), new Promise(resolve => draftServer.close(resolve))]); await rm(profile, { recursive: true, force: true }); }
