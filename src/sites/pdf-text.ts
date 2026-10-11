import { getDocument, OPS } from 'pdfjs-dist';
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
function pageText(items: unknown[], images: PdfImage[], keyFor: (i: number) => string): { text: string; images: Record<string, string> } {
  const runs: TextItem[] = [];
  for (const item of items) {
    const it = item as { str?: string; transform?: number[]; width?: number; height?: number };
    if (typeof it?.str !== 'string' || !it.str.trim()) continue;
    const tr = it.transform ?? [1, 0, 0, 1, 0, 0];
    runs.push({ str: it.str, x: tr[4] ?? 0, y: tr[5] ?? 0, w: it.width ?? 0, h: it.height ?? 0 });
  }
  const lines = buildLines(runs);
  const out: string[] = [];
  const imgs: Record<string, string> = {};
  // 图插到 y 对应的行位（lines y 降序，第一个 y <= img.y 的行前）
  const pending = [...images].sort((a, b) => b.y - a.y);
  for (const line of lines) {
    while (pending.length && pending[0]!.y >= line.y) {
      const img = pending.shift()!;
      const key = keyFor(Object.keys(imgs).length);
      imgs[key] = img.dataUrl;
      out.push(key);
    }
    const t = lineText(line);
    if (t.trim()) out.push(t);
  }
  for (const img of pending) {
    const key = keyFor(Object.keys(imgs).length);
    imgs[key] = img.dataUrl;
    out.push(key);
  }
  return { text: out.join('\n'), images: imgs };
}

interface TextLine { y: number; items: TextItem[] }

function buildLines(runs: TextItem[]): TextLine[] {
  const sorted = [...runs].sort((a, b) => Math.abs(a.y - b.y) > 0.5 ? b.y - a.y : a.x - b.x);
  const lines: TextLine[] = [];
  for (const run of sorted) {
    const tol = Math.max(1.6, run.h * 0.35);
    const line = lines.find(l => Math.abs(l.y - run.y) <= tol);
    if (line) line.items.push(run); else lines.push({ y: run.y, items: [run] });
  }
  return lines;
}

function lineText(line: TextLine): string {
  const items = [...line.items].sort((a, b) => a.x - b.x);
  let text = '';
  let prevEnd = -Infinity;
  let prevH = 0;
  for (const item of items) {
    const gap = item.x - prevEnd;
    if (gap > Math.max(0.5, prevH * 0.28)) text += ' ';
    text += item.str;
    prevEnd = item.x + item.w;
    prevH = item.h || prevH;
  }
  return text.trimEnd();
}

interface PdfImage {
  key: string;
  dataUrl: string;
  y: number;
}

/** 从 PDF 原始字节里挖 image XObject 流——pdf.js 对象解析在主线程不稳，
 *  DCT(JPEG) 原样打包；FlateDecode 用 DecompressionStream 解开再转 PNG。 */
async function rawStreamImages(buf: Uint8Array): Promise<string[]> {
  const latin = new TextDecoder('latin1');
  const head = latin.decode(buf);
  const out: string[] = [];
  let pos = 0;
  while (true) {
    const idx = head.indexOf('/Subtype', pos);
    if (idx < 0) break;
    pos = idx + 8;
    if (!/^\/Subtype\s*\/Image/.test(head.slice(idx, idx + 40))) continue;
    const streamPos = head.indexOf('stream', idx);
    if (streamPos < 0) break;
    const dict = head.slice(idx, streamPos);
    const w = Number(/\/Width\s+(\d+)/.exec(dict)?.[1] ?? 0);
    const h = Number(/\/Height\s+(\d+)/.exec(dict)?.[1] ?? 0);
    const bpc = Number(/\/BitsPerComponent\s+(\d+)/.exec(dict)?.[1] ?? 8);
    const cs = /\/ColorSpace\s*\/(\w+)/.exec(dict)?.[1] ?? 'DeviceRGB';
    const filt = /\/Filter\s*\/(\w+)/.exec(dict)?.[1] ?? '';
    const len = Number(/\/Length\s+(\d+)/.exec(dict)?.[1] ?? 0);
    if (!w || !h || !len) { pos = streamPos + 6; continue; }
    let dataStart = streamPos + 6;
    // stream 后是 \n / \r\n
    if (buf[dataStart] === 0x0d && buf[dataStart + 1] === 0x0a) dataStart += 2;
    else if (buf[dataStart] === 0x0a || buf[dataStart] === 0x0d) dataStart++;
    const data = buf.subarray(dataStart, dataStart + len);
    pos = dataStart + len;
    try {
      const url = await streamToDataUrl({ w, h, bpc, cs, filt, data });
      if (url) out.push(url);
    } catch { /* 解不开的图就跳过 */ }
  }
  return out;
}

