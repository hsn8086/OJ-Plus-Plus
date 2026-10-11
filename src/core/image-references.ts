/** Keep image URLs out of model-generated prose while preserving valid Markdown. */
interface ImageAsset { url: string; alt: string }

// Inline code is consumed first, so Markdown examples inside code stay untouched.
const INLINE = /(`+)[\s\S]*?\1(?!`)|!\[((?:\\.|[^\]\\])*)\]\(\s*(<[^>\n]+>|(?:\\.|[^\s()\\]|\([^()\n]*\))+)\s*(?:"[^"\n]*"|'[^'\n]*')?\s*\)/g;
function mapImages(source: string, replace: (whole: string, alt: string, url: string) => string): string {
  let fence: { char: string; length: number } | undefined;
  return source.split('\n').map(line => {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = { char: marker[0]!, length: marker.length };
      else if (marker[0] === fence.char && marker.length >= fence.length) fence = undefined;
      return line;
    }
    if (fence || /^(?: {4}|\t)/.test(line)) return line;
    return line.replace(INLINE, (whole, code, alt: string, url: string) => code ? whole : replace(whole, alt, url));
  }).join('\n');
}

export function prepareImageReferences(source: string, baseUrl: string, preset: Record<string, string> = {}) {
  const assets = new Map<string, ImageAsset>();
  let index = 0;
  const add = (url: string, alt: string) => {
    const ref = `ojpp-image:${++index}`;
    assets.set(ref, { url, alt });
    return `![${alt}](${ref})`;
  };
  const absolute = (url: string) => {
    const value = url.startsWith('<') ? url.slice(1, -1) : url;
    try { return new URL(value.replace(/\\([()])/g, '$1'), baseUrl).href; }
    catch { return value; }
  };
  // PDF extraction currently produces bare ![图N] markers with a separate asset map.
  const pdfRefs = new Map(Object.entries(preset).map(([key, url]) => [key, add(url, key.slice(2, -1))]));
  let markdown = mapImages(source, (_whole, alt, url) => add(absolute(url), alt));
  markdown = markdown.replace(/!\[图\d+\](?!\()/g, marker => pdfRefs.get(marker) ?? marker);
  const imageMarkdown = (asset: ImageAsset, alt = asset.alt) => `![${alt}](<${asset.url}>)`;
  return {
    markdown,
    cacheIdentity: JSON.stringify([...assets]),
    restore(text: string, complete = false): string {
      const used = new Set<string>();
      let restored = mapImages(text, (_whole, alt, url) => {
        const ref = url.replace(/^<|>$/g, '');
        const asset = assets.get(ref);
        if (asset) { used.add(ref); return imageMarkdown(asset, alt); }
        const original = [...assets].find(([, value]) => value.url === absolute(url));
        if (original) { used.add(original[0]); return imageMarkdown(original[1], alt); }
        // Unresolved model-invented image URLs are not rendered as broken images.
        return '';
      });
      // If the model omits a supplied illustration, retain the real asset at the end.
      if (complete) {
        const missing = [...assets].filter(([ref]) => !used.has(ref)).map(([, asset]) => imageMarkdown(asset));
        if (missing.length) restored += '\n\n' + missing.join('\n\n');
      }
      return restored;
    },
  };
}
