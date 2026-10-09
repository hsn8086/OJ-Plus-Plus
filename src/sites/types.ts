export interface MountPoint {
  anchor: HTMLElement;
  position: InsertPosition;
  /**
   * inline: 紧跟锚点（默认）。
   * right: 浮到锚点所在行的最右边（适合标题行）。
   * block-right: 单独一行、靠右对齐（适合放在标题区下方）。
   */
  align?: 'inline' | 'right' | 'block-right';
}

/** 一个可独立翻译、查看 Markdown、复制的区域。 */
export interface ContentSection {
  kind: 'statement' | 'input' | 'output' | 'solution';
  label: string;
  content: HTMLElement;
  toolbar: MountPoint;
  result: MountPoint;
}

/** 编辑器可选的语言（站点提交用的语言项）。 */
export interface EditorLanguage {
  /** 提交表单里的语言值（CF 的 programTypeId）。 */
  id: string;
  name: string;
  /** CodeMirror 高亮模式。 */
  mode: 'cpp' | 'java' | 'python' | 'text';
}

/** customtest 跑一次的结果。 */
export interface EditorTestResult {
  /** 程序标准输出。 */
  output: string;
  /** 运行信息，如 "46 ms, 0 KB"。 */
  used?: string;
  /** 判题判定（OK / WRONG_ANSWER / TIME_LIMIT_EXCEEDED / COMPILATION_ERROR 等）。 */
  verdict?: string;
  /** 运行/请求失败时的错误描述。 */
  error?: string;
}

/** 站点为题目页提供代码编辑器能力的接口。 */
export interface SiteEditorSupport {
  /** 编辑器面板挂载点；不在题目页时返回 null。 */
  editorMountPoint(doc: Document): MountPoint | null;
  /** 提交用的题号（如 1A、242A）。 */
  problemCode(doc: Document): string | null;
  /** 题目页中的样例输入/期望输出对。 */
  getSamples(doc: Document): { input: string; output: string }[];
  /** 站点可选语言列表。 */
  readonly languages: readonly EditorLanguage[];
  /** 通过站点的 customtest 运行一次代码。 */
  runCustomTest(code: string, languageId: string, input: string): Promise<EditorTestResult>;
  /** 提交代码；url 为结果页（提交列表）。 */
  submit(code: string, languageId: string, problemCode: string): Promise<{ ok: boolean; url?: string; error?: string }>;
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
  /** 题目页代码编辑器能力；不提供则不显示编辑器面板。 */
  readonly editor?: SiteEditorSupport;
  collectSections(doc: Document): ContentSection[];
  /** 在内容的副本上还原站点特有的公式、代码等，不修改原页面。 */
  prepareContent(root: HTMLElement): void;
  mountSettingsButton(button: HTMLButtonElement, doc: Document): void;
  /** 站点特有的动态更新监听，返回清理函数。 */
  observe(doc: Document, onChange: () => void): () => void;
}
