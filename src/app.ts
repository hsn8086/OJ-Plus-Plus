import { APP_NAME } from './brand.ts';
import { defaultSettings } from './core/config.ts';
import { loadSettings, saveSettings } from './core/settings-store.ts';
import { getLocale, resolveLocale, setLocale, t } from './i18n/index.ts';
import type { Platform } from './platforms/types.ts';
import type { SiteAdapter } from './sites/types.ts';
import { iconButton } from './ui/buttons.ts';
import { ICON_SETTINGS } from './ui/icons.ts';
import { mountSection } from './ui/section.ts';
import { openSettingsPanel } from './ui/settings-panel.ts';
import { CSS, DARK_CSS } from './ui/styles.ts';
import { applyTheme, watchSystemTheme } from './ui/theme.ts';
import { toast } from './ui/toast.ts';

/** 组合根：通用功能只接收站点与平台契约，不选择具体适配器。 */
export async function startApp(platform: Platform, site: SiteAdapter): Promise<() => void> {
  if (document.readyState === 'loading') {
    await new Promise<void>((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }));
  }
  let settings = await loadSettings(platform.storage);
  // 语言要在任何界面文字生成之前定下来，否则会出现一帧中文再切成英文
  setLocale(resolveLocale(settings.locale));
  applyTheme(settings.theme);
  const style = document.createElement('style');
  // 暗色样式只在站点提供了 darkStyles 时才注入，避免出现半套暗色
  style.textContent = CSS + (site.styles ?? '') + DARK_CSS + (site.darkStyles ?? '');
  document.head.append(style);
  const stopThemeWatch = watchSystemTheme(() => applyTheme(settings.theme));
  let closeSettings: (() => void) | undefined;
  const settingsButton = iconButton(ICON_SETTINGS, t('app.settingsTitle', { name: APP_NAME }), 'ojpp-settings-btn');
  settingsButton.addEventListener('click', () => {
    if (closeSettings) return;
    closeSettings = openSettingsPanel({
      settings,
      request: platform.request,
      async onChange(next) {
        const updated = next ?? defaultSettings();
        await saveSettings(platform.storage, updated);
        // 保存后应用配色，并在语言真的变了时重建工具栏。
        // 面板内的即时预览已经改过 setLocale，所以对比的是实际渲染语言。
        settings = updated;
        setLocale(resolveLocale(updated.locale));
        applyTheme(settings.theme);
        toast(t('app.settingsSaved'));
        if (getLocale() !== renderedLocale) remountAll();
      },
      onClose() { closeSettings = undefined; },
    });
  });

  const mounted = new Map<HTMLElement, ReturnType<typeof mountSection>>();
  /**
   * 当前工具栏是用哪个语言建的。
   *
   * 不能用“保存前后的语言差异”来判断：设置面板为了即时预览，
   * 会在切换下拉框时就调用 setLocale，等到保存时两边已经相等，
   * 结果工具栏停在旧语言。所以记录一个实际渲染用的语言来对比。
   */
  let renderedLocale = getLocale();
  const remountAll = () => {
    for (const handle of mounted.values()) handle.dispose();
    mounted.clear();
    settingsButton.remove();
    renderedLocale = getLocale();
    reconcile();
  };
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
    stopThemeWatch();
    closeSettings?.();
    for (const handle of mounted.values()) handle.dispose();
    mounted.clear();
    settingsButton.remove();
    style.remove();
  };
}
