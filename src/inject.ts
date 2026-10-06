import { AiError } from './ai.ts';
import {
  ICON_CHECK,
  ICON_COPY,
  ICON_CROSS,
  ICON_MARKDOWN,
  ICON_SETTINGS,
  ICON_SPINNER,
  ICON_TRANSLATE,
} from './icons.ts';
import { htmlToMarkdown } from './markdown.ts';
import {
  collectTargets,
  isToolbarMounted,
  markToolbarMounted,
  type TranslationTarget,
} from './nowcoder.ts';
import { createResultPanel, translateMarkdown } from './translate.ts';
import type { Settings } from './types.ts';

interface RunningJob {
  controller: AbortController;
  panel: ReturnType<typeof createResultPanel>;
  button: HTMLButtonElement;
}

const jobs = new WeakMap<HTMLElement, RunningJob>();
/** 已完成的译文面板，重新翻译时先移除旧的，避免多个面板叠在一起 */
const panels = new WeakMap<HTMLElement, ReturnType<typeof createResultPanel>>();

type ButtonState = 'idle' | 'busy' | 'done' | 'error' | 'active';

function setButtonState(
  button: HTMLButtonElement,
  state: ButtonState,
  title: string,
): void {
  button.dataset.state = state;
  button.title = title;
  button.setAttribute('aria-label', title);
  button.innerHTML =
    state === 'busy'
      ? ICON_SPINNER
      : state === 'done'
        ? ICON_CHECK
        : state === 'error'
          ? ICON_CROSS
          : ICON_TRANSLATE;
  button.disabled = state === 'busy';
}

function iconButton(
  icon: string,
  title: string,
  extraClass = '',
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `ncb-icon-btn ${extraClass}`.trim();
  button.title = title;
  button.setAttribute('aria-label', title);
  button.innerHTML = icon;
  return button;
}

function buildToolbar(target: TranslationTarget, settings: Settings): HTMLElement {
  const toolbar = document.createElement('span');
  toolbar.className = 'ncb-toolbar';

  const translateBtn = iconButton(ICON_TRANSLATE, 'AI 翻译', 'ncb-translate-btn');
  const mdBtn = iconButton(ICON_MARKDOWN, 'Markdown 视图', 'ncb-md-btn');
  const copyBtn = iconButton(ICON_COPY, '复制原文', 'ncb-copy-btn');

  toolbar.append(translateBtn, mdBtn, copyBtn);

  translateBtn.addEventListener('click', () => {
    void runTranslation(target, settings, translateBtn);
  });

  mdBtn.addEventListener('click', () => {
    toggleMarkdownView(target, mdBtn);
  });

  copyBtn.addEventListener('click', () => {
    void navigator.clipboard
      ?.writeText(htmlToMarkdown(target.root))
      .then(() => flash(copyBtn, ICON_CHECK, '已复制'))
      .catch(() => flash(copyBtn, ICON_CROSS, '复制失败'));
  });

  return toolbar;
}

/** 图标按钮的短暂反馈：换图标 1.2s 后换回 */
function flash(button: HTMLButtonElement, icon: string, title: string): void {
  const previous = button.innerHTML;
  const previousTitle = button.title;
  button.innerHTML = icon;
  button.title = title;
  window.setTimeout(() => {
    button.innerHTML = previous;
    button.title = previousTitle;
  }, 1200);
}

