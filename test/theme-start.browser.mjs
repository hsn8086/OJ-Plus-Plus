import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

// Actual MV3 loading: paint the fixture while a deferred script holds DOMContentLoaded.
// The heavy document_idle content script cannot be responsible for these first frames.
const profile = await mkdtemp(join(tmpdir(), 'ojpp-theme-test-'));
const extension = resolve('dist-extension');
const candidates = [process.env.OJPP_CHROME,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  chromium.executablePath()].filter(Boolean);
const html = `<!doctype html><html><head><style>body{background:white}.l-card{background:white;color:black}</style>
<script defer src="/slow-theme-test.js"></script></head><body>
<div class="user-nav"></div><div class="l-card burger"><div class="body"><div class="v-codemirror"><textarea id="native">Native editor</textarea></div><button>Create</button></div></div>
<script>window.domReady=false;document.addEventListener('DOMContentLoaded',()=>window.domReady=true);window.framesSeen=[];function sample(){framesSeen.push({theme:document.documentElement.dataset.ojppTheme,bg:getComputedStyle(document.querySelector('.l-card')).backgroundColor,visible:getComputedStyle(document.body).visibility!=='hidden',domReady:window.domReady});if(framesSeen.length<60)requestAnimationFrame(sample)}requestAnimationFrame(sample);</script>
</body></html>`;
let context;
try {
  context = await chromium.launchPersistentContext(profile, {
    executablePath: candidates.find(p => existsSync(p)), headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  });
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const page = await context.newPage();
  await page.route('https://www.luogu.com.cn/**', async route => {
    if (route.request().url().endsWith('/slow-theme-test.js')) {
      await new Promise(resolve => setTimeout(resolve, 900));
      await route.fulfill({ contentType: 'text/javascript', body: '' });
    } else await route.fulfill({ contentType: 'text/html', body: html });
  });
  const cases = [
    { theme: 'dark', enabled: true, system: 'light', expected: 'dark' },
    { theme: 'auto', enabled: true, system: 'dark', expected: 'dark' },
    { theme: 'auto', enabled: true, system: 'light', expected: 'light' },
    { theme: 'light', enabled: true, system: 'dark', expected: 'light' },
    { theme: 'dark', enabled: false, system: 'dark', expected: 'light' },
  ];
  for (const item of cases) {
    await worker.evaluate(item => chrome.storage.local.set({ 'ojpp:settings': {
      theme: item.theme, locale: 'en', editorEnabled: true,
      siteFeatures: { luogu: { darkMode: item.enabled } },
    } }), item);
    await page.emulateMedia({ colorScheme: item.system });
    if (page.url().startsWith('https:')) await page.evaluate(() => localStorage.clear());
    await page.goto('https://www.luogu.com.cn/problem/new?type=T&providerID=101778', { waitUntil: 'commit' });
    await page.waitForFunction(() => window.framesSeen?.filter(f => f.visible).length >= 5);
    const allFrames = await page.evaluate(() => window.framesSeen);
    const frames = allFrames.filter(f => f.visible).slice(0, 5);
    for (const frame of frames) {
      assert.equal(frame.domReady, false);
      assert.equal(frame.theme, item.expected);
      assert.equal(frame.bg, item.expected === 'dark' ? 'rgb(34, 39, 46)' : 'rgb(255, 255, 255)');
    }
    await page.waitForSelector('.ojpp-settings-btn');
    assert.equal(await page.locator('.ojpp-editor').count(), 0, 'new problem must keep native editor');
    assert.equal(await page.locator('#native').isVisible(), true);
    if (item.theme === 'dark' && item.enabled) {
      await page.reload({ waitUntil: 'commit' });
      await page.waitForFunction(() => window.framesSeen?.filter(f => f.visible).length >= 5);
      assert.equal(await page.evaluate(() => window.framesSeen.filter(f => f.visible).slice(0, 5).every(f => f.theme === 'dark')), true);
      await page.waitForSelector('.ojpp-settings-btn');
    }
    console.log(`✓ before DOMContentLoaded: theme=${item.theme}, enabled=${item.enabled}, system=${item.system}; native creation editor retained`);
  }

  // Exercise the document-start userscript separately, without an installed extension.
  const plain = await chromium.launch({ executablePath: candidates.find(p => existsSync(p)), headless: true });
  try {
    const scriptPage = await plain.newPage();
    const scriptErrors = [];
    scriptPage.on('pageerror', error => scriptErrors.push(error.message));
    scriptPage.on('console', message => { if (message.type() === 'error') scriptErrors.push(message.text()); });
    await scriptPage.route('https://www.luogu.com.cn/**', async route => {
      if (route.request().url().endsWith('/slow-theme-test.js')) {
        await new Promise(resolve => setTimeout(resolve, 900));
        await route.fulfill({ contentType: 'text/javascript', body: '' });
      } else await route.fulfill({ contentType: 'text/html', body: html });
    });
    await scriptPage.addInitScript({ content: `window.GM_getValue=(key,fallback)=>key==='ojpp:settings'?{theme:'dark',locale:'en'}:fallback;window.GM_setValue=()=>{};window.GM_setClipboard=()=>{};window.GM_xmlhttpRequest=()=>({abort(){}});\n` + await readFile('dist/oj-plus-plus.user.js', 'utf8') });
    await scriptPage.goto('https://www.luogu.com.cn/problem/new?type=T', { waitUntil: 'commit' });
    await scriptPage.waitForFunction(() => window.framesSeen?.length >= 5);
    const scriptFrames = await scriptPage.evaluate(() => window.framesSeen.slice(0, 5));
    assert.equal(scriptFrames.every(f => !f.domReady && f.theme === 'dark' && f.bg === 'rgb(34, 39, 46)'), true, JSON.stringify({ scriptFrames, scriptErrors }));
    await scriptPage.waitForSelector('.ojpp-settings-btn');
    assert.equal(await scriptPage.locator('.ojpp-editor').count(), 0);
    console.log('✓ userscript establishes dark theme before DOMContentLoaded and preserves native creation form');
  } finally { await plain.close(); }
} finally {
  await context?.close();
  await rm(profile, { recursive: true, force: true });
}
