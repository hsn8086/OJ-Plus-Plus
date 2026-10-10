import { getDocument } from 'pdfjs-dist';
import { WorkerMessageHandler } from 'pdfjs-dist/build/pdf.worker.mjs';

/** Single-file userscripts cannot deploy a separate worker asset. */
export async function extractPDFText(url: string): Promise<string> {
  const global = globalThis as typeof globalThis & { pdfjsWorker?: { WorkerMessageHandler: unknown } };
  global.pdfjsWorker ??= { WorkerMessageHandler };
  const response = await fetch(url, { credentials: 'same-origin', signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`PDF HTTP ${response.status}`);
  const task = getDocument({ data: new Uint8Array(await response.arrayBuffer()), useSystemFonts: true,
    disableFontFace: true, useWorkerFetch: false });
  try {
    const pdf = await task.promise;
    const pages: string[] = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      let text = '';
      for (const item of content.items) {
        if ('str' in item) text += item.str + (item.hasEOL ? '\n' : ' ');
      }
      pages.push(text.trim());
      page.cleanup();
    }
    const text = pages.join('\n\n');
    if (!text.trim()) throw new Error('PDF contains no extractable text.');
    return text;
  } finally { await task.destroy(); }
}
