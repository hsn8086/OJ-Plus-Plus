import { t } from '../i18n/index.ts';
import type { Settings } from '../core/types.ts';
import type { SiteAdapter, SiteEditorSupport } from '../sites/types.ts';
import { createEditor, type EditorHandle } from '../editor/cm.ts';
import { ICON_CROSS } from './icons.ts';

export interface EditorPanelOptions {
  site: SiteAdapter;
  support: SiteEditorSupport;
  getSettings(): Settings;
  /** 设置有改动时持久化（language/code 草稿/自定义测试） */
  persist(): void;
  isDark(): boolean;
  onDarkChange(cb: (dark: boolean) => void): () => void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const draftKey = (siteId: string, problemCode: string) => `${siteId}:${problemCode}`;

export function mountEditorPanel(options: EditorPanelOptions) {
  const { site, support, getSettings, persist, isDark, onDarkChange } = options;
  const problemCode = support.problemCode(document);
  const settings = getSettings();
  const key = problemCode ? draftKey(site.id, problemCode) : null;

  const root = el('div', 'ojpp-editor');
  const head = el('div', 'ojpp-editor-head');
  const title = el('span', 'ojpp-editor-title', t('editor.title'));
  const langSel = el('select', 'ojpp-editor-lang') as HTMLSelectElement;
  for (const lang of support.languages) {
    const opt = el('option', undefined, lang.name) as HTMLOptionElement;
    opt.value = lang.id;
    langSel.append(opt);
  }
  const savedLang = settings.editorLanguage[site.id];
  const defaultLang = support.languages.find((l) => l.id === savedLang) ?? support.languages[0];
  langSel.value = defaultLang.id;

  const spacer = el('span', 'ojpp-editor-spacer');
  const addTestBtn = el('button', 'ojpp-btn ojpp-btn-sm', t('editor.addTest')) as HTMLButtonElement;
  const runAllBtn = el('button', 'ojpp-btn ojpp-btn-sm', t('editor.runAll')) as HTMLButtonElement;
  const submitBtn = el('button', 'ojpp-btn ojpp-btn-sm ojpp-btn-primary', t('editor.submit')) as HTMLButtonElement;
  head.append(title, langSel, spacer, addTestBtn, runAllBtn, submitBtn);

  const cmHost = el('div', 'ojpp-editor-cm');
  const tests = el('div', 'ojpp-editor-tests');
  const submitLine = el('div', 'ojpp-editor-submitline');
  root.append(head, cmHost, tests, submitLine);

  const initial = key ? (settings.editorCode[key]?.code ?? '') : '';
  const editor: EditorHandle = createEditor(cmHost, {
    doc: initial,
    mode: defaultLang.mode,
    dark: isDark(),
    fontSize: settings.editorFontSize,
    tabSize: 4,
    lspUrl: settings.editorLspUrl,
    onChange: (code) => {
      if (!key) return;
      getSettings().editorCode[key] = { code, updated: Date.now() };
      persistDebounced();
    },
  });
  const stopDark = onDarkChange((dark) => editor.setDark(dark));

  let persistTimer: ReturnType<typeof setTimeout> | undefined;
  function persistDebounced() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => persist(), 600);
  }

  langSel.onchange = () => {
    const lang = support.languages.find((l) => l.id === langSel.value) ?? defaultLang;
    editor.setMode(lang.mode);
    getSettings().editorLanguage[site.id] = lang.id;
    persist();
  };

  /* ---------- 测试行 ---------- */

  interface TestRow {
    kind: 'custom' | 'sample';
    input: string;
    expected: string;
    row: HTMLElement;
    statusEl: HTMLElement;
    bodyEl: HTMLElement;
    customIndex?: number;
  }

  const rows: TestRow[] = [];

  const runRow = async (row: TestRow) => {
    const input = row.kind === 'custom'
      ? (row.row.querySelector('.ojpp-test-input') as HTMLTextAreaElement).value
      : row.input;
    const expected = row.kind === 'custom'
      ? (row.row.querySelector('.ojpp-test-expected') as HTMLTextAreaElement).value
      : row.expected;
    row.statusEl.textContent = t('editor.running');
    row.statusEl.className = 'ojpp-test-status running';
    row.bodyEl.replaceChildren();
    try {
      const res = await support.runCustomTest(editor.getCode(), langSel.value, input);
      if (res.error) {
        row.statusEl.textContent = t('editor.runError');
        row.statusEl.className = 'ojpp-test-status error';
      } else {
        const ok = res.output.trim() === expected.trim();
        row.statusEl.textContent = ok ? t('editor.match') : t('editor.mismatch');
        row.statusEl.className = `ojpp-test-status ${ok ? 'ok' : 'warn'}`;
      }
      if (res.output) {
        const out = el('pre', 'ojpp-test-out');
        out.textContent = res.output;
        row.bodyEl.append(out);
      }
      if (res.error) {
        const err = el('pre', 'ojpp-test-out error');
        err.textContent = res.error;
        row.bodyEl.append(err);
      }
      if (res.used) row.bodyEl.append(el('div', 'ojpp-test-used', res.used));
    } catch (e) {
      row.statusEl.textContent = t('editor.runError');
      row.statusEl.className = 'ojpp-test-status error';
      row.bodyEl.append(el('pre', 'ojpp-test-out error', e instanceof Error ? e.message : String(e)));
    }
  };

  function addCustomRow(item: { input: string; expected: string }, customIndex: number) {
    const row = el('div', 'ojpp-test ojpp-test-custom');
    const headRow = el('div', 'ojpp-test-head');
    const name = el('span', 'ojpp-test-name', `${t('editor.customN')} ${customIndex + 1}`);
    const status = el('span', 'ojpp-test-status');
    const actions = el('span', 'ojpp-test-actions');
    const runOne = el('button', 'ojpp-btn ojpp-btn-xs', t('editor.runOne')) as HTMLButtonElement;
    const del = el('button', 'ojpp-icon-btn ojpp-test-del') as HTMLButtonElement;
    del.innerHTML = ICON_CROSS;
    del.title = t('editor.delete');
    actions.append(runOne, del);
    headRow.append(name, actions, status);
    const grid = el('div', 'ojpp-test-grid');
    const inputTa = el('textarea', 'ojpp-test-input') as HTMLTextAreaElement;
    inputTa.placeholder = t('editor.customPlaceholder');
    inputTa.value = item.input;
    const expTa = el('textarea', 'ojpp-test-expected') as HTMLTextAreaElement;
    expTa.placeholder = t('editor.expected');
    expTa.value = item.expected;
    grid.append(fieldWrap(t('editor.input'), inputTa), fieldWrap(t('editor.expected'), expTa));
    const body = el('div', 'ojpp-test-body');
    row.append(headRow, grid, body);
    const rec: TestRow = { kind: 'custom', input: '', expected: '', row, statusEl: status, bodyEl: body, customIndex };
    runOne.onclick = () => void runRow(rec);
    del.onclick = () => {
      rows.splice(rows.indexOf(rec), 1);
      row.remove();
      saveCustomTests();
    };
    rows.push(rec);
    tests.append(row);
    return rec;
  }

  function addSampleRow(sample: { input: string; output: string }, index: number) {
    const row = el('div', 'ojpp-test ojpp-test-sample');
    const headRow = el('div', 'ojpp-test-head');
    const name = el('span', 'ojpp-test-name', `${t('editor.sample')} ${index + 1}`);
    const status = el('span', 'ojpp-test-status');
    const actions = el('span', 'ojpp-test-actions');
    const runOne = el('button', 'ojpp-btn ojpp-btn-xs', t('editor.runOne')) as HTMLButtonElement;
    actions.append(runOne);
    headRow.append(name, actions, status);
    const grid = el('div', 'ojpp-test-grid');
    const inPre = el('pre', 'ojpp-test-pre');
    inPre.textContent = sample.input || ' ';
    const expPre = el('pre', 'ojpp-test-pre');
    expPre.textContent = sample.output || ' ';
    grid.append(fieldWrap(t('editor.input'), inPre), fieldWrap(t('editor.expected'), expPre));
    const body = el('div', 'ojpp-test-body');
    row.append(headRow, grid, body);
    const rec: TestRow = { kind: 'sample', input: sample.input, expected: sample.output, row, statusEl: status, bodyEl: body };
    runOne.onclick = () => void runRow(rec);
    rows.push(rec);
    tests.append(row);
    return rec;
  }

  function fieldWrap(label: string, control: HTMLElement) {
    const wrap = el('div', 'ojpp-test-field');
    wrap.append(el('div', 'ojpp-test-label', label), control);
    return wrap;
  }

  function saveCustomTests() {
    if (!key) return;
    const list = rows
      .filter((r) => r.kind === 'custom')
      .map((r) => ({
        input: (r.row.querySelector('.ojpp-test-input') as HTMLTextAreaElement).value,
        expected: (r.row.querySelector('.ojpp-test-expected') as HTMLTextAreaElement).value,
      }));
    getSettings().editorTests[key] = list;
    persistDebounced();
  }

  // 初始：恢复自定义测试 + 载入题面样例
  const saved = key ? (settings.editorTests[key] ?? []) : [];
  saved.forEach((item, i) => addCustomRow(item, i));
  const samples = support.getSamples(document);
  samples.forEach((s, i) => addSampleRow(s, i));
  if (!rows.length) {
    tests.append(el('div', 'ojpp-editor-empty', t('editor.noSamples')));
  }

  addTestBtn.onclick = () => {
    const empty = tests.querySelector('.ojpp-editor-empty');
    empty?.remove();
    const rec = addCustomRow({ input: '', expected: '' }, rows.filter(r => r.kind === 'custom').length);
    (rec.row.querySelector('.ojpp-test-input') as HTMLTextAreaElement).focus();
    rec.row.scrollIntoView({ block: 'nearest' });
    saveCustomTests();
  };

  // 编辑时自动保存
  tests.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).matches('.ojpp-test-input, .ojpp-test-expected')) saveCustomTests();
  });

  let runningAll = false;
  runAllBtn.onclick = async () => {
    if (runningAll) return;
    runningAll = true;
    runAllBtn.disabled = true;
    const old = runAllBtn.textContent;
    runAllBtn.textContent = t('editor.running');
    try {
      // 先自定义再题面样例，串行跑避免并发判题
      for (const row of rows) {
        if (!runningAll) break;
        await runRow(row);
      }
    } finally {
      runningAll = false;
      runAllBtn.disabled = false;
      runAllBtn.textContent = old;
    }
  };

  submitBtn.onclick = async () => {
    if (!problemCode) {
      submitLine.replaceChildren(el('div', 'ojpp-editor-empty', t('editor.noProblem')));
      return;
    }
    submitBtn.disabled = true;
    const old = submitBtn.textContent;
    submitBtn.textContent = t('editor.submitting');
    try {
      const res = await support.submit(editor.getCode(), langSel.value, problemCode);
      if (res.ok) {
        if (res.url) {
          // 已提交——直接跳到状态页看判题
          window.location.href = res.url;
          return;
        }
        submitLine.prepend(el('div', 'ojpp-editor-submitok', t('editor.submitted')));
      } else {
        submitLine.prepend(el('div', 'ojpp-editor-submiterr', res.error ?? t('editor.submitFailed')));
      }
    } catch (e) {
      submitLine.prepend(el('div', 'ojpp-editor-submiterr', e instanceof Error ? e.message : String(e)));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = old;
    }
  };

  return {
    el: root,
    editor,
    dispose() {
      clearTimeout(persistTimer);
      persist();
      stopDark();
      editor.destroy();
      root.remove();
    },
  };
}
