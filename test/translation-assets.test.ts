import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepareImageReferences } from '../src/core/image-references.ts';
import { renderMarkdown } from '../src/ui/markdown.ts';
import { translateMarkdown } from '../src/core/translate.ts';
import { translationCacheKey } from '../src/core/translate-cache.ts';
import { defaultSettings } from '../src/core/config.ts';

test('image references survive streaming, relative URLs and omitted or invented model images', () => {
  const source = 'Before ![diagram](/figures/tree(1).png "tree")\n\n```md\n![code](example.png)\n```\n`![inline](example.png)`';
  const refs = prepareImageReferences(source, 'https://qoj.ac/problem/1');
  assert.match(refs.markdown, /!\[diagram\]\(ojpp-image:1\)/);
  assert.match(refs.markdown, /!\[code\]\(example.png\)/);
  assert.match(refs.markdown, /`!\[inline\]\(example.png\)`/);
  const partial = refs.restore('Before ![diagram](ojpp-image:1)');
  assert.match(partial, /https:\/\/qoj.ac\/figures\/tree\(1\).png/);
  assert.doesNotMatch(partial, /ojpp-image:/);
  const complete = refs.restore('Text\n\n![图片](imaginary.png)', true);
  assert.doesNotMatch(complete, /imaginary/);
  assert.match(complete, /https:\/\/qoj.ac\/figures\/tree\(1\).png/);
  assert.equal((refs.restore(refs.markdown, true).match(/tree\(1\).png/g) ?? []).length, 1);
});

test('PDF assets use distinct valid references alongside HTML images', () => {
  const refs = prepareImageReferences('![图1]\n![other](other.png)', 'https://qoj.ac/problem/1', { '![图1]': 'data:image/png;base64,AAAA' });
  assert.match(refs.markdown, /ojpp-image:1/);
  assert.match(refs.markdown, /ojpp-image:2/);
  const restored = refs.restore(refs.markdown, true);
  assert.match(restored, /data:image\/png;base64,AAAA/);
  assert.match(restored, /https:\/\/qoj.ac\/problem\/other.png/);
});

test('vision instructions belong to the system message, not the text to translate', async () => {
  const settings = defaultSettings();
  settings.providers[0]!.apiKey = 'fixture';
  const source = 'Statement ![图](ojpp-image:1)';
  let body: any;
  await translateMarkdown(async request => {
    body = JSON.parse(request.body!);
    return { status: 200, statusText: 'OK', text: JSON.stringify({ choices: [{ message: { content: source } }] }) };
  }, { settings, markdown: source, images: ['data:image/png;base64,AAAA'], streaming: false });
  assert.match(body.messages[0].content, /不要把这条说明输出到译文/);
  assert.equal(body.messages[1].content[0].text, source);
  assert.equal(body.messages[1].content[1].type, 'image_url');
});

test('translation cache changes with image assets and prompt settings', async () => {
  const settings = defaultSettings();
  const old = await translationCacheKey(settings, 'same text', 'asset-a');
  assert.notEqual(old, await translationCacheKey(settings, 'same text', 'asset-b'));
  settings.extraPrompt = 'New instructions';
  assert.notEqual(old, await translationCacheKey(settings, 'same text', 'asset-a'));
});

test('translated code fences receive safe highlighting and retain their text', () => {
  for (const [language, code] of [
    ['cpp', '#include <iostream>\nint main() { return 0; }'],
    ['python', 'a = input()\nprint(a)'],
    ['java', 'public class Main { int a = 1; }'],
    ['pascal', 'begin writeln(1); end.'],
    ['cs', 'class Main { static void Main() {} }'],
  ]) {
    const html = renderMarkdown('```' + language + '\n' + code + '\n```');
    assert.match(html, /class="hljs-/);
    assert.equal(html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim(), code);
  }
  assert.doesNotMatch(renderMarkdown('```unknown\n<script>alert(1)</script>\n```'), /<script>/);
  assert.doesNotMatch(renderMarkdown('```text\n1 2 3\n```'), /class="hljs-/);
});
