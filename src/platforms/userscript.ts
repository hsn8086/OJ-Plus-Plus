import {
  GM_getValue,
  GM_setClipboard,
  GM_setValue,
  GM_xmlhttpRequest,
} from 'vite-plugin-monkey/dist/client';
import type { HttpStreamTransport, HttpTransport, Platform } from './types.ts';

const request: HttpTransport = (req) => new Promise((resolve, reject) => {
  if (req.signal?.aborted) {
    reject(new DOMException('Aborted', 'AbortError'));
    return;
  }

  const cleanup = () => req.signal?.removeEventListener('abort', onAbort);
  const fail = (error: Error) => {
    cleanup();
    reject(error);
  };
  const handle = GM_xmlhttpRequest({
    method: req.method as 'GET' | 'POST',
    url: req.url,
    headers: req.headers,
    data: req.body,
    timeout: req.timeoutMs,
    responseType: 'text',
    onload(res) {
      cleanup();
      resolve({ status: res.status, statusText: res.statusText, text: res.responseText });
    },
    onerror: () => fail(new Error('网络请求失败，请检查网络或接口地址')),
    ontimeout: () => fail(new Error('请求超时')),
    onabort: () => fail(new DOMException('Aborted', 'AbortError')),
  });
  function onAbort() {
    // 部分脚本管理器取消后不触发 onabort，主动结束 Promise。
    fail(new DOMException('Aborted', 'AbortError'));
    handle.abort();
  }
  req.signal?.addEventListener('abort', onAbort, { once: true });
});

/**
 * 流式请求。
 *
 * 不能用 onprogress + responseText：Tampermonkey 的 onprogress 只带进度字段，
 * responseText 在 readyState !== 4 时被清空，文本要等整个 body 读完才赋值。
 * 真正的增量通道是 onpartial + partialSize，它给出的是**增量**片段，
 * 所以这里自己累积成累计文本，对上层保持“累计”这个统一契约。
 *
 * 不支持 partialSize 的管理器（如部分 Violentmonkey 版本）不会触发 onpartial，
 * 此时拿不到正文，上层会自动退化为一次性请求。
 */
const stream: HttpStreamTransport = (req) => new Promise((resolve, reject) => {
  if (req.signal?.aborted) {
    reject(new DOMException('Aborted', 'AbortError'));
    return;
  }
  const cleanup = () => req.signal?.removeEventListener('abort', onAbort);
  const fail = (error: Error) => {
    cleanup();
    reject(error);
  };
  let accumulated = '';
  const push = (piece: string) => {
    if (!piece) return;
    accumulated += piece;
    req.onChunk?.(accumulated);
  };

  const handle = GM_xmlhttpRequest({
    method: req.method as 'GET' | 'POST',
    url: req.url,
    headers: req.headers,
    data: req.body,
    timeout: req.timeoutMs,
    responseType: 'stream',
    // 每次回调返回的片段大小（字符数），越小首屏越快
    partialSize: 128,
    onpartial(res: { partial?: unknown }) {
      // 片段在 partial；部分实现只给 tfd（transferable data），那种情况交给 onload
      const piece = res.partial;
      if (typeof piece === 'string') push(piece);
    },
    onprogress(res: { responseText?: unknown }) {
      // 少数管理器在 onprogress 里直接给累计文本（responseText 非空）
      const text = res.responseText;
      if (typeof text === 'string' && text.length > accumulated.length) {
        accumulated = text;
        req.onChunk?.(accumulated);
      }
    },
    onload(res) {
      cleanup();
      // partialSize 模式下 response/responseText 会被删掉，只能用累积值
      const text = accumulated || (typeof res.responseText === 'string' ? res.responseText : '');
      resolve({ status: res.status, statusText: res.statusText, text });
    },
    onerror: () => fail(new Error('网络请求失败，请检查网络或接口地址')),
    ontimeout: () => fail(new Error('请求超时')),
    onabort: () => fail(new DOMException('Aborted', 'AbortError')),
  } as Parameters<typeof GM_xmlhttpRequest>[0]);
  function onAbort() {
    // 部分脚本管理器取消后不触发 onabort，主动结束 Promise。
    fail(new DOMException('Aborted', 'AbortError'));
    handle.abort();
  }
  req.signal?.addEventListener('abort', onAbort, { once: true });
});

export function createUserscriptPlatform(): Platform {
  // GM API 在脚本沙箱作用域内，不一定挂在 globalThis 上。
  if ([GM_getValue, GM_setValue, GM_xmlhttpRequest, GM_setClipboard]
    .some((api) => typeof api !== 'function')) {
    throw new Error('请通过 Tampermonkey 或 Violentmonkey 安装 OJ++，并允许脚本所需权限');
  }
  return {
    id: 'userscript',
    storage: {
      async get<T>(key: string) {
        return GM_getValue<T | undefined>(key, undefined);
      },
      async set<T>(key: string, value: T) {
        GM_setValue(key, value);
      },
    },
    request,
    stream,
    async writeClipboard(text) {
      GM_setClipboard(text, 'text');
    },
  };
}
