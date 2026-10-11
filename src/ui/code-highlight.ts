import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import delphi from 'highlight.js/lib/languages/delphi';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import csharp from 'highlight.js/lib/languages/csharp';
import kotlin from 'highlight.js/lib/languages/kotlin';
import haskell from 'highlight.js/lib/languages/haskell';
import lua from 'highlight.js/lib/languages/lua';
import ocaml from 'highlight.js/lib/languages/ocaml';
import julia from 'highlight.js/lib/languages/julia';
import scala from 'highlight.js/lib/languages/scala';
import perl from 'highlight.js/lib/languages/perl';

for (const [name, language] of Object.entries({ c, cpp, java, python, javascript, delphi, ruby, php, rust, go, csharp, kotlin, haskell, lua, ocaml, julia, scala, perl })) {
  hljs.registerLanguage(name, language);
}
hljs.registerAliases(['pascal'], { languageName: 'delphi' });

/** markdown-it escapes the original code when this returns an empty string. */
export function highlightCode(code: string, info: string): string {
  const language = info.trim().split(/\s+/)[0]?.toLowerCase();
  // Avoid expensive auto-detection for samples/plain text and very large streamed fences.
  if (!language || !hljs.getLanguage(language) || code.length > 100_000) return '';
  try { return hljs.highlight(code, { language, ignoreIllegals: true }).value; }
  catch { return ''; }
}
