import type { HttpStreamTransport, HttpTransport } from '../platforms/types.ts';
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
  /** 收到增量正文时回调（已累计），用于流式展示 */
  onDelta?: (text: string) => void;
  /** 支持流式的传输；不传则退化为一次性请求 */
  stream?: HttpStreamTransport;
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
  // 允许空 Key：本地推理服务通常不需要鉴权。

  const attempts = Math.max(1, settings.retries + 1);
  let lastError: unknown;
  // 一旦已经把部分译文显示给用户，就不再重试：
  // 重试会让面板内容回退重来，比直接报错更差。
  const shown: string[] = [];
  const optionsWithGuard: AskOptions = options.onDelta
    ? { ...options, onDelta: (text) => { shown.push(text); options.onDelta!(text); } }
    : options;

  for (let i = 0; i < attempts; i += 1) {
    if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    try {
      return await once(request, settings, cfg, prompt, systemPrompt, optionsWithGuard);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      lastError = error;
      if (error instanceof AiError && isFatal(error.status)) break;
      if (shown.length > 0) break;
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
  const wantStream = !!(options.stream && options.onDelta && adapter.createStreamReader);
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: prompt },
  ];
  const build = (stream: boolean) => {
    const { url, headers, body } = adapter.build(cfg, { messages, stream });
    return {
      method: 'POST',
      url,
      headers,
      body: JSON.stringify(body),
      timeoutMs: settings.timeoutMs,
      signal: options.signal,
    };
  };

  // 流式：边收边回显。失败且没吐过任何内容时，允许回退到一次性请求。
  if (wantStream) {
    let streamed = false;
    const readStream = adapter.createStreamReader!();
    try {
      const res = await options.stream!({
        ...build(true),
        onChunk: (raw) => {
          const text = readStream(raw);
          if (text) {
            streamed = true;
            options.onDelta!(text);
          }
        },
      });
      if (res.status < 200 || res.status >= 300) {
        // 有些服务商在流式错误时返回普通 JSON 错误体
        const payload = safeJson(res.text);
        const detail =
          (payload && adapter.extractError?.(payload)) || truncate(res.text, 400) || res.statusText;
        throw new AiError(`${res.status} ${detail}`, res.status);
      }
      const finalText = readStream(res.text) ?? '';
      if (finalText.trim()) return finalText;
      // 流里没解析出正文：可能是服务端忽略了 stream 参数，当作普通响应再解析一次
      const fallback = adapter.extractText(safeJson(res.text));
      if (fallback.trim()) return fallback;
      throw new AiError('接口返回了空内容，可能是模型不支持或提示词被拒绝');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      if (error instanceof AiError && isFatal(error.status)) throw error;
      // 已经显示过部分译文就不要重新开始，否则用户会看到内容回退
      if (streamed) throw error;
      // 否则退回非流式重试。注意要用不带 stream 的请求体，
      // 否则服务端仍返回 SSE，而下面按 JSON 解析会失败。
    }
  }

  const res = await request(build(false));
  const payload = safeJson(res.text);

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
  // 非流式回退时，一次性把结果交给回调，避免 UI 停在空面板
  if (wantStream) options.onDelta!(text);
  return text;
}

function safeJson(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
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
