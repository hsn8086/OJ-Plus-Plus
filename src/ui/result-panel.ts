import type { TranslationResult } from '../core/translate.ts';
import type { WriteClipboard } from '../platforms/types.ts';
import { bindCopy, iconButton, setIcon } from './buttons.ts';
import { ICON_CHEVRON, ICON_CHEVRON_RIGHT, ICON_COPY } from './icons.ts';
import { ensureKatexStyles, renderMarkdown, stabilizeMarkdown } from './markdown.ts';

export function createResultPanel(writeClipboard: WriteClipboard) {
  ensureKatexStyles();
  const el = document.createElement('div');
  el.className = 'ojpp-result';
  const header = document.createElement('div');
  header.className = 'ojpp-result-header';
  const title = document.createElement('span');
  title.className = 'ojpp-result-title';
  title.textContent = 'AI 翻译';
  const status = document.createElement('span');
  status.className = 'ojpp-result-status';
  status.setAttribute('role', 'status');
  const actions = document.createElement('span');
  actions.className = 'ojpp-result-actions';
  const copy = iconButton(ICON_COPY, '复制译文');
  const toggle = iconButton(ICON_CHEVRON, '收起');
  toggle.setAttribute('aria-expanded', 'true');
  actions.append(copy, toggle);
  header.append(title, status, actions);
  const body = document.createElement('div');
  body.className = 'ojpp-result-body';
  el.append(header, body);

  let currentMarkdown = '';
  let streaming = false;
  const update = (markdown: string) => {
    currentMarkdown = markdown;
    // 流式过程中把未完成的公式/代码块先藏起来，避免每帧都渲染成错乱的样子
    body.innerHTML = renderMarkdown(streaming ? stabilizeMarkdown(markdown) : markdown);
  };
  const setStatus = (text: string, kind: 'info' | 'error' = 'info') => {
    status.textContent = text;
    status.dataset.kind = kind;
  };
  bindCopy(copy, () => currentMarkdown, writeClipboard);
  toggle.addEventListener('click', () => {
    const collapsed = el.classList.toggle('ojpp-collapsed');
    setIcon(toggle, collapsed ? ICON_CHEVRON_RIGHT : ICON_CHEVRON, collapsed ? '展开' : '收起');
    toggle.setAttribute('aria-expanded', String(!collapsed));
  });
  return {
    el,
    update,
    setStatus,
    begin() {
      streaming = true;
      el.classList.add('ojpp-streaming');
    },
    finish(result: TranslationResult) {
      streaming = false;
      el.classList.remove('ojpp-streaming');
      update(result.markdown);
      setStatus(`${result.providerName} · ${result.model} · ${(result.elapsedMs / 1000).toFixed(1)}s`);
    },
    remove: () => el.remove(),
  };
}