async function streamToDataUrl({ w, h, bpc, cs, filt, data }: {
  w: number; h: number; bpc: number; cs: string; filt: string; data: Uint8Array;
}): Promise<string | null> {
  if (filt === 'DCTDecode') return `data:image/jpeg;base64,${u8ToB64(data)}`;
  if (filt === 'JPXDecode') return `data:image/jp2;base64,${u8ToB64(data)}`;
  if (filt !== 'FlateDecode' || bpc !== 8) return null;
  const raw = await inflate(data);
  const bpp = cs === 'DeviceRGB' ? 3 : cs === 'DeviceGray' ? 1 : cs === 'DeviceCMYK' ? 4 : 0;
  if (!bpp || raw.length < w * h * bpp) return null;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const pix = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const s = i * bpp, t = i * 4;
    pix[t] = raw[s]!;
    pix[t + 1] = bpp >= 3 ? raw[s + 1]! : raw[s]!;
    pix[t + 2] = bpp >= 3 ? raw[s + 2]! : raw[s]!;
    pix[t + 3] = 255;
  }
  ctx.putImageData(new ImageData(pix, w, h), 0, 0);
  return canvas.toDataURL('image/png');
}

function u8ToB64(u8: Uint8Array): string {
  let s = '';
  for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, [...u8.subarray(i, i + 8192)]);
  return btoa(s);
}

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate');
  const stream = new Blob([data as unknown as ArrayBuffer]).stream().pipeThrough(ds);
  const res = new Uint8Array(await new Response(stream).arrayBuffer());
  return res;
}

/** 一页里的图片位置：paintImageXObject op 的变换矩阵给 y，
 *  数据从 imageQueue（rawStreamImages 解出来的 dataURL）按序取。 */
async function pageImages(page: { getOperatorList(): Promise<any> }, imageQueue: string[]): Promise<PdfImage[]> {
  let ops;
  try {
    ops = await Promise.race([
      page.getOperatorList(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('ops timeout')), 30000)),
    ]);
  } catch { return []; }
  const out: PdfImage[] = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  const stack: number[][] = [];
  let paintCount = 0;
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i] as number;
    const args = ops.argsArray[i] as unknown[];
    if (fn === OPS.save) stack.push([...ctm]);
    else if (fn === OPS.restore) ctm = stack.pop() ?? ctm;
    else if (fn === OPS.transform) ctm = args as number[];
    else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
      paintCount++;
      const dataUrl = imageQueue.shift();
      if (dataUrl) out.push({ key: '', dataUrl, y: ctm[5] ?? 0 });
    }
  }
  return out;
}

async function openPDF(url: string): Promise<{ task: ReturnType<typeof getDocument>; bytes: Uint8Array }> {
  const global = globalThis as typeof globalThis & { pdfjsWorker?: { WorkerMessageHandler: unknown } };
  global.pdfjsWorker ??= { WorkerMessageHandler };
  const response = await fetch(url, { credentials: 'same-origin', signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`PDF HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return {
    bytes,
    task: getDocument({ data: bytes.slice(), useSystemFonts: true, disableFontFace: true, useWorkerFetch: false }),
  };
}

/** 样例区域标题：起点 Example/Sample，终点下一个正文章节标题。 */
const SAMPLE_HEAD = /^[ \t]*(examples?|samples?|sample tests?|测试样例|样例)[ \t]*$/im;
const SECTION_HEAD = /^[ \t]*(note|notes|scoring|subtasks?|constraints?|limits?|提示|说明|数据范围|分数|计分|评分|附录|hack|evaluation|explanation)\b/im;

/** 把提取文本切成「正文」和「样例区」——样例单独走结构化提取，不参与题面翻译。 */
export function splitPdfSamples(text: string): { statement: string; samples: string | undefined } {
  const head = SAMPLE_HEAD.exec(text);
  if (!head) return { statement: text, samples: undefined };
  const rest = text.slice(head.index + head[0].length);
  const tail = SECTION_HEAD.exec(rest);
  const samples = tail ? rest.slice(0, tail.index).trim() : rest.trim();
  let statement = (text.slice(0, head.index) + (tail ? rest.slice(tail.index) : '')).trim();
  // 图占位符留在 statement：图块可能是样例配图，切进 samples 会丢引用
  const markers = rest.match(/!\[图\d+\]/g)?.filter(m => !statement.includes(m));
  if (markers?.length) statement += '\n\n' + markers.join('\n');
  const cleanSamples = samples.replace(/!\[图\d+\]/g, '').trim();
  return { statement, samples: cleanSamples || undefined };
}

/** Single-file userscripts cannot deploy a separate worker asset. */
export async function extractPDFText(url: string): Promise<{ text: string; images: Record<string, string> }> {
  const { task, bytes } = await openPDF(url);
  try {
    const pdf = await task.promise;
    const pages: string[] = [];
    const images: Record<string, string> = {};
    let imageCount = 0;
    const imageQueue = await rawStreamImages(bytes).catch(() => [] as string[]);
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      const pageImgs = await pageImages(page as never, imageQueue);
      const startCount = imageCount;
      const { text, images: pageImageMap } = pageText(content.items as unknown[], pageImgs, (i) => `![图${startCount + i + 1}]`);
      imageCount += Object.keys(pageImageMap).length;
      Object.assign(images, pageImageMap);
      pages.push(text.trim());
      page.cleanup();
    }
    const text = pages.join('\n\n');
    if (!text.trim()) throw new Error('PDF contains no extractable text.');
    return { text, images };
  } finally { await task.destroy(); }
}

/** 页面渲染成 PNG data URL——字体无 ToUnicode 时（公式/扫描件）图片是唯一完整来源。 */
export async function renderPDFImages(url: string, { maxPages = 6, maxDim = 1600 } = {}): Promise<string[]> {
  const { task } = await openPDF(url);
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
