interface NativeSnapshot { code: string; language: string; languages: { id: string; name: string }[] }
export function requestNativeEditor(doc: Document, request: { type: 'read' } | { type: 'sync'; code: string; language: string }): NativeSnapshot | undefined {
  if (!doc.body) return undefined;
  let field = doc.querySelector<HTMLTextAreaElement>('#ojpp-native-bridge');
  if (!field) {
    field = doc.createElement('textarea'); field.id = 'ojpp-native-bridge';
    field.className = 'ojpp-native-bridge'; field.hidden = true; doc.body.append(field);
  }
  field.value = JSON.stringify(request);
  try {
    field.dispatchEvent(new CustomEvent('ojpp-native-editor', { bubbles: true }));
    const result = JSON.parse(field.value);
    return Array.isArray(result.languages) ? result : undefined;
  } catch { return undefined; }
  finally { field.value = ''; }
}

/** Page-world bridge restricted to reading/synchronizing native editor state. */
export function installNativeEditorBridge(win: Window): void {
  const mark = '__ojppNativeEditorBridge';
  const state = win as Window & { [mark]?: boolean };
  if (state[mark]) return;
  state[mark] = true;
  const revisions = new WeakMap<object, number>();
  win.addEventListener('ojpp-native-editor', event => {
    const field = event.target as HTMLTextAreaElement | null;
    if (field?.tagName !== 'TEXTAREA' || field.className !== 'ojpp-native-bridge') return;
    try {
      const request = JSON.parse(field.value);
      // Luogu does not expose the editor instance publicly. Read its complete CM6
      // document (including virtualized lines); never reconstruct source from visible DOM.
      if (request.type === 'read' && /(^|\.)luogu\.com(?:\.cn)?$/.test(win.location.hostname)) {
        const content = win.document.querySelector('.ide-container .v-codemirror .cm-content, .l-card.burger .v-codemirror .cm-content') as HTMLElement & { cmTile?: any; cmView?: any };
        const view = content?.cmTile?.view ?? content?.cmView?.view;
        if (view?.state?.doc) field.value = JSON.stringify({ code: view.state.doc.toString(), language: win.localStorage.getItem('ide-language') ?? '', languages: [] });
        return;
      }
      const node = win.document.querySelector('.code-editor-box') as HTMLElement & { __vue__?: any };
      const editor = node?.__vue__?.$parent?.editor;
      if (!editor || typeof editor.valCode !== 'function') return;
      if (request.type === 'read') {
        field.value = JSON.stringify({
          code: editor.valCode(), language: String(editor.valLangue()),
          languages: editor.langList.filter((item: any) => !item.disabled).map((item: any) => ({ id: String(item.value), name: String(item.text) })),
        });
      } else if (request.type === 'sync' && typeof request.code === 'string' && request.code.length <= 2_000_000) {
        const id = String(request.language);
        if (!editor.langList.some((item: any) => String(item.value) === id && !item.disabled)) return;
        const revision = (revisions.get(editor) ?? 0) + 1;
        revisions.set(editor, revision);
        if (String(editor.valLangue()) !== id) editor.valLangue(id, true);
        // Language changes restore a site cache during Vue's flush. Apply only the
        // latest code after that flush, including a template pasted in the same turn.
        editor.$nextTick(() => {
          if (!node.isConnected || revisions.get(editor) !== revision) return;
          try { if (editor.valCode() !== request.code) editor.valCode(request.code); } catch { /* Native editor was disposed. */ }
        });
        field.value = JSON.stringify({ ok: true });
      }
    } catch { /* A site update or a malformed event must not affect the page. */ }
  });
}
