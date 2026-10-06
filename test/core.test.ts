import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chunkMarkdown, buildSystemPrompt } from '../src/prompt.ts';
import { migrate, defaultSettings, createProvider, PROVIDER_PRESETS } from '../src/config.ts';
import { getAdapter } from '../src/providers.ts';
import type { ProviderConfig } from '../src/types.ts';

function provider(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
  const base = createProvider(PROVIDER_PRESETS[0]);
  return { ...base, apiKey: 'sk-test', ...overrides };
}

function stripIds(s: ReturnType<typeof defaultSettings>) {
  return {
    ...s,
    activeProviderId: s.activeProviderId ? '<id>' : null,
    providers: s.providers.map((p) => ({ ...p, id: '<id>' })),
  };
}

test('chunkMarkdown 保留短文本', () => {
  assert.deepEqual(chunkMarkdown('hello'), ['hello']);
  assert.deepEqual(chunkMarkdown('   '), []);
});

test('chunkMarkdown 按标题切分且每块不超限', () => {
  const doc = [
    '# A',
    'a'.repeat(40),
    '# B',
    'b'.repeat(40),
    '# C',
    'c'.repeat(40),
  ].join('\n\n');
  const chunks = chunkMarkdown(doc, 60);
  assert.ok(chunks.length >= 3);
  for (const chunk of chunks) assert.ok(chunk.length <= 60, `too long: ${chunk.length}`);
  assert.ok(chunks.join('').includes('ccc'));
});

test('chunkMarkdown 对超长单段按行硬切', () => {
  const long = Array.from({ length: 50 }, (_, i) => `line-${i}-${'x'.repeat(20)}`).join('\n');
  const chunks = chunkMarkdown(long, 200);
  assert.ok(chunks.length > 1);
  for (const chunk of chunks) assert.ok(chunk.length <= 200);
});

test('buildSystemPrompt 注入目标语言与追加要求', () => {
  const settings = defaultSettings();
  settings.targetLang = 'English';
  settings.extraPrompt = 'keep it terse';
  const prompt = buildSystemPrompt(settings);
  assert.ok(prompt.includes('English'));
  assert.ok(prompt.includes('keep it terse'));
  assert.ok(prompt.includes('LaTeX'));
});

test('migrate 为缺失字段补默认值', () => {
  const migrated = migrate({ providers: [{ id: 'x', name: 'n' }] });
  assert.equal(migrated.timeoutMs, defaultSettings().timeoutMs);
  assert.equal(migrated.providers[0].protocol, 'openai-chat');
  assert.deepEqual(migrated.providers[0].headers, {});
  assert.equal(migrated.activeProviderId, 'x');
});

test('migrate 把旧的顶层 temperature 并进 body', () => {
  const migrated = migrate({
    providers: [{ id: 'x', temperature: 0.3, body: { top_p: 0.9 } }],
  });
  assert.deepEqual(migrated.providers[0].body, { temperature: 0.3, top_p: 0.9 });
});

test('默认模型是 gpt-6-luna', () => {
  assert.equal(defaultSettings().providers[0].model, 'gpt-6-luna');
  const custom = PROVIDER_PRESETS.find((p) => p.key === 'custom');
  assert.equal(custom?.model, 'gpt-6-luna');
});

test('migrate 修复失效的 activeProviderId', () => {
  const migrated = migrate({ activeProviderId: 'ghost', providers: [{ id: 'real' }] });
  assert.equal(migrated.activeProviderId, 'real');
});

test('migrate 处理非对象输入', () => {
  assert.deepEqual(stripIds(migrate(null)), stripIds(defaultSettings()));
  assert.deepEqual(stripIds(migrate('nope')), stripIds(defaultSettings()));
});

