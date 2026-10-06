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
export type WriteClipboard = (text: string) => Promise<void>;

export interface Platform {
  readonly id: string;
  readonly storage: Storage;
  readonly request: HttpTransport;
  readonly writeClipboard: WriteClipboard;
}
