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
  root.setAttribute(THEME_ATTR, theme);
  // 让浏览器把滚动条、表单控件也切成对应配色
  root.style.colorScheme = theme;
}

/** 系统配色变化时通知调用方；返回取消订阅函数。 */
export function watchSystemTheme(onChange: () => void): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const media = matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
