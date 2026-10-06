/** 页面功能只依赖这些能力；具体 API 由入口选择的平台适配器提供。 */
export interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
}

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

export type HttpTransport = (request: HttpRequest) => Promise<HttpResponse>;

/**
 * 流式请求：onChunk 收到的是**累计**的原始响应文本，不是增量。
 * 累计形式对两种平台都自然：GM 的 onprogress 只给累计文本，
 * fetch 的 reader 虽然给增量，但拼成累计只是一次字符串相加。
 */
export interface HttpStreamRequest extends HttpRequest {
  onChunk?: (raw: string) => void;
}

export type HttpStreamTransport = (request: HttpStreamRequest) => Promise<HttpResponse>;
export type WriteClipboard = (text: string) => Promise<void>;

export interface Platform {
  readonly id: string;
  readonly storage: Storage;
  readonly request: HttpTransport;
  /** 不支持流式时为 undefined，此时自动退化为一次性请求 */
  readonly stream?: HttpStreamTransport;
  readonly writeClipboard: WriteClipboard;
}
