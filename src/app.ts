import { APP_NAME } from './brand.ts';
import { defaultSettings } from './core/config.ts';
import { loadSettings, saveSettings } from './core/settings-store.ts';
import type { Platform } from './platforms/types.ts';
import type { SiteAdapter } from './sites/types.ts';
import { iconButton } from './ui/buttons.ts';
import { ICON_SETTINGS } from './ui/icons.ts';
import { mountSection } from './ui/section.ts';
import { openSettingsPanel } from './ui/settings-panel.ts';
import { CSS } from './ui/styles.ts';
import { toast } from './ui/toast.ts';

/** 组合根：通用功能只接收站点与平台契约，不选择具体适配器。 */
export async function startApp(platform: Platform, site: SiteAdapter): Promise<() => void> {
  if (document.readyState === 'loading') {
    await new Promise<void>((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }));
  }
  let settings = await loadSettings(platform.storage);
  const style = document.createElement('style');
  style.textContent = CSS + (site.styles ?? '');
  document.head.append(style);
  let closeSettings: (() => void) | undefined;
  const settingsButton = iconButton(ICON_SETTINGS, `${APP_NAME} 设置`, 'ojpp-settings-btn');
  settingsButton.addEventListener('click', () => {
    if (closeSettings) return;
    closeSettings = openSettingsPanel({
      settings,
      request: platform.request,
      async onChange(next) {
        const updated = next ?? defaultSettings();
        await saveSettings(platform.storage, updated);
        settings = updated;
        toast('设置已保存');
      },
      onClose() { closeSettings = undefined; },
    });
  });

  const mounted = new Map<HTMLElement, ReturnType<typeof mountSection>>();
  const reconcile = () => {
    const sections = site.collectSections(document);
    if (sections.length === 0) {
      closeSettings?.();
      settingsButton.remove();
      for (const handle of mounted.values()) handle.dispose();
      mounted.clear();
      return;
    }
    if (!settingsButton.isConnected) site.mountSettingsButton(settingsButton, document);
    const active = new Set(sections.map((section) => section.content));
    for (const [content, handle] of mounted) {
      if (!active.has(content) || !handle.toolbar.isConnected) {
        handle.dispose();
        mounted.delete(content);
      }
    }
    for (const section of sections) {
      if (mounted.has(section.content)) continue;
      const handle = mountSection(section, {
        platform,
        getSettings: () => settings,
        prepareContent: (root) => site.prepareContent(root),
      });
      mounted.set(section.content, handle);
      if (settings.autoTranslate && section.kind === 'statement') void handle.translate();
    }
  };
  reconcile();
  const stopObserving = site.observe(document, reconcile);
  return () => {
    stopObserving();
    closeSettings?.();
    for (const handle of mounted.values()) handle.dispose();
    mounted.clear();
    settingsButton.remove();
    style.remove();
  };
}
