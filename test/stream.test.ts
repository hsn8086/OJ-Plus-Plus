import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSseParser } from '../src/core/sse.ts';
import { getAdapter } from '../src/core/providers.ts';
import { renderMarkdown, stabilizeMarkdown } from '../src/ui/markdown.ts';

function sse(events: string[]): string {
  return events.map((e) => `data: ${e}\n\n`).join('');
}

test('SSE 解析：分片落在事件中间也能拼回来', () => {
  const full = sse(['{"a":1}', '{"b":2}', '[DONE]']);
  // 逐字符喂，模拟最坏的分片
  const parser = createSseParser();
  const seen: string[] = [];
  for (const ch of full) seen.push(...parser(ch));
  assert.deepEqual(seen, ['{"a":1}', '{"b":2}', '[DONE]']);
});

test('SSE 解析：容忍 CRLF 与多行 data', () => {
  const parser = createSseParser();
  assert.deepEqual(parser('data: line1\r\ndata: line2\r\n\r\n'), ['line1\nline2']);
});

test('流式提取：三种协议都能取出累计正文', () => {
  const chat = getAdapter('openai-chat').createStreamReader!();
  assert.equal(
    chat(sse([
      '{"choices":[{"delta":{"content":"你"}}]}',
      '{"choices":[{"delta":{"content":"好"}}]}',
    ])),
    '你好',
  );

  const responses = getAdapter('openai-responses').createStreamReader!();
  assert.equal(
    responses(sse([
      '{"type":"response.output_text.delta","delta":"你"}',
      '{"type":"response.output_text.delta","delta":"好"}',
    ])),
    '你好',
  );

  const anthropic = getAdapter('anthropic').createStreamReader!();
  assert.equal(
    anthropic(sse([
      '{"type":"message_start"}',
      '{"type":"content_block_delta","delta":{"type":"text_delta","text":"你"}}',
      '{"type":"content_block_delta","delta":{"type":"text_delta","text":"好"}}',
    ])),
    '你好',
  );
});

test('流式提取：只收到 thinking 时不应把思考内容当译文', () => {
  const chat = getAdapter('openai-chat').createStreamReader!();
  assert.equal(chat(sse(['{"choices":[{"delta":{"reasoning_content":"嗯…"}}]}'])), null);
});

test('流式请求体带上 stream 开关，非流式不带', () => {
  const cfg = { ...getAdapter('openai-chat'), apiKey: 'k' } as never;
  const adapter = getAdapter('openai-chat');
  const base = { ...cfg, model: 'm', baseUrl: 'https://api.example/v1', headers: {}, body: {}, reasoning: { enabled: null, effort: '' } };
  assert.equal(adapter.build(base, { messages: [], stream: true }).body.stream, true);
  assert.equal(adapter.build(base, { messages: [] }).body.stream, undefined);
});

test('流式渲染：逐帧都不漏出 LaTeX 源码，且终态与原文一致', () => {
  const visible = (html: string) =>
    html.replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<[^>]*>/g, '');
  const samples = [
    '当小 S 第奇数次（ $1,3,5,\\cdots$ ）次按按钮时，她可以得到 $1$ 元。',
    '给定 $P=[p_0, p_1, \\ldots, p_{n-1}]$ 以及 $n-1$ 次修改。',
    '复杂度是 $$O(n \\log n)$$，其中 $n \\le 10^9$。',
    '用 `$` 表示美元，公式是 $a+b$。',
    '```sh\nprice=$5\n```\n\n然后是 $x$。',
    '价格从 $5 到 $10 不等，共 $20。',
    '设 $x = \\frac{a}{b}$ 且 $y > 0$。',
  ];

  for (const sample of samples) {
    // 终态必须与不做稳定化时完全一致，否则稳定化会吃掉内容
    assert.equal(
      visible(renderMarkdown(stabilizeMarkdown(sample))).trim(),
      visible(renderMarkdown(sample)).trim(),
      `终态不一致: ${sample}`,
    );
    // 逐字符前缀：任何一帧都不能漏出 LaTeX 源码
    for (let i = 0; i <= sample.length; i += 2) {
      const prefix = sample.slice(0, i);
      const shown = visible(renderMarkdown(stabilizeMarkdown(prefix)));
      assert.doesNotMatch(shown, /\\[a-zA-Z]{2,}/, `漏出 LaTeX 源码: ${JSON.stringify(prefix)}`);
      assert.doesNotMatch(shown, /\$\$/, `漏出 $$: ${JSON.stringify(prefix)}`);
    }
  }
});

test('流式渲染：半截公式先隐藏，货币与代码里的 $ 照常显示', () => {
  // 半截公式：隐藏，避免用户看到 $a+
  assert.equal(stabilizeMarkdown('公式是 $a+').trim(), '公式是');
  assert.equal(stabilizeMarkdown('公式是 $n \\le').trim(), '公式是');
  // 未闭合的显示公式
  assert.equal(stabilizeMarkdown('复杂度是 $$O(n').trim(), '复杂度是');
  // 货币：不是公式，必须原样保留
  assert.equal(stabilizeMarkdown('价格从 $5 到 $10 不等，共 $20。'), '价格从 $5 到 $10 不等，共 $20。');
  // 代码里的 $ 不是公式
  assert.equal(stabilizeMarkdown('用 `$` 表示美元。'), '用 `$` 表示美元。');
  // 已闭合的公式不受影响
  assert.equal(stabilizeMarkdown('公式是 $a+b$。'), '公式是 $a+b$。');
});

test('行内 $$...$$ 渲染成独立公式，不留下可见美元符', () => {
  const html = renderMarkdown('复杂度是 $$O(n \\log n)$$，其中 $n \\le 10^9$。');
  const visible = html.replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<[^>]*>/g, '');
  assert.doesNotMatch(visible, /\$/, `可见文字不应有 $: ${visible}`);
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 1);
  // 货币不该被当成公式
  const money = renderMarkdown('价格从 $5 到 $10 不等。');
  assert.equal((money.match(/class="katex/g) ?? []).length, 0);
  assert.match(money, /\$5/);
});
