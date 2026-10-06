import { AiError } from './ai';
import { htmlToMarkdown } from './markdown';
import {
  collectTargets,
  isToolbarMounted,
  markToolbarMounted,
  type TranslationTarget,
} from './nowcoder';
import { createResultPanel, translateMarkdown } from './translate';
import type { Settings } from './types';

interface RunningJob {
  controller: AbortController;
  panel: ReturnType<typeof createResultPanel>;
  button: HTMLButtonElement;
}

const jobs = new WeakMap<HTMLElement, RunningJob>();

function buildToolbar(
  target: TranslationTarget,
  settings: Settings,
  onStateChange: () => void,
): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.className = 'ncb-toolbar';

  const translateBtn = document.createElement('button');
  translateBtn.type = 'button';
  translateBtn.className = 'ncb-btn ncb-btn-primary ncb-translate-btn';
  translateBtn.textContent = 'AI 翻译';

  const mdBtn = document.createElement('button');
  mdBtn.type = 'button';
  mdBtn.className = 'ncb-btn ncb-md-btn';
  mdBtn.textContent = 'Markdown 视图';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'ncb-btn ncb-copy-btn';
  copyBtn.textContent = '复制原文';

  const settingsBtn = document.createElement('button');
  settingsBtn.type = 'button';
  settingsBtn.className = 'ncb-btn ncb-btn-ghost ncb-settings-btn';
  settingsBtn.textContent = '设置';

  toolbar.append(translateBtn, mdBtn, copyBtn, settingsBtn);

  translateBtn.addEventListener('click', () => {
    void runTranslation(target, settings, translateBtn, onStateChange);
  });

  mdBtn.addEventListener('click', () => {
    toggleMarkdownView(target, mdBtn);
  });

  copyBtn.addEventListener('click', async () => {
    const markdown = htmlToMarkdown(target.root);
    try {
      await navigator.clipboard.writeText(markdown);
      copyBtn.textContent = '已复制';
    } catch {
      copyBtn.textContent = '复制失败';
    }
    window.setTimeout(() => (copyBtn.textContent = '复制原文'), 1500);
  });

  settingsBtn.addEventListener('click', () => {
    document.querySelector<HTMLButtonElement>('.ncb-fab')?.click();
  });

  return toolbar;
}

async function runTranslation(
  target: TranslationTarget,
  settings: Settings,
  button: HTMLButtonElement,
  onStateChange: () => void,
): Promise<void> {
  const existing = jobs.get(target.root);
  if (existing) {
    existing.controller.abort();
    existing.panel.remove();
    jobs.delete(target.root);
    button.textContent = 'AI 翻译';
    button.disabled = false;
    return;
  }

  const markdown = htmlToMarkdown(target.root);
  if (!markdown.trim()) {
    button.textContent = '无内容';
    return;
  }

  const controller = new AbortController();
  const panel = createResultPanel(target.placement, target.anchor);
  jobs.set(target.root, { controller, panel, button });

  button.disabled = true;
  button.textContent = '翻译中…';
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
    button.textContent = '重新翻译';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      panel.remove();
      button.textContent = 'AI 翻译';
    } else {
      const message =
        error instanceof AiError
          ? error.message
          : error instanceof Error
            ? error.message
            : String(error);
      panel.setStatus(`翻译失败：${message}`, 'error');
      button.textContent = '重试';
    }
  } finally {
    button.disabled = false;
    jobs.delete(target.root);
    onStateChange();
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
    button.textContent = 'Markdown 视图';
    return;
  }
  root.dataset.ncbMdBackup = root.innerHTML;
  root.dataset.ncbMd = '1';
  const pre = document.createElement('pre');
  pre.className = 'ncb-md-source';
  pre.textContent = htmlToMarkdown(root);
  root.replaceChildren(pre);
  button.textContent = '原始内容';
}

/** 给所有尚未挂载工具栏的目标注入工具栏 */
export function installToolbars(settings: Settings): void {
  for (const target of collectTargets()) {
    if (isToolbarMounted(target.anchor)) continue;
    const toolbar = buildToolbar(target, settings, () => {
      /* state change hook */
    });
    if (target.placement === 'before') {
      target.anchor.insertAdjacentElement('beforebegin', toolbar);
    } else if (target.placement === 'after') {
      target.anchor.insertAdjacentElement('afterend', toolbar);
    } else {
      target.anchor.prepend(toolbar);
    }
    markToolbarMounted(target.anchor);
  }
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
