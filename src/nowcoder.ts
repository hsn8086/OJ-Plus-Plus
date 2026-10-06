export interface TranslationTarget {
  /** 稳定标识，用于缓存与去重 */
  key: string;
  /** 读取内容的根元素 */
  root: HTMLElement;
  /** 工具栏挂载点 */
  anchor: HTMLElement;
  /** 结果面板插入位置 */
  placement: 'before' | 'after' | 'prepend';
  label: string;
}

const TOOLBAR_FLAG = 'ncbToolbar';

export function isProblemPage(): boolean {
  return !!document.querySelector('.subject-question, .subject-describe');
}

/** 扫描页面上所有可翻译区域，跳过已挂过工具栏的 */
export function collectTargets(): TranslationTarget[] {
  const targets: TranslationTarget[] = [];
  const seen = new WeakSet<HTMLElement>();

  const push = (
    root: HTMLElement | null,
    anchor: HTMLElement | null,
    placement: TranslationTarget['placement'],
    label: string,
  ) => {
    if (!root || !anchor || seen.has(root)) return;
    if (!(root.textContent ?? '').trim()) return;
    seen.add(root);
    targets.push({
      key: `${label}:${targets.length}`,
      root,
      anchor,
      placement,
      label,
    });
  };

  // 题目描述主体
  document.querySelectorAll<HTMLElement>('.subject-question').forEach((el) => {
    push(el, el, 'before', '题目描述');
  });

  // 输入/输出描述，它们是 .subject-describe 下紧跟 h2 的 pre
  document
    .querySelectorAll<HTMLElement>('.subject-describe > h2')
    .forEach((h2) => {
      const title = (h2.textContent ?? '').trim();
      if (!/描述/.test(title)) return;
      let node = h2.nextElementSibling;
      while (node && node.tagName !== 'PRE') node = node.nextElementSibling;
      if (node) {
        const label = /输入/.test(title) ? '输入描述' : '输出描述';
        push(node as HTMLElement, h2, 'before', label);
      }
    });

  // 题解正文
  document.querySelectorAll<HTMLElement>('div.nc-post-content').forEach((el) => {
    push(el, el, 'prepend', '题解');
  });

  return targets;
}

export function markToolbarMounted(anchor: HTMLElement): void {
  anchor.dataset[TOOLBAR_FLAG] = '1';
}

export function isToolbarMounted(anchor: HTMLElement): boolean {
  return anchor.dataset[TOOLBAR_FLAG] === '1';
}

/** 页面标题，作为缓存与日志的上下文 */
export function pageTitle(): string {
  const title = document.querySelector('.question-title')?.textContent?.trim();
  return title || document.title;
}
