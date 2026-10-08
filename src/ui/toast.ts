let timer: ReturnType<typeof setTimeout> | undefined;
let currentToast: HTMLElement | undefined;

export function toast(message: string, kind: 'info' | 'error' | 'success' = 'info'): void {
  // 移除旧 toast（带退出动画）
  if (currentToast) {
    const old = currentToast;
    old.style.animation = 'none';
    old.style.transition = 'opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)';
    old.style.opacity = '0';
    old.style.transform = 'translateY(100%) scale(0.9)';
    setTimeout(() => old.remove(), 200);
  }
  
  clearTimeout(timer);
  
  const node = document.createElement('div');
  node.className = 'ojpp-toast';
  node.dataset.kind = kind;
  node.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  node.textContent = message;
  
  document.body.append(node);
  currentToast = node;
  
  // 自动消失时长：错误信息停留更久
  const duration = kind === 'error' ? 6000 : 3000;
  timer = setTimeout(() => {
    if (node === currentToast) {
      node.style.transition = 'opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)';
      node.style.opacity = '0';
      node.style.transform = 'translateY(100%) scale(0.9)';
      setTimeout(() => {
        node.remove();
        if (currentToast === node) currentToast = undefined;
      }, 200);
    }
  }, duration);
}
