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

interface ReadableStreamLike {
  getReader(): {
    read(): Promise<{ done: boolean; value?: unknown }>;
    releaseLock?(): void;
  };
}

function isReadableStream(value: unknown): value is ReadableStreamLike {
  return !!value
    && typeof value === 'object'
    && typeof (value as { getReader?: unknown }).getReader === 'function';
}

function decodeStreamChunk(decoder: TextDecoder, value: unknown, final = false): string {
  if (typeof value === 'string') return value;
  if (value instanceof ArrayBuffer) return decoder.decode(new Uint8Array(value), { stream: !final });
  if (ArrayBuffer.isView(value)) {
    return decoder.decode(
      new Uint8Array(value.buffer as ArrayBuffer, value.byteOffset, value.byteLength),
      { stream: !final },
    );
  }
  return '';
}

/**
 * 流式请求。
 *
 * Tampermonkey 的 responseType=stream 不会把 onpartial 交给用户脚本。
 * 它在用户脚本侧暴露一个 ReadableStream，分片通过这个流的 reader 读取。
 * 必须在 onreadystatechange 阶段开始读取，等 onload 才读取就只会得到
 * 已经完成的结果，页面看不到中间态。
 */
const stream: HttpStreamTransport = (req) => new Promise((resolve, reject) => {
  if (req.signal?.aborted) {
    reject(new DOMException('Aborted', 'AbortError'));
    return;
  }
  let settled = false;
  let accumulated = '';
  let readerTask: Promise<void> | null = null;
  const decoder = new TextDecoder();
  const cleanup = () => req.signal?.removeEventListener('abort', onAbort);
  const fail = (error: Error) => {
    if (settled) return;
    settled = true;
    cleanup();
    reject(error);
  };
  const push = (value: unknown, final = false) => {
    if (settled) return;
    const text = decodeStreamChunk(decoder, value, final);
    if (!text) return;
    accumulated += text;
    req.onChunk?.(accumulated);
  };
  const consume = (response: unknown): Promise<void> => {
    if (!isReadableStream(response)) return Promise.resolve();
    if (readerTask) return readerTask;
    readerTask = (async () => {
      const reader = response.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          push(value);
        }
        push(decoder.decode(), true);
      } finally {
        reader.releaseLock?.();
      }
    })();
    return readerTask;
  };
  const finish = (res: { status: number; statusText: string; response?: unknown; responseText?: unknown }) => {
    consume(res.response).then(() => {
      if (settled) return;
      settled = true;
      cleanup();
      const text = accumulated || (typeof res.responseText === 'string' ? res.responseText : '');
      resolve({ status: res.status, statusText: res.statusText, text });
    }).catch((error: unknown) => {
      fail(error instanceof Error ? error : new Error('读取流式响应失败'));
    });
  };

  const handle = GM_xmlhttpRequest({
    method: req.method as 'GET' | 'POST',
    url: req.url,
    headers: req.headers,
    data: req.body,
    timeout: req.timeoutMs,
    responseType: 'stream',
    partialSize: 64,
    onreadystatechange(res: { readyState?: number; response?: unknown }) {
      if ((res.readyState ?? 0) >= 2) {
        // TM 在 readyState=2 提供同一个 ReadableStream；此处开始消费才是真流式。
        void consume(res.response).catch((error: unknown) => {
          fail(error instanceof Error ? error : new Error('读取流式响应失败'));
        });
      }
    },
    // TM 在 onloadend 前才会关闭 response ReadableStream。
    onloadend: finish,
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
