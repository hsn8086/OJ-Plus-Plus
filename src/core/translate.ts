import type { HttpStreamTransport, HttpTransport } from '../platforms/types.ts';
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
  /** 流式传输；不传则退化为一次性请求 */
  stream?: HttpStreamTransport;
  /** 开启流式展示（默认开启，设置里可关） */
  streaming?: boolean;
}

export async function translateMarkdown(
  request: HttpTransport,
  { settings, markdown, signal, onStatus, onPartial, stream, streaming }: TranslateOptions,
): Promise<TranslationResult> {
  const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
  const system = buildSystemPrompt(settings);
  const chunks = settings.translateWholeBlock ? [markdown] : chunkMarkdown(markdown);
  const started = Date.now();
  const out: string[] = [];
  const useStream = !!stream && streaming !== false;
  for (const [index, chunk] of chunks.entries()) {
    signal?.throwIfAborted();
    onStatus?.(chunks.length === 1 ? '正在翻译…' : `正在翻译第 ${index + 1}/${chunks.length} 段…`);
    const done = out.length;
    const translated = await ask(request, settings, chunk, system, {
      signal,
      stream,
      onDelta: useStream
        ? (text) => onPartial?.([...out, text].join('\n\n'))
        : undefined,
    });
    out.push(translated.trim());
    onPartial?.(out.slice(0, done + 1).join('\n\n'));
  }
  return {
    markdown: out.join('\n\n'),
    providerName: cfg?.name ?? '未配置',
    model: cfg?.model ?? '',
    elapsedMs: Date.now() - started,
  };
}
