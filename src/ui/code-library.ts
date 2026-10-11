import { t } from '../i18n/index.ts';
import type { Settings } from '../core/types.ts';
import type { EditorHandle } from '../editor/cm.ts';
import { CODE_LANGUAGES, type CodeLanguage } from '../editor/language-detection.ts';
import { codeTemplate, DEFAULT_TEMPLATES } from '../editor/code-library.ts';

export function createCodeLibrary(options: {
  editor: EditorHandle;
  getSettings(): Settings;
  persist(): void;
  language(): CodeLanguage;
  useTemplate(code: string, language: CodeLanguage): void;
}) {
  const controls = document.createElement('span');
  controls.className = 'ojpp-library-controls';
  let dialog: HTMLDialogElement | undefined;
  const button = (label: string, action: () => void, parent: HTMLElement) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.onclick = action; parent.append(b); return b;
  };
  const open = (mode: 'template' | 'snippets') => {
    dialog?.remove();
    dialog = document.createElement('dialog');
    dialog.className = 'ojpp-library';
    const heading = document.createElement('h2');
    heading.id = 'ojpp-library-title'; heading.textContent = t(mode === 'template' ? 'editor.templates' : 'editor.snippets');
    dialog.setAttribute('aria-labelledby', heading.id);
    const top = document.createElement('header'); top.append(heading);
    button(t('editor.libraryClose'), () => dialog?.close(), top);
    dialog.append(top);
    const row = document.createElement('div'); row.className = 'ojpp-library-fields'; dialog.append(row);
    const field = <T extends HTMLElement>(label: string, input: T) => {
      const node = document.createElement('label'); const text = document.createElement('span');
      text.textContent = label; input.setAttribute('aria-label', label); node.append(text, input); row.append(node); return input;
    };
    const language = field(t('editor.libraryLanguage'), document.createElement('select'));
    if (mode === 'snippets') language.add(new Option(t('editor.libraryAll'), 'all'));
    for (const key of CODE_LANGUAGES) language.add(new Option(key === 'cpp' ? 'C++' : key === 'csharp' ? 'C#' : key, key));
    language.value = options.language();
    const source = document.createElement('textarea'); source.className = 'ojpp-library-code'; source.rows = 15;
    source.spellcheck = false; source.setAttribute('aria-label', t('editor.libraryCode'));
    const hint = document.createElement('p'); hint.className = 'ojpp-library-hint';
    hint.textContent = t(mode === 'template' ? 'editor.templateHint' : 'editor.snippetHint');
    const status = document.createElement('p'); status.className = 'ojpp-library-status'; status.setAttribute('role', 'status');
    const actions = document.createElement('footer');
    const close = () => { dialog?.close(); options.editor.view.focus(); };
    if (mode === 'template') {
      const load = () => { source.value = codeTemplate(options.getSettings().editorTemplates, language.value as CodeLanguage); status.textContent = ''; };
      language.onchange = load; load();
      button(t('editor.librarySave'), () => {
        options.getSettings().editorTemplates[language.value as CodeLanguage] = source.value;
        options.persist(); status.textContent = t('editor.librarySaved');
      }, actions);
      button(t('editor.templateReset'), () => {
        delete options.getSettings().editorTemplates[language.value as CodeLanguage];
        source.value = DEFAULT_TEMPLATES[language.value as CodeLanguage]; options.persist(); status.textContent = t('editor.librarySaved');
      }, actions);
      button(t('editor.templateUse'), () => { options.useTemplate(source.value, language.value as CodeLanguage); close(); }, actions);
    } else {
      const list = field(t('editor.snippetSelect'), document.createElement('select'));
      const name = field(t('editor.snippetName'), document.createElement('input'));
      const prefix = field(t('editor.snippetPrefix'), document.createElement('input'));
      name.maxLength = 100; prefix.maxLength = 50;
      let currentId = '';
      const refresh = (id = '') => {
        list.replaceChildren(new Option(t('editor.snippetNew'), ''));
        for (const item of options.getSettings().editorSnippets) list.add(new Option(`${item.name} · ${item.language}`, item.id));
        list.value = id;
      };
      const load = () => {
        currentId = list.value;
        const item = options.getSettings().editorSnippets.find(s => s.id === currentId);
        name.value = item?.name ?? ''; prefix.value = item?.prefix ?? ''; source.value = item?.code ?? '';
        language.value = item?.language ?? options.language(); status.textContent = '';
      };
      list.onchange = load; refresh(); load();
      button(t('editor.librarySave'), () => {
        if (!name.value.trim() || !source.value.trim()) { status.textContent = t('editor.snippetRequired'); return; }
        const items = options.getSettings().editorSnippets;
        if (!currentId && items.length >= 100) { status.textContent = t('editor.snippetLimit'); return; }
        const item = { id: currentId || crypto.randomUUID(), name: name.value.trim(), prefix: prefix.value.trim(), language: language.value as CodeLanguage | 'all', code: source.value };
        const index = items.findIndex(s => s.id === item.id);
        if (index >= 0) items[index] = item; else items.push(item);
        currentId = item.id; options.persist(); refresh(item.id); status.textContent = t('editor.librarySaved');
      }, actions);
      button(t('editor.snippetDelete'), () => {
        options.getSettings().editorSnippets = options.getSettings().editorSnippets.filter(s => s.id !== currentId);
        options.persist(); refresh(); load();
      }, actions);
      button(t('editor.snippetInsert'), () => { options.editor.insertSnippet(source.value); close(); }, actions);
    }
    dialog.append(hint, source, status, actions);
    dialog.addEventListener('close', () => { dialog?.remove(); dialog = undefined; }, { once: true });
    document.body.append(dialog); dialog.showModal();
  };
  button(t('editor.templates'), () => open('template'), controls);
  button(t('editor.snippets'), () => open('snippets'), controls);
  return { el: controls, dispose() { dialog?.remove(); dialog = undefined; controls.remove(); } };
}
