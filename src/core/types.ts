export type Protocol = 'openai-chat' | 'openai-responses' | 'anthropic';

/** 界面语言设置；auto 表示跟随浏览器 */
export type Locale = 'zh' | 'en' | 'auto';

/** 站点配色；auto 跟随系统 */
export type Theme = 'auto' | 'light' | 'dark';

export interface ProviderConfig {
  id: string;
  /** 备注名，显示在设置面板和翻译状态里 */
  name: string;
  protocol: Protocol;
  /** 例如 https://api.openai.com/v1，也可以直接填完整端点 */
  baseUrl: string;
  apiKey: string;
  model: string;
  /** 额外请求头，会覆盖默认值 */
  headers: Record<string, string>;
  /** 额外请求体字段，会覆盖默认值；temperature 之类不常用参数走这里 */
  body: Record<string, unknown>;
  /** 推理参数；enabled 为 null 表示跟随模型默认 */
  reasoning: {
    enabled: boolean | null;
    effort: string;
  };
}

export interface Settings {
  version: number;
  activeProviderId: string | null;
  providers: ProviderConfig[];
  /** 目标语言，注入提示词 */
  targetLang: string;
  /** 追加到系统提示词末尾的自定义要求 */
  extraPrompt: string;
  /** 关闭时按段落切分后逐段翻译，适合超长题面 */
  translateWholeBlock: boolean;
  /** 各站点是否自动翻译题面；key 为站点 id，'*' 是旧版全局开关迁移来的 */
  autoTranslate: Record<string, boolean>;
  /** 请求超时（毫秒） */
  timeoutMs: number;
  /** 失败重试次数 */
  retries: number;
  /** 边收边渲染；关闭后等整段译完再显示 */
  streaming: boolean;
  /** 界面语言；auto 跟随浏览器 */
  locale: Locale;
  /** 站点配色；auto 跟随系统 */
  theme: Theme;
  /** 题目页代码编辑器总开关（站点支持时才显示） */
  editorEnabled: boolean;
  /** 编辑器字号 */
  editorFontSize: number;
  /** LSP WebSocket 地址（如 ws://localhost:20876），空为关闭 */
  editorLspUrl: string;
  /** 各站点最近选择的提交语言 id */
  editorLanguage: Record<string, string>;
  /** 按「站点:题号」保存的草稿代码 */
  editorCode: Record<string, { code: string; updated: number }>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** 请求 SSE 流式响应 */
  stream?: boolean;
}

export interface ProviderAdapter {
  readonly protocol: Protocol;
  readonly label: string;
  readonly defaultBaseUrl: string;
  readonly defaultModel: string;
  build(
    cfg: ProviderConfig,
    req: ChatRequest,
  ): {
    url: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
  };
  /** 从非流式响应体中取出完整文本，失败返回空串 */
  extractText(payload: unknown): string;
  /** 从错误响应体里提取人类可读的信息 */
  extractError?(payload: unknown): string;
  /**
   * 创建一个流式提取器。每次请求都要新建一个，因为它会累计状态。
   * 调用时传入到目前为止收到的完整 SSE 文本，返回累计正文；
   * 返回 null 表示还没有正文，不要覆盖已有内容。
   */
  createStreamReader?(): (raw: string) => string | null;
}
