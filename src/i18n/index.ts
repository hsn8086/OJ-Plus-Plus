import { en } from './en.ts';
import { zh, type MessageKey } from './zh.ts';

export type Locale = 'zh' | 'en' | 'auto';
/** 解析后的实际语言，不含 auto。 */
export type ResolvedLocale = 'zh' | 'en';

const CATALOGS: Record<ResolvedLocale, Record<string, string>> = { zh, en };

/**
 * 浏览器语言 → 支持的语言。
 * 只有明确是中文时才用中文，其余一律回退英文，
 * 这样新增语言前不会出现半截中文。
 */
export function resolveLocale(setting: Locale, languages?: readonly string[]): ResolvedLocale {
  if (setting === 'zh' || setting === 'en') return setting;
  const list = languages ?? (typeof navigator !== 'undefined' ? navigator.languages ?? [] : []);
  const first = list[0] ?? '';
  return /^zh\b/i.test(first) ? 'zh' : 'en';
}

let current: ResolvedLocale = 'zh';
const listeners = new Set<(locale: ResolvedLocale) => void>();

export function getLocale(): ResolvedLocale {
  return current;
}

export function setLocale(locale: ResolvedLocale): void {
  if (locale === current) return;
  current = locale;
  for (const listener of listeners) listener(locale);
}

export function onLocaleChange(listener: (locale: ResolvedLocale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * 取文案并替换 {name} 形式的占位符。
 *
 * 找不到键时回退中文，再回退键名本身，方便在界面上一眼看出漏翻。
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = CATALOGS[current][key] ?? zh[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export type { MessageKey };
