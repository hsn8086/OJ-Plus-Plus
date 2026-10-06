import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSseParser } from '../src/core/sse.ts';
import { getAdapter } from '../src/core/providers.ts';
import { stabilizeMarkdown } from '../src/ui/markdown.ts';

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

test('流式渲染：未闭合的公式与代码块不会渲染成错乱内容', () => {
  // 正常闭合：原样保留
  assert.equal(stabilizeMarkdown('答案是 $a+b$ 。'), '答案是 $a+b$ 。');
  // 公式只到一半：把半截公式摘掉
  assert.equal(stabilizeMarkdown('答案是 $a+'), '答案是 ');
  assert.equal(stabilizeMarkdown('公式 $x$ 和未完成的 $y'), '公式 $x$ 和未完成的 ');
  // 显示公式
  assert.equal(stabilizeMarkdown('$$\nO(n)\n$$'), '$$\nO(n)\n$$');
  assert.equal(stabilizeMarkdown('$$\nO(n'), '');
  // 代码块未闭合
  assert.equal(stabilizeMarkdown('```ts\nconst a = 1;\n'), '');
  assert.equal(stabilizeMarkdown('```ts\nconst a = 1;\n```'), '```ts\nconst a = 1;\n```');
  // 行内代码未闭合
  assert.equal(stabilizeMarkdown('用 `code'), '用 ');
});

test('浏览器平台：fetch 流式边收边回调，且累计文本正确', async () => {
  const { createBrowserPlatform } = await import('../src/platforms/browser.ts');
  const text = '给定 $a+b$ 的结果。';
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < text.length; i += 3) {
        const piece = `data: ${JSON.stringify({ choices: [{ delta: { content: text.slice(i, i + 3) } }] })}\n\n`;
        controller.enqueue(encoder.encode(piece));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response(body, { status: 200 })) as typeof fetch;
  try {
    const seen: string[] = [];
    const platform = createBrowserPlatform();
    const res = await platform.stream!({
      method: 'POST',
      url: 'https://api.example/v1/chat/completions',
      onChunk: (raw) => seen.push(raw),
    });
    assert.equal(res.status, 200);
    // 回调拿到的是累计文本，且分片到达
    assert.ok(seen.length > 1, `应多次回调，实际 ${seen.length}`);
    assert.equal(seen.at(-1), res.text);
    assert.equal(getAdapter('openai-chat').createStreamReader!()(res.text), text);
  } finally {
    globalThis.fetch = original;
  }
});
