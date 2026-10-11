import type { EditorLanguage } from '../sites/types.ts';

export const CODE_LANGUAGES = ['cpp', 'c', 'python', 'java', 'javascript', 'rust', 'go', 'csharp', 'kotlin', 'pascal', 'ruby', 'php', 'haskell', 'lua', 'ocaml', 'julia', 'scala', 'perl', 'text'] as const;
export type CodeLanguage = typeof CODE_LANGUAGES[number];

export function languageFamily(language: EditorLanguage): CodeLanguage {
  const name = language.name.toLowerCase();
  if (/c\+\+|g\+\+|clang\+\+/.test(name)) return 'cpp';
  if (/c#|csharp/.test(name)) return 'csharp';
  if (/javascript|node\.js/.test(name)) return 'javascript';
  if (/python|pypy/.test(name)) return 'python';
  for (const key of ['kotlin', 'java', 'rust', 'go', 'pascal', 'ruby', 'php', 'haskell', 'lua', 'ocaml', 'julia', 'scala', 'perl'] as const) {
    if (new RegExp(`\\b${key}\\b`).test(name)) return key;
  }
  if (/\bc(?:\d{2})?\b/.test(name)) return 'c';
  return language.mode === 'text' ? 'text' : language.mode;
}

/** Bounded scan; unknown/incomplete code retains the last resolved language. */
export function detectCodeLanguage(code: string): CodeLanguage | undefined {
  const sample = code.length > 20_480 ? code.slice(0, 16_384) + '\n' + code.slice(-4096) : code;
  const text = sample.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' ');
  if (/\bfn\s+main\s*\(|\buse\s+std::/.test(text)) return 'rust';
  if (/\bpackage\s+main\b|\bfunc\s+main\s*\(/.test(text)) return 'go';
  if (/\bfun\s+main\s*\(/.test(text)) return 'kotlin';
  if (/using\s+System\b|Console\.(?:Write|Read)/.test(text)) return 'csharp';
  if (/System\.(?:out|in)\b|import\s+java\.|public\s+(?:final\s+)?class\s+|\b(?:public\s+)?class\s+\w+[\s\S]*\bstatic\s+void\s+main\b/.test(text)) return 'java';
  if (/std::|using\s+namespace|\b(?:cin|cout|cerr)\s*(?:>>|<<)|#\s*include\s*<(?:iostream|bits\/[^>]+|vector|string)>/.test(text)) return 'cpp';
  if (/#\s*include|\b(?:int|signed|void)\s+main\s*\(|\b(?:printf|scanf)\s*\(/.test(text)) return 'c';
  if (/^\s*(?:def|class)\s+\w+.*:|^\s*(?:from\s+\w+\s+import|import\s+(?:sys|math|collections)|elif\b)|\b(?:print|input)\s*\(/m.test(text)) return 'python';
  if (/console\.log|require\s*\(|\b(?:const|let)\s+\w+\s*=|\bfunction\s+\w+\s*\(/.test(text)) return 'javascript';
  if (/\bprogram\s+\w+\s*;|\bbegin\b[\s\S]*\bend\./i.test(text)) return 'pascal';
  return undefined;
}

export function resolveAutoLanguage(code: string, languages: readonly EditorLanguage[], previous: EditorLanguage): EditorLanguage {
  const family = detectCodeLanguage(code);
  if (!family || languageFamily(previous) === family) return previous;
  const candidates = languages.filter(language => languageFamily(language) === family);
  const preferred = family === 'python' ? candidates.find(language => /(?:python|pypy)\s*3/i.test(language.name)) : undefined;
  return preferred ?? candidates[0]
    ?? (family === 'c' ? languages.find(language => languageFamily(language) === 'cpp') : undefined)
    ?? previous;
}
