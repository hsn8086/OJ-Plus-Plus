import { addStyle, getValue, setValue } from './gm';
import { SETTINGS_KEY, defaultSettings, migrate } from './config';
import { isProblemPage } from './nowcoder';
import { openSettingsPanel } from './settings-panel';
import { installToolbars, startObserving } from './inject';
import { CSS } from './styles';
import type { Settings } from './types';

let currentSettings: Settings;

export function loadSettings(): Settings {
  return migrate(getValue<unknown>(SETTINGS_KEY, null));
}

export function saveSettings(settings: Settings): void {
  setValue(SETTINGS_KEY, settings);
}

let toastTimer: number | undefined;

export function toast(message: string, kind: 'info' | 'error' = 'info'): void {
  document.querySelector('.ncb-toast')?.remove();
  const node = document.createElement('div');
  node.className = 'ncb-toast';
  node.dataset.kind = kind;
  node.textContent = message;
  document.body.append(node);
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => node.remove(), kind === 'error' ? 6000 : 3000);
}

function openPanel(): void {
  openSettingsPanel({
    settings: currentSettings,
    onChange(next) {
      currentSettings = next ?? defaultSettings();
      saveSettings(currentSettings);
      toast('设置已保存，刷新页面后部分选项生效');
    },
    onClose() {
      /* noop */
    },
  });
}

function mountFloatingEntry(): void {
  if (document.querySelector('.ncb-fab')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ncb-fab';
  button.textContent = 'NCB';
  button.title = 'NowcoderBetter 设置';
  button.addEventListener('click', openPanel);
  document.body.append(button);
}

function autoTranslate(): void {
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.subject-question').forEach((root) => {
      const toolbar = root.previousElementSibling;
      if (!toolbar?.classList.contains('ncb-toolbar')) return;
      toolbar.querySelector<HTMLButtonElement>('.ncb-translate-btn')?.click();
    });
  }, 500);
}

function bootstrap(): void {
  currentSettings = loadSettings();
  addStyle(CSS);
  mountFloatingEntry();

  if (isProblemPage()) {
    installToolbars(currentSettings);
    startObserving(() => installToolbars(currentSettings));
    if (currentSettings.autoTranslate) autoTranslate();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
