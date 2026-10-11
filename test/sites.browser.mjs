import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { build } from 'vite';

const output = await build({ configFile: 'vite.config.ts', logLevel: 'silent', build: { write: false } });
const bundle = [output].flat().flatMap(r => r.output).find(r => r.type === 'chunk').code;
const candidates = [process.env.OJPP_CHROME, `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, chromium.executablePath()].filter(Boolean);
const browser = await chromium.launch({ executablePath: candidates.find(p => existsSync(p)) });
const fixture = name => readFile(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
async function open(url, html, settings = {}, setup = async () => {}) {
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().url() === url
    ? route.fulfill({ body: html, contentType: 'text/html' }) : route.abort());
  await setup(page);
  await page.goto(url);
  await page.evaluate(({ bundle, settings }) => {
    window.state = { requests: [], settings: { locale: 'en', theme: 'dark', targetLang: '简体中文', autoTranslate: {}, ...settings } };
    window.GM_getValue = (key, fallback) => key === 'ojpp:settings' ? window.state.settings : fallback;
    window.GM_setValue = (key, value) => { if (key === 'ojpp:settings') window.state.settings = structuredClone(value); };
    window.GM_setClipboard = value => { window.state.clipboard = value; };
    window.GM_xmlhttpRequest = opts => { window.state.requests.push(opts.data); return { abort() {} }; };
    (0, eval)(bundle);
  }, { bundle, settings });
  await page.waitForSelector('.ojpp-settings-btn');
  return page;
}
async function flags(page, site, values) {
  await page.locator('.ojpp-settings-btn').click();
  for (const [feature, value] of Object.entries(values)) {
    await page.locator(`.ojpp-site-options[data-site="${site}"] input[data-feature="${feature}"]`).setChecked(value);
  }
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForTimeout(450);
}
try {
  const qoj = await open('https://qoj.ac/problem/1', await fixture('qoj.html'));
  assert.equal(await qoj.locator('.ojpp-toolbar').count(), 1);
  assert.equal(await qoj.locator('.nav-tabs a').first().textContent(), '题面');
  await qoj.locator('.ojpp-md-btn').click();
  const md = await qoj.locator('.ojpp-md-source').textContent();
  assert.match(md, /\$N\$/);
  assert.match(md, /1 2/);
  await flags(qoj, 'qoj', { translation: false, pageI18n: false, darkMode: false });
  assert.equal(await qoj.locator('.ojpp-toolbar').count(), 0);
  assert.equal(await qoj.locator('.nav-tabs a').first().textContent(), 'Statement');
  assert.equal(await qoj.locator('.uoj-article').isVisible(), true);
  assert.equal(await qoj.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await qoj.locator('.ojpp-settings-btn').count(), 1);
  assert.equal(await qoj.evaluate(() => document.querySelector('[data-ojpp-site-dark]').textContent), '');
  await flags(qoj, 'qoj', { translation: true, pageI18n: true, darkMode: true });
  assert.equal(await qoj.locator('.ojpp-toolbar').count(), 1);
  assert.equal(await qoj.locator('.nav-tabs a').first().textContent(), '题面');
  assert.equal(await qoj.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(28, 33, 40)');
  // Saving another site's overrides must not change QOJ.
  await qoj.locator('.ojpp-settings-btn').click();
  await qoj.locator('[data-site="luogu"] summary').click();
  await qoj.locator('[data-site="luogu"] input[data-feature="translation"]').uncheck();
  await qoj.getByRole('button', { name: 'Save', exact: true }).click();
  await qoj.waitForTimeout(400);
  assert.equal(await qoj.locator('.ojpp-toolbar').count(), 1);
  await qoj.close();

  // Creation forms contain the same burger/v-codemirror structure as submission cards.
  // Neither the panel nor its hiding CSS may take over the native Markdown form.
  const creation = await open('https://www.luogu.com.cn/problem/new?type=T&providerID=101778',
    '<div class="user-nav"></div><div class="l-card burger"><div class="body"><div class="v-codemirror"><textarea id="native-statement">Native statement</textarea></div><button>Create</button></div></div>',
    { editorEnabled: true });
  assert.equal(await creation.locator('.ojpp-editor').count(), 0);
  assert.equal(await creation.locator('#native-statement').isVisible(), true);
  await creation.close();

  const luogu = await open('https://www.luogu.com.cn/problem/P1001', await fixture('luogu.html'), { targetLang: 'English' });
  assert.equal(await luogu.locator('.ojpp-toolbar').count(), 3);
  assert.equal(await luogu.locator('.io-sample .ojpp-toolbar').count(), 0);
  await luogu.locator('.ojpp-md-btn').first().click();
  assert.match(await luogu.locator('.ojpp-md-source').textContent(), /\$a,b\$/);
  assert.equal(await luogu.locator('h2').first().evaluate(e => e.firstChild.textContent), 'Description');
  await flags(luogu, 'luogu', { pageI18n: false });
  assert.equal(await luogu.locator('h2').first().evaluate(e => e.firstChild.textContent), '题目描述');
  assert.equal(await luogu.locator('.ojpp-toolbar').count(), 3);
  // Simulate SPA reuse: old translation/Markdown views must be discarded for the next problem.
  await luogu.evaluate(() => {
    history.pushState({}, '', '/problem/P1002');
    document.querySelector('#lentille-context').textContent = JSON.stringify({ data: { problem: { pid: 'P1002', content: { description: 'Next problem $x^2$', formatI: 'Input', formatO: 'Output' } } } });
    document.querySelector('.lfe-marked-wrap').textContent = 'Next problem';
  });
  await luogu.waitForTimeout(300);
  assert.equal(await luogu.locator('.ojpp-md-source').count(), 0);
  await luogu.locator('.ojpp-md-btn').first().click();
  assert.equal(await luogu.locator('.ojpp-md-source').textContent(), 'Next problem $x^2$');
  await luogu.close();

  const atcoder = await open('https://atcoder.jp/contests/abc350/tasks/abc350_a', await fixture('atcoder-task.html'));
  await atcoder.waitForSelector('.ojpp-editor');
  await flags(atcoder, 'atcoder', { editor: false });
  assert.equal(await atcoder.locator('.ojpp-editor').count(), 0);
  assert.equal(await atcoder.locator('#select-lang').isVisible(), true);
  await flags(atcoder, 'atcoder', { editor: true });
  assert.equal(await atcoder.locator('.ojpp-editor').count(), 1);
  await atcoder.close();

  const nc = await open('https://ac.nowcoder.com/acm/contest/100000/A', await fixture('nowcoder.html'));
  assert.equal(await nc.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(28, 33, 40)');
  await flags(nc, 'nowcoder', { darkMode: false });
  assert.equal(await nc.evaluate(() => document.querySelector('[data-ojpp-site-dark]').textContent), '');
  assert.ok(await nc.locator('.ojpp-toolbar').count() > 0);
  await nc.close();
  // Minimal searchable PDF; all assets are local to the test (no PDF.js CDN/worker requests).
  const stream = 'BT /F1 14 Tf 40 100 Td (PDF statement: add 1 and 2.) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`; }
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const pdfPage = await open('https://qoj.ac/problem/2', '<nav class="navbar"><ul class="navbar-nav"></ul></nav><div id="tab-statement"><article class="uoj-article"></article><iframe id="statements-pdf" src="/download.php?type=statement&id=2"></iframe></div>', {}, async p => {
    await p.route('**/download.php?type=statement&id=2', route => route.fulfill({ body: Buffer.from(pdf), contentType: 'application/pdf' }));
  });
  await pdfPage.waitForSelector('.ojpp-qoj-pdf-text', { state: 'attached' });
  await pdfPage.locator('.ojpp-md-btn').click();
  assert.match(await pdfPage.locator('.ojpp-md-source').textContent(), /PDF statement: add 1 and 2/);
  await flags(pdfPage, 'qoj', { translation: false });
  assert.equal(await pdfPage.locator('.ojpp-qoj-pdf-text').count(), 0);
  assert.equal(await pdfPage.locator('#statements-pdf').count(), 1);
  await flags(pdfPage, 'qoj', { translation: true });
  assert.equal(await pdfPage.locator('.ojpp-qoj-pdf-text').count(), 1);
  await pdfPage.close();
  console.log('Site browser regression: QOJ HTML/PDF, Luogu raw Markdown/SPA, feature toggles, i18n restore and editor lifecycle passed');
} finally { await browser.close(); }
