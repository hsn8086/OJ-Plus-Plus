import type { Theme } from '../core/types.ts';

export interface ThemePreference { theme: Theme; enabled: boolean }
const CACHE_KEY = 'ojpp:theme-start:v1';

/** Only the theme preference is mirrored into origin storage, never provider settings. */
export function themePreference(raw: unknown, siteId: string): ThemePreference {
  const settings = raw as { theme?: unknown; siteFeatures?: Record<string, { darkMode?: unknown }> } | null;
  return {
    theme: settings?.theme === 'light' || settings?.theme === 'dark' ? settings.theme : 'auto',
    enabled: settings?.siteFeatures?.[siteId]?.darkMode !== false,
  };
}

export function cacheThemePreference(siteId: string, preference: ThemePreference): void {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ siteId, ...preference })); } catch { /* Storage may be disabled. */ }
}

export function readCachedTheme(siteId: string): ThemePreference | undefined {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
    if (raw?.siteId === siteId && typeof raw.enabled === 'boolean'
      && ['auto', 'dark', 'light'].includes(raw.theme)) return { theme: raw.theme, enabled: raw.enabled };
  } catch { /* Missing or invalid cache is resolved from platform storage. */ }
  return undefined;
}

export function whenDocumentElement(): Promise<HTMLElement> {
  if (document.documentElement) return Promise.resolve(document.documentElement);
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (!document.documentElement) return;
      observer.disconnect();
      resolve(document.documentElement);
    });
    observer.observe(document, { childList: true });
  });
}

/** Establish the theme before the application mounts. */
export function applyEarlyTheme(root: HTMLElement, preference: ThemePreference): void {
  const dark = preference.enabled && (preference.theme === 'dark'
    || (preference.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches));
  root.setAttribute('data-ojpp-theme', dark ? 'dark' : 'light');
}

export const EARLY_THEME_CSS = `
html[data-ojpp-theme="dark"] { background: #1c2128; color-scheme: dark; }
/* First visit has no synchronous hint. Do not paint unthemed content while storage resolves.
   CSS also releases the guard if the startup script is interrupted. */
html[data-ojpp-theme-pending] body { visibility: hidden; animation: ojpp-theme-reveal 0s 1.2s forwards; }
@keyframes ojpp-theme-reveal { to { visibility: visible; } }
`;
