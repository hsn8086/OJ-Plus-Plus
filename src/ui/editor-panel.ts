import { t } from '../i18n/index.ts';
import type { Settings } from '../core/types.ts';
import type { SiteAdapter, SiteEditorSupport } from '../sites/types.ts';
import { createEditor, type EditorHandle } from '../editor/cm.ts';
import { ICON_CROSS, ICON_PLAY, ICON_PLUS, ICON_SEND, ICON_SPINNER } from './icons.ts';

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

/**
 * 站点提交/测试页的独立 CM6 接管（无面板）：
 * 隐藏站点原生编辑器（ACE），在同一位置放 CM6，
 * 内容同步进真正提交的 textarea + syncBack（如 ACE 实例）。
 */
export function mountEditorPage(opts: {
  anchor: HTMLElement;
  position: InsertPosition;
  hide?: HTMLElement;
  textarea: HTMLTextAreaElement;
  langSelect?: HTMLSelectElement;
  langMode(id: string): 'cpp' | 'java' | 'python' | 'text';
  syncBack?(code: string): void;
  getSettings(): Settings;
  isDark(): boolean;
  onDarkChange(cb: (dark: boolean) => void): () => void;
}): { el: HTMLElement; dispose(): void } {
  const host = document.createElement('div');
  host.className = 'ojpp-editor-page';
  opts.anchor.insertAdjacentElement(opts.position, host);
  if (opts.hide) opts.hide.style.display = 'none';

  const settings = opts.getSettings();
  const editor = createEditor(host, {
    doc: opts.textarea.value,
    mode: opts.langMode(opts.langSelect?.value ?? ''),
    dark: opts.isDark(),
    fontSize: settings.editorFontSize,
    tabSize: 4,
    lspUrl: settings.editorLspUrl,
    onChange: (code) => {
      opts.textarea.value = code;
      opts.syncBack?.(code);
    },
  });
  const stopDark = opts.onDarkChange((dark) => editor.setDark(dark));

  const onLang = () => {
    if (opts.langSelect) editor.setMode(opts.langMode(opts.langSelect.value));
  };
  opts.langSelect?.addEventListener('change', onLang);

  return {
    el: host,
    dispose() {
      stopDark();
      opts.langSelect?.removeEventListener('change', onLang);
      editor.destroy();
      host.remove();
      if (opts.hide) opts.hide.style.display = '';
    },
  };
}

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
  head.append(title, langSel, spacer);

  const cmHost = el('div', 'ojpp-editor-cm');

  // 动作条：代码框和样例列表之间；左侧状态文本，右侧图标
  const actionsBar = el('div', 'ojpp-editor-actions');
  const submitStatus = el('span', 'ojpp-editor-status');
  const runAllBtn = el('button', 'ojpp-icon-btn ojpp-editor-act') as HTMLButtonElement;
  runAllBtn.innerHTML = ICON_PLAY;
  runAllBtn.title = t('editor.runAll');
  runAllBtn.setAttribute('aria-label', t('editor.runAll'));
  const addTestBtn = el('button', 'ojpp-icon-btn ojpp-editor-act') as HTMLButtonElement;
  addTestBtn.innerHTML = ICON_PLUS;
  addTestBtn.title = t('editor.addTest');
  addTestBtn.setAttribute('aria-label', t('editor.addTest'));
  const submitBtn = el('button', 'ojpp-icon-btn ojpp-editor-act ojpp-editor-submit') as HTMLButtonElement;
  submitBtn.innerHTML = ICON_SEND;
  submitBtn.title = t('editor.submit');
  submitBtn.setAttribute('aria-label', t('editor.submit'));
  actionsBar.append(submitStatus, runAllBtn, addTestBtn, submitBtn);

  const tests = el('div', 'ojpp-editor-tests');
  root.append(head, cmHost, actionsBar, tests);

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
    for (const u of row.row.querySelectorAll('.ojpp-test-used')) u.remove();
    row.row.classList.remove('collapsed');
    const runBtn = row.row.querySelector<HTMLButtonElement>('.ojpp-test-run');
    if (runBtn) { runBtn.dataset.state = 'busy'; runBtn.innerHTML = ICON_SPINNER; }
    try {
      const res = await support.runCustomTest(editor.getCode(), langSel.value, input);
      if (res.error) {
        row.statusEl.textContent = res.verdict ?? t('editor.runError');
        row.statusEl.className = 'ojpp-test-status error';
      } else {
        const ok = res.output.trim() === expected.trim();
        const accepted = ok && (!res.verdict || res.verdict === 'OK');
        row.statusEl.textContent = res.verdict && res.verdict !== 'OK'
          ? res.verdict
          : ok
            ? t('editor.accepted')
            : t('editor.wrongAnswer');
        row.statusEl.className = `ojpp-test-status ${accepted ? 'ok' : 'warn'}`;
        // 只有 Accepted 才折叠成一行；WA/出错保持展开看输出
        if (accepted) row.row.classList.add('collapsed');
      }
      if (res.output && res.output.trim()) {
        const out = el('pre', 'ojpp-test-out');
        out.textContent = res.output;
        row.bodyEl.append(out);
      }
      if (res.error) {
        const err = el('pre', 'ojpp-test-out error');
        err.textContent = res.error;
        row.bodyEl.append(err);
      }
      if (res.used) {
        // used 形如 "OK, 46 ms, 0 KB"——折叠态下在标题行尾部显示纯用时
        const stat = res.used.replace(/^[^,]+,\s*/, '');
        const u = el('span', 'ojpp-test-used', stat);
        row.statusEl.after(u);
      }
    } catch (e) {
      row.statusEl.textContent = t('editor.runError');
      row.statusEl.className = 'ojpp-test-status error';
      row.bodyEl.append(el('pre', 'ojpp-test-out error', e instanceof Error ? e.message : String(e)));
    } finally {
      if (runBtn) { runBtn.dataset.state = ''; runBtn.innerHTML = ICON_PLAY; }
    }
  };

  function addCustomRow(item: { input: string; expected: string }, customIndex: number) {
    const row = el('div', 'ojpp-test ojpp-test-custom');
    const headRow = el('div', 'ojpp-test-head');
    const name = el('span', 'ojpp-test-name', `${t('editor.customN')} ${customIndex + 1}`);
    const status = el('span', 'ojpp-test-status');
    const actions = el('span', 'ojpp-test-actions');
    const runOne = el('button', 'ojpp-icon-btn ojpp-test-run') as HTMLButtonElement;
    runOne.innerHTML = ICON_PLAY;
    runOne.title = t('editor.runOne');
    const del = el('button', 'ojpp-icon-btn ojpp-test-del') as HTMLButtonElement;
    del.innerHTML = ICON_CROSS;
    del.title = t('editor.delete');
    actions.append(del, runOne);
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
    // 折叠态点击标题重新展开
    headRow.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      row.classList.toggle('collapsed');
    });
    // 自定义行排在样例行上面——DOM 和 rows 数组都插到首个样例前
    const firstSample = tests.querySelector('.ojpp-test-sample');
    const emptyNote = tests.querySelector('.ojpp-editor-empty');
    emptyNote?.remove();
    if (firstSample) tests.insertBefore(row, firstSample);
    else tests.append(row);
    const sampleIdx = rows.findIndex((r) => r.kind === 'sample');
    if (sampleIdx === -1) rows.push(rec);
    else rows.splice(sampleIdx, 0, rec);
    return rec;
  }

  function addSampleRow(sample: { input: string; output: string }, index: number) {
    const row = el('div', 'ojpp-test ojpp-test-sample');
    const headRow = el('div', 'ojpp-test-head');
    const name = el('span', 'ojpp-test-name', `${t('editor.sample')} ${index + 1}`);
    const status = el('span', 'ojpp-test-status');
    const actions = el('span', 'ojpp-test-actions');
    const runOne = el('button', 'ojpp-icon-btn ojpp-test-run') as HTMLButtonElement;
    runOne.innerHTML = ICON_PLAY;
    runOne.title = t('editor.runOne');
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
    headRow.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      row.classList.toggle('collapsed');
    });
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
    runAllBtn.dataset.state = 'busy';
    runAllBtn.innerHTML = ICON_SPINNER;
    try {
      // customtest 支持并发（各自独立 job id）——并发池 3 个，别打太多
      const queue = [...rows];
      await Promise.all(
        Array.from({ length: Math.min(3, queue.length) }, async () => {
          for (let row = queue.shift(); row; row = queue.shift()) {
            await runRow(row);
          }
        })
      );
    } finally {
      runningAll = false;
      runAllBtn.disabled = false;
      runAllBtn.dataset.state = '';
      runAllBtn.innerHTML = ICON_PLAY;
    }
  };

  submitBtn.onclick = async () => {
    if (!problemCode) {
      submitStatus.textContent = t('editor.noProblem');
      submitStatus.className = 'ojpp-editor-status err';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.dataset.state = 'busy';
    submitBtn.innerHTML = ICON_SPINNER;
    submitStatus.textContent = t('editor.submitting');
    submitStatus.className = 'ojpp-editor-status busy';
    try {
      const res = await support.submit(editor.getCode(), langSel.value, problemCode);
      if (res.ok) {
        if (res.url) {
          // 已提交——直接跳到状态页看判题
          window.location.href = res.url;
          return;
        }
        submitStatus.textContent = t('editor.submitted');
        submitStatus.className = 'ojpp-editor-status ok';
      } else {
        submitStatus.textContent = res.error ?? t('editor.submitFailed');
        submitStatus.className = 'ojpp-editor-status err';
      }
    } catch (e) {
      submitStatus.textContent = e instanceof Error ? e.message : String(e);
      submitStatus.className = 'ojpp-editor-status err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.dataset.state = '';
      submitBtn.innerHTML = ICON_SEND;
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
