export function providerOrigin(baseUrl: string): { origin: string; pattern: string } {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Unsupported provider URL');
  return { origin: url.origin, pattern: `${url.protocol}//${url.hostname}/*` };
}

/** A user-initiated test can authorize a draft without saving the settings panel. */
export async function prepareProviderPermission(baseUrl: string, signal: AbortSignal): Promise<string> {
  const { origin, pattern } = providerOrigin(baseUrl);
  if (signal.aborted) throw new Error('Cancelled');
  if (await chrome.permissions.contains({ origins: [pattern] })) return origin;
  const tab = await chrome.tabs.create({ url: chrome.runtime.getURL('options.html') + '?authorize=' + encodeURIComponent(origin) });
  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error?: Error) => {
      if (finished) return;
      finished = true;
      clearInterval(poll); clearTimeout(timeout);
      chrome.tabs.onRemoved.removeListener(removed);
      signal.removeEventListener('abort', abort);
      if (error) reject(error); else resolve(origin);
    };
    const check = () => {
      // Extension API activity keeps this short-lived permission workflow alive under MV3.
      void chrome.permissions.contains({ origins: [pattern] }).then(allowed => { if (allowed) finish(); }, error => finish(new Error(String(error))));
    };
    const removed = (id: number) => { if (id === tab.id) {
      void chrome.permissions.contains({ origins: [pattern] }).then(allowed => finish(allowed ? undefined : new Error('Provider authorization cancelled')), error => finish(new Error(String(error))));
    } };
    const abort = () => finish(new Error('Cancelled'));
    const poll = setInterval(check, 500);
    const timeout = setTimeout(() => finish(new Error('Provider authorization timed out. Click Test connection to retry.')), 120000);
    chrome.tabs.onRemoved.addListener(removed);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort(); else check();
  });
}
