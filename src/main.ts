import { addStyle, getValue, isUserscriptEnv, setValue } from './gm.ts';
import { SETTINGS_KEY, defaultSettings, migrate } from './config.ts';
import { isProblemPage } from './nowcoder.ts';
import { openSettingsPanel } from './settings-panel.ts';
import { installSettingsEntry, installToolbars, startObserving } from './inject.ts';
import { CSS } from './styles.ts';
import type { Settings } from './types.ts';

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

function autoTranslate(): void {
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.subject-question').forEach((root) => {
      const title = document.querySelector('.subject-item-title');
      title
        ?.querySelector<HTMLButtonElement>('.ncb-translate-btn')
        ?.click();
      void root;
    });
  }, 500);
}

function bootstrap(): void {
  currentSettings = loadSettings();
  addStyle(CSS);

  if (isProblemPage()) {
    installToolbars(currentSettings);
    startObserving(() => installToolbars(currentSettings));
    if (currentSettings.autoTranslate) autoTranslate();
  }

  installSettingsEntry(openPanel);

  if (!isUserscriptEnv) {
    toast('未检测到脚本管理器，请求会走 fetch 并受同源策略限制', 'error');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
