import { SETTINGS_KEY } from '../core/config.ts';
import { applyEarlyTheme, cacheThemePreference, readCachedTheme, themePreference, whenDocumentElement } from '../ui/theme-start.ts';

declare const __OJPP_THEME_HOSTS__: Record<string, string>;
const siteId = __OJPP_THEME_HOSTS__[location.hostname];
if (siteId) {
  // Tiny document_start entry; the editor/PDF/application bundle can load afterwards.
  let preference = readCachedTheme(siteId);
  const prepare = (root: HTMLElement) => {
    if (preference) applyEarlyTheme(root, preference);
    else root.setAttribute('data-ojpp-theme-pending', '');
  };
  if (document.documentElement) prepare(document.documentElement);
  const rootReady = whenDocumentElement().then(root => { prepare(root); return root; });
  const release = () => document.documentElement?.removeAttribute('data-ojpp-theme-pending');
  const timeout = setTimeout(release, 1200);
  void chrome.storage.local.get(SETTINGS_KEY).then(async stored => {
    preference = themePreference(stored[SETTINGS_KEY], siteId);
    cacheThemePreference(siteId, preference);
    applyEarlyTheme(await rootReady, preference);
  }).catch(error => console.warn('[OJ++] Early theme settings unavailable', error))
    .finally(() => { clearTimeout(timeout); release(); });
}
