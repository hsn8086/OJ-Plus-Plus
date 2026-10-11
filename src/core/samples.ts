import { ask } from './ai.ts';
import type { Settings } from './types.ts';
import type { HttpTransport } from '../platforms/types.ts';

export interface ExtractedSample { input: string; output: string; note?: string }

const SAMPLE_SYSTEM = [
  '你是竞赛题样例的结构化提取器。用户给出从 PDF 提取的样例区文本（可能含两栏交错、残缺格式）。',
  '请把每组样例整理为 JSON：{"samples":[{"input":"...","output":"...","note":"可选注释"}]}',
  '硬性要求：',
  '1. input/output 保留原始行结构与换行，不要合并、不要改写、不要翻译。',
  '2. 输入输出配对错乱时按上下文合理配对；表头文字（standard input/output 等）不算样例内容。',
  '3. 无法辨认的字段填空字符串。note 可写样例编号/说明，无可省略。',
  '4. 只输出 JSON，不要代码块包裹、不要解释。',
].join('\n');

/**
 * 把 PDF 样例区文本提取为结构化样例列表。
 * 模型只负责把散文本整理成 JSON——比让它翻译样例可靠得多。
 */
export async function extractSamples(
  request: HttpTransport,
  settings: Settings,
  text: string,
  { signal, images }: { signal?: AbortSignal; images?: string[] } = {},
): Promise<ExtractedSample[]> {
  const system = images?.length ? SAMPLE_SYSTEM + '\n- 随文附带的图片是原始 PDF 页面，以图片内容为准。' : SAMPLE_SYSTEM;
  const out = await ask(request, settings, text, system, { signal, images });
  const match = /\{[\s\S]*\}/.exec(out);
  if (!match) return [];
  try {
    const data = JSON.parse(match[0]) as { samples?: ExtractedSample[] };
    return Array.isArray(data.samples) ? data.samples : [];
  } catch {
    return [];
  }
}

/** 样例渲染成 markdown 附在题面译文末尾。 */
export function samplesToMarkdown(samples: ExtractedSample[], label: string): string {
  if (!samples.length) return '';
  const blocks = samples.map((s, i) => {
    const head = `**${label} ${samples.length > 1 ? i + 1 : ''}**`.trim();
    const parts = [head];
    if (s.note) parts.push(`_${s.note}_`);
    if (s.input) parts.push('输入：', '```', s.input.trimEnd(), '```');
    if (s.output) parts.push('输出：', '```', s.output.trimEnd(), '```');
    return parts.join('\n');
  });
  return blocks.join('\n\n');
}
