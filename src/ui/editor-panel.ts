import { t } from '../i18n/index.ts';
import { localLanguageFor } from '../execution/languages.ts';
import type { Platform } from '../platforms/types.ts';
import type { Settings } from '../core/types.ts';
import type { SiteAdapter, SiteEditorSupport, EditorLanguage } from '../sites/types.ts';
import { createEditor, type EditorHandle } from '../editor/cm.ts';
import { languageFamily, resolveAutoLanguage } from '../editor/language-detection.ts';
import { codeTemplate } from '../editor/code-library.ts';
import { mountWorkspace } from './workspace.ts';
import { createCodeLibrary } from './code-library.ts';
import { ICON_CROSS, ICON_PLAY, ICON_PLUS, ICON_SEND, ICON_SPINNER } from './icons.ts';

export interface EditorPanelOptions {
  platform: Platform;
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
  offToggle?: HTMLInputElement;
  syncBack?(code: string): void;
  getSettings(): Settings;
  persist(): void;
  isDark(): boolean;
  onDarkChange(cb: (dark: boolean) => void): () => void;
}): { el: HTMLElement; dispose(): void; refresh(): void } {
  const host = document.createElement('div');
  host.className = 'ojpp-editor-page';
  opts.anchor.insertAdjacentElement(opts.position, host);
  if (opts.hide) opts.hide.style.display = 'none';

  const settings = opts.getSettings();
  const currentFamily = () => languageFamily({ id: opts.langSelect?.value ?? '',
    name: opts.langSelect?.selectedOptions[0]?.textContent ?? '', mode: opts.langMode(opts.langSelect?.value ?? '') });
  const editor = createEditor(host, {
    doc: opts.textarea.value,
    mode: opts.langMode(opts.langSelect?.value ?? ''),
    dark: opts.isDark(),
    fontSize: settings.editorFontSize,
    tabSize: 4,
    lspUrl: settings.editorLspUrl,
    snippets: () => opts.getSettings().editorSnippets.filter(item => item.language === 'all' || item.language === currentFamily()),
    onChange: (code) => {
      opts.textarea.value = code;
      opts.syncBack?.(code);
    },
  });
  const stopDark = opts.onDarkChange((dark) => editor.setDark(dark));
  const library = createCodeLibrary({ editor, getSettings: opts.getSettings, persist: opts.persist, language: currentFamily,
    useTemplate(code, family) {
      const option = [...opts.langSelect?.options ?? []].find(item => languageFamily({ id: item.value, name: item.textContent ?? '', mode: opts.langMode(item.value) }) === family);
      if (option && opts.langSelect) { opts.langSelect.value = option.value; opts.langSelect.dispatchEvent(new Event('change', { bubbles: true })); }
      editor.setCode(code);
    },
  });
  host.prepend(library.el);

  let lastLanguage = opts.langSelect?.value ?? '';
  const onLang = () => {
    const next = opts.langSelect?.value ?? '';
    if (next !== lastLanguage) {
      lastLanguage = next;
      editor.setMode(opts.langMode(next));
    }
  };
  opts.langSelect?.addEventListener('change', onLang);

  // 「关闭编辑器」开关：勾选 → 藏 CM6 露 textarea；不勾 → 露 CM6 继续压原生编辑器
  const applyToggle = () => {
    const off = opts.offToggle?.checked ?? false;
    host.style.display = off ? 'none' : '';
    if (!off && opts.hide) opts.hide.style.display = 'none';
  };
  opts.offToggle?.addEventListener('change', applyToggle);
  applyToggle();

  return {
    el: host,
    refresh: onLang,
    dispose() {
      library.dispose();
      stopDark();
      opts.langSelect?.removeEventListener('change', onLang);
      opts.offToggle?.removeEventListener('change', applyToggle);
      editor.destroy();
      host.remove();
      if (opts.hide) opts.hide.style.display = '';
    },
  };
}

