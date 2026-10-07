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

  // 示例块里的“说明”也必须有自己的工具栏，否则它永远无法翻译。
  const labels = await page.locator('.ojpp-toolbar').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('aria-label') ?? ''),
  );
  assert.ok(labels.some((label) => label.includes('说明')), `缺少“说明”工具栏: ${labels.join(' | ')}`);

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

  // Codeforces：老题（服务端 .tex-span）与新题（MathJax script 源码）两种公式形态。
  // 两者都不能出现重复公式或残留渲染节点。
  const cfBuilt = await build({ configFile: false, logLevel: 'silent', build: {
    write: false, minify: false,
    lib: { entry: new URL('test/fixtures/codeforces-entry.ts', root).pathname, name: 'OJPPCf', formats: ['iife'] },
  } });
  const cfCode = (Array.isArray(cfBuilt) ? cfBuilt[0] : cfBuilt).output.find((file) => file.type === 'chunk').code;

  /** 打开一个 Codeforces fixture，返回各区域的 Markdown。 */
  const readCfMarkdown = async (fixtureName) => {
    const html = await readFile(new URL(`test/fixtures/${fixtureName}`, root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify(settings)), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    const count = await page.locator('.ojpp-toolbar').count();
    for (let i = 0; i < count; i += 1) {
      await page.locator('.ojpp-toolbar').nth(i).locator('.ojpp-md-btn').click();
      await page.waitForTimeout(80);
    }
    const markdown = (await page.locator('.ojpp-md-source').evaluateAll((nodes) => nodes.map((n) => n.textContent))).join('\n\n');
    const labels = await page.locator('.ojpp-toolbar').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('aria-label') ?? ''),
    );
    const settingsButtons = await page.locator('.ojpp-settings-btn').count();
    await page.evaluate(() => window.stopApp());
    await page.close();
    return { markdown, labels, settingsButtons };
  };

  const cfOld = await readCfMarkdown('codeforces-old.html');
  assert.ok(cfOld.labels.length >= 3, `老题应收集到题面区域，实际: ${cfOld.labels.join(' | ')}`);
  assert.equal(cfOld.settingsButtons, 1, 'Codeforces 应有设置按钮');
  // 老题：<i>n</i> × <i>m</i> 应还原成 $n \times m$，上标 10^9 不能丢
  assert.match(cfOld.markdown, /\$n \\times m\$/, `老题公式未还原: ${cfOld.markdown.slice(0, 200)}`);
  assert.match(cfOld.markdown, /10\^\{9\}/, '老题上标应还原成 ^{9}');
  assert.doesNotMatch(cfOld.markdown, /tex-span|<i>|upper-index/, '老题不应残留渲染标签');

  const cfNew = await readCfMarkdown('codeforces-new.html');
  assert.ok(cfNew.labels.length >= 3, `新题应收集到题面区域，实际: ${cfNew.labels.join(' | ')}`);
  // 新题：直接使用 MathJax 的原始 LaTeX
  assert.match(cfNew.markdown, /\\frac\{p_i\}\{100\}/, '新题应保留 MathJax 源码');
  assert.match(cfNew.markdown, /1\s*\\le\s*n\s*\\le\s*2\\cdot 10\^5/, '新题不等式应保留原始 LaTeX');
  // 不能残留渲染副本或原始 script
  assert.doesNotMatch(cfNew.markdown, /MathJax|MJXp|mjx-/, '不应残留 MathJax 渲染节点');
  assert.doesNotMatch(cfNew.markdown, /\$\$\$/, '不应残留 $$$ 原文');
  // 公式后的普通文本不该被 Turndown 转义
  assert.doesNotMatch(cfNew.markdown, /\$i\$\\-th/, '公式后的连字符不应被转义');
  assert.match(cfNew.markdown, /\$i\$-th/, '公式后的连字符应保持原样');

  console.log('✓ Codeforces：老题 .tex-span 还原、新题 MathJax 源码、公式不重复');

  // 工具栏靠右：与标题同一行，且贴到容器右侧。
  // 用真实几何位置断言，而不是看 CSS 类名。
  const align = await (async () => {
    const html = await readFile(new URL('test/fixtures/codeforces-new.html', root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify(settings)), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    const result = await page.evaluate(() => [...document.querySelectorAll('.ojpp-toolbar')].map((tb) => {
      const heading = tb.parentElement;
      const hb = heading.getBoundingClientRect();
      const tbb = tb.getBoundingClientRect();
      return {
        sameLine: Math.abs((hb.top + hb.height / 2) - (tbb.top + tbb.height / 2)) < hb.height,
        atRight: Math.abs(tbb.right - hb.right) < 8,
      };
    }));
    await page.evaluate(() => window.stopApp());
    await page.close();
    return result;
  })();
  assert.ok(align.length > 0, '应有工具栏');
  assert.ok(align.every((a) => a.sameLine), `工具栏应与标题同行: ${JSON.stringify(align)}`);
  assert.ok(align.every((a) => a.atRight), `工具栏应靠右: ${JSON.stringify(align)}`);
  console.log('✓ 工具栏：靠右且与标题同行');

  // 暗色主题与界面语言：主题属性要落到 <html>，且只影响脚本自己的界面。
  const themed = await (async () => {
    const html = await readFile(new URL('test/fixtures/codeforces-new.html', root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify({
      ...settings, theme: 'dark', locale: 'en',
    })), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    await page.waitForTimeout(200);
    const probe = await page.evaluate(() => {
      const style = (sel, prop) => {
        const node = document.querySelector(sel);
        return node ? getComputedStyle(node)[prop] : null;
      };
      return {
        themeAttr: document.documentElement.getAttribute('data-ojpp-theme'),
        colorScheme: document.documentElement.style.colorScheme,
        statementColor: style('.problem-statement', 'color'),
        buttonTitle: document.querySelector('.ojpp-translate-btn')?.getAttribute('title'),
      };
    });
    await page.evaluate(() => window.stopApp());
    await page.close();
    return probe;
  })();
  assert.equal(themed.themeAttr, 'dark', '暗色主题应写到 html 属性');
  assert.equal(themed.colorScheme, 'dark', '应同步 color-scheme');
  // 题面文字要变成浅色，说明暗色样式真的作用到站点内容，而不只是面板
  assert.notEqual(themed.statementColor, 'rgb(0, 0, 0)', `题面应应用暗色: ${themed.statementColor}`);
  assert.equal(themed.buttonTitle, 'AI Translate', '英文界面下按钮应为英文');
  console.log('✓ 暗色主题与界面语言：题面与面板同时切换');

  // 在面板里切换语言后，面板与工具栏都要立刻变，不必刷新页面。
  // 这里覆盖一个曾经的 bug：面板为即时预览调了 setLocale，
  // 导致保存时“前后语言相同”，工具栏停在旧语言。
  const switched = await (async () => {
    const html = await readFile(new URL('test/fixtures/nowcoder.html', root), 'utf8');
    const built = await build({ configFile: false, logLevel: 'silent', build: {
      write: false, minify: false,
      lib: { entry: new URL('test/fixtures/nowcoder-entry.ts', root).pathname, name: 'OJPPLocale', formats: ['iife'] },
    } });
    const ncCode = (Array.isArray(built) ? built[0] : built).output.find((f) => f.type === 'chunk').code;
    const page = await pageWithFixture('https://ac.nowcoder.com/acm/contest/100000/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify({ ...settings, locale: 'zh' })), settings);
    await page.addScriptTag({ content: ncCode });
    await page.evaluate(async () => { window.stopApp = await OJPPLocale.start(); });

    await page.locator('.ojpp-settings-btn').click();
    await page.waitForTimeout(250);
    const before = await page.locator('.ojpp-tab').first().textContent();
    // 第一个下拉框是界面语言
    await page.locator('.ojpp-field select').first().selectOption('en');
    await page.waitForTimeout(250);
    const panelAfter = await page.locator('.ojpp-tab').first().textContent();
    await page.locator('.ojpp-btn-primary').click();
    await page.waitForTimeout(400);
    const toolbarAfter = await page.locator('.ojpp-translate-btn').first().getAttribute('title');

    await page.evaluate(() => window.stopApp());
    await page.close();
    return { before, panelAfter, toolbarAfter };
  })();
  assert.equal(switched.before, '翻译设置', `初始应为中文: ${switched.before}`);
  assert.equal(switched.panelAfter, 'Translation', `面板应即时切换: ${switched.panelAfter}`);
  assert.equal(switched.toolbarAfter, 'AI Translate', `保存后工具栏应切换: ${switched.toolbarAfter}`);
  console.log('✓ 界面语言切换：面板即时生效，保存后工具栏同步');

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
