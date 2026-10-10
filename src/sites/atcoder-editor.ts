import { t } from '../i18n/index.ts';
import type { EditorLanguage, EditorTestResult, SiteEditorSupport } from './types.ts';

export function atcoderContest(path: string): string | null {
  return /^\/contests\/([\w-]+)(?:\/|$)/.exec(path)?.[1] ?? null;
}

export function atcoderLanguageMode(name: string): EditorLanguage['mode'] {
  if (/C\+\+|Clang|\bC\d*\b/.test(name)) return 'cpp';
  if (/Python|PyPy|Codon/i.test(name)) return 'python';
  if (/^Java\b/.test(name)) return 'java';
  return 'text';
}

export function atcoderStatement(doc: Document): HTMLElement | null {
  const root = doc.querySelector<HTMLElement>('#task-statement');
  if (!root) return null;
  const variants = [...root.querySelectorAll<HTMLElement>('.lang-en, .lang-ja')];
  return variants.find(e => doc.defaultView?.getComputedStyle(e).display !== 'none') ?? variants[0] ?? root;
}

export function atcoderSamples(doc: Document): { input: string; output: string }[] {
  const root = atcoderStatement(doc);
  if (!root) return [];
  // Recognize headings too: pre-sample IDs are assigned by AtCoder's client script.
  const inputs: HTMLElement[] = [];
  const outputs: HTMLElement[] = [];
  for (const section of root.querySelectorAll('section')) {
    const heading = section.querySelector('h3')?.textContent?.trim() ?? '';
    const pre = section.querySelector<HTMLElement>('pre');
    if (!pre) continue;
    if (/^(Sample Input|入力例|样例输入)\s*\d+/.test(heading)) inputs.push(pre);
    if (/^(Sample Output|出力例|样例输出)\s*\d+/.test(heading)) outputs.push(pre);
  }
  const samples: { input: string; output: string }[] = [];
  for (let i = 0; i < Math.min(inputs.length, outputs.length); i++) {
    samples.push({ input: inputs[i].textContent ?? '', output: outputs[i].textContent ?? '' });
  }
  return samples;
}

interface TestResponse {
  Interval?: number;
  Result?: { Id: number; Status: number; ExitCode: number | string; TimeConsumption: string; MemoryConsumption: string };
  Stdout?: string;
  Stderr?: string;
}

export function parseAtcoderResult(data: TestResponse): EditorTestResult | null {
  if (!data.Result || data.Interval || [1, 2].includes(data.Result.Status)) return null;
  const r = data.Result;
  if (!r.Id) return null;
  const output = (data.Stdout ?? '').replace(/\r\n/g, '\n');
  const failed = Number(r.ExitCode) !== 0 || r.Status !== 3;
  return { output, used: `${r.TimeConsumption}, ${r.MemoryConsumption}`, verdict: failed ? 'ERROR' : 'OK',
    ...(failed ? { error: data.Stderr?.trim() || `Exit code: ${r.ExitCode} (status ${r.Status})` } : {}) };
}

function languages(doc: Document): EditorLanguage[] {
  return [...doc.querySelectorAll<HTMLOptionElement>('select[name="data.LanguageId"] option')]
    .filter(o => o.value).map(o => ({ id: o.value, name: o.text, mode: atcoderLanguageMode(o.text) }))
    .sort((a, b) => Number(/^C\+\+.*GCC/.test(b.name)) - Number(/^C\+\+.*GCC/.test(a.name)));
}

declare const unsafeWindow: Window | undefined;

function syncAce(code: string) {
  const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const ace = (win as unknown as { ace?: { edit(id: string): { getValue(): string; setValue(code: string, cursor: number): void } } }).ace;
  if (ace && document.querySelector('#editor')) {
    const editor = ace.edit('editor');
    if (editor.getValue() !== code) editor.setValue(code, -1);
  }
}

async function fetchChecked(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { credentials: 'same-origin', signal: AbortSignal.timeout(30000), ...init });
  if (!res.ok) throw new Error(`AtCoder HTTP ${res.status}`);
  if (new URL(res.url).pathname === '/login') throw new Error(t('atcoder.signIn'));
  return res;
}

