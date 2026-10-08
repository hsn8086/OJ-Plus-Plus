import { t } from '../i18n/index.ts';
import type { Settings } from '../core/types.ts';
import type { SiteAdapter, SiteEditorSupport } from '../sites/types.ts';
import { createEditor, type EditorHandle } from '../editor/cm.ts';

export interface EditorPanelOptions {
  site: SiteAdapter;
  support: SiteEditorSupport;
  getSettings(): Settings;
  /** 设置有改动时持久化（language/code 草稿） */
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
  const runBtn = el('button', 'ojpp-btn ojpp-btn-sm', t('editor.run')) as HTMLButtonElement;
  const customBtn = el('button', 'ojpp-btn ojpp-btn-sm', t('editor.custom')) as HTMLButtonElement;
  const submitBtn = el('button', 'ojpp-btn ojpp-btn-sm ojpp-btn-primary', t('editor.submit')) as HTMLButtonElement;
  head.append(title, langSel, spacer, runBtn, customBtn, submitBtn);

  const cmHost = el('div', 'ojpp-editor-cm');
  const customArea = el('div', 'ojpp-editor-custom');
  customArea.hidden = true;
  const customInput = el('textarea', 'ojpp-editor-input') as HTMLTextAreaElement;
  customInput.placeholder = t('editor.customPlaceholder');
  const customRun = el('button', 'ojpp-btn ojpp-btn-sm', t('editor.runOne')) as HTMLButtonElement;
  customArea.append(customInput, customRun);

  const results = el('div', 'ojpp-editor-results');
  root.append(head, cmHost, customArea, results);

  const initial = problemCode ? (settings.editorCode[draftKey(site.id, problemCode)]?.code ?? '') : '';
  const editor: EditorHandle = createEditor(cmHost, {
    doc: initial,
    mode: defaultLang.mode,
    dark: isDark(),
    fontSize: settings.editorFontSize,
    tabSize: 4,
    lspUrl: settings.editorLspUrl,
    onChange: (code) => {
      if (!problemCode) return;
      const s = getSettings();
      s.editorCode[draftKey(site.id, problemCode)] = { code, updated: Date.now() };
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

  let busy = false;
  const run = async (input: string, label: string, expected?: string) => {
    if (busy) return;
    busy = true;
    const row = el('div', 'ojpp-editor-result');
    const headRow = el('div', 'ojpp-editor-result-head');
    const name = el('span', 'ojpp-editor-result-name', label);
    const status = el('span', 'ojpp-editor-result-status', t('editor.running'));
    headRow.append(name, status);
    row.append(headRow);
    results.append(row);
    row.scrollIntoView({ block: 'nearest' });
    try {
      const res = await support.runCustomTest(editor.getCode(), langSel.value, input);
      row.classList.add('done');
      if (res.error) {
        status.textContent = t('editor.runError');
        status.classList.add('error');
      } else if (expected !== undefined) {
        const ok = res.output.trim() === expected.trim();
        status.textContent = ok ? t('editor.match') : t('editor.mismatch');
        status.classList.add(ok ? 'ok' : 'warn');
      } else {
        status.textContent = res.used ?? t('editor.done');
        status.classList.add('ok');
      }
      const body = el('div', 'ojpp-editor-result-body');
      if (res.output) {
        const out = el('pre', 'ojpp-editor-out');
        out.textContent = res.output;
        body.append(out);
      }
      if (res.error) {
        const err = el('pre', 'ojpp-editor-out error');
        err.textContent = res.error;
        body.append(err);
      }
      if (expected !== undefined && expected.trim()) {
        const exp = el('pre', 'ojpp-editor-out expected');
        exp.textContent = `${t('editor.expected')}:\n${expected}`;
        body.append(exp);
      }
      if (res.used && expected === undefined) {
        // used 已在 status 里
      } else if (res.used) {
        const u = el('div', 'ojpp-editor-used', res.used);
        body.append(u);
      }
      if (body.childElementCount) row.append(body);
    } catch (e) {
      status.textContent = t('editor.runError');
      status.classList.add('error');
      const err = el('pre', 'ojpp-editor-out error', e instanceof Error ? e.message : String(e));
      row.append(err);
    } finally {
      busy = false;
    }
  };

  runBtn.onclick = () => {
    const samples = support.getSamples(document);
    results.replaceChildren();
    if (!samples.length) {
      results.append(el('div', 'ojpp-editor-empty', t('editor.noSamples')));
      return;
    }
    samples.forEach((s, i) => {
      void run(s.input, `${t('editor.sample')} ${i + 1}`, s.output);
    });
  };

  customBtn.onclick = () => {
    customArea.hidden = !customArea.hidden;
    if (!customArea.hidden) customInput.focus();
  };
  customRun.onclick = () => {
    results.replaceChildren();
    void run(customInput.value, t('editor.customRun'));
  };

  submitBtn.onclick = async () => {
    if (busy) return;
    if (!problemCode) {
      results.replaceChildren(el('div', 'ojpp-editor-empty', t('editor.noProblem')));
      return;
    }
    busy = true;
    submitBtn.disabled = true;
    const old = submitBtn.textContent;
    submitBtn.textContent = t('editor.submitting');
    try {
      const res = await support.submit(editor.getCode(), langSel.value, problemCode);
      const row = el('div', res.ok ? 'ojpp-editor-submitok' : 'ojpp-editor-submiterr');
      if (res.ok && res.url) {
        const a = el('a', undefined, t('editor.submitted')) as HTMLAnchorElement;
        a.href = res.url;
        a.target = '_blank';
        row.append(a);
      } else {
        row.textContent = res.error ?? t('editor.submitFailed');
      }
      results.prepend(row);
    } catch (e) {
      results.prepend(el('div', 'ojpp-editor-submiterr', e instanceof Error ? e.message : String(e)));
    } finally {
      busy = false;
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
