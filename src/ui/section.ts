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
  toolbar.setAttribute('aria-label', `${section.label}工具栏`);
  const translate = iconButton(ICON_TRANSLATE, 'AI 翻译', 'ojpp-translate-btn');
  const markdown = iconButton(ICON_MARKDOWN, 'Markdown 视图', 'ojpp-md-btn');
  const copy = iconButton(ICON_COPY, '复制原文', 'ojpp-copy-btn');
  toolbar.append(translate, markdown, copy);
  section.toolbar.anchor.insertAdjacentElement(section.toolbar.position, toolbar);

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
      state('error', ICON_CROSS, '没有可翻译的内容');
      return;
    }
    result?.remove();
    const panel = createResultPanel(platform.writeClipboard);
    result = panel;
    section.result.anchor.insertAdjacentElement(section.result.position, panel.el);
    controller = new AbortController();
    const signal = controller.signal;
    state('busy', ICON_SPINNER, '翻译中，点击中止');
    try {
      // 保存设置后，下次点击立即使用新配置；当前请求使用独立快照。
      const translated = await translateMarkdown(platform.request, {
        settings: structuredClone(getSettings()),
        markdown: text,
        signal,
        onStatus: panel.setStatus,
        onPartial: panel.update,
      });
      signal.throwIfAborted();
      panel.finish(translated);
      state('done', ICON_CHECK, '重新翻译');
      feedbackTimer = setTimeout(() => state('idle', ICON_TRANSLATE, '重新翻译'), 3000);
    } catch (error) {
      if (signal.aborted) {
        panel.remove();
        if (!disposed) state('idle', ICON_TRANSLATE, 'AI 翻译');
      } else {
        const message = error instanceof Error ? error.message : String(error);
        panel.setStatus(`翻译失败：${message}`, 'error');
        state('error', ICON_CROSS, `重试：${message.slice(0, 60)}`);
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
      setIcon(markdown, ICON_MARKDOWN, 'Markdown 视图');
    } else {
      source = document.createElement('pre');
      source.className = 'ojpp-md-source';
      source.textContent = readMarkdown();
      section.content.after(source);
      section.content.hidden = true;
      markdown.dataset.state = 'active';
      setIcon(markdown, ICON_MARKDOWN, '返回原始内容');
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
