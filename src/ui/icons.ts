/** 工具栏用的内联 SVG 图标，全部用 currentColor 以跟随按钮状态变色。 */

function svg(path: string, viewBox = '0 0 24 24'): string {
  return `<svg viewBox="${viewBox}" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

/** 翻译：地球 + 双向箭头 */
export const ICON_TRANSLATE = svg(
  '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M3 12h18"/>' +
    '<path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>',
);

/** Markdown 视图：文档 */
export const ICON_MARKDOWN = svg(
  '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5"/>' +
    '<path d="M9 13v4"/>' +
    '<path d="M12 15l2 2 2-2"/>',
);

/** 复制：剪贴板 */
export const ICON_COPY = svg(
  '<rect x="9" y="9" width="12" height="12" rx="2"/>' +
    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
);

/** 设置：齿轮 */
export const ICON_SETTINGS = svg(
  '<circle cx="12" cy="12" r="3"/>' +
    '<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0z"/>',
);

/** 完成：对勾 */
export const ICON_CHECK = svg('<path d="M20 6 9 17l-5-5"/>');

/** 收起：向上尖角 */
export const ICON_CHEVRON = svg('<path d="m6 15 6-6 6 6"/>');

/** 展开：向下尖角 */
export const ICON_CHEVRON_RIGHT = svg('<path d="m6 9 6 6 6-6"/>');

/** 失败：叉 */
export const ICON_CROSS = svg(
  '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
);

/** 加载中：缺口圆环，靠 CSS 旋转 */
export const ICON_SPINNER = svg('<path d="M21 12a9 9 0 1 1-6.2-8.6"/>');
