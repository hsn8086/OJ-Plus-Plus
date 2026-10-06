import type { Settings } from './types';

export function buildSystemPrompt(settings: Settings): string {
  const lang = settings.targetLang.trim() || '简体中文';
  const lines = [
    `你是一名编程竞赛（算法竞赛）题面的专业译者。把用户给出的 Markdown 文本翻译成${lang}。`,
    '',
    '硬性要求：',
    '1. 只输出译文本身，不要任何前言、解释、总结或代码块包裹。',
    '2. 原样保留 Markdown 结构：标题层级、列表、表格、引用、代码块、加粗斜体、链接。',
    '3. 原样保留 LaTeX 公式（$...$ 与 $$...$$）以及公式内的所有字符，绝不翻译、改写或换行。',
    '4. 变量名、函数名、类名、宏、复杂度记号（如 O(n log n)）、输入输出样例、文件名保持原样。',
    '5. 不要翻译代码块内部的内容，只翻译代码块外的说明文字。',
    '6. 术语按中文竞赛习惯翻译，例如：sample → 样例，constraint → 数据范围，subtask → 子任务，',
    '   test case → 测试点，interactive → 交互题，time limit → 时间限制。',
    '7. 保持原文的段落划分，不要把多个段落合并成一段，也不要增加原文没有的段落。',
    '8. 如果原文已经是目标语言，直接原样返回。',
  ];
  if (settings.extraPrompt.trim()) {
    lines.push('', '额外要求：', settings.extraPrompt.trim());
  }
  return lines.join('\n');
}

/**
 * 把 markdown 切成若干块，避免超长文本被截断或超出上下文窗口。
 * 优先按标题切，其次按空行切，保证每块不超过 maxChars。
 */
export function chunkMarkdown(source: string, maxChars = 3000): string[] {
  const text = source.trim();
  if (text.length <= maxChars) return text ? [text] : [];

  const sections = text.split(/\n(?=#{1,6}\s)/);
  const chunks: string[] = [];

  for (const section of sections) {
    if (section.length <= maxChars) {
      chunks.push(section);
      continue;
    }
    const paragraphs = section.split(/\n{2,}/);
    let buffer = '';
    for (const para of paragraphs) {
      if (buffer && buffer.length + para.length + 2 > maxChars) {
        chunks.push(buffer);
        buffer = '';
      }
      if (para.length > maxChars) {
        // 单段仍然过长，按行硬切
        const lines = para.split('\n');
        let lineBuffer = '';
        for (const line of lines) {
          if (lineBuffer && lineBuffer.length + line.length + 1 > maxChars) {
            chunks.push(lineBuffer);
            lineBuffer = '';
          }
          lineBuffer = lineBuffer ? `${lineBuffer}\n${line}` : line;
        }
        if (lineBuffer) chunks.push(lineBuffer);
        continue;
      }
      buffer = buffer ? `${buffer}\n\n${para}` : para;
    }
    if (buffer) chunks.push(buffer);
  }

  return chunks.filter((c) => c.trim());
}
