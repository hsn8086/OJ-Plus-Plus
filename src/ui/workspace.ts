import type { SiteAdapter } from '../sites/types.ts';
import type { Settings } from '../core/types.ts';
import { t } from '../i18n/index.ts';

export function mountWorkspace(editor: HTMLElement, statement: HTMLElement, site: SiteAdapter, settings: () => Settings, persist: () => void, measure: () => void) {
  const placeholder = document.createComment('ojpp-statement-position');
  const editorPosition = document.createComment('ojpp-editor-position');
  statement.before(placeholder);
  editor.before(editorPosition);
  const workspace = document.createElement('div');
  workspace.className = 'ojpp-workspace'; workspace.dataset.site = site.id; workspace.dataset.ojppSiteContent = '1';
  placeholder.after(workspace);
  const reader = document.createElement('div'); reader.className = 'ojpp-workspace-statement'; reader.dataset.ojppSiteContent = '1';
  reader.append(statement); workspace.append(reader, editor);
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'ojpp-layout-toggle';
  const apply = () => {
    const split = (settings().editorLayout[site.id] ?? 'split') === 'split';
    workspace.dataset.layout = split ? 'split' : 'stacked';
    button.textContent = t(split ? 'editor.layoutStacked' : 'editor.layoutSplit');
    button.setAttribute('aria-pressed', String(split));
    measure();
  };
  button.onclick = () => {
    settings().editorLayout[site.id] = workspace.dataset.layout === 'split' ? 'stacked' : 'split';
    persist(); apply();
  };
  editor.querySelector('.ojpp-editor-head')?.append(button);
  apply();
  return {
    refresh: apply,
    dispose() {
      const currentContents = [...reader.childNodes];
      if (placeholder.isConnected) placeholder.replaceWith(...currentContents);
      for (const node of currentContents) {
        if (node instanceof HTMLElement && node.isConnected && node.dataset.ojppLayoutGroup) node.replaceWith(...node.childNodes);
      }
      if (editorPosition.isConnected) editorPosition.replaceWith(editor);
      button.remove(); workspace.remove();
    },
  };
}
