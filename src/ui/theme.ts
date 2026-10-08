import type { Theme } from '../core/types.ts';

/** 脚本在 <html> 上打的标记，站点暗色样式都挂在它下面。 */
export const THEME_ATTR = 'data-ojpp-theme';

/** 解析实际主题；auto 跟随系统。 */
export function resolveTheme(setting: Theme): 'light' | 'dark' {
  if (setting === 'light' || setting === 'dark') return setting;
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * 应用主题。
 *
 * 不直接改站点自己的 class 或内联样式，只在 <html> 上加一个属性，
 * 这样站点自身的暗色模式（如果有）不会被覆盖，
 * 脚本补的样式也只影响自己该管的部分。
 */
export function applyTheme(setting: Theme): void {
  const root = document.documentElement;
  const theme = resolveTheme(setting);
  const previous = root.getAttribute(THEME_ATTR);
  root.setAttribute(THEME_ATTR, theme);
  // 让浏览器把滚动条、表单控件也切成对应配色
  root.style.colorScheme = theme;
  // 从暗色切回浅色时，把之前清掉的内联颜色还回去
  if (previous === 'dark' && theme !== 'dark') restoreInlineColors();
  if (theme === 'dark') stripInlineColors(document);
}

/** 系统配色变化时通知调用方；返回取消订阅函数。 */
export function watchSystemTheme(onChange: () => void): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const media = matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * 清掉元素上的内联 color，让样式表里的暗色规则能生效。
 *
 * 有些站点元素写死了 `style="color:black !important"`（例如博客标题的链接）。
 * 内联的 !important 优先级高于任何选择器，CSS 覆盖不掉，只能改属性本身。
 *
 * 只在切到暗色时执行：浅色下这些内联样式是对的，动了反而出问题。
 * 记录被清掉的元素，切回浅色时还原。
 */
const strippedInline = new Map<HTMLElement, string>();

function stripInlineColors(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>('[style*="color"], [style*="background"], [style*="background-color"]')) {
    const style = el.getAttribute('style');
    if (!style || strippedInline.has(el)) continue;
    // 只清掉跟配色相关的声明（文字色与背景色），保留布局/排版等其它内联样式。
    // 站点有些按钮把 background-color 也写在内联里，只清 color 救不回来。
    const cleaned = style
      .split(';')
      .filter((part) => {
        const prop = part.trim().toLowerCase();
        return !/^color\s*:/.test(prop) && !/^background(-color)?\s*:/.test(prop);
      })
      .join(';')
      .trim();
    if (cleaned === style.trim()) continue;
    strippedInline.set(el, style);
    if (cleaned) el.setAttribute('style', cleaned);
    else el.removeAttribute('style');
  }
}

function restoreInlineColors(): void {
  for (const [el, style] of strippedInline) {
    if (el.isConnected) el.setAttribute('style', style);
  }
  strippedInline.clear();
}

/**
 * 监听页面变化，持续清理内联颜色。
 * 站点的博客列表等内容是异步加载的，只处理一次会漏掉后插入的节点。
 */
export function watchInlineColors(): () => void {
  const run = () => {
    if (document.documentElement.getAttribute(THEME_ATTR) === 'dark') stripInlineColors(document);
  };
  run();
  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    restoreInlineColors();
  };
}
