import type { HttpTransport } from '../platforms/types.ts';
import { getAdapter } from './providers.ts';
import type { ProviderConfig, Settings } from './types.ts';

export class AiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AiError';
    this.status = status;
  }
}

export interface AskOptions {
  signal?: AbortSignal;
}

/**
 * 用当前选中的提供商完成一次问答，返回纯文本结果。
 * 失败时按 settings.retries 重试（不重试鉴权类错误）。
 */
export async function ask(
  request: HttpTransport,
  settings: Settings,
  prompt: string,
  systemPrompt: string,
  options: AskOptions = {},
): Promise<string> {
  const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
  if (!cfg) throw new AiError('还没有配置任何提供商，请先打开设置面板添加一个');
  if (!cfg.model.trim()) throw new AiError('未填写模型名');
  if (!cfg.apiKey.trim() && !cfg.headers['Authorization'] && !cfg.headers['x-api-key']) {
    throw new AiError('未填写 API Key');
  }

  const attempts = Math.max(1, settings.retries + 1);
  let lastError: unknown;

  for (let i = 0; i < attempts; i += 1) {
    if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    try {
      return await once(request, settings, cfg, prompt, systemPrompt, options);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      lastError = error;
      if (error instanceof AiError && isFatal(error.status)) break;
      if (i < attempts - 1) await sleep(600 * (i + 1), options.signal);
    }
  }
  throw lastError instanceof Error ? lastError : new AiError('翻译请求失败');
}

async function once(
  request: HttpTransport,
  settings: Settings,
  cfg: ProviderConfig,
  prompt: string,
  systemPrompt: string,
  options: AskOptions,
): Promise<string> {
  const adapter = getAdapter(cfg.protocol);
  const { url, headers, body } = adapter.build(cfg, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  });

  const res = await request({
    method: 'POST',
    url,
    headers,
    body: JSON.stringify(body),
    timeoutMs: settings.timeoutMs,
    signal: options.signal,
  });

  let payload: unknown;
  try {
    payload = res.text ? JSON.parse(res.text) : null;
  } catch {
    payload = null;
  }

  if (res.status < 200 || res.status >= 300) {
    const detail =
      (payload && adapter.extractError?.(payload)) ||
      truncate(res.text, 400) ||
      res.statusText;
    throw new AiError(`${res.status} ${detail}`, res.status);
  }

  const text = adapter.extractText(payload);
  if (!text.trim()) {
    throw new AiError('接口返回了空内容，可能是模型不支持或提示词被拒绝');
  }
  return text;
}

function isFatal(status?: number): boolean {
  return status === 400 || status === 401 || status === 403 || status === 404;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/** 发一条短请求，使用设置面板内尚未保存的配置测试连接。 */
export async function testConnection(
  request: HttpTransport,
  settings: Settings,
  cfg: ProviderConfig,
): Promise<string> {
  const adapter = getAdapter(cfg.protocol);
  const { url, headers, body } = adapter.build(cfg, {
    messages: [{ role: 'user', content: 'reply with the single word: ok' }],
  });
  // 测试时把 max_tokens 压到最小，避免浪费额度
  if (cfg.protocol === 'anthropic') {
    (body as Record<string, unknown>).max_tokens = 16;
  }
  const res = await request({
    method: 'POST',
    url,
    headers,
    body: JSON.stringify(body),
    timeoutMs: Math.min(settings.timeoutMs, 30_000),
  });
  let payload: unknown;
  try {
    payload = JSON.parse(res.text);
  } catch {
    payload = null;
  }
  if (res.status < 200 || res.status >= 300) {
    const detail =
      (payload && adapter.extractError?.(payload)) || truncate(res.text, 300);
    throw new AiError(`${res.status} ${detail}`, res.status);
  }
  return adapter.extractText(payload) || '(空响应，但状态码正常)';
}
