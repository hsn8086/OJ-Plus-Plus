import { getDocument } from 'pdfjs-dist';
import { WorkerMessageHandler } from 'pdfjs-dist/build/pdf.worker.mjs';

interface TextItem {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 按坐标重建排版：同一 y（基线容差内）的文本块归一行，
 * 行间按 x 空档补空格——LaTeX 生成的 PDF 不打 hasEOL，
 * 直接用 item.str 拼会把整页糊成一行。
 */
function pageText(items: unknown[]): string {
  const runs: TextItem[] = [];
  for (const item of items) {
    const it = item as { str?: string; transform?: number[]; width?: number; height?: number };
    if (typeof it?.str !== 'string' || !it.str.trim()) continue;
    const tr = it.transform ?? [1, 0, 0, 1, 0, 0];
    runs.push({ str: it.str, x: tr[4] ?? 0, y: tr[5] ?? 0, w: it.width ?? 0, h: it.height ?? 0 });
  }
  if (!runs.length) return '';
  // 多栏版式：先切栏（栏缝 = 贯穿大半页高的空档），再逐栏按行排
  const columns = splitColumns(runs);
  return columns.map(col => columnText(col)).filter(Boolean).join('\n\n');
}

/** 双栏/多栏检测：找一条横贯中部的纵向空带，把文本切成栏。样例表就靠它分开输入/输出。 */
function splitColumns(runs: TextItem[]): TextItem[][] {
  const xs = runs.map(r => r.x).sort((a, b) => a - b);
  const pageRight = Math.max(...runs.map(r => r.x + r.w));
  let best = { x: -1, gap: 0 };
  for (let i = 1; i < xs.length; i++) {
    const gap = xs[i]! - xs[i - 1]!;
    const cx = (xs[i]! + xs[i - 1]!) / 2;
    // 缝必须在内容区中部（15%~85%），且宽于 20pt 或页宽 8%
    if (gap > best.gap && cx > pageRight * 0.15 && cx < pageRight * 0.85) best = { x: cx, gap };
  }
  if (best.gap < Math.max(20, pageRight * 0.08)) return [runs];
  const left = runs.filter(r => r.x + r.w <= best.x + 0.5);
  const right = runs.filter(r => r.x >= best.x - 0.5);
  if (!left.length || !right.length) return [runs];
  // 跨缝文本太多就不是真双栏（可能只是稀疏排版）
  if (runs.length - left.length - right.length > runs.length * 0.35) return [runs];
  return [left, right];
}

function columnText(runs: TextItem[]): string {
  const sorted = [...runs].sort((a, b) => Math.abs(a.y - b.y) > 0.5 ? b.y - a.y : a.x - b.x);
  const lines: TextItem[][] = [];
  for (const run of sorted) {
    const tol = Math.max(1.6, run.h * 0.35);
    const line = lines.find(l => Math.abs(l[0]!.y - run.y) <= tol);
    if (line) line.push(run); else lines.push([run]);
  }
  // 行内按 x 排序，空档超过阈值补空格
  const out: string[] = [];
  for (const line of lines) {
    line.sort((a, b) => a.x - b.x);
    let text = '';
    let prevEnd = -Infinity;
    let prevH = 0;
    for (const item of line) {
      const gap = item.x - prevEnd;
      // 阈值取字高约 1/4：LaTeX 词间空隙通常 ≥0.3em
      if (gap > Math.max(0.5, prevH * 0.28)) text += ' ';
      text += item.str;
      prevEnd = item.x + item.w;
      prevH = item.h || prevH;
    }
    if (text.trim()) out.push(text.trimEnd());
  }
  return out.join('\n');
}

async function openPDF(url: string) {
  const global = globalThis as typeof globalThis & { pdfjsWorker?: { WorkerMessageHandler: unknown } };
  global.pdfjsWorker ??= { WorkerMessageHandler };
  const response = await fetch(url, { credentials: 'same-origin', signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`PDF HTTP ${response.status}`);
  return getDocument({ data: new Uint8Array(await response.arrayBuffer()), useSystemFonts: true,
    disableFontFace: true, useWorkerFetch: false });
}

/** Single-file userscripts cannot deploy a separate worker asset. */
export async function extractPDFText(url: string): Promise<string> {
  const task = await openPDF(url);
  try {
    const pdf = await task.promise;
    const pages: string[] = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      pages.push(pageText(content.items as unknown[]).trim());
      page.cleanup();
    }
    const text = pages.join('\n\n');
    if (!text.trim()) throw new Error('PDF contains no extractable text.');
    return text;
  } finally { await task.destroy(); }
}

/** 页面渲染成 PNG data URL——字体无 ToUnicode 时（公式/扫描件）图片是唯一完整来源。 */
export async function renderPDFImages(url: string, { maxPages = 6, maxDim = 1600 } = {}): Promise<string[]> {
  const task = await openPDF(url);
  try {
    const pdf = await task.promise;
    const images: string[] = [];
    for (let n = 1; n <= Math.min(pdf.numPages, maxPages); n++) {
      const page = await pdf.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(2, maxDim / Math.max(base.width, base.height));
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas: canvas, canvasContext: canvas.getContext('2d')!, viewport } as never).promise;
      images.push(canvas.toDataURL('image/png'));
      page.cleanup();
    }
    return images;
  } finally { await task.destroy(); }
}
