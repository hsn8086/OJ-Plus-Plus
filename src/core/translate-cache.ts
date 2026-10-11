import type { TranslationResult } from './translate.ts';
import type { Platform } from '../platforms/types.ts';
import type { Settings } from './types.ts';

const KEY = 'ojpp:transCache';
const MAX_ENTRIES = 200;

interface CacheEntry { t: number; text: string; providerName: string; model: string }

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** 缓存键：目标语言 + 提供商指纹 + 原文。换语言/提供商/模型/额外参数自动失效。 */
export async function translationCacheKey(settings: Settings, markdown: string, context = ''): Promise<string> {
  const p = settings.providers.find(x => x.id === settings.activeProviderId);
  const fingerprint = [
    'translation-v2-image-references',
    settings.targetLang, settings.extraPrompt, settings.pdfPrompt ?? '',
    String(!!settings.pdfAsImages), String(settings.translateWholeBlock), context,
    p?.protocol ?? '', p?.baseUrl ?? '', p?.model ?? '',
    JSON.stringify(p?.headers ?? {}), JSON.stringify(p?.body ?? {}),
    markdown,
  ].join('\n');
  return sha256(fingerprint);
}

export async function getCachedTranslation(platform: Platform, key: string): Promise<TranslationResult | undefined> {
  const map = await platform.storage.get<Record<string, CacheEntry>>(KEY);
  const hit = map?.[key];
  return hit ? { markdown: hit.text, providerName: hit.providerName, model: hit.model, elapsedMs: 0 } : undefined;
}

export async function setCachedTranslation(platform: Platform, key: string, result: TranslationResult): Promise<void> {
  const map = { ...(await platform.storage.get<Record<string, CacheEntry>>(KEY) ?? {}) };
  map[key] = { t: Date.now(), text: result.markdown, providerName: result.providerName, model: result.model };
  const entries = Object.entries(map).sort((a, b) => b[1].t - a[1].t);
  entries.length = Math.min(entries.length, MAX_ENTRIES);
  await platform.storage.set(KEY, Object.fromEntries(entries));
}