async function runTest(code: string, languageId: string, input: string): Promise<EditorTestResult> {
  const contest = atcoderContest(location.pathname);
  if (!contest) throw new Error('No AtCoder contest.');
  const base = `/contests/${contest}/custom_test`;
  const page = new DOMParser().parseFromString(await (await fetchChecked(base)).text(), 'text/html');
  const token = page.querySelector<HTMLInputElement>('input[name="csrf_token"]')?.value;
  if (!token) throw new Error(t('atcoder.signIn'));
  const before: TestResponse = await (await fetchChecked(`${base}/json?reload=true`)).json();
  if (before.Interval || [1, 2].includes(before.Result?.Status ?? 0)) throw new Error(t('atcoder.testBusy'));
  const body = new URLSearchParams({ 'data.LanguageId': languageId, sourceCode: code, input, csrf_token: token });
  const reply = await (await fetchChecked(`${base}/submit/json`, { method: 'POST', body })).text();
  if (reply.trim() && reply.trim() !== '""') {
    throw new Error(new DOMParser().parseFromString(reply, 'text/html').body.textContent?.trim() || 'Custom test rejected.');
  }
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data: TestResponse = await (await fetchChecked(`${base}/json?reload=true`)).json();
    if (data.Result?.Id === before.Result?.Id) continue;
    const result = parseAtcoderResult(data);
    if (result) return result;
  }
  throw new Error(t('atcoder.testTimeout'));
}

// AtCoder exposes one current result per session, unlike CF's independent job IDs.
let testQueue: Promise<unknown> = Promise.resolve();

export const atcoderEditor: SiteEditorSupport = {
  editorMountPoint(doc) {
    const root = doc.querySelector<HTMLElement>('#task-statement');
    return root && languages(doc).length ? { anchor: root, position: 'afterend' } : null;
  },
  problemCode(doc) { return /\/tasks\/([\w-]+)$/.exec(new URL(doc.URL).pathname)?.[1] ?? null; },
  get languages() { return languages(document); },
  getSamples: atcoderSamples,
  syncCode(code, languageId) {
    const source = document.querySelector<HTMLTextAreaElement>('#plain-textarea');
    const language = document.querySelector<HTMLSelectElement>('select[name="data.LanguageId"]');
    if (source) source.value = code;
    if (language) language.value = languageId;
    syncAce(code);
  },
  runCustomTest(code, languageId, input) {
    const run = async (): Promise<EditorTestResult> => navigator.locks
      ? await navigator.locks.request('ojpp-atcoder-custom-test', () => runTest(code, languageId, input))
      : await runTest(code, languageId, input);
    const result = testQueue.then(run);
    testQueue = result.catch(() => undefined);
    return result;
  },
  async submit(code, languageId, problemCode) {
    const form = document.querySelector<HTMLFormElement>('form.form-code-submit');
    if (!form || !/\/submit$/.test(new URL(form.action).pathname)) return { ok: false, error: t('atcoder.formUnavailable') };
    const source = form.querySelector<HTMLTextAreaElement>('[name="sourceCode"]');
    const language = form.querySelector<HTMLSelectElement>('[name="data.LanguageId"]');
    if (!source || !language) return { ok: false, error: t('atcoder.formUnavailable') };
    source.value = code;
    language.value = languageId;
    syncAce(code);
    const body = new URLSearchParams();
    for (const [key, value] of new FormData(form)) if (typeof value === 'string') body.set(key, value);
    body.set('data.TaskScreenName', problemCode);
    body.set('sourceCode', code);
    body.set('data.LanguageId', languageId);
    const challenge = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
    if (challenge && !challenge.value) {
      form.scrollIntoView({ block: 'center' });
      return { ok: false, error: t('atcoder.verification') };
    }
    const response = await fetchChecked(form.action, { method: 'POST', body });
    if (/\/submissions(?:\/|$)/.test(new URL(response.url).pathname)) return { ok: true, url: response.url };
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const errors = [...doc.querySelectorAll('.alert-danger, .has-error .help-block')].map(e => e.textContent?.trim()).filter(Boolean);
    return { ok: false, error: errors.join('; ') || t('atcoder.notConfirmed') };
  },
  editorPage(doc) {
    // Task pages already have the full panel; keep the native form available for verification.
    if (doc.querySelector('#task-statement')) return null;
    const textarea = doc.querySelector<HTMLTextAreaElement>('#plain-textarea');
    const native = doc.querySelector<HTMLElement>('#editor');
    if (!textarea || !native) return null;
    return { anchor: native, position: 'afterend', hide: native, textarea,
      langSelect: doc.querySelector<HTMLSelectElement>('select[name="data.LanguageId"]') ?? undefined,
      langMode: id => languages(doc).find(l => l.id === id)?.mode ?? 'text', syncBack: syncAce };
  },
};
