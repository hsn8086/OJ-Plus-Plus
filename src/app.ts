import { APP_NAME } from './brand.ts';
import { defaultSettings, isAutoTranslateEnabled, isSiteFeatureEnabled } from './core/config.ts';
import { restorePageI18n } from './core/page-i18n.ts';
import { loadSettings, saveSettings } from './core/settings-store.ts';
import { getLocale, resolveLocale, setLocale, t } from './i18n/index.ts';
import type { Platform } from './platforms/types.ts';
import type { ContentSection, SiteAdapter } from './sites/types.ts';
import { iconButton } from './ui/buttons.ts';
import { ICON_SETTINGS } from './ui/icons.ts';
import { mountEditorPage, mountEditorPanel } from './ui/editor-panel.ts';
import { mountSection } from './ui/section.ts';
import { openSettingsPanel } from './ui/settings-panel.ts';
import { CSS, DARK_CSS } from './ui/styles.ts';
import { applyTheme, setSiteThemeEnabled, THEME_ATTR, watchInlineColors, watchSystemTheme } from './ui/theme.ts';
import { toast } from './ui/toast.ts';

/** 组合根：通用功能只接收站点与平台契约，不选择具体适配器。 */
export async function startApp(platform: Platform, site: SiteAdapter): Promise<() => void> {
  if (document.readyState === 'loading') {
    await new Promise<void>((resolve) => document.addEventListener('DOMContentLoaded', () => resolve(), { once: true }));
  }
  let settings = await loadSettings(platform.storage);
  // 语言要在任何界面文字生成之前定下来，否则会出现一帧中文再切成英文
  setLocale(resolveLocale(settings.locale));
  const feature = (key: Parameters<typeof isSiteFeatureEnabled>[2]) => isSiteFeatureEnabled(settings, site.id, key);
  setSiteThemeEnabled(feature('darkMode') && !!site.darkStyles, !site.preserveInlineColors);
  applyTheme(settings.theme);
  const style = document.createElement('style');
  style.textContent = CSS + (site.styles ?? '') + DARK_CSS;
  const siteDarkStyle = document.createElement('style');
  siteDarkStyle.dataset.ojppSiteDark = site.id;
  siteDarkStyle.textContent = feature('darkMode') ? site.darkStyles ?? '' : '';
  document.head.append(style, siteDarkStyle);
  const stopThemeWatch = watchSystemTheme(() => applyTheme(settings.theme));
  // 站点有些元素把颜色写在内联样式里（还带 !important），只能靠 JS 清掉
  const stopInlineWatch = watchInlineColors();
  let closeSettings: (() => void) | undefined;
  const settingsButton = iconButton(ICON_SETTINGS, t('app.settingsTitle', { name: APP_NAME }), 'ojpp-settings-btn');
  settingsButton.addEventListener('click', () => {
    if (closeSettings) return;
    closeSettings = openSettingsPanel({
      settings,
      localExecution: !!platform.localRunner,
      prepareProvider: platform.prepareProvider,
      request: platform.request,
      async onChange(next) {
        const updated = next ?? defaultSettings();
        await saveSettings(platform.storage, updated);
        // 保存后应用配色，并在语言真的变了时重建工具栏。
        // 面板内的即时预览已经改过 setLocale，所以对比的是实际渲染语言。
        const translationChanged = isAutoTranslateEnabled(settings, site.id) !== isAutoTranslateEnabled(updated, site.id)
          || feature('translation') !== isSiteFeatureEnabled(updated, site.id, 'translation');
        if (settings.targetLang !== updated.targetLang || feature('pageI18n') !== isSiteFeatureEnabled(updated, site.id, 'pageI18n')) {
          restorePageI18n(document);
        }
        settings = updated;
        const darkCSS = feature('darkMode') ? site.darkStyles ?? '' : '';
        if (siteDarkStyle.textContent !== darkCSS) siteDarkStyle.textContent = darkCSS;
        setSiteThemeEnabled(feature('darkMode') && !!site.darkStyles, !site.preserveInlineColors);
        setLocale(resolveLocale(updated.locale));
        applyTheme(settings.theme);
        toast(t('app.settingsSaved'));
        if (getLocale() !== renderedLocale || translationChanged) remountAll();
        else reconcileAll();
      },
      onClose() { closeSettings = undefined; },
    });
  });

  const mounted = new Map<HTMLElement, ReturnType<typeof mountSection>>();
  const identities = new WeakMap<HTMLElement, string | undefined>();
  let editorPanel: ReturnType<typeof mountEditorPanel> | undefined;
  const persist = () => void saveSettings(platform.storage, settings);
  const isDarkNow = () => document.documentElement.getAttribute(THEME_ATTR) === 'dark';
  const darkWatchers = new Set<(dark: boolean) => void>();
  const themeAttrObserver = new MutationObserver(() => {
    const dark = isDarkNow();
    for (const cb of darkWatchers) cb(dark);
  });
  themeAttrObserver.observe(document.documentElement, { attributes: true, attributeFilter: [THEME_ATTR] });
  const onDarkChange = (cb: (dark: boolean) => void) => {
    darkWatchers.add(cb);
    return () => darkWatchers.delete(cb);
  };
  const reconcileEditor = () => {
    const mount = site.editor?.editorMountPoint(document);
    const want = settings.editorEnabled && feature('editor') && !!mount && !!site.editor
      && (!site.editor.localOnly || !!platform.localRunner);
    if (!want) {
      editorPanel?.dispose();
      editorPanel = undefined;
      return;
    }
    if (editorPanel?.el.isConnected) return;
    editorPanel?.dispose();
    editorPanel = mountEditorPanel({
      platform,
      site,
      support: site.editor!,
      getSettings: () => settings,
      persist,
      isDark: isDarkNow,
      onDarkChange,
    });
    mount!.anchor.insertAdjacentElement(mount!.position, editorPanel.el);
  };
  let editorPageMount: ReturnType<typeof mountEditorPage> | undefined;
  const reconcileEditorPage = () => {
    const ep = settings.editorEnabled && feature('editor') ? site.editor?.editorPage?.(document) : null;
    if (!ep) {
      editorPageMount?.dispose();
      editorPageMount = undefined;
      return;
    }
    if (editorPageMount?.el.isConnected) {
      editorPageMount.refresh();
      return;
    }
    editorPageMount?.dispose();
    editorPageMount = mountEditorPage({
      anchor: ep.anchor,
      position: ep.position,
      hide: ep.hide,
      textarea: ep.textarea,
      langSelect: ep.langSelect,
      langMode: ep.langMode ?? ((id) => site.editor!.languages.find((l) => l.id === id)?.mode ?? 'text'),
      offToggle: ep.offToggle,
      syncBack: ep.syncBack,
      getSettings: () => settings,
      isDark: isDarkNow,
      onDarkChange,
    });
  };
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
    editorPanel?.dispose();
    editorPanel = undefined;
    editorPageMount?.dispose();
    editorPageMount = undefined;
    settingsButton.remove();
    renderedLocale = getLocale();
    reconcileAll();
  };
  const reconcile = () => {
    const sections = feature('translation') ? site.collectSections(document) : [];
    // 设置入口与题面区域是两回事：首页、状态页、日历页没有题面，
    // 但仍然要能打开设置，所以这里不再因为 sections 为空就摘掉按钮。
    if (!settingsButton.isConnected) site.mountSettingsButton(settingsButton, document);
    if (sections.length === 0) {
      for (const handle of mounted.values()) handle.dispose();
      mounted.clear();
      return;
    }
    const active = new Set(sections.map((section) => section.content));
    for (const [content, handle] of mounted) {
      if (!active.has(content) || !handle.toolbar.isConnected) {
        handle.dispose();
        mounted.delete(content);
      }
    }
    for (const section of sections) {
      if (mounted.has(section.content) && identities.get(section.content) === section.identity) continue;
      mounted.get(section.content)?.dispose();
      identities.set(section.content, section.identity);
      const handle = mountSection(section, {
        platform,
        getSettings: () => settings,
        prepareContent: (root) => site.prepareContent(root),
        extractSamples: section.pdfSamples ? () => void extractPdfSamples(section) : undefined,
      });
      mounted.set(section.content, handle);
      // 站点开关开着就把收集到的每个区都自动翻——不只是题面正文，
      // 输入、输出、说明一并翻；样例不在收集之列（会破坏复制）
      if (isAutoTranslateEnabled(settings, site.id)) {
        void handle.translate();
      }
    }
    // 自动提取样例：PDF 题面拿到样例原文后自动跑结构化提取
    if (settings.autoExtractSamples) {
      for (const section of sections) {
        if (section.pdfSamples && !pdfExtracted.has(section.content)) {
          pdfExtracted.add(section.content);
          void extractPdfSamples(section);
        }
      }
    }
  };
  /** PDF 样例：结构化提取（JSON）→ 塞进编辑器样例列表。 */
  const pdfExtracted = new Set<HTMLElement>();
  const extractPdfSamples = async (section: ContentSection) => {
    if (!section.pdfSamples) return;
    try {
      const { extractSamples } = await import('./core/samples.ts');
      // 图片模式开了就把页面图一起给——AI 看真实版式比看提取文本准得多
      const images = settings.pdfAsImages && section.images ? await section.images() : undefined;
      const samples = await extractSamples(platform.request, settings, section.pdfSamples, { images });
      if (!samples.length) { toast(t('editor.noSamplesExtracted'), 'error'); return; }
      // 提取字段是 md/latex/<br> 约定——进编辑器测试行把 <br> 换回 \n（pre 是纯文本）
      const plain = (s: string) => s.replace(/<br\s*\/?>/gi, '\n');
      editorPanel?.addSamples(samples.map(s => ({ input: plain(s.input), output: plain(s.output) })));
      toast(t('editor.samplesExtracted', { count: samples.length }), 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : String(error), 'error');
    }
  };

  const reconcileAll = () => {
    reconcile();
    reconcileEditor();
    reconcileEditorPage();
    // 自动提取样例：PDF 题面拿到样例原文后自动跑结构化提取

    // 站点界面 i18n 跟「目标语言」走：目标是中文才把站点英文换中文
    const targetZh = /中文|简体|繁体|汉语|zh|chinese/i.test(settings.targetLang);
    if (feature('pageI18n')) site.i18nPage?.(document, targetZh ? 'zh' : 'en');
  };
  reconcileAll();
  const stopObserving = site.observe(document, reconcileAll);
  return () => {
    stopObserving();
    stopThemeWatch();
    stopInlineWatch();
    themeAttrObserver.disconnect();
    closeSettings?.();
    editorPanel?.dispose();
    editorPageMount?.dispose();
    for (const handle of mounted.values()) handle.dispose();
    mounted.clear();
    settingsButton.remove();
    restorePageI18n(document);
    style.remove();
    siteDarkStyle.remove();
  };
}
