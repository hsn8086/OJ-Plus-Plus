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
  // 先按行聚合（y 接近归一行），再按 x 排序
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
