import type { LocalRunRequest, LocalRunResult } from '../execution/types.ts';

type Request = Omit<LocalRunRequest, 'signal'>;
const jobs = new Map<string, { cancelled: boolean; abort?: () => void }>();
const cache = new Map<string, Uint8Array>();
let queue: Promise<unknown> = Promise.resolve();
let idle: ReturnType<typeof setTimeout> | undefined;

async function execute(id: string, request: Request): Promise<LocalRunResult> {
  const job = jobs.get(id)!;
  if (job.cancelled) return { output: '', verdict: 'CANCELLED', error: 'Cancelled' };
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(request.language + '\n' + request.code)))].map(n => n.toString(16).padStart(2, '0')).join('');
  return new Promise(resolve => {
    const worker = new Worker('runner.js', { type: 'module' });
    let timer: ReturnType<typeof setTimeout>;
    let finished = false;
    const done = (result: LocalRunResult) => {
      if (finished) return;
      finished = true; clearTimeout(timer); worker.terminate(); resolve(result);
    };
    job.abort = () => done({ output: '', verdict: 'CANCELLED', error: 'Cancelled' });
    if (job.cancelled) { job.abort(); return; }
    const timeout = (ms: number, compile: boolean) => {
      clearTimeout(timer);
      timer = setTimeout(() => done({ output: '', verdict: compile ? 'COMPILATION_TIMEOUT' : 'TIME_LIMIT_EXCEEDED',
        error: compile ? 'Local compiler timed out' : `Local time limit: ${ms} ms` }), ms);
    };
    timeout(60000, true);
    worker.onmessage = (event: MessageEvent<{ phase?: string; artifact?: Uint8Array; result?: LocalRunResult }>) => {
      if (event.data.phase === 'run') timeout(request.timeoutMs, false);
      if (event.data.artifact && event.data.artifact.byteLength < 4 * 1024 * 1024) {
        cache.delete(hash); cache.set(hash, event.data.artifact);
        while (cache.size > 4) cache.delete(cache.keys().next().value!);
      }
      if (event.data.result) done(event.data.result);
    };
    worker.onerror = event => done({ output: '', verdict: 'RUNTIME_ERROR', error: event.message });
    worker.postMessage({ request, artifact: cache.get(hash) });
  });
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || sender.tab || message?.target !== 'engine') return;
  const id = String(message.id);
  if (message.type === 'cancel') { const job = jobs.get(id); if (job) { job.cancelled = true; job.abort?.(); } respond({ ok: true }); return; }
  if (message.type !== 'run') return;
  clearTimeout(idle);
  jobs.set(id, { cancelled: false });
  const result = queue.then(() => execute(id, message.request));
  queue = result.catch(() => undefined);
  void result.then(value => respond({ ok: true, value }), error => respond({ ok: false, error: String(error) })).finally(() => {
    jobs.delete(id);
    if (!jobs.size) idle = setTimeout(() => { void chrome.runtime.sendMessage({ target: 'engine-idle' }); }, 60000);
  });
  return true;
});

// Actual activity messages reset the MV3 idle timer; an open Port alone does not.
setInterval(() => { if (jobs.size) void chrome.runtime.sendMessage({ target: 'engine-heartbeat' }); }, 10000);
