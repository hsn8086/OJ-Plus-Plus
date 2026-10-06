import type { HttpTransport } from '../platforms/types.ts';
import { ask } from './ai.ts';
import { buildSystemPrompt, chunkMarkdown } from './prompt.ts';
import type { Settings } from './types.ts';

export interface TranslationResult {
  markdown: string;
  providerName: string;
  model: string;
  elapsedMs: number;
}

export interface TranslateOptions {
  settings: Settings;
  markdown: string;
  signal?: AbortSignal;
  onStatus?: (text: string) => void;
  onPartial?: (markdown: string) => void;
}

export async function translateMarkdown(
  request: HttpTransport,
  { settings, markdown, signal, onStatus, onPartial }: TranslateOptions,
): Promise<TranslationResult> {
  const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
  const system = buildSystemPrompt(settings);
  const chunks = settings.translateWholeBlock ? [markdown] : chunkMarkdown(markdown);
  const started = Date.now();
  const out: string[] = [];
  for (const [index, chunk] of chunks.entries()) {
    signal?.throwIfAborted();
    onStatus?.(chunks.length === 1 ? '正在翻译…' : `正在翻译第 ${index + 1}/${chunks.length} 段…`);
    out.push((await ask(request, settings, chunk, system, { signal })).trim());
    onPartial?.(out.join('\n\n'));
  }
  return {
    markdown: out.join('\n\n'),
    providerName: cfg?.name ?? '未配置',
    model: cfg?.model ?? '',
    elapsedMs: Date.now() - started,
  };
}
