import { ask } from './ai';
import { ensureKatexStyles, renderMarkdown } from './markdown';
import { buildSystemPrompt, chunkMarkdown } from './prompt';
import type { Settings } from './types';

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
  placement: 'before' | 'after' | 'prepend',
  host: HTMLElement,
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
  copyBtn.className = 'ncb-btn ncb-btn-ghost';
  copyBtn.textContent = '复制译文';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'ncb-btn ncb-btn-ghost';
  toggleBtn.textContent = '收起';

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
    copyBtn.textContent = '已复制';
    setTimeout(() => (copyBtn.textContent = '复制译文'), 1500);
  });

  toggleBtn.addEventListener('click', () => {
    const collapsed = el.classList.toggle('ncb-collapsed');
    toggleBtn.textContent = collapsed ? '展开' : '收起';
  });

  if (placement === 'before') host.insertAdjacentElement('beforebegin', el);
  else if (placement === 'after') host.insertAdjacentElement('afterend', el);
  else host.prepend(el);

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
