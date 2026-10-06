/**
 * GM_* 薄封装。
 *
 * 在 Tampermonkey / Violentmonkey 下走原生 API；
 * 在普通浏览器里（比如 vite dev 直接打开页面）回退到 localStorage / fetch，
 * 方便脱离脚本管理器调试。
 *
 * 注意：不要用 globalThis 探测 GM API。脚本管理器把 API 注入在沙箱作用域里，
 * 并不会挂到 window 上，探测 globalThis 会得到 undefined 而静默退化成 fetch，
 * 于是被 CORS 挡住。这里直接判断 import 进来的绑定是不是函数。
 */

import {
  GM_addStyle,
  GM_deleteValue,
  GM_getValue,
  GM_listValues,
  GM_setClipboard,
  GM_setValue,
  GM_xmlhttpRequest,
} from 'vite-plugin-monkey/dist/client';

type RawResponse = {
  status: number;
  statusText: string;
  responseText: string;
  finalUrl: string;
  responseHeaders: string;
};

export interface HttpRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  text: string;
}

const hasGM = typeof GM_getValue === 'function';
const hasGMRequest = typeof GM_xmlhttpRequest === 'function';
const hasGMStyle = typeof GM_addStyle === 'function';
const hasGMClipboard = typeof GM_setClipboard === 'function';

const LOCAL_PREFIX = 'ncb:gm:';

function localGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function getValue<T>(key: string, fallback: T): T {
  if (hasGM) {
    const value = GM_getValue<T | undefined>(key, undefined);
    return value === undefined || value === '' ? fallback : value;
  }
  return localGet(key, fallback);
}

export function setValue<T>(key: string, value: T): void {
  if (hasGM) {
    GM_setValue(key, value);
    return;
  }
  try {
    localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function deleteValue(key: string): void {
  if (hasGM) {
    GM_deleteValue(key);
    return;
  }
  localStorage.removeItem(LOCAL_PREFIX + key);
}

export function listValues(): string[] {
  if (hasGM) return GM_listValues();
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(LOCAL_PREFIX))
    .map((k) => k.slice(LOCAL_PREFIX.length));
}

export function addStyle(css: string): HTMLStyleElement {
  if (hasGMStyle) return GM_addStyle(css) as HTMLStyleElement;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

export function setClipboard(text: string): void {
  if (hasGMClipboard) {
    GM_setClipboard(text, 'text');
    return;
  }
  void navigator.clipboard?.writeText(text);
}

/**
 * 统一请求出口。优先 GM_xmlhttpRequest 以绕过 CORS，
 * 没有 GM 时退化为 fetch（此时浏览器同源策略生效）。
 */
export function request(req: HttpRequest): Promise<HttpResponse> {
  if (hasGMRequest) {
    return new Promise<HttpResponse>((resolve, reject) => {
      const handle = GM_xmlhttpRequest({
        method: req.method,
        url: req.url,
        headers: req.headers,
        data: req.body,
        timeout: req.timeoutMs,
        responseType: 'text',
        onload: (res: RawResponse) =>
          resolve({
            status: res.status,
            statusText: res.statusText,
            text: res.responseText,
          }),
        onerror: () => reject(new Error('网络请求失败，请检查网络或接口地址')),
        ontimeout: () => reject(new Error('请求超时')),
        onabort: () => reject(new DOMException('Aborted', 'AbortError')),
      });
      req.signal?.addEventListener('abort', () => handle.abort(), { once: true });
    });
  }

  const controller = new AbortController();
  const timer = req.timeoutMs
    ? setTimeout(() => controller.abort(), req.timeoutMs)
    : undefined;
  req.signal?.addEventListener('abort', () => controller.abort(), { once: true });

  return fetch(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    signal: controller.signal,
  })
    .then(async (res) => ({
      status: res.status,
      statusText: res.statusText,
      text: await res.text(),
    }))
    .finally(() => {
      if (timer) clearTimeout(timer);
    });
}

/** 是否运行在脚本管理器里，用于设置面板给出提示 */
export const isUserscriptEnv = hasGM && hasGMRequest;
