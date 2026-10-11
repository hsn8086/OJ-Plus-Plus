import { whenDocumentElement } from '../ui/theme-start.ts';

// Editor dependencies inspect documentElement while loading. At document-start
// it may not exist yet; wait for <html>, not DOMContentLoaded, before importing them.
void whenDocumentElement().then(async () => {
  const [{ startApp }, { createUserscriptPlatform }, { resolveSite }, { toast }] = await Promise.all([
    import('../app.ts'),
    import('../platforms/userscript.ts'),
    import('../sites/index.ts'),
    import('../ui/toast.ts'),
  ]);
  const site = resolveSite(new URL(location.href));
  if (site) await startApp(createUserscriptPlatform(), site).catch(error => toast(String(error), 'error'));
}).catch(error => console.error('[OJ++]', error));
