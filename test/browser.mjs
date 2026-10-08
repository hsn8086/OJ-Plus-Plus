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

/**
 * 点击第一个工具栏的翻译按钮。
 *
 * 用 DOM 点击而不是 Playwright 的 click()：工具栏是 float 布局的 span，
 * Playwright 的可操作性检查会把父 span 当成“拦截点击的元素”而拒绝点击，
 * 但真实用户点击时事件会正常冒泡到按钮。这里直接派发点击更贴近真实行为。
 */
async function clickTranslate(page) {
  await page.evaluate(() => {
    const btn = document.querySelector('.ojpp-toolbar .ojpp-translate-btn');
    if (!(btn instanceof HTMLElement)) throw new Error('找不到翻译按钮');
    btn.click();
  });
}

async function translate(page) {
  await clickTranslate(page);
  await page.waitForFunction(
    () => document.querySelector('.ojpp-translate-btn')?.dataset.state === 'done',
    null,
    { timeout: 15000 },
  );
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

  // 添加提供商：主视图 → 管理提供商 → 添加面板。面板里不能出现重复的自定义入口。
  await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
  await page.getByRole('button', { name: '管理', exact: true }).click();
  await page.waitForTimeout(200);
  await page.locator('.ojpp-add-provider').click();
  await page.waitForTimeout(200);
  const presets = await page.locator('.ojpp-preset-item').evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()),
  );
  assert.ok(presets.length > 0, '添加面板应列出预设');
  // 自定义只允许一个入口，否则用户不知道点哪个
  const customEntries = presets.filter((text) => text.includes('自定义'));
  assert.equal(
    customEntries.length,
    1,
    `自定义入口应只有一个，实际: ${customEntries.join(' | ')}`,
  );
  // 第一个就是自定义，方便自己填地址
  assert.ok(presets[0].includes('自定义'), `自定义应排在最前: ${presets[0]}`);
  // 搜索能过滤
  const search = page.getByPlaceholder('搜索...');
  await search.fill('deepseek');
  await page.waitForTimeout(200);
  const filtered = await page.locator('.ojpp-preset-item').evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()),
  );
  assert.ok(filtered.length >= 1 && filtered.every((x) => /deepseek|自定义/i.test(x)), `搜索过滤异常: ${filtered.join(' | ')}`);
  // 返回列表（栈导航的返回箭头）
  await page.locator('.ojpp-back-btn').click();
  await page.waitForTimeout(200);
  assert.ok(await page.locator('.ojpp-add-provider').count() > 0, '应回到列表视图');
  // 关掉面板再继续后面的用例
  await page.locator('.ojpp-panel-close').click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });

  // 连续输入、拖选到面板外、立即正常点击遮罩，以及保存后即时切换模型。
  await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
  await page.getByRole('button', { name: '管理', exact: true }).click();
  // 提供商页现在是「列表 → 编辑」两步，先进编辑视图
  await page.locator('.ojpp-provider-edit').first().click();
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
  // 拖选结束后浏览器会向遮罩补发一对 pointerdown/pointerup，
  // 这一下不该关闭面板（否则用户拖选文字就会误关设置）。
  assert.equal(await page.getByRole('dialog').count(), 1, '拖选文字不应关闭面板');
  // 再真正点一次遮罩，这次应该关闭（关闭有 300ms 动画，要等它跑完）
  await page.mouse.click(20, 800);
  await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 2000 });

  await page.getByRole('button', { name: 'OJ++ 设置', exact: true }).click();
  await page.getByRole('button', { name: '管理', exact: true }).click();
  await page.locator('.ojpp-provider-edit').first().click();
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
  // 只针对第一个工具栏里的按钮。页面上有多个工具栏，
  // 用全局 getByRole 会命中被浮层挡住的那些。
  await clickTranslate(page);
  await clickTranslate(page);
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
    const result = await page.evaluate(() => {
      const header = document.querySelector('.problem-statement .header');
      const hb = header?.getBoundingClientRect();
      return [...document.querySelectorAll('.ojpp-toolbar')].map((tb) => {
        const tbb = tb.getBoundingClientRect();
        if (tb.classList.contains('ojpp-toolbar-block')) {
          // 题面工具栏：在标题区下方单独一行，靠右，且不与标题同行
          return {
            kind: 'block',
            belowHeader: hb ? tbb.top >= hb.bottom - 2 : null,
            ownLine: hb ? Math.abs(tbb.top - (hb.top + hb.height / 2)) > 10 : null,
            atRight: hb ? Math.abs(tbb.right - hb.right) < 8 : null,
          };
        }
        // 其余工具栏：跟在各自小标题同一行，靠右
        const heading = tb.parentElement;
        const chb = heading.getBoundingClientRect();
        return {
          kind: 'inline',
          sameLine: Math.abs((chb.top + chb.height / 2) - (tbb.top + tbb.height / 2)) < chb.height,
          atRight: Math.abs(tbb.right - chb.right) < 8,
        };
      });
    });
    await page.evaluate(() => window.stopApp());
    await page.close();
    return result;
  })();
  assert.ok(align.length > 0, '应有工具栏');
  const block = align.filter((a) => a.kind === 'block');
  assert.equal(block.length, 1, `题面应有独立的块级工具栏: ${JSON.stringify(align)}`);
  assert.ok(block[0].belowHeader, '题面工具栏应在时限/内存限制下方');
  assert.ok(block[0].ownLine, '题面工具栏应单独一行');
  const inline = align.filter((a) => a.kind === 'inline');
  assert.ok(inline.every((a) => a.sameLine), `区域工具栏应与小标题同行: ${JSON.stringify(inline)}`);
  assert.ok(align.every((a) => a.atRight), `工具栏都应靠右: ${JSON.stringify(align)}`);
  console.log('✓ 工具栏：题面独立一行靠右，其余与小标题同行');

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

  // 暗色完整性：扫一遍可见元素，不该还有浅色底。
  // 这个断言来自真实反馈：样例块（.sample-tests pre #efefef）、
  // 样例行高亮（.test-example-line-even #E0E0E0）和侧边栏曾经漏掉。
  const leftovers = await (async () => {
    const html = await readFile(new URL('test/fixtures/codeforces-new.html', root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify({
      ...settings, theme: 'dark', locale: 'zh',
    })), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    await page.waitForTimeout(200);
    const found = await page.evaluate(() => {
      const isLight = (rgb) => {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
        if (!m) return false;
        const alpha = /rgba\([^)]*,\s*([\d.]+)\)/.exec(rgb);
        if (alpha && Number(alpha[1]) === 0) return false;
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
      };
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 6) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (!isLight(cs.backgroundColor)) continue;
        out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)} = ${cs.backgroundColor}`);
      }
      return out.slice(0, 10);
    });
    // 文字颜色也要检查：站点给顶部导航和侧边栏链接设了 #000，
    // 背景压暗后黑字会完全看不见。
    const darkText = await page.evaluate(() => {
      const isDark = (rgb) => {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
        if (!m) return false;
        return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.35;
      };
      const out = [];
      for (const sel of ['.menu-list li a', '.second-level-menu-list li a', '.roundbox a', '.sidebox a']) {
        for (const el of document.querySelectorAll(sel)) {
          const cs = getComputedStyle(el);
          if (isDark(cs.color)) out.push(`${sel} = ${cs.color}`);
        }
      }
      return [...new Set(out)].slice(0, 8);
    });
    // 多测样例的奇偶行必须保持不同底色，否则行分组信息就丢了。
    // （曾经因为用 .test-example-line 覆盖高亮，把交替色也一起盖掉。）
    const lineColors = await page.evaluate(() => {
      const even = document.querySelector('.test-example-line-even');
      const odd = document.querySelector('.test-example-line-odd');
      return {
        even: even ? getComputedStyle(even).backgroundColor : null,
        odd: odd ? getComputedStyle(odd).backgroundColor : null,
      };
    });
    // 提交类按钮：站点用 outset 边框做立体感，暗色下要压成扁平。
    const buttonStyle = await page.evaluate(() => {
      const el = document.querySelector('input[type="submit"]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { borderStyle: cs.borderTopStyle, bg: cs.backgroundColor };
    });
    // 页脚、比赛状态、登录区这些深蓝色链接，深底上要换成可读的浅色。
    // 站点用 #0000cc / #3b5998，亮度很低，之前扫描漏掉了它们。
    const dimLinks = await page.evaluate(() => {
      const out = [];
      const check = (sel) => {
        for (const el of document.querySelectorAll(sel)) {
          const cs = getComputedStyle(el);
          const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(cs.color);
          if (!m) continue;
          if ((0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.4) {
            out.push(sel + ' = ' + cs.color);
          }
        }
      };
      check('#footer a');
      check('.contest-state-phase');
      check('.lang-chooser a');
      return [...new Set(out)];
    });
    // sidebar-menu 的 li 原本套 1px 白边框，暗色下要拆掉。
    const sidebarBorder = await page.evaluate(() => {
      const li = document.querySelector('.sidebar-menu ul li');
      if (!li) return null;
      const cs = getComputedStyle(li);
      return { top: cs.borderTopWidth, bottom: cs.borderBottomWidth, bottomColor: cs.borderBottomColor };
    });
    // 顶栏必须分两条：logo/登录 与 主导航 用不同底色，不能糊成一片。
    const headerBands = await page.evaluate(() => {
      const h = document.querySelector('#header');
      const mb = document.querySelector('.menu-box');
      if (!h || !mb) return null;
      const hs = getComputedStyle(h);
      const ms = getComputedStyle(mb);
      // 近黑色（亮度 < 0.18）也不接受：用户反馈“不要用黑色”
      const lum = (rgb) => {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
        return m ? (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 : null;
      };
      return {
        headerBg: hs.backgroundColor,
        menuBg: ms.backgroundColor,
        // 导航条才是可见的色块；#header 故意与页面底色一致，不参与亮度检查
        menuLum: lum(ms.backgroundColor),
        pageBg: getComputedStyle(document.body).backgroundColor,
      };
    });
    // logo 处理：白底转透明靠 mix-blend-mode
    const logoStyle = await page.evaluate(() => {
      const img = document.querySelector('#header img[alt="Codeforces"]');
      if (!img) return null;
      const cs = getComputedStyle(img);
      return { filter: cs.filter, blend: cs.mixBlendMode };
    });
    await page.evaluate(() => window.stopApp());
    await page.close();
    return { leftovers: found, darkText, lineColors, buttonStyle, dimLinks, sidebarBorder, headerBands, logoStyle };
  })();
  assert.deepEqual(leftovers.leftovers, [], `暗色下仍有浅色背景: ${leftovers.leftovers.join(' | ')}`);
  assert.deepEqual(leftovers.darkText, [], `暗色下仍有黑色文字: ${leftovers.darkText.join(' | ')}`);
  assert.ok(leftovers.lineColors.even && leftovers.lineColors.odd, '应有多测样例行');
  assert.notEqual(
    leftovers.lineColors.even,
    leftovers.lineColors.odd,
    `多测样例的奇偶行底色应不同: ${JSON.stringify(leftovers.lineColors)}`,
  );
  assert.ok(leftovers.buttonStyle, 'fixture 里应有提交按钮');
  assert.notEqual(
    leftovers.buttonStyle.borderStyle,
    'outset',
    `提交按钮不应保留拟物化边框: ${JSON.stringify(leftovers.buttonStyle)}`,
  );
  assert.deepEqual(leftovers.dimLinks, [], `深蓝链接在暗色下仍不可读: ${leftovers.dimLinks.join(' | ')}`);
  assert.ok(leftovers.sidebarBorder, 'fixture 应有 sidebar-menu 列表');
  assert.equal(leftovers.sidebarBorder.top, '0px', `侧边栏列表项不应有白边框: ${JSON.stringify(leftovers.sidebarBorder)}`);
  assert.ok(leftovers.headerBands, 'fixture 应有 #header 与 .menu-box');
  assert.notEqual(
    leftovers.headerBands.headerBg,
    leftovers.headerBands.menuBg,
    `顶栏两层应用不同底色以保持分层: ${JSON.stringify(leftovers.headerBands)}`,
  );
  assert.ok(
    leftovers.headerBands.menuLum > 0.18,
    `导航条不应使用近黑色: ${JSON.stringify(leftovers.headerBands)}`,
  );
  // 用户要求：logo/登录这一条与页面底色一致，不要留出比背景更亮的色块
  assert.equal(
    leftovers.headerBands.headerBg,
    leftovers.headerBands.pageBg,
    `#header 应与页面背景同色: ${JSON.stringify(leftovers.headerBands)}`,
  );
  assert.ok(leftovers.logoStyle, 'fixture 应有 Codeforces logo');
  assert.equal(leftovers.logoStyle.blend, 'screen', `logo 应用 screen 混合让白底透明: ${JSON.stringify(leftovers.logoStyle)}`);
  console.log('✓ 暗色完整性：无残留浅色、无黑字、多测交替色、按钮扁平、深蓝链接与 logo 已处理');

  // 站点在更多页面上的暗色表现：提交记录表、评级颜色、公告标题、表单。
  // 这些选择器都来自真实页面的实测，不是猜的。
  const extras = await (async () => {
    const html = await readFile(new URL('test/fixtures/codeforces-new.html', root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify({
      ...settings, theme: 'dark', locale: 'zh',
    })), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    await page.waitForTimeout(200);
    const probe = await page.evaluate(() => {
      const color = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).color : null;
      };
      const bg = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).backgroundColor : null;
      };
      const lum = (rgb) => {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb ?? '');
        return m ? (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 : null;
      };
      return {
        // 评级颜色不能是纯黑/纯红。
        // 用 span 而不是链接：链接会被通用的 a 规则兜住，
        // span 才真正依赖 .user-* 规则。
        userBlack: color('.user-black'),
        // sidebox 里的段位名是最脆弱的地方：
        // .sidebox a 这条通用链接规则会把 .rated-user.user-* 刷成灰。
        sideboxRed: color('.sidebox .user-red'),
        sideboxOrange: color('.sidebox .user-orange'),
        sideboxCyan: color('.sidebox .user-cyan'),
        userRed: color('.rated-user.user-red'),
        legendaryFirst: color('.legendary-user-first-letter'),
        // 表格不能是白底
        tableBg: bg('.status-frame-datatable tr'),
        // 表单不能是白底
        selectBg: bg('select'),
        inputBg: bg('input[type="text"]'),
        // 深蓝文字要变亮
        footer: lum(color('#footer a')),
        rating: lum(color('.topic-rating')),
        // 站点把颜色写在 style="color:black !important" 里，
        // CSS 覆盖不掉，只能靠 JS 清掉内联声明
        inlineBlackTitle: lum(color('h3 a[style], h3 a')),
      };
    });
    await page.evaluate(() => window.stopApp());
    await page.close();
    return probe;
  })();
  const lumOf = (rgb) => {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb ?? '');
    return m ? (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 : null;
  };
  for (const [name, value] of Object.entries({
    'user-black': extras.userBlack,
    'user-red': extras.userRed,
    'legendary 首字母': extras.legendaryFirst,
  })) {
    assert.ok(lumOf(value) > 0.4, `${name} 在暗色下应可读，实际 ${value}`);
  }
  // 段位名颜色不能是灰或蓝——否则段位色就被链接规则吞掉了。
  // 这是覆盖过的 bug：.sidebox a 等通用链接规则把 .rated-user.user-*
  // 刷成了 #cdd9e5，红名/橙名全变灰。
  const rgb = (c) => /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(c)?.slice(1).map(Number);
  const isGray = (c) => {
    const v = rgb(c); return v && Math.max(...v) - Math.min(...v) < 40;
  };
  assert.equal(extras.userRed, 'rgb(248, 81, 73)', `user-red 应是段位红，实际 ${extras.userRed}`);
  assert.equal(extras.sideboxRed, 'rgb(248, 81, 73)', `sidebox 里的 user-red 应是红，实际 ${extras.sideboxRed}`);
  assert.equal(extras.sideboxOrange, 'rgb(240, 136, 62)', `sidebox 里的 user-orange 应是橙，实际 ${extras.sideboxOrange}`);
  assert.equal(extras.sideboxCyan, 'rgb(57, 197, 187)', `sidebox 里的 user-cyan 应是青，实际 ${extras.sideboxCyan}`);
  assert.ok(!isGray(extras.userRed), 'user-red 不能是灰色');
  assert.ok(!isGray(extras.userBlack) || extras.userBlack === 'rgb(154, 164, 178)', 'user-black 应是灰，实际 ' + extras.userBlack);
  for (const [name, value] of Object.entries({
    '表格行': extras.tableBg,
    'select': extras.selectBg,
    '文本输入框': extras.inputBg,
  })) {
    assert.ok(lumOf(value) < 0.4, `${name} 不应是浅色底，实际 ${value}`);
  }
  assert.ok(extras.footer > 0.4, `页脚链接应可读，实际亮度 ${extras.footer}`);
  assert.ok(extras.rating > 0.4, `rating 变化应可读，实际亮度 ${extras.rating}`);
  assert.ok(
    extras.inlineBlackTitle > 0.4,
    `内联 black !important 的标题应被清成可读色，实际亮度 ${extras.inlineBlackTitle}`,
  );
  console.log('✓ 暗色覆盖：评级颜色、表格、表单、深蓝链接');

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
    // v2 用堆栈导航替代了标签页，底部主按钮就是「保存」
    const before = await page.locator('.ojpp-panel-foot .ojpp-btn-primary').textContent();
    // 第一个下拉框是界面语言
    await page.locator('.ojpp-panel select').first().selectOption('en');
    await page.waitForTimeout(250);
    const panelAfter = await page.locator('.ojpp-panel-foot .ojpp-btn-primary').textContent();
    await page.locator('.ojpp-panel-foot .ojpp-btn-primary').click();
    await page.waitForTimeout(400);
    const toolbarAfter = await page.locator('.ojpp-translate-btn').first().getAttribute('title');

    await page.evaluate(() => window.stopApp());
    await page.close();
    return { before, panelAfter, toolbarAfter };
  })();
  assert.equal(switched.before, '保存', `初始应为中文: ${switched.before}`);
  assert.equal(switched.panelAfter, 'Save', `面板应即时切换: ${switched.panelAfter}`);
  assert.equal(switched.toolbarAfter, 'AI Translate', `保存后工具栏应切换: ${switched.toolbarAfter}`);
  console.log('✓ 界面语言切换：面板即时生效，保存后工具栏同步');

  // 题面工具栏插在 .header 之后，站点更新会反复触发 reconcile。
  // 覆盖一个曾经的 bug：用 `.header + div` 找题面正文，
  // 工具栏插入后这个选择器指向工具栏自身，工具栏数量会逐渐减少。
  const stable = await (async () => {
    const html = await readFile(new URL('test/fixtures/codeforces-new.html', root), 'utf8');
    const page = await pageWithFixture('https://codeforces.com/problemset/problem/1/A', html);
    await page.evaluate((settings) => localStorage.setItem('ojpp:settings', JSON.stringify(settings)), settings);
    await page.addScriptTag({ content: cfCode });
    await page.evaluate(async () => { window.stopApp = await OJPPCf.start(); });
    await page.waitForTimeout(200);
    const before = await page.locator('.ojpp-toolbar').count();
    // 连续触发多次站点更新
    for (let i = 0; i < 3; i += 1) {
      await page.evaluate(() => document.querySelector('.problem-statement')?.append(document.createElement('span')));
      await page.waitForTimeout(200);
    }
    const probe = await page.evaluate(() => ({
      toolbars: document.querySelectorAll('.ojpp-toolbar').length,
      statementToolbar: document.querySelectorAll('.ojpp-toolbar-block').length,
      // 题面正文不能被工具栏替换
      bodyHasText: (document.querySelector('.problem-statement > div:not(.header):not(.ojpp-toolbar)')?.textContent ?? '').includes('Creatnx'),
    }));
    await page.evaluate(() => window.stopApp());
    await page.close();
    return { before, ...probe };
  })();
  assert.equal(stable.toolbars, stable.before, `反复更新后工具栏数量应稳定: ${JSON.stringify(stable)}`);
  assert.equal(stable.statementToolbar, 1, '题面工具栏应始终存在');
  assert.ok(stable.bodyHasText, '题面正文不应被工具栏替换');
  console.log('✓ 工具栏在反复更新后保持稳定，题面正文未被替换');

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
