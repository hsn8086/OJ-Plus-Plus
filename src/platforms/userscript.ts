import {
  GM_getValue,
  GM_setClipboard,
  GM_setValue,
  GM_xmlhttpRequest,
} from 'vite-plugin-monkey/dist/client';
import { t } from '../i18n/index.ts';
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
    onerror: () => fail(new Error(t('error.network'))),
    ontimeout: () => fail(new Error(t('error.timeout'))),
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
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  const decoder = new TextDecoder();
  const cleanup = () => {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    req.signal?.removeEventListener('abort', onAbort);
  };
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
    if (readerTask) return readerTask;
    if (!isReadableStream(response)) return Promise.resolve();
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
  const finish = (
    res: { status: number; statusText: string; response?: unknown; responseText?: unknown },
    waitMs = 0,
  ) => {
    const complete = () => {
      if (settled) return;
      settled = true;
      cleanup();
      const text = accumulated || (typeof res.responseText === 'string' ? res.responseText : '');
      resolve({ status: res.status, statusText: res.statusText, text });
    };
    const task = consume(res.response);
    task.then(complete).catch((error: unknown) => {
      fail(error instanceof Error ? error : new Error(t('error.streamRead')));
    });
    // 某些 TM 版本会触发 onload，但不把 onloadend/stream close 传到沙箱。
    // onload 代表响应体已经完整到达，给 reader 一小段时间消费排队数据后收尾。
    if (waitMs > 0) fallbackTimer = setTimeout(complete, waitMs);
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
          fail(error instanceof Error ? error : new Error(t('error.streamRead')));
        });
      }
    },
    // onload 表示响应体已经到达；正常 TM 仍会随后触发 onloadend。
    // 250ms 兜底，兼容只发 onload 的管理器版本。
    onload: (res) => finish(res, 250),
    onloadend: finish,
    onerror: () => fail(new Error(t('error.network'))),
    ontimeout: () => fail(new Error(t('error.timeout'))),
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
    throw new Error(t('error.notUserscript'));
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
