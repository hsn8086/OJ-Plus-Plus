let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(message: string, kind: 'info' | 'error' = 'info'): void {
  document.querySelector('.ojpp-toast')?.remove();
  clearTimeout(timer);
  const node = document.createElement('div');
  node.className = 'ojpp-toast';
  node.dataset.kind = kind;
  node.setAttribute('role', 'status');
  node.textContent = message;
  document.body.append(node);
  timer = setTimeout(() => node.remove(), kind === 'error' ? 6000 : 3000);
}
