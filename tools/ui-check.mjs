/**
 * UI 回归检查：针对曾经出过问题的交互逐条断言。
 *
 *   node tools/ui-check.mjs
 * 依赖：mock-ai-server（8787）与 dist 的 http server（8791）已在运行。
 *
 * 覆盖的历史问题：
 *   1. 工具栏要图标化，且不重复出现设置入口
 *   2. 备注名输入每敲一个字母都会失焦
 *   3. 在输入框里选文本、拖出面板松手会误关设置窗口
 *   4. 译文面板左侧的蓝色加粗边
 *   5. 重复点翻译会叠出多个面板
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const SCRIPT_URL = 'http://127.0.0.1:8791/nowcoder-better.user.js';
const PAGE_URL = 'https://ac.nowcoder.com/acm/contest/100000/A';

const CHROME_CANDIDATES = [
  process.env.NCB_CHROME,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
].filter(Boolean);

const settings = {
  version: 1,
  activeProviderId: 'p1',
  providers: [
    {
      id: 'p1',
      name: 'DeepSeek',
      protocol: 'openai-chat',
      baseUrl: 'http://127.0.0.1:8787/v1',
      apiKey: 'test-key',
      model: 'deepseek-chat',
      headers: {},
      body: {},
      reasoning: { enabled: null, effort: '' },
    },
  ],
  targetLang: '简体中文',
  extraPrompt: '',
  translateWholeBlock: true,
  autoTranslate: false,
  timeoutMs: 30000,
  retries: 0,
};

const initScript = `
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
    window.GM_xmlhttpRequest = (o) => {
      const x = new XMLHttpRequest();
      x.open(o.method || 'GET', o.url, true);
      const h = o.headers || {};
      for (const k of Object.keys(h)) { try { x.setRequestHeader(k, h[k]); } catch(e){} }
      x.onload = () => { if (o.onload) o.onload({ status: x.status, statusText: x.statusText, responseText: x.responseText, responseHeaders: x.getAllResponseHeaders(), finalUrl: o.url }); };
      x.onerror = () => { if (o.onerror) o.onerror({ error: 'network' }); };
      x.send(o.data || null);
      return { abort: () => x.abort() };
    };
  })();`;

const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok, detail });
}

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1180, height: 860 } });
await page.addInitScript({ content: initScript });
await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
await page.addScriptTag({ url: SCRIPT_URL });
await page.waitForSelector('.ncb-toolbar');

// 1. 工具栏图标化
const toolbar = await page.evaluate(() => {
  const bars = Array.from(document.querySelectorAll('.ncb-toolbar'));
  return {
    count: bars.length,
    texts: bars.map((b) => b.textContent.trim()),
    svgCounts: bars.map((b) => b.querySelectorAll('svg').length),
    settingsPerToolbar: document.querySelectorAll('.ncb-toolbar .ncb-settings-btn').length,
    settingsInHeader: !!document.querySelector('.header-right .ncb-settings-btn'),
  };
});
check('工具栏已注入', toolbar.count >= 3, `count=${toolbar.count}`);
check('工具栏只有图标没有文字', toolbar.texts.every((t) => t === ''), JSON.stringify(toolbar.texts));
check('每个工具栏 3 个图标', toolbar.svgCounts.every((n) => n === 3), JSON.stringify(toolbar.svgCounts));
check('设置入口不在工具栏里', toolbar.settingsPerToolbar === 0);
check('设置入口在页面右上角', toolbar.settingsInHeader);

// 2. 备注名输入不失焦
await page.evaluate(() => document.querySelector('.ncb-settings-btn').click());
await page.waitForSelector('.ncb-mask');
await page.evaluate(() => document.querySelectorAll('.ncb-tab')[1].click());
await page.waitForTimeout(200);
check(
  '设置面板已去掉 temperature 字段',
  await page.evaluate(() => !/temperature/i.test(document.querySelector('.ncb-panel-body').textContent)),
);

const nameInput = page.locator('.ncb-panel input[type="text"]').first();
await nameInput.click();
await nameInput.press('End');
await page.keyboard.type('ABC');
await page.waitForTimeout(200);
check('备注名完整输入', (await nameInput.inputValue()).endsWith('ABC'), await nameInput.inputValue());
check(
  '备注名输入后仍然聚焦',
  await page.evaluate(() => document.activeElement?.tagName === 'INPUT'),
);
check(
  '备注名实时同步到列表',
  (await page.locator('.ncb-provider-item .ncb-provider-name').first().textContent()).endsWith('ABC'),
);

// 3. 选文本拖出面板不应关闭
await nameInput.evaluate((el) => {
  el.focus();
  el.setSelectionRange(0, 4);
});
const box = await nameInput.boundingBox();
await page.mouse.move(box.x + 5, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 200, box.y + box.height / 2, { steps: 5 });
await page.mouse.move(60, 820, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(200);
check('选文本拖出面板不会关闭窗口', (await page.locator('.ncb-mask').count()) === 1);

// 4. 点遮罩空白仍然关闭
await page.waitForTimeout(400);
await page.mouse.click(30, 830);
await page.waitForTimeout(200);
check('点遮罩空白会关闭窗口', (await page.locator('.ncb-mask').count()) === 0);

// 5. 译文面板没有蓝色左边框；重复翻译不叠加
await page.evaluate(() => document.querySelector('.ncb-translate-btn').click());
await page.waitForTimeout(1200);
for (let i = 0; i < 2; i += 1) {
  await page.evaluate(() => document.querySelector('.ncb-translate-btn').click());
  await page.waitForTimeout(1200);
}
const panel = await page.evaluate(() => {
  const el = document.querySelector('.ncb-result');
  const st = getComputedStyle(el);
  return {
    count: document.querySelectorAll('.ncb-result').length,
    borderLeftColor: st.borderLeftColor,
    borderLeftWidth: st.borderLeftWidth,
    borderTopColor: st.borderTopColor,
    hasText: !!el.querySelector('.ncb-result-body').textContent.trim(),
  };
});
check('译文面板只有一个', panel.count === 1, `count=${panel.count}`);
check('译文面板有内容', panel.hasText);
check(
  '译文面板没有蓝色加粗左边框',
  panel.borderLeftColor === panel.borderTopColor && panel.borderLeftWidth === '1px',
  `left=${panel.borderLeftWidth} ${panel.borderLeftColor} top=${panel.borderTopColor}`,
);

await browser.close();

let failed = 0;
for (const c of checks) {
  if (!c.ok) failed += 1;
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
}
console.log(failed === 0 ? '\n全部通过' : `\n${failed} 项失败`);
process.exit(failed === 0 ? 0 : 1);
