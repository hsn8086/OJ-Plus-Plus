// Narrow page-world bridge for sites whose native form reads ACE instead of the textarea.
// This bridge never handles extension messages, permissions, storage, or HTTP requests.
window.addEventListener('input', event => {
  const field = event.target;
  if (!(field instanceof HTMLTextAreaElement) || !['sourceCodeTextarea', 'plain-textarea'].includes(field.id)) return;
  const win = window as unknown as { ace?: { edit(id: string): { getValue(): string; setValue(value: string, cursor: number): void } } };
  if (!win.ace || !document.querySelector('#editor.ace_editor')) return;
  const editor = win.ace.edit('editor');
  if (editor.getValue() !== field.value) editor.setValue(field.value, -1);
});
