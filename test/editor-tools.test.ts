import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectCodeLanguage, languageFamily, resolveAutoLanguage } from '../src/editor/language-detection.ts';
import { defaultSettings, migrate } from '../src/core/config.ts';
import { codeTemplate } from '../src/editor/code-library.ts';
import type { EditorLanguage } from '../src/sites/types.ts';

const languages: EditorLanguage[] = [
  { id: 'cpp', name: 'GNU G++17', mode: 'cpp' },
  { id: 'c', name: 'C(gcc 10)', mode: 'cpp' },
  { id: 'py2', name: 'Python2', mode: 'python' },
  { id: 'py3', name: 'Python3', mode: 'python' },
  { id: 'java', name: 'Java 21', mode: 'text' },
];

test('auto ignores misleading strings/comments and chooses official site languages', () => {
  assert.equal(detectCodeLanguage('#include <bits/stdc++.h>\nint main() { puts("print(input())"); }'), 'cpp');
  assert.equal(detectCodeLanguage('import sys\nprint("std::cout")'), 'python');
  assert.equal(resolveAutoLanguage('print(input())', languages, languages[0]!).id, 'py3');
  assert.equal(resolveAutoLanguage('public class Main {}', languages, languages[0]!).id, 'java');
  assert.equal(resolveAutoLanguage('// print(input())\n', languages, languages[0]!).id, 'cpp');
  assert.equal(resolveAutoLanguage('', languages, languages[3]!).id, 'py3');
  assert.equal(languageFamily(languages[1]!), 'c');
});

test('auto can identify code near the end of a large document and keeps unsupported languages stable', () => {
  assert.equal(detectCodeLanguage('// filler\n'.repeat(100_000) + '\nprint(input())'), 'python');
  assert.equal(resolveAutoLanguage('fn main() {}', languages, languages[0]!).id, 'cpp');
});

test('templates and snippets migrate independently from per-problem drafts', () => {
  const settings = migrate({ ...defaultSettings(), editorTemplates: { python: '', cpp: 'int main() {}', bad: 'x' },
    editorCode: { 'luogu:P1001': { code: 'draft', updated: 1 } }, editorSnippets: [
      { id: '1', name: 'loop', prefix: 'fori', language: 'cpp', code: 'for (int ${1:i}=0; ${1:i}<${2:n}; ++${1:i}) {}' },
      { id: '2', name: 'invalid', prefix: 'x', language: 'unknown', code: 'bad' },
    ], editorLayout: { codeforces: 'split', atcoder: 'bad' } });
  assert.equal(codeTemplate(settings.editorTemplates, 'python'), '');
  assert.equal(codeTemplate(settings.editorTemplates, 'cpp'), 'int main() {}');
  assert.match(codeTemplate(settings.editorTemplates, 'java'), /public class Main/);
  assert.equal(settings.editorCode['luogu:P1001']?.code, 'draft');
  assert.equal(settings.editorSnippets.length, 1);
  assert.deepEqual(settings.editorLayout, { codeforces: 'split' });
});
