import type { EditorLanguage, SiteEditorSupport } from './types.ts';
import { requestNativeEditor as nativeRequest } from './native-editor-bridge.ts';
function mode(name: string): EditorLanguage['mode'] {
  if (/python|pypy/i.test(name)) return 'python';
  if (/java(?!script)/i.test(name)) return 'java';
  if (/c\+\+|^c(?:\(|$)/i.test(name)) return 'cpp';
  return 'text';
}
const fallback: EditorLanguage[] = [
  { id: '2', name: 'C++（clang++18）', mode: 'cpp' },
  { id: '38', name: 'C++(g++ 13)', mode: 'cpp' },
  { id: '39', name: 'C(gcc 10)', mode: 'cpp' },
  { id: '11', name: 'Python3', mode: 'python' },
  { id: '25', name: 'pypy3', mode: 'python' },
  { id: '4', name: 'Java', mode: 'java' },
];

export const nowcoderEditor: SiteEditorSupport = {
  get languages() {
    const snapshot = nativeRequest(document, { type: 'read' });
    return snapshot?.languages.map(language => ({ ...language, mode: mode(language.name) })) ?? fallback;
  },
  editorMountPoint(doc) {
    if (!/^\/acm\/(?:problem\/\d+|contest\/\d+\/[^/]+)\/?$/.test(new URL(doc.URL).pathname)) return null;
    const anchor = doc.querySelector<HTMLElement>('.code-editor-box .code-font');
    // Keep native controls until the bridge is available; never mount an unsynchronized replacement.
    return anchor && nativeRequest(doc, { type: 'read' }) ? { anchor, position: 'beforeend' } : null;
  },
  problemCode(doc) {
    const path = new URL(doc.URL).pathname;
    return /\/acm\/problem\/(\d+)/.exec(path)?.[1]
      ?? /\/acm\/contest\/(\d+\/[^/]+)/.exec(path)?.[1] ?? null;
  },
  initialCode(doc) { return nativeRequest(doc, { type: 'read' })?.code; },
  initialLanguage(doc) { return nativeRequest(doc, { type: 'read' })?.language; },
  syncCode(code, language) { nativeRequest(document, { type: 'sync', code, language }); },
  getSamples(doc) {
    const values = [...doc.querySelectorAll<HTMLTextAreaElement>('.question-oi-mod textarea')].map(node => node.value);
    const samples = [];
    for (let i = 0; i + 1 < values.length; i += 2) samples.push({ input: values[i]!, output: values[i + 1]! });
    return samples;
  },
};
