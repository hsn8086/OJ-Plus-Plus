import { t } from '../i18n/index.ts';
import type { HttpStreamTransport, HttpTransport } from '../platforms/types.ts';
import { ask } from './ai.ts';
import { buildPdfSystemPrompt, buildSystemPrompt, chunkMarkdown } from './prompt.ts';
import type { Settings } from './types.ts';

export interface TranslationResult {
  markdown: string;
  providerName: string;
  model: string;
  elapsedMs: number;
}

export interface TranslateOptions {
  settings: Settings;
  /** data URL 图片，随原文一起发给视觉模型 */
  images?: string[];
  /** PDF 题面：换用 PDF 专用提示词 */
  pdf?: boolean;
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
  { settings, markdown, signal, onStatus, onPartial, stream, streaming, images, pdf }: TranslateOptions,
): Promise<TranslationResult> {
  const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
  const system = (pdf ? buildPdfSystemPrompt(settings) : buildSystemPrompt(settings))
    + (images?.length ? '\n附图仅供理解题面，请保留正文中已有的图片引用；不要把这条说明输出到译文，也不要凭附图编造新的图片链接。' : '');
  const chunks = settings.translateWholeBlock ? [markdown] : chunkMarkdown(markdown);
  const started = Date.now();
  const out: string[] = [];
  const useStream = !!stream && streaming !== false;
  for (const [index, chunk] of chunks.entries()) {
    signal?.throwIfAborted();
    onStatus?.(chunks.length === 1
      ? t('translate.status')
      : t('translate.statusChunk', { index: index + 1, total: chunks.length }));
    const done = out.length;
    const translated = await ask(request, settings, chunk, system, {
      signal,
      stream,
      images: index === 0 ? images : undefined,
      onDelta: useStream
        ? (text) => onPartial?.([...out, text].join('\n\n'))
        : undefined,
    });
    out.push(translated.trim());
    onPartial?.(out.slice(0, done + 1).join('\n\n'));
  }
  return {
    markdown: out.join('\n\n'),
    providerName: cfg?.name ?? t('translate.unknownProvider'),
    model: cfg?.model ?? '',
    elapsedMs: Date.now() - started,
  };
}
