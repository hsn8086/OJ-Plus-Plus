import type { HttpTransport, Platform } from './types.ts';

/** 普通网页调试适配器。fetch 受 CORS 限制，不用于替代扩展后台请求。 */
const request: HttpTransport = async (req) => {
  const signal = req.timeoutMs
    ? AbortSignal.any([
        ...(req.signal ? [req.signal] : []),
        AbortSignal.timeout(req.timeoutMs),
      ])
    : req.signal;
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
    if (signal?.reason?.name === 'TimeoutError') throw new Error('请求超时');
    throw error;
  }
};

export function createBrowserPlatform(): Platform {
  return {
    id: 'browser',
    storage: {
      async get<T>(key: string) {
        // 兼容旧版直接注入脚本调试时使用的 localStorage 前缀。
        const raw = localStorage.getItem(key) ?? localStorage.getItem(`ncb:gm:${key}`);
        if (raw === null) return undefined;
        return JSON.parse(raw) as T;
      },
      async set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
      },
    },
    request,
    async writeClipboard(text) {
      await navigator.clipboard.writeText(text);
    },
  };
}