test('openai-chat 端点补全与请求体', () => {
  const adapter = getAdapter('openai-chat');
  const cfg = provider({ baseUrl: 'https://api.example.com/v1/', model: 'm1' });
  const { url, headers, body } = adapter.build(cfg, {
    messages: [{ role: 'user', content: 'hi' }],
  });
  assert.equal(url, 'https://api.example.com/v1/chat/completions');
  assert.equal(headers.Authorization, 'Bearer sk-test');
  assert.equal(body.model, 'm1');
  assert.equal(body.temperature, undefined);
  assert.equal(body.thinking, undefined);
});

test('openai-chat 接受完整端点', () => {
  const adapter = getAdapter('openai-chat');
  const cfg = provider({ baseUrl: 'https://gw.example.com/v1/chat/completions' });
  const { url } = adapter.build(cfg, { messages: [] });
  assert.equal(url, 'https://gw.example.com/v1/chat/completions');
});

test('openai-chat 解析字符串与分段 content', () => {
  const adapter = getAdapter('openai-chat');
  assert.equal(
    adapter.extractText({ choices: [{ message: { content: 'abc' } }] }),
    'abc',
  );
  assert.equal(
    adapter.extractText({
      choices: [{ message: { content: [{ type: 'text', text: 'a' }, { text: 'b' }] } }],
    }),
    'ab',
  );
  assert.equal(adapter.extractText({}), '');
});

test('openai-responses 端点与 output_text 解析', () => {
  const adapter = getAdapter('openai-responses');
  const cfg = provider({ baseUrl: 'https://api.example.com/v1', protocol: 'openai-responses' });
  const { url, body } = adapter.build(cfg, {
    messages: [{ role: 'system', content: 's' }, { role: 'user', content: 'u' }],
  });
  assert.equal(url, 'https://api.example.com/v1/responses');
  assert.deepEqual(body.input, [
    { role: 'system', content: 's' },
    { role: 'user', content: 'u' },
  ]);
  assert.equal(adapter.extractText({ output_text: 'hi' }), 'hi');
  assert.equal(
    adapter.extractText({ output: [{ content: [{ type: 'output_text', text: 'x' }] }] }),
    'x',
  );
});

test('openai-responses 写入 reasoning.effort', () => {
  const adapter = getAdapter('openai-responses');
  const cfg = provider({
    protocol: 'openai-responses',
    reasoning: { enabled: null, effort: 'high' },
  });
  const { body } = adapter.build(cfg, { messages: [] });
  assert.deepEqual(body.reasoning, { effort: 'high' });
});

test('anthropic 把 system 提出来并解析 content 数组', () => {
  const adapter = getAdapter('anthropic');
  const cfg = provider({
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-5',
  });
  const { url, headers, body } = adapter.build(cfg, {
    messages: [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'usr' },
    ],
  });
  assert.equal(url, 'https://api.anthropic.com/v1/messages');
  assert.equal(headers['x-api-key'], 'sk-test');
  assert.equal(headers['anthropic-version'], '2023-06-01');
  assert.equal(body.system, 'sys');
  assert.deepEqual(body.messages, [{ role: 'user', content: 'usr' }]);
  assert.equal(body.max_tokens, 8192);
  assert.equal(
    adapter.extractText({ content: [{ type: 'text', text: 'a' }, { type: 'thinking' }, { type: 'text', text: 'b' }] }),
    'ab',
  );
});

test('额外 header 与 body 可覆盖默认值', () => {
  const adapter = getAdapter('openai-chat');
  const cfg = provider({
    headers: { Authorization: 'Custom abc', 'X-Extra': '1' },
    body: { model: 'override', top_p: 0.9 },
  });
  const { headers, body } = adapter.build(cfg, { messages: [] });
  assert.equal(headers.Authorization, 'Custom abc');
  assert.equal(headers['X-Extra'], '1');
  assert.equal(body.model, 'override');
  assert.equal(body.top_p, 0.9);
});

test('未填 baseUrl 时回退到协议默认地址', () => {
  const adapter = getAdapter('openai-chat');
  const cfg = provider({ baseUrl: '' });
  const { url } = adapter.build(cfg, { messages: [] });
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
});
