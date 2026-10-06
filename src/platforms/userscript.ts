import {
  GM_getValue,
  GM_setClipboard,
  GM_setValue,
  GM_xmlhttpRequest,
} from 'vite-plugin-monkey/dist/client';
import type { HttpTransport, Platform } from './types.ts';

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
    async writeClipboard(text) {
      GM_setClipboard(text, 'text');
    },
  };
}
