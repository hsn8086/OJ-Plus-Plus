/**
 * 端到端验证：在真实牛客题目页注入构建产物，
 * 分别用三种协议打通 mock AI 服务，检查译文渲染与 KaTeX。
 *
 *   node tools/e2e-check.mjs
 * 依赖：本地 http server（dist）与 mock-ai-server 已在运行。
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const SCRIPT_URL = 'http://127.0.0.1:8791/nowcoder-better.user.js';
const PAGE_URL = 'https://ac.nowcoder.com/acm/contest/100000/A';
const MOCK = 'http://127.0.0.1:8787/v1';

const PROTOCOLS = [
  { protocol: 'openai-chat', baseUrl: MOCK, model: 'mock-chat' },
  { protocol: 'openai-responses', baseUrl: MOCK, model: 'mock-resp' },
  { protocol: 'anthropic', baseUrl: MOCK, model: 'mock-claude' },
];

const results = [];
let failures = 0;

function makeInitScript(settings) {
  return `
    (function(){
      const store = new Map();
      store.set('ncb:settings', ${JSON.stringify(JSON.stringify(settings))});
      window.GM_getValue = (k, d) => {
        if (!store.has(k)) return d;
        const v = store.get(k);
        try { return typeof v === 'string' ? JSON.parse(v) : v; } catch(e) { return v; }
      };
      window.GM_setValue = (k, v) => store.set(k, typeof v === 'string' ? v : JSON.stringify(v));
      window.GM_deleteValue = (k) => store.delete(k);
      window.GM_listValues = () => Array.from(store.keys());
      window.GM_addStyle = (css) => { const s = document.createElement('style'); s.textContent = css; (document.head||document.documentElement).appendChild(s); return s; };
      window.GM_setClipboard = () => {};
      window.GM_xmlhttpRequest = (opts) => {
        const xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'GET', opts.url, true);
        const hs = opts.headers || {};
        for (const k of Object.keys(hs)) { try { xhr.setRequestHeader(k, hs[k]); } catch(e){} }
        xhr.onload = () => { if (opts.onload) opts.onload({ status: xhr.status, statusText: xhr.statusText, responseText: xhr.responseText, responseHeaders: xhr.getAllResponseHeaders(), finalUrl: opts.url }); };
        xhr.onerror = () => { if (opts.onerror) opts.onerror({ error: 'network' }); };
        xhr.ontimeout = () => { if (opts.ontimeout) opts.ontimeout(); };
        xhr.send(opts.data || null);
        return { abort: () => xhr.abort() };
      };
    })();`;
}

function settingsFor({ protocol, baseUrl, model }) {
  return {
    version: 1,
    activeProviderId: 'p1',
    providers: [
      {
        id: 'p1',
        name: `Mock ${protocol}`,
        protocol,
        baseUrl,
        apiKey: 'test-key',
        model,
        headers: {},
        body: {},
        reasoning: { enabled: null, effort: '' },
        temperature: null,
      },
    ],
    targetLang: '简体中文',
    extraPrompt: '',
    translateWholeBlock: true,
    autoTranslate: false,
    timeoutMs: 30000,
    retries: 0,
  };
}

const CHROME_PATHS = [
  process.env.NCB_CHROME,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
].filter(Boolean);
const executablePath = CHROME_PATHS.find((p) => existsSync(p));

const browser = await chromium.launch(executablePath ? { executablePath } : {});

for (const variant of PROTOCOLS) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  page.on('request', (req) => {
    if (req.url().includes('127.0.0.1:8787')) {
      let body = null;
      try {
        body = JSON.parse(req.postData() || 'null');
      } catch {
        body = null;
      }
      requests.push({ url: req.url(), headers: req.headers(), body });
    }
  });
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.addInitScript({ content: makeInitScript(settingsFor(variant)) });
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ url: SCRIPT_URL });
  await page.waitForSelector('.ncb-toolbar', { timeout: 10000 });

  await page.evaluate(() => {
    document.querySelector('.ncb-translate-btn').click();
  });
  await page.waitForFunction(
    () => {
      const status = document.querySelector('.ncb-result-status');
      return status && /·.*s$/.test(status.textContent || '');
    },
    { timeout: 20000 },
  );

  const snapshot = await page.evaluate(() => {
    const panel = document.querySelector('.ncb-result');
    const body = panel.querySelector('.ncb-result-body');
    // 检查 katex 之外是否还有裸露的 $...$ 或 \hspace
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    let leaked = '';
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('.katex')) continue;
      leaked += node.textContent;
    }
    return {
      status: panel.querySelector('.ncb-result-status').textContent,
      hasResult: !!body.textContent.trim(),
      katexCount: body.querySelectorAll('.katex').length,
      rawLatexLeaked: /\\hspace|\$/.test(leaked),
      toolbarCount: document.querySelectorAll('.ncb-toolbar').length,
    };
  });

  const shape = assertRequestShape(variant.protocol, requests[0]);

  const ok =
    snapshot.hasResult &&
    snapshot.katexCount > 0 &&
    !snapshot.rawLatexLeaked &&
    requests.length > 0 &&
    shape.ok &&
    errors.length === 0;

  if (!ok) failures += 1;
  results.push({
    protocol: variant.protocol,
    ok,
    requests: requests.length,
    shape: shape.detail,
    ...snapshot,
    errors,
  });
  await context.close();
}

await browser.close();

function assertRequestShape(protocol, req) {
  if (!req || !req.body) return { ok: false, detail: 'no request body' };
  const body = req.body;
  const headers = req.headers || {};
  if (protocol === 'openai-chat') {
    const ok = Array.isArray(body.messages) && !!headers.authorization;
    return { ok, detail: ok ? 'messages + Bearer' : JSON.stringify(Object.keys(body)) };
  }
  if (protocol === 'openai-responses') {
    const ok = Array.isArray(body.input) && !!headers.authorization;
    return { ok, detail: ok ? 'input + Bearer' : JSON.stringify(Object.keys(body)) };
  }
  if (protocol === 'anthropic') {
    const ok = Array.isArray(body.messages) && !!headers['x-api-key'] && !!headers['anthropic-version'];
    return { ok, detail: ok ? 'messages + x-api-key' : JSON.stringify(Object.keys(headers)) };
  }
  return { ok: false, detail: 'unknown protocol' };
}

for (const r of results) {
  console.log(
    `${r.ok ? '✅' : '❌'} ${r.protocol.padEnd(18)} status="${r.status}" katex=${r.katexCount} requests=${r.requests} shape=${r.shape} errors=${r.errors.length}`,
  );
}
console.log(failures === 0 ? '\n全部通过' : `\n${failures} 项失败`);
process.exit(failures === 0 ? 0 : 1);
