import type { Platform, HttpResponse, HttpRequest } from './types.ts';
import type { LocalRunResult } from '../execution/types.ts';

export function createExtensionPlatform(): Platform {
  let port: chrome.runtime.Port | undefined;
  const pending = new Map<string, { resolve(value: unknown): void; reject(error: Error): void; chunk?(value: string): void; cleanup(): void }>();
  const connect = () => {
    if (port) return port;
    port = chrome.runtime.connect({ name: 'ojpp' });
    port.onMessage.addListener(message => {
      const entry = pending.get(message.id);
      if (!entry) return;
      if (message.kind === 'chunk') { entry.chunk?.(message.text); return; }
      pending.delete(message.id); entry.cleanup();
      if (message.kind === 'error') entry.reject(new Error(message.error));
      else entry.resolve(message.value);
    });
    port.onDisconnect.addListener(() => {
      port = undefined;
      for (const entry of pending.values()) { entry.cleanup(); entry.reject(new Error('OJ++ extension disconnected. Retry the operation.')); }
      pending.clear();
    });
    return port;
  };
  const call = <T>(type: string, args: Record<string, unknown>, signal?: AbortSignal, chunk?: (value: string) => void): Promise<T> => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Cancelled', 'AbortError')); return; }
    const id = crypto.randomUUID();
    const connection = connect();
    const abort = () => {
      try { connection.postMessage({ id, type: 'cancel' }); } catch { /* disconnected */ }
      pending.delete(id); reject(new DOMException('Cancelled', 'AbortError'));
    };
    pending.set(id, { resolve: value => resolve(value as T), reject, chunk, cleanup: () => signal?.removeEventListener('abort', abort) });
    signal?.addEventListener('abort', abort, { once: true });
    try { connection.postMessage({ id, type, ...args }); }
    catch (error) { pending.get(id)?.cleanup(); pending.delete(id); reject(error); }
  });
  const wire = (request: HttpRequest & { onChunk?: unknown }) => { const { signal: _signal, onChunk: _onChunk, ...rest } = request; return rest; };
  return {
    id: 'extension',
    storage: { get: key => call('storage-get', { key }), set: (key, value) => call('storage-set', { key, value }) },
    request: request => call<HttpResponse>('http', { request: wire(request) }, request.signal),
    stream: request => {
      let raw = '';
      return call<HttpResponse>('stream', { request: wire(request) }, request.signal, chunk => { raw += chunk; request.onChunk?.(raw); });
    },
    writeClipboard: text => navigator.clipboard.writeText(text),
    localRunner: { run: request => {
      const { signal, ...data } = request;
      return call<LocalRunResult>('run', { request: data }, signal);
    } },
  };
}
