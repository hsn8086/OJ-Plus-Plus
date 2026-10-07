// 离线浏览器回归：实际 userscript 构建 + GM 沙箱；另一站点 DOM + 浏览器平台。
// 协议拼包由单元测试覆盖，这里只验证适配边界和用户交互，不检查图标数或 CSS 像素。
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { build } from 'vite';

const root = new URL('../', import.meta.url);

/** 用当前源码构建，避免拿旧的 dist 产物跑测试。 */
async function buildUserscript() {
  const result = await build({
    configFile: new URL('vite.config.ts', root).pathname,
    logLevel: 'silent',
    build: { write: false, minify: false },
  });
  const outputs = Array.isArray(result) ? result : [result];
  for (const output of outputs) {
    for (const file of output.output ?? []) {
      if (file.type === 'chunk') return file.code;
    }
  }
  throw new Error('vite 构建没有产出 chunk');
}

const bundle = await buildUserscript();
const fixture = await readFile(new URL('test/fixtures/nowcoder.html', root), 'utf8');
const screenshots = process.argv.includes('--screenshots');
const executableCandidates = [
  process.env.OJPP_CHROME,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  chromium.executablePath(),
].filter(Boolean);
const executablePath = executableCandidates.find((path) => existsSync(path));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const settings = {
  version: 1, activeProviderId: 'p1',
  providers: [{ id: 'p1', name: '演示接口', protocol: 'openai-chat', baseUrl: 'https://api.fixture.test/v1', apiKey: 'demo-key', model: 'gpt-6-luna', headers: {}, body: {}, reasoning: { enabled: null, effort: '' } }],
  targetLang: '简体中文', extraPrompt: '', translateWholeBlock: true, autoTranslate: false, timeoutMs: 30000, retries: 0,
};
const response = { choices: [{ message: { content: '给定两个整数，求它们的和 $a+b$。\n\n在一行中输出结果。' } }] };

