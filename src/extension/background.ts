import { SETTINGS_KEY, migrate } from '../core/config.ts';
import type { HttpRequest } from '../platforms/types.ts';
import { validateLocalRequest } from '../execution/validate.ts';
import { prepareProviderPermission, providerOrigin } from './provider-permissions.ts';

let creating: Promise<void> | undefined;
let activeLocal = 0;
async function engine() {
  if (creating) return creating;
  creating = (async () => {
    const contexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT' as chrome.runtime.ContextType] });
    if (!contexts.length) await chrome.offscreen.createDocument({ url: 'offscreen.html', reasons: [chrome.offscreen.Reason.WORKERS], justification: 'Run user-requested local programming tests in WebAssembly workers.' });
  })();
  try { await creating; } finally { creating = undefined; }
}

async function authorize(req: HttpRequest, previewOrigins: Set<string>) {
  const { origin, pattern } = providerOrigin(req.url);
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  const settings = migrate(stored[SETTINGS_KEY]);
  if (!previewOrigins.has(origin) && !settings.providers.some(provider => {
    try { return new URL(provider.baseUrl).origin === origin; } catch { return false; }
  })) throw new Error('Provider origin is not configured. Use Test connection or save the provider first.');
  if (!await chrome.permissions.contains({ origins: [pattern] })) throw new Error(`Authorize ${origin} from the OJ++ extension options page first.`);
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'ojpp' || port.sender?.id !== chrome.runtime.id) return;
  const session = crypto.randomUUID();
  const controllers = new Map<string, AbortController>();
  const localJobs = new Set<string>();
  const previewOrigins = new Set<string>();
  let disconnected = false;
  const post = (message: unknown) => { if (!disconnected) port.postMessage(message); };
  port.onMessage.addListener(message => {
    const id = String(message.id);
    if (message.type === 'cancel') {
      controllers.get(id)?.abort();
      if (localJobs.has(id)) void chrome.runtime.sendMessage({ target: 'engine', type: 'cancel', id: `${session}:${id}` });
      return;
    }
    const cancellation = new AbortController();
    controllers.set(id, cancellation);
    void (async () => {
      if (message.type === 'prepare-provider') {
        if (typeof message.baseUrl !== 'string' || message.baseUrl.length > 4096) throw new Error('Invalid provider URL');
        const origin = await prepareProviderPermission(message.baseUrl, cancellation.signal);
        if (cancellation.signal.aborted || disconnected) throw new Error('Cancelled');
        previewOrigins.add(origin);
        return;
      }
      if (message.type === 'storage-get') {
        if (typeof message.key !== 'string' || !/^(ojpp:|ncb:)/.test(message.key)) throw new Error('Invalid storage key');
        const result = await chrome.storage.local.get(message.key);
        return result[message.key];
      }
      if (message.type === 'storage-set') {
        if (message.key !== SETTINGS_KEY) throw new Error('Invalid storage key');
        await chrome.storage.local.set({ [message.key]: message.value }); return;
      }
      if (message.type === 'run') {
        const request = validateLocalRequest(message.request);
        if (activeLocal >= 32) throw new Error('Local execution queue is full');
        localJobs.add(id);
        activeLocal++;
        await engine();
        if (cancellation.signal.aborted || disconnected) throw new Error('Cancelled');
        const result = await chrome.runtime.sendMessage({ target: 'engine', type: 'run', id: `${session}:${id}`, request });
        if (!result?.ok) throw new Error(result?.error ?? 'Local runner disconnected');
        return result.value;
      }
      if (message.type === 'http' || message.type === 'stream') {
        const req = message.request as HttpRequest;
        await authorize(req, previewOrigins);
        if (cancellation.signal.aborted || disconnected) throw new Error('Cancelled');
        const signal = AbortSignal.any([cancellation.signal, AbortSignal.timeout(Math.min(300000, Math.max(1000, req.timeoutMs ?? 120000)))]);
        const response = await fetch(req.url, { method: req.method, headers: req.headers, body: req.body, signal, credentials: 'omit' });
        let text = '';
        if (message.type === 'stream' && response.body) {
          const reader = response.body.getReader(); const decoder = new TextDecoder();
          for (;;) {
            const chunk = await reader.read();
            if (chunk.done) break;
            const delta = decoder.decode(chunk.value, { stream: true });
            text += delta; post({ id, kind: 'chunk', text: delta });
          }
          const tail = decoder.decode(); text += tail;
          if (tail) post({ id, kind: 'chunk', text: tail });
        } else text = await response.text();
        return { status: response.status, statusText: response.statusText, text };
      }
      throw new Error('Unknown extension operation');
    })().then(value => post({ id, kind: 'result', value }), error => post({ id, kind: 'error', error: error instanceof Error ? error.message : String(error) }))
      .finally(() => { controllers.delete(id); if (localJobs.delete(id)) activeLocal--; });
  });
  port.onDisconnect.addListener(() => {
    disconnected = true;
    for (const controller of controllers.values()) controller.abort();
    for (const id of localJobs) void chrome.runtime.sendMessage({ target: 'engine', type: 'cancel', id: `${session}:${id}` }).catch(() => {});
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.id !== chrome.runtime.id || sender.tab) return;
  if (message?.target === 'engine-idle' && !activeLocal) void chrome.offscreen.closeDocument().catch(() => {});
});
chrome.action.onClicked.addListener(() => { void chrome.runtime.openOptionsPage(); });