async function runTranslation(
  target: TranslationTarget,
  settings: Settings,
  button: HTMLButtonElement,
): Promise<void> {
  const existing = jobs.get(target.root);
  if (existing) {
    existing.controller.abort();
    existing.panel.remove();
    jobs.delete(target.root);
    setButtonState(button, 'idle', 'AI 翻译');
    return;
  }

  const markdown = htmlToMarkdown(target.root);
  if (!markdown.trim()) {
    setButtonState(button, 'error', '没有可翻译的内容');
    return;
  }

  // 清掉上一次的译文，否则重复点击会叠出多个面板
  panels.get(target.root)?.remove();
  panels.delete(target.root);

  const controller = new AbortController();
  const panel = createResultPanel(target, button.parentElement as HTMLElement);
  jobs.set(target.root, { controller, panel, button });

  setButtonState(button, 'busy', '翻译中，点击中止');
  panel.setStatus('准备中…');

  try {
    const result = await translateMarkdown({
      settings,
      markdown,
      signal: controller.signal,
      onStatus: (text) => panel.setStatus(text),
      onPartial: (partial) => {
        panel.update(partial);
        panel.setStatus('接收中…');
      },
    });
    panel.finish(result);
    panels.set(target.root, panel);
    setButtonState(button, 'done', '重新翻译');
    // 几秒后回到翻译图标，避免按钮看起来像“已完成、无法再点”
    window.setTimeout(() => {
      if (button.dataset.state === 'done') setButtonState(button, 'idle', '重新翻译');
    }, 3000);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      panel.remove();
      setButtonState(button, 'idle', 'AI 翻译');
    } else {
      const message =
        error instanceof AiError
          ? error.message
          : error instanceof Error
            ? error.message
            : String(error);
      panel.setStatus(`翻译失败：${message}`, 'error');
      panels.set(target.root, panel);
      setButtonState(button, 'error', `重试：${message.slice(0, 60)}`);
    }
  } finally {
    jobs.delete(target.root);
  }
}

function toggleMarkdownView(target: TranslationTarget, button: HTMLButtonElement): void {
  const root = target.root;
  if (root.dataset.ncbMd === '1') {
    if (root.dataset.ncbMdBackup !== undefined) {
      root.innerHTML = root.dataset.ncbMdBackup;
      delete root.dataset.ncbMdBackup;
    }
    delete root.dataset.ncbMd;
    button.dataset.state = 'idle';
    button.title = 'Markdown 视图';
    button.setAttribute('aria-label', 'Markdown 视图');
    return;
  }
  root.dataset.ncbMdBackup = root.innerHTML;
  root.dataset.ncbMd = '1';
  const pre = document.createElement('pre');
  pre.className = 'ncb-md-source';
  pre.textContent = htmlToMarkdown(root);
  root.replaceChildren(pre);
  button.dataset.state = 'active';
  button.title = '返回原始内容';
  button.setAttribute('aria-label', '返回原始内容');
}

/** 给所有尚未挂载工具栏的目标注入工具栏 */
export function installToolbars(settings: Settings): void {
  for (const target of collectTargets()) {
    if (isToolbarMounted(target.mountHost)) continue;
    const toolbar = buildToolbar(target, settings);
    if (target.mountPosition === 'append') target.mountHost.append(toolbar);
    else target.mountHost.prepend(toolbar);
    markToolbarMounted(target.mountHost);
  }
}

/** 在页面右上角挂一个设置入口，不在每个标题旁边重复 */
export function installSettingsEntry(openSettings: () => void): void {
  if (document.querySelector('.ncb-settings-btn')) return;
  const button = iconButton(ICON_SETTINGS, 'NowcoderBetter 设置', 'ncb-settings-btn');
  button.addEventListener('click', openSettings);

  // 牛客顶部有 header-right，优先塞进去；没有就固定到右上角。
  // 注意 querySelector 传选择器列表会按文档顺序返回，
  // 而 .header-bar 是 .header-right 的父节点，会先命中，所以这里逐个查。
  const headerRight = document.querySelector('.header-right');
  if (headerRight) {
    const host = document.createElement('span');
    host.className = 'ncb-settings-host';
    host.append(button);
    headerRight.append(host);
    return;
  }
  const headerBar = document.querySelector('.header-bar');
  if (headerBar) {
    const host = document.createElement('span');
    host.className = 'ncb-settings-host';
    host.style.marginLeft = 'auto';
    host.append(button);
    headerBar.append(host);
    return;
  }
  button.classList.add('ncb-settings-floating');
  document.body.append(button);
}

/** 监听页面动态渲染（牛客题目区是异步插入的） */
export function startObserving(onChange: () => void): void {
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      onChange();
    }, 300);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (event) => {
    const el = event.target as HTMLElement | null;
    if (el?.closest('.more-unfold, .js-full-question, .js-small-question')) {
      schedule();
    }
  });
}
