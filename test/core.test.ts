import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chunkMarkdown } from '../src/core/prompt.ts';
import { migrate, createProvider, PROVIDER_PRESETS } from '../src/core/config.ts';
import { getAdapter } from '../src/core/providers.ts';
import type { Protocol } from '../src/core/types.ts';

const messages = [{ role: 'system' as const, content: 'sys' }, { role: 'user' as const, content: 'usr' }];

for (const protocol of ['openai-chat', 'openai-responses', 'anthropic'] as Protocol[]) {
  test(`${protocol} 请求与响应契约`, () => {
    const cfg = { ...createProvider(PROVIDER_PRESETS[0]), protocol, apiKey: 'test-key', baseUrl: 'https://api.example/v1/' };
    const adapter = getAdapter(protocol);
    const { url, headers, body } = adapter.build(cfg, { messages });
    const endpoint = protocol === 'anthropic' ? 'messages' : protocol === 'openai-responses' ? 'responses' : 'chat/completions';
    assert.equal(url, `https://api.example/v1/${endpoint}`);
    assert.equal(adapter.build({ ...cfg, baseUrl: url }, { messages }).url, url);
    assert.equal(body.model, cfg.model);
    assert.equal(body.temperature, undefined);
    if (protocol === 'anthropic') {
      assert.equal(headers['x-api-key'], 'test-key');
      assert.equal(headers['anthropic-version'], '2023-06-01');
      assert.equal(body.system, 'sys');
      assert.deepEqual(body.messages, [messages[1]]);
      assert.equal(adapter.extractText({ content: [{ type: 'thinking' }, { type: 'text', text: '译文' }] }), '译文');
    } else {
      assert.equal(headers.Authorization, 'Bearer test-key');
      assert.deepEqual(protocol === 'openai-chat' ? body.messages : body.input, messages);
      if (protocol === 'openai-chat') {
        assert.equal(adapter.extractText({ choices: [{ message: { content: '译文' } }] }), '译文');
        assert.equal(adapter.extractText({ choices: [{ message: { content: [{ text: '译' }, { text: '文' }] } }] }), '译文');
      } else {
        assert.equal(adapter.extractText({ output_text: '译文' }), '译文');
        assert.equal(adapter.extractText({ output: [{ content: [{ type: 'output_text', text: '译文' }] }] }), '译文');
        assert.deepEqual(adapter.build({ ...cfg, reasoning: { enabled: null, effort: 'high' } }, { messages }).body.reasoning, { effort: 'high' });
      }
    }
    const custom = adapter.build({ ...cfg, headers: { 'X-Custom': '1' }, body: { model: 'override' } }, { messages });
    assert.equal(custom.headers['X-Custom'], '1');
    assert.equal(custom.body.model, 'override');
  });
}

test('配置迁移保留用户数据、修复失效选择并迁移旧参数', () => {
  const settings = migrate({ activeProviderId: 'deleted', providers: [{ id: 'saved', name: '我的接口', apiKey: 'saved-key', temperature: 0.3, body: { top_p: 0.9 } }] });
  assert.equal(settings.activeProviderId, 'saved');
  assert.equal(settings.providers[0].apiKey, 'saved-key');
  assert.equal(settings.providers[0].name, '我的接口');
  assert.deepEqual(settings.providers[0].body, { temperature: 0.3, top_p: 0.9 });
  assert.deepEqual(settings.providers[0].reasoning, { enabled: null, effort: '' });
});

test('长题面分段保持文本顺序与内容', () => {
  const text = Array.from({ length: 60 }, (_, i) => `line-${i}-${'x'.repeat(20)}`).join('\n');
  const chunks = chunkMarkdown(text, 200);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.length <= 200));
  assert.equal(chunks.join('\n'), text);
});
