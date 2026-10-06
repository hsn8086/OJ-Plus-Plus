export interface TranslationTarget {
  /** 稳定标识，用于去重 */
  key: string;
  /** 读取内容的根元素 */
  root: HTMLElement;
  /** 工具栏挂载到哪个元素上 */
  mountHost: HTMLElement;
  /** 挂载位置：标题行用 append（与标题同一行），正文块用 prepend */
  mountPosition: 'append' | 'prepend';
  /**
   * 结果面板的插入位置：
   * - afterRoot：插在正文块后面（标题行挂工具栏时用）
   * - afterToolbar：插在工具栏后面（工具栏在正文块内部时用）
   */
  panelPosition: 'afterRoot' | 'afterToolbar';
  label: string;
}

const TOOLBAR_FLAG = 'ncbToolbar';

export function isProblemPage(): boolean {
  return !!document.querySelector('.subject-question, .subject-describe');
}

function hasContent(el: HTMLElement | null): el is HTMLElement {
  return !!el && !!(el.textContent ?? '').trim();
}

/**
 * 收集页面上可翻译的区域。工具栏塞进标题行，与标题排在同一行；
 * 结果面板追加到同一个包装容器里，所以永远紧跟在工具栏下方。
 */
export function collectTargets(): TranslationTarget[] {
  const targets: TranslationTarget[] = [];
  const seen = new WeakSet<HTMLElement>();

  const push = (
    root: HTMLElement | null,
    mountHost: HTMLElement | null,
    mountPosition: TranslationTarget['mountPosition'],
    panelPosition: TranslationTarget['panelPosition'],
    label: string,
  ) => {
    if (!hasContent(root) || !mountHost || seen.has(root)) return;
    seen.add(root);
    targets.push({
      key: `${label}:${targets.length}`,
      root,
      mountHost,
      mountPosition,
      panelPosition,
      label,
    });
  };

  // 题目描述：h2.subject-item-title + div.subject-question
  push(
    document.querySelector<HTMLElement>('.subject-question'),
    document.querySelector<HTMLElement>('.subject-item-title'),
    'append',
    'afterRoot',
    '题目描述',
  );

  // 输入/输出描述：.subject-describe 下的 h2 + 紧随的 pre
  document
    .querySelectorAll<HTMLElement>('.subject-describe > h2')
    .forEach((heading) => {
      const text = (heading.textContent ?? '').trim();
      if (!/描述/.test(text)) return;
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'PRE') node = node.nextElementSibling;
      if (!node) return;
      push(
        node as HTMLElement,
        heading,
        'append',
        'afterRoot',
        /输入/.test(text) ? '输入描述' : '输出描述',
      );
    });

  // 题解正文
  document.querySelectorAll<HTMLElement>('div.nc-post-content').forEach((el) => {
    push(el, el, 'prepend', 'afterToolbar', '题解');
  });

  return targets;
}

export function markToolbarMounted(anchor: HTMLElement): void {
  anchor.dataset[TOOLBAR_FLAG] = '1';
}

export function isToolbarMounted(anchor: HTMLElement): boolean {
  return anchor.dataset[TOOLBAR_FLAG] === '1';
}

/** 页面标题，用于日志上下文 */
export function pageTitle(): string {
  const title = document.querySelector('.question-title')?.textContent?.trim();
  return title || document.title;
}
