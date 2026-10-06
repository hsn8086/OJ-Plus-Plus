import { ask } from './ai.ts';
import {
  ICON_CHECK,
  ICON_CHEVRON,
  ICON_CHEVRON_RIGHT,
  ICON_COPY,
} from './icons.ts';
import { ensureKatexStyles, renderMarkdown } from './markdown.ts';
import type { TranslationTarget } from './nowcoder.ts';
import { buildSystemPrompt, chunkMarkdown } from './prompt.ts';
import type { Settings } from './types.ts';

export interface TranslationResult {
  markdown: string;
  providerName: string;
  model: string;
  elapsedMs: number;
}

export interface TranslateOptions {
  settings: Settings;
  markdown: string;
  signal?: AbortSignal;
  onStatus?: (text: string) => void;
  onPartial?: (markdown: string) => void;
}

export async function translateMarkdown(
  options: TranslateOptions,
): Promise<TranslationResult> {
  const { settings, markdown, signal, onStatus, onPartial } = options;
  const system = buildSystemPrompt(settings);
  const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
  const providerName = cfg?.name ?? '未配置';
  const model = cfg?.model ?? '';
  const started = Date.now();

  const chunks = settings.translateWholeBlock
    ? [markdown]
    : chunkMarkdown(markdown);

  if (chunks.length === 1) {
    onStatus?.('正在翻译…');
    const text = await ask(settings, chunks[0], system, { signal });
    onPartial?.(text.trim());
    return {
      markdown: text.trim(),
      providerName,
      model,
      elapsedMs: Date.now() - started,
    };
  }

  const out: string[] = [];
  for (let i = 0; i < chunks.length; i += 1) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    onStatus?.(`正在翻译第 ${i + 1}/${chunks.length} 段…`);
    const text = await ask(settings, chunks[i], system, { signal });
    out.push(text.trim());
    onPartial?.(out.join('\n\n'));
  }

  return {
    markdown: out.join('\n\n'),
    providerName,
    model,
    elapsedMs: Date.now() - started,
  };
}

export interface ResultPanelHandle {
  el: HTMLElement;
  update(markdown: string): void;
  setStatus(text: string, kind?: 'info' | 'error'): void;
  finish(result: TranslationResult): void;
  remove(): void;
}

/** 结果面板：状态行 + 译文 + 复制按钮 */
export function createResultPanel(
  target: TranslationTarget,
  toolbar: HTMLElement,
): ResultPanelHandle {
  ensureKatexStyles();
  const el = document.createElement('div');
  el.className = 'ncb-result';

  const header = document.createElement('div');
  header.className = 'ncb-result-header';

  const title = document.createElement('span');
  title.className = 'ncb-result-title';
  title.textContent = 'AI 翻译';

  const status = document.createElement('span');
  status.className = 'ncb-result-status';

  const actions = document.createElement('span');
  actions.className = 'ncb-result-actions';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'ncb-icon-btn';
  copyBtn.title = '复制译文';
  copyBtn.setAttribute('aria-label', '复制译文');
  copyBtn.innerHTML = ICON_COPY;

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'ncb-icon-btn';
  toggleBtn.title = '收起';
  toggleBtn.setAttribute('aria-label', '收起');
  toggleBtn.innerHTML = ICON_CHEVRON;

  actions.append(copyBtn, toggleBtn);
  header.append(title, status, actions);

  const body = document.createElement('div');
  body.className = 'ncb-result-body';

  el.append(header, body);

  let currentMarkdown = '';

  const render = (markdown: string) => {
    currentMarkdown = markdown;
    body.innerHTML = renderMarkdown(markdown);
  };

  copyBtn.addEventListener('click', () => {
    void navigator.clipboard?.writeText(currentMarkdown);
    copyBtn.innerHTML = ICON_CHECK;
    copyBtn.title = '已复制';
    setTimeout(() => {
      copyBtn.innerHTML = ICON_COPY;
      copyBtn.title = '复制译文';
    }, 1200);
  });

  toggleBtn.addEventListener('click', () => {
    const collapsed = el.classList.toggle('ncb-collapsed');
    toggleBtn.innerHTML = collapsed ? ICON_CHEVRON_RIGHT : ICON_CHEVRON;
    toggleBtn.title = collapsed ? '展开' : '收起';
  });

  if (target.panelPosition === 'afterToolbar') {
    toolbar.insertAdjacentElement('afterend', el);
  } else {
    target.root.insertAdjacentElement('afterend', el);
  }

  return {
    el,
    update: render,
    setStatus(text, kind = 'info') {
      status.textContent = text;
      status.dataset.kind = kind;
    },
    finish(result) {
      render(result.markdown);
      status.textContent = `${result.providerName} · ${result.model} · ${(
        result.elapsedMs / 1000
      ).toFixed(1)}s`;
      status.dataset.kind = 'info';
    },
    remove() {
      el.remove();
    },
  };
}
