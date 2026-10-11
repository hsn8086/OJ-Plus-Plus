import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { build } from 'vite';

const result = await build({ configFile: 'vite.config.ts', logLevel: 'silent', build: { write: false } });
const bundle = [result].flat().flatMap(o => o.output).find(o => o.type === 'chunk').code;
const fixture = await readFile(new URL('./fixtures/atcoder-task.html', import.meta.url), 'utf8');
const candidates = [process.env.OJPP_CHROME, `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, chromium.executablePath()].filter(Boolean);
const browser = await chromium.launch({ executablePath: candidates.find(p => existsSync(p)) });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const url = 'https://atcoder.jp/contests/abc350/tasks/abc350_a';
  await page.route('**/*', route => route.request().url() === url
    ? route.fulfill({ body: fixture, contentType: 'text/html' }) : route.abort());
  await page.goto(url);
  await page.evaluate(code => {
    window.GM_getValue = (key, fallback) => key === 'ojpp:settings' ? {
      locale: 'zh', targetLang: '简体中文', theme: 'dark', editorEnabled: true,
      providers: [{ id: 'test', name: 'Test', protocol: 'openai-chat', baseUrl: 'https://fixture.invalid', model: 'test', apiKey: '' }], activeProviderId: 'test', stream: false,
    } : fallback;
    window.GM_setValue = () => {};
    window.GM_setClipboard = value => { window.copied = value; };
    window.GM_xmlhttpRequest = opts => {
      window.requestBody = JSON.parse(opts.data);
      setTimeout(() => opts.onload({ status: 200, responseText: JSON.stringify({ choices: [{ message: { content: '这是译文，含公式 $S$。' } }] }) }), 0);
      return { abort() {} };
    };
    (0, eval)(code);
  }, bundle);
  await page.waitForSelector('.ojpp-editor');
  assert.equal(await page.locator('.lang-en .ojpp-toolbar').count(), 7);
  assert.equal(await page.locator('.lang-ja .ojpp-toolbar').count(), 0);
  assert.equal(await page.locator('.ojpp-test').count(), 3);
  assert.equal(await page.locator('#select-lang').isVisible(), false);
  assert.equal(await page.locator('#sourceCode').isVisible(), false);
  assert.equal(await page.locator('form.form-code-submit button[type="submit"]').isVisible(), false);
  assert.equal(await page.locator('.cf-challenge').isVisible(), true);
  await page.evaluate(() => document.querySelector('.lang-en .ojpp-toolbar button:nth-child(2)').click());
  const markdown = await page.locator('.ojpp-md-source').first().textContent();
  assert.match(markdown, /\$S\$/);
  assert.match(markdown, /\$\\ldots\$/);
  assert.ok(!markdown.includes('data.'));
  // This validates UI -> AI request -> result rendering; live custom-test is verified separately.
  await page.evaluate(() => document.querySelector('.lang-en .ojpp-translate-btn').click());
  await page.waitForFunction(() => document.querySelector('.lang-en .ojpp-translate-btn')?.dataset.state === 'done');
  assert.match(await page.locator('.lang-en').innerText(), /这是译文/);
  assert.ok(await page.evaluate(() => JSON.stringify(window.requestBody).includes('You are given a string')));
  await page.locator('.ojpp-editor-lang').selectOption('6082');
  await page.locator('.ojpp-editor .cm-content').focus();
  assert.match(await page.locator('.ojpp-editor .cm-content').innerText(), /def solve/);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText('print(input())');
  assert.equal(await page.locator('#plain-textarea').inputValue(), 'print(input())');
  let submitted;
  await page.route('**/contests/abc350/submit', async route => {
    submitted = new URLSearchParams(route.request().postData());
    await route.fulfill({ contentType: 'text/html', body: '<div class="alert-danger">Fixture submission error</div>' });
  });
  await page.evaluate(() => document.querySelector('.ojpp-editor-submit').click());
  await page.waitForFunction(() => document.querySelector('.ojpp-editor-status')?.textContent === 'Fixture submission error');
  assert.equal(submitted.get('sourceCode'), 'print(input())');
  assert.equal(submitted.get('data.LanguageId'), '6082');
  assert.equal(submitted.get('data.TaskScreenName'), 'abc350_a');
  assert.equal(submitted.get('csrf_token'), 'fixture-token');
  let testId = 10;
  let exitCode = 0;
  let customTestLanguage;
  await page.route('**/contests/abc350/custom_test**', async route => {
    if (route.request().method() === 'POST') {
      customTestLanguage = new URLSearchParams(route.request().postData()).get('data.LanguageId');
      testId++;
      await route.fulfill({ body: '' });
    } else if (route.request().url().includes('/json')) {
      await route.fulfill({ json: { Result: { Id: testId, Status: 3, ExitCode: exitCode, TimeConsumption: '10 ms', MemoryConsumption: '8964 KiB' }, Stdout: 'Yes\n', Stderr: 'debug <b>1</b>\n' } });
    } else await route.fulfill({ body: fixture, contentType: 'text/html' });
  });
  const firstTest = page.locator('.ojpp-test').first();
  await page.locator('.ojpp-editor-lang').selectOption('__auto__');
  await firstTest.locator('.ojpp-test-run').click();
  await page.waitForSelector('.ojpp-test-stderr', { state: 'attached' });
  assert.equal(customTestLanguage, '6082');
  assert.equal(await firstTest.locator('.ojpp-test-status').textContent(), 'Accepted');
  assert.equal(await firstTest.locator('.ojpp-test-stderr').textContent(), 'debug <b>1</b>\n');
  assert.equal(await firstTest.locator('.ojpp-test-stderr b').count(), 0);
  assert.equal(await firstTest.locator('.ojpp-test-stderr').isVisible(), true);
  assert.match(await firstTest.locator('.ojpp-test-used').textContent(), /10 ms/);
  exitCode = 1;
  await firstTest.locator('.ojpp-test-run').click();
  await page.waitForFunction(() => document.querySelector('.ojpp-test-status')?.textContent === 'ERROR');
  assert.equal(await firstTest.locator('.ojpp-test-stderr').count(), 1);
  assert.match(await firstTest.locator('.ojpp-test-out.error').textContent(), /Exit code: 1/);
  await page.evaluate(() => {
    document.querySelector('.lang-en').style.display = 'none';
    document.querySelector('.lang-ja').style.display = 'inline';
  });
  await page.waitForFunction(() => document.querySelectorAll('.lang-ja .ojpp-toolbar').length === 7);
  assert.equal(await page.locator('.lang-en .ojpp-toolbar').count(), 0);
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.ojpp-toolbar').count(), 7);
  assert.equal(await page.locator('.ojpp-editor').count(), 1);
  assert.deepEqual(errors, []);
  assert.equal(await page.evaluate(() => {
    document.querySelector('.ojpp-editor').remove();
    return getComputedStyle(document.querySelector('#select-lang').parentElement).display !== 'none';
  }), true);
  const contestFixture = await readFile(new URL('./fixtures/atcoder-contest.html', import.meta.url), 'utf8');
  const contestUrl = 'https://atcoder.jp/contests/abc478';
  await page.route(contestUrl, route => route.fulfill({ body: contestFixture, contentType: 'text/html' }));
  const injectContest = async enabled => page.evaluate(({ code, enabled }) => {
    window.requests = [];
    window.GM_getValue = (key, fallback) => key === 'ojpp:settings' ? {
      locale: 'zh', targetLang: '简体中文', autoTranslate: { atcoder: enabled }, stream: false,
      providers: [{ id: 'test', name: 'Test', protocol: 'openai-chat', baseUrl: 'https://fixture.invalid', model: 'test', apiKey: '' }], activeProviderId: 'test',
    } : fallback;
    window.GM_setValue = () => {};
    window.GM_setClipboard = () => {};
    window.GM_xmlhttpRequest = opts => {
      window.requests.push(opts.data);
      setTimeout(() => opts.onload({ status: 200, responseText: JSON.stringify({ choices: [{ message: { content: '比赛介绍译文' } }] }) }), 0);
      return { abort() {} };
    };
    (0, eval)(code);
  }, { code: bundle, enabled });
  await page.goto(contestUrl);
  await injectContest(true);
  await page.waitForFunction(() => document.querySelector('.ojpp-translate-btn')?.dataset.state === 'done');
  assert.equal(await page.locator('.ojpp-toolbar').count(), 1);
  assert.equal(await page.locator('.insert-participant-box a').textContent(), '虚拟参赛');
  assert.equal(await page.evaluate(() => window.requests.length), 1);
  assert.match(await page.evaluate(() => window.requests[0]), /full-feedback/);
  assert.doesNotMatch(await page.evaluate(() => window.requests[0]), /コンテスト時間/);
  await page.evaluate(() => { document.querySelector('.lang-en').style.display = 'none'; document.querySelector('.lang-ja').style.display = 'inline'; });
  await page.waitForFunction(() => window.requests.length === 2);
  assert.match(await page.evaluate(() => window.requests[1]), /コンテスト時間/);
  await page.waitForTimeout(400);
  assert.equal(await page.evaluate(() => window.requests.length), 2);
  assert.equal(await page.locator('.ojpp-toolbar').count(), 1);
  await page.goto(contestUrl);
  await injectContest(false);
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.ojpp-toolbar').count(), 1);
  assert.equal(await page.evaluate(() => window.requests.length), 0);
  const virtualFixture = await readFile(new URL('./fixtures/atcoder-virtual.html', import.meta.url), 'utf8');
  await page.route(`${contestUrl}/virtual`, route => route.fulfill({ body: virtualFixture, contentType: 'text/html' }));
  await page.goto(`${contestUrl}/virtual`);
  await injectContest(false);
  assert.match(await page.locator('.h2').textContent(), /虚拟参赛/);
  assert.match(await page.locator('.lang-en').textContent(), /虚拟参赛不会影响积分/);
  assert.doesNotMatch(await page.locator('.lang-en').textContent(), /Submitting|Virtual participation/);
  assert.doesNotMatch(await page.locator('.lang-ja').textContent(), /[ぁ-んァ-ヶ]/);
  assert.equal(await page.locator('.lang-ja a').getAttribute('href'), '/contests/abc478/standings/virtual');
  assert.equal(await page.locator('#form-register button').textContent(), '报名');
  assert.equal(await page.evaluate(() => window.requests.length), 0);
  assert.deepEqual(errors, []);
  console.log('AtCoder browser regression: bilingual content, contest auto-translation, formulas, submission, stderr and native controls passed');
} finally { await browser.close(); }
