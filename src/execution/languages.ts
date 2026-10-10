import type { EditorLanguage } from '../sites/types.ts';
import type { LocalLanguage } from './types.ts';

export function localLanguageFor(language: EditorLanguage): LocalLanguage | undefined {
  if (language.mode === 'python') return 'python';
  if (language.mode !== 'cpp') return undefined;
  return /(?:^|\s)C(?:\s|\d|$)/.test(language.name) && !language.name.includes('++') ? 'c' : 'cpp';
}

export const LOCAL_LANGUAGES: readonly EditorLanguage[] = [
  { id: 'local-cpp17', name: 'C++17 (Clang 8 / WASI)', mode: 'cpp' },
  { id: 'local-c11', name: 'C11 (Clang 8 / WASI)', mode: 'cpp' },
  { id: 'local-python311', name: 'Python 3.11.3 (CPython / WASI)', mode: 'python' },
];