export function mountEditorPanel(options: EditorPanelOptions) {
  const { platform, site, support, getSettings, persist, isDark, onDarkChange } = options;
  const languages = support.languages;
  const problemCode = support.problemCode(document);
  const settings = getSettings();
  const key = problemCode ? draftKey(site.id, problemCode) : null;

  const root = el('div', 'ojpp-editor');
  const head = el('div', 'ojpp-editor-head');
  const title = el('span', 'ojpp-editor-title', t('editor.title'));
  const langSel = el('select', 'ojpp-editor-lang') as HTMLSelectElement;
  const AUTO_ID = '__auto__';
  const autoOpt = new Option('auto', AUTO_ID);
  langSel.add(autoOpt);
  for (const lang of languages) {
    const opt = el('option', undefined, lang.name) as HTMLOptionElement;
    opt.value = lang.id;
    langSel.append(opt);
  }
  const savedLang = settings.editorLanguage[site.id] ?? support.initialLanguage?.(document);
  const defaultLang = languages.find((l) => l.id === savedLang) ?? languages[0];
  langSel.value = savedLang === AUTO_ID ? AUTO_ID : defaultLang.id;

  const spacer = el('span', 'ojpp-editor-spacer');
  const backend = el('select', 'ojpp-editor-backend') as HTMLSelectElement;
  if (support.runCustomTest) backend.add(new Option(t('editor.siteRun'), 'site'));
  if (platform.localRunner) backend.add(new Option(t('editor.localRun'), 'local'));
  backend.value = platform.localRunner ? (settings.editorBackend[site.id] ?? 'local') : 'site';
  if (!backend.value) backend.selectedIndex = 0;
  backend.hidden = !platform.localRunner;
  const localLimit = el('select', 'ojpp-editor-timeout') as HTMLSelectElement;
  for (const ms of [1000, 3000, 5000, 10000, 30000]) localLimit.add(new Option(`${ms / 1000}s`, String(ms)));
  localLimit.value = String(settings.localTimeoutMs);
  if (!localLimit.value) localLimit.value = '3000';
  localLimit.title = t('editor.localTimeout');
  const runtimeHint = el('div', 'ojpp-editor-runtime');
  const updateBackend = () => {
    localLimit.hidden = runtimeHint.hidden = backend.value !== 'local';
    runtimeHint.textContent = t('editor.localRuntime');
  };
  backend.onchange = () => { getSettings().editorBackend[site.id] = backend.value as 'site' | 'local'; updateBackend(); persist(); };
  localLimit.onchange = () => { getSettings().localTimeoutMs = Number(localLimit.value); persist(); };
  updateBackend();
  head.append(title, langSel, backend, localLimit, spacer);

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
  actionsBar.append(submitStatus, runAllBtn, addTestBtn);
  if (support.submit) actionsBar.append(submitBtn);

  const tests = el('div', 'ojpp-editor-tests');
  const canRun = !!support.runCustomTest || !!platform.localRunner;
  runAllBtn.hidden = addTestBtn.hidden = tests.hidden = !canRun;
  actionsBar.hidden = !canRun && !support.submit;
  root.append(head, runtimeHint, cmHost, actionsBar, tests);

  const initial = key && settings.editorCode[key] !== undefined ? settings.editorCode[key]!.code
    : support.initialCode?.(document) || codeTemplate(settings.editorTemplates, languageFamily(defaultLang));
  let currentLang = defaultLang;
  let disposed = false;
  let syncQueued = false;
  let latestCode = initial;
  const highlightMode = (language: EditorLanguage) => {
    const family = languageFamily(language);
    return family === 'java' || family === 'python' ? family : family === 'c' || family === 'cpp' ? 'cpp' : language.mode;
  };
  const editor: EditorHandle = createEditor(cmHost, {
    doc: initial,
    mode: highlightMode(defaultLang),
    dark: isDark(),
    fontSize: settings.editorFontSize,
    tabSize: 4,
    lspUrl: settings.editorLspUrl,
    snippets: () => getSettings().editorSnippets.filter(s => s.language === 'all' || s.language === languageFamily(currentLang)),
    onChange: (code) => {
      latestCode = code;
      // CodeMirror cannot dispatch a reconfiguration from inside its update listener.
      // One microtask coalesces a paste/transaction burst without adding debounce latency.
      if (!syncQueued) {
        syncQueued = true;
        queueMicrotask(() => {
          syncQueued = false;
          if (disposed) return;
          const picked = resolveLang(latestCode);
          support.syncCode?.(latestCode, picked.id);
        });
      }
      if (!key) return;
      getSettings().editorCode[key] = { code, updated: Date.now() };
      persistDebounced();
    },
  });
  const stopDark = onDarkChange((dark) => editor.setDark(dark));

  const resolveLang = (code = editor.getCode()): EditorLanguage => {
    currentLang = langSel.value === AUTO_ID ? resolveAutoLanguage(code, languages, currentLang)
      : languages.find(language => language.id === langSel.value) ?? defaultLang;
    autoOpt.textContent = `auto(${currentLang.name})`;
    editor.setMode(highlightMode(currentLang));
    return currentLang;
  };
  const resolvedLangId = () => resolveLang().id;
  const initialLang = resolveLang(initial);
  support.syncCode?.(initial, initialLang.id);

  let persistTimer: ReturnType<typeof setTimeout> | undefined;
  function persistDebounced() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => persist(), 600);
  }

  langSel.onchange = () => {
    const oldCode = editor.getCode();
    const wasStarter = !oldCode || oldCode === codeTemplate(getSettings().editorTemplates, languageFamily(currentLang));
    const lang = resolveLang();
    if (wasStarter && langSel.value !== AUTO_ID) editor.setCode(codeTemplate(getSettings().editorTemplates, languageFamily(lang)));
    support.syncCode?.(editor.getCode(), lang.id);
    getSettings().editorLanguage[site.id] = langSel.value;
    persist();
  };
  const library = createCodeLibrary({ editor, getSettings, persist, language: () => languageFamily(currentLang),
    useTemplate(code, family) {
      const language = languages.find(item => languageFamily(item) === family);
      if (language) { langSel.value = language.id; langSel.dispatchEvent(new Event('change')); }
      editor.setCode(code);
    },
  });
  head.insertBefore(library.el, spacer);

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
  const activeRuns = new Map<TestRow, AbortController>();

  const runRow = async (row: TestRow, snapshot?: { code: string; languageId: string }) => {
    if (activeRuns.has(row)) { activeRuns.get(row)!.abort(); return; }
    const controller = new AbortController();
    activeRuns.set(row, controller);
    const local = backend.value === 'local';
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
    if (runBtn) { runBtn.dataset.state = 'busy'; runBtn.innerHTML = ICON_SPINNER; runBtn.disabled = !local; runBtn.title = local ? t('common.cancel') : t('editor.running'); }
    try {
      const code = snapshot?.code ?? editor.getCode();
      const languageId = snapshot?.languageId ?? resolvedLangId();
      const language = languages.find(item => item.id === languageId)!;
      const localLanguage = localLanguageFor(language);
      if (local && !localLanguage) throw new Error(t('editor.localUnsupported'));
      const res = local && platform.localRunner
        ? await platform.localRunner.run({ code, input, language: localLanguage!, timeoutMs: Number(localLimit.value), signal: controller.signal })
        : support.runCustomTest ? await support.runCustomTest(code, languageId, input)
          : { output: '', verdict: 'ERROR', error: t('editor.localUnavailable') };
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
        // 有诊断输出时保持展开，便于阅读；stderr 不参与答案比较。
        if (accepted && !res.stderr) row.row.classList.add('collapsed');
      }
      if (res.output && res.output.trim()) {
        const out = el('pre', 'ojpp-test-out');
        out.textContent = res.output;
        row.bodyEl.append(out);
      }
      if (res.stderr) {
        const stderr = el('pre', 'ojpp-test-out ojpp-test-stderr');
        stderr.textContent = res.stderr;
        row.bodyEl.append(fieldWrap(t('editor.stderr'), stderr));
      }
      if (res.error) {
        const err = el('pre', 'ojpp-test-out error');
        err.textContent = res.error;
        row.bodyEl.append(err);
      }
      if (res.used) {
        // used 形如 "OK, 46 ms, 0 KB"——折叠态下在标题行尾部显示纯用时
        const stat = res.used.replace(/^(?:OK|[A-Z_]+),\s*/, '');
        const u = el('span', 'ojpp-test-used', stat);
        row.statusEl.after(u);
      }
    } catch (e) {
      row.statusEl.textContent = controller.signal.aborted ? t('editor.cancelled') : t('editor.runError');
      row.statusEl.className = 'ojpp-test-status error';
      row.bodyEl.append(el('pre', 'ojpp-test-out error', e instanceof Error ? e.message : String(e)));
    } finally {
      activeRuns.delete(row);
      if (runBtn) { runBtn.dataset.state = ''; runBtn.innerHTML = ICON_PLAY; runBtn.disabled = false; runBtn.title = t('editor.runOne'); }
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
    runOne.onclick = (event) => { event.stopPropagation(); void runRow(rec); };
    del.onclick = () => {
      activeRuns.get(rec)?.abort();
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
    runOne.onclick = (event) => { event.stopPropagation(); void runRow(rec); };
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
  let allCancelled = false;
  runAllBtn.onclick = async () => {
    if (runningAll) { allCancelled = true; for (const run of activeRuns.values()) run.abort(); return; }
    runningAll = true;
    allCancelled = false;
    const local = backend.value === 'local';
    runAllBtn.disabled = !local;
    backend.disabled = langSel.disabled = localLimit.disabled = true;
    runAllBtn.dataset.state = 'busy';
    runAllBtn.innerHTML = ICON_SPINNER;
    runAllBtn.title = local ? t('common.cancel') : t('editor.running');
    runAllBtn.setAttribute('aria-label', runAllBtn.title);
    try {
      // customtest 支持并发（各自独立 job id）——并发池 3 个，别打太多
      const snapshot = { code: editor.getCode(), languageId: resolvedLangId() };
      const queue = [...rows];
      await Promise.all(
        Array.from({ length: Math.min(local ? 1 : 3, queue.length) }, async () => {
          for (let row = queue.shift(); row && !allCancelled; row = queue.shift()) {
            await runRow(row, snapshot);
          }
        })
      );
    } finally {
      runningAll = false;
      backend.disabled = langSel.disabled = localLimit.disabled = false;
      runAllBtn.disabled = false;
      runAllBtn.dataset.state = '';
      runAllBtn.innerHTML = ICON_PLAY;
      runAllBtn.title = t('editor.runAll');
      runAllBtn.setAttribute('aria-label', runAllBtn.title);
    }
  };

  submitBtn.onclick = async () => {
    if (!support.submit) return;
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
      const res = await support.submit(editor.getCode(), resolvedLangId(), problemCode);
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

  let workspace: ReturnType<typeof mountWorkspace> | undefined;
  return {
    el: root,
    refreshLayout() {
      const statement = support.layoutStatement?.(document);
      if (!workspace && statement && root.isConnected && !statement.contains(root)) {
        workspace = mountWorkspace(root, statement, site, getSettings, persist, () => editor.view.requestMeasure());
      }
    },
    editor,
    /** 外部注入的样例（如 PDF 提取）——追加到样例行末尾。 */
    addSamples(items: { input: string; output: string }[]) {
      tests.querySelector('.ojpp-editor-empty')?.remove();
      const offset = rows.filter((r) => r.kind === 'sample').length;
      items.forEach((s, i) => addSampleRow(s, offset + i));
    },
    dispose() {
      disposed = true;
      workspace?.dispose();
      library.dispose();
      for (const run of activeRuns.values()) run.abort();
      allCancelled = true;
      clearTimeout(persistTimer);
      persist();
      stopDark();
      editor.destroy();
      root.remove();
    },
  };
}