async function pageWithFixture(url, html) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 880 } });
  await page.route('**/*', async (route) => {
    const requestURL = new URL(route.request().url());
    if (requestURL.href === url) return route.fulfill({ contentType: 'text/html', body: html });
    if (requestURL.hostname === 'api.fixture.test') {
      // 注意：Playwright 的 fulfill 不能向页面流式推送，所以这里返回整包 JSON。
      // 浏览器平台的流式通道由 test/stream.test.ts 直接打桩 fetch 覆盖。
      return route.fulfill({ json: response, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    if (requestURL.hostname === 'cdn.jsdelivr.net') {
      const asset = requestURL.pathname.split('/dist/')[1];
      if (asset && !asset.includes('..')) {
        return route.fulfill({ body: await readFile(new URL(`node_modules/katex/dist/${asset}`, root)), contentType: asset.endsWith('.css') ? 'text/css' : 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' } });
      }
    }
    if (requestURL.pathname === '/equation') {
      return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="24"><text x="1" y="18" font-size="18">a+b</text></svg>' });
    }
    return route.abort();
  });
  await page.goto(url);
  return page;
}

async function translate(page) {
  await page.getByRole('button', { name: /^(AI 翻译|重新翻译)$/ }).first().click();
  await page.waitForFunction(() => document.querySelector('.ojpp-translate-btn')?.dataset.state === 'done');
}

try {
  const page = await pageWithFixture('https://ac.nowcoder.com/acm/contest/100000/A', fixture);
  const main = await page.locator('main').evaluate((node) => { const html = node.outerHTML; node.remove(); return html; });
  await page.evaluate(({ bundle, settings, response }) => {
    const store = new Map([['ojpp:settings', settings]]);
    const state = window.__testState = { store, requests: [], clipboard: '', delay: 10, aborted: 0 };
    // 只有词法作用域里有 GM API；page.fetch 故意失败，以捕获 CORS 回退回归。
    window.fetch = () => { throw new Error('userscript must use GM transport'); };
    const run = new Function('GM_getValue', 'GM_setValue', 'GM_setClipboard', 'GM_xmlhttpRequest', bundle);
    run(
      (key, fallback) => structuredClone(store.get(key) ?? fallback),
      (key, value) => store.set(key, structuredClone(value)),
      (text) => { state.clipboard = text; },
      (options) => {
        const body = JSON.parse(options.data);
        state.requests.push(body);
        const timers = [];
        let aborted = false;
        const abort = () => {
          aborted = true;
          timers.forEach(clearTimeout);
          state.aborted += 1;
          options.onabort?.();
        };
        if (body.stream) {
          // TM 的 responseType=stream 会在 readyState=2 提供 ReadableStream；
          // 后续网络分片通过 controller.enqueue() 进入该流，不会调用用户的 onpartial。
          let controller;
          const responseStream = new ReadableStream({
            start(value) { controller = value; },
          });
          options.onreadystatechange?.({
            readyState: 2,
            status: 200,
            statusText: 'OK',
            response: responseStream,
            responseText: undefined,
          });
          const text = response.choices[0].message.content;
          const events = [];
          for (let i = 0; i < text.length; i += 3) {
            events.push(`data: ${JSON.stringify({ choices: [{ delta: { content: text.slice(i, i + 3) } }] })}\n\n`);
          }
          events.push('data: [DONE]\n\n');
          events.forEach((event, index) => {
            timers.push(setTimeout(() => {
              if (aborted) return;
              const isLast = index === events.length - 1;
              if (!isLast) {
                controller.enqueue(new TextEncoder().encode(event));
                options.onprogress?.({ responseText: '', loaded: index + 1, total: events.length });
              } else {
                // TM 的 onload 先到，但此时 response stream 仍未关闭；
                // 随后的 onloadend 才关闭它并让 reader.read() 返回 done。
                options.onload?.({ status: 200, statusText: 'OK', response: responseStream, responseText: undefined });
                timers.push(setTimeout(() => {
                  controller.close();
                  options.onloadend?.({ status: 200, statusText: 'OK', response: responseStream, responseText: undefined });
                }, state.delay));
              }
            }, state.delay * (index + 1)));
          });
        } else {
          timers.push(setTimeout(() => options.onload({ status: 200, statusText: 'OK', responseText: JSON.stringify(response) }), state.delay));
        }
        return { abort };
      },
    );
  }, { bundle, settings, response });
  // 等应用完成初始化（它会注入自己的样式表）。
  // 这里不能用“存储里有 settings”来判断：测试一开始就把配置放好了，
  // 那个条件恒为真，等于没等。
  await page.waitForFunction(() =>
    [...document.querySelectorAll('style')].some((s) => s.textContent?.includes('.ojpp-toolbar')),
  );
  await page.evaluate((html) => document.body.insertAdjacentHTML('beforeend', html), main);
  await page.getByRole('button', { name: 'AI 翻译', exact: true }).first().waitFor();

  // Markdown 视图与复制始终读取原始 DOM，公式交给站点适配器还原。
  // KaTeX 页面必须还原成 LaTeX，而不是把 katex-mathml / katex-html 两份文本都抓下来。
  await page.getByRole('button', { name: 'Markdown 视图', exact: true }).first().click();
  const statementMarkdown = await page.locator('.ojpp-md-source').first().textContent();
  assert.match(statementMarkdown, /\$a\+b\$/);
  assert.match(statementMarkdown, /\$a_i \\le 10\^9\$/);
  assert.match(statementMarkdown, /\$\$O\(n\)\$\$/);
  assert.doesNotMatch(statementMarkdown, /katex|mord|mathnormal|annotation/);
  await page.getByRole('button', { name: '复制原文', exact: true }).first().click();
  assert.match(await page.evaluate(() => window.__testState.clipboard), /\$a\+b\$/);
  await page.getByRole('button', { name: '返回原始内容', exact: true }).click();

  // 连续输入、拖选到面板外、立即正常点击遮罩，以及保存后即时切换模型。
  await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
  await page.getByRole('button', { name: '提供商', exact: true }).click();
  const name = page.getByLabel('备注名', { exact: true });
  await name.fill('');
  await name.pressSequentially('Provider ABC');
  assert.equal(await name.inputValue(), 'Provider ABC');
  assert.equal(await name.evaluate((node) => node === document.activeElement), true);
  await name.scrollIntoViewIfNeeded();
  const box = await name.boundingBox();
  await page.mouse.move(box.x + 20, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(20, 800, { steps: 8 });
  await page.mouse.up();
  assert.equal(await page.getByRole('dialog').count(), 1);
  await page.mouse.click(20, 800);
  assert.equal(await page.getByRole('dialog').count(), 0);

  await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
  await page.getByRole('button', { name: '提供商', exact: true }).click();
  await page.getByLabel('模型', { exact: true }).fill('updated-model');
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  // 流式：请求体带 stream，且中途就能看到部分译文
  await page.evaluate(() => {
    window.__testState.rendered = [];
    const observer = new MutationObserver(() => {
      const body = document.querySelector('.ojpp-result-body');
      if (body) window.__testState.rendered.push(body.textContent || '');
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    window.__testState.renderObserver = observer;
  });
  await page.getByRole('button', { name: 'AI 翻译', exact: true }).first().click();
  await page.waitForFunction(() => {
    const panel = document.querySelector('.ojpp-result');
    return panel?.classList.contains('ojpp-streaming')
      && (panel.querySelector('.ojpp-result-body')?.textContent?.trim().length ?? 0) > 0;
  });
  const midText = await page.locator('.ojpp-result-body').textContent();
  assert.ok(midText.includes('给定两个整数'), `流式中间态应有部分译文，实际: ${midText}`);
  assert.equal(await page.locator('.ojpp-result.ojpp-streaming').count(), 1);
  await page.waitForFunction(() => document.querySelector('.ojpp-translate-btn')?.dataset.state === 'done');
  const rendered = await page.evaluate(() => {
    window.__testState.renderObserver?.disconnect();
    return window.__testState.rendered.filter((text, index, all) => index === 0 || text !== all[index - 1]);
  });
  console.log('stream frames:', rendered.map((text) => text.length).join(','));
  assert.equal(
    rendered.some((text, index) => index > 0 && text.length < rendered[index - 1].length),
    false,
    `显示文本不应回缩: ${rendered.map((text) => text.length).join(',')}`,
  );
  assert.equal(await page.locator('.ojpp-result.ojpp-streaming').count(), 0);
  assert.equal(await page.evaluate(() => window.__testState.requests.at(-1).model), 'updated-model');
  assert.equal(await page.evaluate(() => window.__testState.requests.at(-1).stream), true);
  assert.match(await page.evaluate(() => window.__testState.requests.at(-1).messages.at(-1).content), /\$a\+b\$/);
  // 译文里的 LaTeX 必须被 KaTeX 渲染成公式节点
  assert.ok(await page.locator('.ojpp-result .katex').count() > 0);
  assert.doesNotMatch(await page.locator('.ojpp-result-body').textContent(), /\$a\+b\$/);
  await page.getByRole('button', { name: '复制译文', exact: true }).click();
  assert.match(await page.evaluate(() => window.__testState.clipboard), /\$a\+b\$/);
  await translate(page);
  assert.equal(await page.locator('.ojpp-result').count(), 1);

  await page.evaluate(() => { window.__testState.delay = 5000; });
  await page.getByRole('button', { name: '重新翻译', exact: true }).click();
  await page.getByRole('button', { name: '翻译中，点击中止', exact: true }).click();
  await page.waitForFunction(() => window.__testState.aborted === 1);
  await page.locator('.ojpp-result').waitFor({ state: 'detached' });
  console.log('✓ userscript：动态题面、公式与复制、设置交互、即时配置、TM ReadableStream 流式与取消');

  if (screenshots) {
    await page.evaluate(() => { window.__testState.delay = 10; });
    await translate(page);
    await page.evaluate(() => {
      document.querySelector('.ojpp-toast')?.remove();
      window.scrollTo(0, 0);
    });
    await mkdir(new URL('docs/images/', root), { recursive: true });
    await page.screenshot({ path: new URL('docs/images/translate.png', root).pathname });
    await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
    await page.getByRole('button', { name: '提供商', exact: true }).click();
    await page.screenshot({ path: new URL('docs/images/settings-provider.png', root).pathname });
  }
  await page.close();

  // 使用另一个站点契约与真实 browser 平台；不加载 GM 或牛客适配器。
  const built = await build({ configFile: false, logLevel: 'silent', build: {
    write: false, minify: false,
    lib: { entry: new URL('test/fixtures/alternate.ts', root).pathname, name: 'OJPPTest', formats: ['iife'] },
  } });
  const output = (Array.isArray(built) ? built[0] : built).output.find((file) => file.type === 'chunk').code;
  const alternate = await pageWithFixture('https://fixture.test/problem', '<nav></nav><h1>另一站点</h1><article>Find the sum.</article>');
  await alternate.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify(settings)), settings);
  await alternate.addScriptTag({ content: output });
  await alternate.evaluate(async () => { window.stopApp = await OJPPTest.start(); });
  await translate(alternate);
  assert.match(await alternate.locator('.ojpp-result-body').textContent(), /给定两个整数/);
  assert.ok(await alternate.locator('.ojpp-result .katex').count() > 0);
  await alternate.evaluate(() => window.stopApp());
  assert.equal(await alternate.locator('.ojpp-toolbar, .ojpp-result, .ojpp-settings-btn').count(), 0);
  await alternate.close();
  console.log('✓ 通用应用：另一站点 DOM + browser 平台、异步存储、fetch 请求、卸载清理');
} finally {
  await browser.close();
}
