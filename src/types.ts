export type Protocol = 'openai-chat' | 'openai-responses' | 'anthropic';

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
  /** 额外请求体字段，会覆盖默认值 */
  body: Record<string, unknown>;
  /** 推理参数；enabled 为 null 表示跟随模型默认 */
  reasoning: {
    enabled: boolean | null;
    effort: string;
  };
  temperature: number | null;
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
  /** 页面加载后自动翻译题面 */
  autoTranslate: boolean;
  /** 请求超时（毫秒） */
  timeoutMs: number;
  /** 失败重试次数 */
  retries: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
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
}
