import { t } from '../i18n/index.ts';
import type { HttpStreamTransport, HttpTransport, Platform } from './types.ts';

function timeoutSignal(req: { timeoutMs?: number; signal?: AbortSignal }): AbortSignal | undefined {
  return req.timeoutMs
    ? AbortSignal.any([
        ...(req.signal ? [req.signal] : []),
        AbortSignal.timeout(req.timeoutMs),
      ])
    : req.signal;
}

function rethrow(error: unknown, signal?: AbortSignal): never {
  if (signal?.reason?.name === 'TimeoutError') throw new Error(t('error.timeout'));
  throw error;
}

/** 普通网页调试适配器。fetch 受 CORS 限制，不用于替代扩展后台请求。 */
const request: HttpTransport = async (req) => {
  const signal = timeoutSignal(req);
  try {
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      signal,
    });
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    };
  } catch (error) {
    rethrow(error, signal);
  }
};

const stream: HttpStreamTransport = async (req) => {
  const signal = timeoutSignal(req);
  try {
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      signal,
    });
    if (!response.body) {
      return {
        status: response.status,
        statusText: response.statusText,
        text: await response.text(),
      };
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      req.onChunk?.(text);
    }
    text += decoder.decode();
    return { status: response.status, statusText: response.statusText, text };
  } catch (error) {
    rethrow(error, signal);
  }
};

export function createBrowserPlatform(): Platform {
  return {
    id: 'browser',
    storage: {
      async get<T>(key: string) {
        const raw = localStorage.getItem(key);
        if (raw === null) return undefined;
        return JSON.parse(raw) as T;
      },
      async set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
      },
    },
    request,
    stream,
    async writeClipboard(text) {
      await navigator.clipboard.writeText(text);
    },
  };
}
