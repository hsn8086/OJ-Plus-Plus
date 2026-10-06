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

interface TransferableData {
  objUrl?: { url?: unknown };
  blob?: unknown;
  dataUri?: unknown;
  binary?: unknown;
}

function decodeBinaryString(value: string): string {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return new TextDecoder().decode(bytes);
}

function decodeDataUri(value: string): string {
  const comma = value.indexOf(',');
  if (comma < 0) return '';
  const metadata = value.slice(0, comma);
  const payload = value.slice(comma + 1);
  if (/;base64(?:;|$)/i.test(metadata)) return decodeBinaryString(atob(payload));
  return decodeURIComponent(payload);
}

async function readObjectUrl(url: string): Promise<string> {
  // TM 的 objUrl 通常不能被页面 fetch 读取，失败后用 GM 请求再取一次。
  if (typeof fetch === 'function') {
    try {
      const response = await fetch(url);
      return await response.text();
    } catch {
      // 继续走 GM_xmlhttpRequest 后备路径。
    }
  }
  return new Promise<string>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'text',
      onload: (response) => resolve(response.responseText || ''),
      onerror: () => reject(new Error('无法读取 Tampermonkey 流式片段')),
    });
  });
}

async function readPartialText(value: unknown): Promise<string> {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  const event = value as { partial?: unknown; tfd?: unknown };
  if (typeof event.partial === 'string') return event.partial;

  const raw = (event.tfd ?? value) as TransferableData;
  if (typeof raw.dataUri === 'string') return decodeDataUri(raw.dataUri);
  if (typeof raw.binary === 'string') return decodeBinaryString(raw.binary);
  if (raw.binary instanceof ArrayBuffer) return new TextDecoder().decode(raw.binary);
  if (ArrayBuffer.isView(raw.binary)) {
    return new TextDecoder().decode(
      new Uint8Array(raw.binary.buffer, raw.binary.byteOffset, raw.binary.byteLength),
    );
  }
  if (raw.blob && typeof (raw.blob as { text?: unknown }).text === 'function') {
    return (raw.blob as Blob).text();
  }
  if (typeof raw.objUrl?.url === 'string') return readObjectUrl(raw.objUrl.url);
  return '';
}

/**
 * 流式请求。
 *
 * Tampermonkey 的 responseType=stream + partialSize 在沙箱里通常通过
 * onpartial({ tfd: { objUrl } }) 传递 Blob，而不是直接传 partial 字符串。
 * 这里兼容 TM 的 transferable data，并按顺序解码后再交给上层。
 */
const stream: HttpStreamTransport = (req) => new Promise((resolve, reject) => {
  if (req.signal?.aborted) {
    reject(new DOMException('Aborted', 'AbortError'));
    return;
  }
  let settled = false;
  const cleanup = () => req.signal?.removeEventListener('abort', onAbort);
  const fail = (error: Error) => {
    if (settled) return;
    settled = true;
    cleanup();
    reject(error);
  };
  let accumulated = '';
  const push = (piece: string) => {
    if (!piece || settled) return;
    accumulated += piece;
    req.onChunk?.(accumulated);
  };
  // TM 可能在 onload 前仍有待解码的 objUrl，串行化以保持 SSE 顺序。
  let partials = Promise.resolve();

  const handle = GM_xmlhttpRequest({
    method: req.method as 'GET' | 'POST',
    url: req.url,
    headers: req.headers,
    data: req.body,
    timeout: req.timeoutMs,
    responseType: 'stream',
    // 每次回调返回的片段大小（字符数），越小首帧越快
    partialSize: 64,
    onpartial(res: { partial?: unknown; tfd?: unknown }) {
      const current = partials.then(async () => {
        try {
          push(await readPartialText(res));
        } catch {
          // 片段无法解码时交给上层的非流式回退，不丢失最终结果。
        }
      });
      partials = current;
      return current;
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
      partials.then(() => {
        if (settled) return;
        settled = true;
        cleanup();
        // partialSize 模式下 response/responseText 会被删掉，只能用累积值
        const text = accumulated || (typeof res.responseText === 'string' ? res.responseText : '');
        resolve({ status: res.status, statusText: res.statusText, text });
      });
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
