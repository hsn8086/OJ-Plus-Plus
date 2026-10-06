export interface MountPoint {
  anchor: HTMLElement;
  position: InsertPosition;
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
  collectSections(doc: Document): ContentSection[];
  /** 在内容的副本上还原站点特有的公式、代码等，不修改原页面。 */
  prepareContent(root: HTMLElement): void;
  mountSettingsButton(button: HTMLButtonElement, doc: Document): void;
  /** 站点特有的动态更新监听，返回清理函数。 */
  observe(doc: Document, onChange: () => void): () => void;
}
