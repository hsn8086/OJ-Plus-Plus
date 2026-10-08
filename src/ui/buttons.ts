import { t } from '../i18n/index.ts';
import { ICON_CHECK, ICON_CROSS } from './icons.ts';
import type { WriteClipboard } from '../platforms/types.ts';

export function setIcon(button: HTMLButtonElement, icon: string, title: string): void {
  button.innerHTML = icon;
  button.title = title;
  button.setAttribute('aria-label', title);
}

export function iconButton(icon: string, title: string, className = ''): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `ojpp-icon-btn ${className}`.trim();
  setIcon(button, icon, title);
  return button;
}

export function bindCopy(
  button: HTMLButtonElement,
  readText: () => string,
  writeClipboard: WriteClipboard,
): void {
  const icon = button.innerHTML;
  const title = button.title;
  let timer: ReturnType<typeof setTimeout> | undefined;
  
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    button.disabled = true;
    
    try {
      await writeClipboard(readText());
      button.dataset.state = 'done';
      setIcon(button, ICON_CHECK, t('common.copied'));
    } catch {
      button.dataset.state = 'error';
      setIcon(button, ICON_CROSS, t('common.copyFailed'));
    }
    
    timer = setTimeout(() => {
      button.dataset.state = '';
      setIcon(button, icon, title);
      button.disabled = false;
    }, 1500);
  });
}
