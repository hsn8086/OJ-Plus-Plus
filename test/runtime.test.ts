import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ask } from '../src/core/ai.ts';
import { defaultSettings, SETTINGS_KEY } from '../src/core/config.ts';
import { loadSettings, saveSettings } from '../src/core/settings-store.ts';
import type { Storage } from '../src/platforms/types.ts';

function memoryStorage(values: Map<string, unknown>): Storage {
  return {
    async get<T>(key: string) { return values.get(key) as T | undefined; },
    async set<T>(key: string, value: T) { values.set(key, structuredClone(value)); },
  };
}

test('更名后从旧存储迁移配置，之后以新键为准', async () => {
  const old = defaultSettings();
  old.providers[0].apiKey = 'saved-key';
  const values = new Map<string, unknown>([['ncb:settings', old]]);
  const storage = memoryStorage(values);
  const settings = await loadSettings(storage);
  assert.equal(settings.providers[0].apiKey, 'saved-key');
  assert.deepEqual(values.get(SETTINGS_KEY), settings);
  settings.providers[0].model = 'updated-model';
  await saveSettings(storage, settings);
  assert.equal((await loadSettings(storage)).providers[0].model, 'updated-model');
  assert.deepEqual(values.get('ncb:settings'), old);
});

test('异步存储写入失败向调用方报告，防止显示虚假的保存成功', async () => {
  const storage: Storage = {
    async get() { return undefined; },
    async set() { throw new Error('storage unavailable'); },
  };
  await assert.rejects(saveSettings(storage, defaultSettings()), /storage unavailable/);
});

test('空 API Key 不发认证头，也不阻断请求', async () => {
  const settings = defaultSettings();
  settings.providers[0].apiKey = '';
  let headers: Record<string, string> = {};
  const transport = async (request: { headers?: Record<string, string> }) => {
    headers = request.headers ?? {};
    return { status: 200, statusText: 'OK', text: '{"choices":[{"message":{"content":"译文"}}]}' };
  };
  assert.equal(await ask(transport, settings, 'text', 'system'), '译文');
  assert.equal(headers.Authorization, undefined);
  assert.equal(headers['Content-Type'], 'application/json');

  // 手动在额外请求头里写了认证头时，仍然照常发送。
  settings.providers[0].headers = { Authorization: 'Bearer local-token' };
  await ask(transport, settings, 'text', 'system');
  assert.equal(headers.Authorization, 'Bearer local-token');
});

test('AI 调用使用注入的传输：鉴权失败不重试，取消后不发请求', async () => {
  const settings = defaultSettings();
  settings.providers[0].apiKey = 'test-key';
  settings.retries = 3;
  let requests = 0;
  const transport = async () => {
    requests += 1;
    return { status: 401, statusText: 'Unauthorized', text: '{"error":{"message":"bad key"}}' };
  };
  await assert.rejects(ask(transport, settings, 'text', 'system'), /401 bad key/);
  assert.equal(requests, 1);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(ask(transport, settings, 'text', 'system', { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(requests, 1);
});
