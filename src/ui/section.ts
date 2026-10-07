import { t } from '../i18n/index.ts';
import { translateMarkdown } from '../core/translate.ts';
import type { Settings } from '../core/types.ts';
import type { Platform } from '../platforms/types.ts';
import type { ContentSection, SiteAdapter } from '../sites/types.ts';
import { bindCopy, iconButton, setIcon } from './buttons.ts';
import { ICON_CHECK, ICON_COPY, ICON_CROSS, ICON_MARKDOWN, ICON_SPINNER, ICON_TRANSLATE } from './icons.ts';
import { htmlToMarkdown } from './markdown.ts';
import { createResultPanel } from './result-panel.ts';

interface SectionOptions {
  platform: Platform;
  getSettings(): Settings;
  prepareContent: SiteAdapter['prepareContent'];
}

/** 每个区域持有自己的视图与请求状态，随区域卸载一并清理。 */
export function mountSection(section: ContentSection, options: SectionOptions) {
  const { platform, getSettings, prepareContent } = options;
  const toolbar = document.createElement('span');
  toolbar.className = 'ojpp-toolbar';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', t('toolbar.group', { label: section.label }));
  const translate = iconButton(ICON_TRANSLATE, t('toolbar.translate'), 'ojpp-translate-btn');
  const markdown = iconButton(ICON_MARKDOWN, t('toolbar.markdown'), 'ojpp-md-btn');
  const copy = iconButton(ICON_COPY, t('toolbar.copyOriginal'), 'ojpp-copy-btn');
  toolbar.append(translate, markdown, copy);
  if (section.toolbar.align === 'right') {
    // 靠右对齐：追加到标题元素内部并向右浮动，
    // 这样工具栏和标题同一行，且不会改变站点自己的 DOM 结构。
    toolbar.classList.add('ojpp-toolbar-right');
    section.toolbar.anchor.append(toolbar);
  } else {
    section.toolbar.anchor.insertAdjacentElement(section.toolbar.position, toolbar);
  }

  const readMarkdown = () => htmlToMarkdown(section.content, prepareContent);
  bindCopy(copy, readMarkdown, platform.writeClipboard);
  let controller: AbortController | undefined;
  let result: ReturnType<typeof createResultPanel> | undefined;
  let source: HTMLElement | undefined;
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  const originallyHidden = section.content.hidden;

  const state = (value: string, icon: string, title: string) => {
    translate.dataset.state = value;
    setIcon(translate, icon, title);
  };
  const run = async () => {
    if (controller) {
      controller.abort();
      return;
    }
    clearTimeout(feedbackTimer);
    const text = readMarkdown();
    if (!text.trim()) {
      state('error', ICON_CROSS, t('toolbar.noContent'));
      return;
    }
    result?.remove();
    const panel = createResultPanel(platform.writeClipboard);
    result = panel;
    section.result.anchor.insertAdjacentElement(section.result.position, panel.el);
    controller = new AbortController();
    const signal = controller.signal;
    state('busy', ICON_SPINNER, t('toolbar.translating'));
    panel.begin();
    try {
      // 保存设置后，下次点击立即使用新配置；当前请求使用独立快照。
      const snapshot = structuredClone(getSettings());
      const translated = await translateMarkdown(platform.request, {
        settings: snapshot,
        markdown: text,
        signal,
        stream: platform.stream,
        streaming: snapshot.streaming,
        onStatus: panel.setStatus,
        onPartial: panel.update,
      });
      signal.throwIfAborted();
      panel.finish(translated);
      state('done', ICON_CHECK, t('toolbar.retranslate'));
      feedbackTimer = setTimeout(() => state('idle', ICON_TRANSLATE, t('toolbar.retranslate')), 3000);
    } catch (error) {
      if (signal.aborted) {
        panel.remove();
        if (!disposed) state('idle', ICON_TRANSLATE, t('toolbar.translate'));
      } else {
        const message = error instanceof Error ? error.message : String(error);
        panel.setStatus(t('toolbar.translateFailed', { message }), 'error');
        state('error', ICON_CROSS, t('toolbar.retry', { message: message.slice(0, 60) }));
      }
    } finally {
      controller = undefined;
    }
  };
  translate.addEventListener('click', () => void run());

  markdown.addEventListener('click', () => {
    if (source) {
      source.remove();
      source = undefined;
      section.content.hidden = originallyHidden;
      markdown.dataset.state = 'idle';
      setIcon(markdown, ICON_MARKDOWN, t('toolbar.markdown'));
    } else {
      source = document.createElement('pre');
      source.className = 'ojpp-md-source';
      source.textContent = readMarkdown();
      section.content.after(source);
      section.content.hidden = true;
      markdown.dataset.state = 'active';
      setIcon(markdown, ICON_MARKDOWN, t('toolbar.backToOriginal'));
    }
  });

  return {
    toolbar,
    translate: run,
    dispose() {
      disposed = true;
      controller?.abort();
      clearTimeout(feedbackTimer);
      toolbar.remove();
      result?.remove();
      source?.remove();
      section.content.hidden = originallyHidden;
    },
  };
}
