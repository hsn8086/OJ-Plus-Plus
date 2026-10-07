export interface MountPoint {
  anchor: HTMLElement;
  position: InsertPosition;
  /**
   * right: 浮到锚点所在行的最右边（标题行右侧）。
   * inline: 紧跟锚点（默认）。
   */
  align?: 'inline' | 'right';
}

/** 一个可独立翻译、查看 Markdown、复制的区域。 */
export interface ContentSection {
  kind: 'statement' | 'input' | 'output' | 'solution';
  label: string;
  content: HTMLElement;
  toolbar: MountPoint;
  result: MountPoint;
}

export interface SiteAdapter {
  readonly id: string;
  readonly name: string;
  /** 用于入口分派，同时生成 userscript 的 @match。 */
  readonly hosts: readonly string[];
  readonly styles?: string;
  /**
   * 暗色主题样式。只有站点提供了它，「暗色」选项才有意义。
   * 选择器统一挂在 html[data-ojpp-theme="dark"] 下，避免污染站点自身样式。
   */
  readonly darkStyles?: string;
  collectSections(doc: Document): ContentSection[];
  /** 在内容的副本上还原站点特有的公式、代码等，不修改原页面。 */
  prepareContent(root: HTMLElement): void;
  mountSettingsButton(button: HTMLButtonElement, doc: Document): void;
  /** 站点特有的动态更新监听，返回清理函数。 */
  observe(doc: Document, onChange: () => void): () => void;
}
