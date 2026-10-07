import { t } from '../i18n/index.ts';
import { DEFAULT_MODEL } from './config.ts';
import { createSseParser, parseJson } from './sse.ts';
import type { ChatRequest, ProviderAdapter, ProviderConfig } from './types.ts';

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * baseUrl 允许三种写法：
 *   https://api.openai.com/v1          → 自动补 /chat/completions
 *   https://api.openai.com/v1/         → 同上
 *   https://my.gateway/chat/completions → 已含端点，原样使用
 */
function resolveUrl(baseUrl: string, fallbackBase: string, suffix: string): string {
  const base = trimSlash((baseUrl || fallbackBase).trim());
  if (!base) throw new Error(t('error.baseUrlEmpty'));
  if (/\/[a-z0-9-]+$/i.test(base) && /(completions|messages|responses|chat)$/i.test(base)) {
    return base;
  }
  return base + suffix;
}

function mergeHeaders(
  base: Record<string, string>,
  extra: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    if (key.trim()) out[key.trim()] = value;
  }
  return out;
}

/**
 * 本地推理服务（llama.cpp、Ollama、vLLM 等）常常不需要 Key。
 * 这种情况下不要发空的认证头，否则有些服务会当成错误的凭据直接拒绝。
 */
function authHeader(name: string, value: string): Record<string, string> {
  const key = value.trim();
  return key ? { [name]: name === 'Authorization' ? `Bearer ${key}` : key } : {};
}

/** 去掉值为 undefined/null 的字段，避免污染请求体 */
function compact<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) out[key] = value;
  }
  return out as T;
}

/**
 * 流式提取器：接收完整 SSE 文本，返回累计正文。
 * 返回 null 表示这一批还没有正文，调用方应保留上一次的内容。
 */
function streamReader(
  pick: (payload: unknown) => string | null,
): () => (raw: string) => string | null {
  return () => {
    let acc = '';
    const parser = createSseParser();
    let seen = 0;
    return (raw) => {
      for (const event of parser(raw.slice(seen))) {
        if (event === '[DONE]') continue;
        const text = pick(parseJson(event));
        if (text) acc += text;
      }
      seen = raw.length;
      return acc || null;
    };
  };
}

const openaiChatStream = streamReader((payload) => {
  const data = payload as {
    choices?: { delta?: { content?: unknown; reasoning_content?: unknown } }[];
  };
  return normalizeContent(data?.choices?.[0]?.delta?.content) || null;
});

const openaiResponsesStream = streamReader((payload) => {
  const data = payload as {
    type?: string;
    delta?: unknown;
    output_text?: unknown;
  };
  // Responses 的事件类型较多，只取真正携带正文增量的几种
  if (typeof data?.delta === 'string' && data.delta) return data.delta;
  if (typeof data?.output_text === 'string' && data.output_text) return data.output_text;
  return null;
});

const anthropicStream = streamReader((payload) => {
  const data = payload as {
    type?: string;
    delta?: { type?: string; text?: unknown };
  };
  if (data?.type === 'content_block_delta' && typeof data.delta?.text === 'string') {
    return data.delta.text;
  }
  return null;
});

const openaiChat: ProviderAdapter = {
  protocol: 'openai-chat',
  label: 'OpenAI Chat Completions',
  defaultBaseUrl: 'https://api.openai.com/v1',
  defaultModel: DEFAULT_MODEL,

  build(cfg: ProviderConfig, req: ChatRequest) {
    const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, '/chat/completions');
    const body = compact({
      model: cfg.model || this.defaultModel,
      messages: req.messages,
      ...(req.stream ? { stream: true } : {}),
      ...(cfg.reasoning.enabled === null
        ? {}
        : { thinking: { type: cfg.reasoning.enabled ? 'enabled' : 'disabled' } }),
      ...(cfg.reasoning.effort && cfg.reasoning.enabled !== false
        ? { reasoning_effort: cfg.reasoning.effort }
        : {}),
      ...cfg.body,
    });
    return {
      url,
      headers: mergeHeaders(
        {
          'Content-Type': 'application/json',
          ...authHeader('Authorization', cfg.apiKey),
        },
        cfg.headers,
      ),
      body,
    };
  },

  extractText(payload: unknown) {
    const data = payload as {
      choices?: { message?: { content?: unknown; reasoning_content?: unknown } }[];
    };
    const message = data?.choices?.[0]?.message;
    if (!message) return '';
    return normalizeContent(message.content);
  },

  createStreamReader: openaiChatStream,

  extractError(payload: unknown) {
    const data = payload as { error?: { message?: string }; message?: string };
    return data?.error?.message || data?.message || '';
  },
};

const openaiResponses: ProviderAdapter = {
  protocol: 'openai-responses',
  label: 'OpenAI Responses',
  defaultBaseUrl: 'https://api.openai.com/v1',
  defaultModel: DEFAULT_MODEL,

  build(cfg: ProviderConfig, req: ChatRequest) {
    const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, '/responses');
    const body = compact({
      model: cfg.model || this.defaultModel,
      input: req.messages.map((m) => ({ role: m.role, content: m.content })),
      ...(req.stream ? { stream: true } : {}),
      ...(cfg.reasoning.effort ? { reasoning: { effort: cfg.reasoning.effort } } : {}),
      ...cfg.body,
    });
    return {
      url,
      headers: mergeHeaders(
        {
          'Content-Type': 'application/json',
          ...authHeader('Authorization', cfg.apiKey),
        },
        cfg.headers,
      ),
      body,
    };
  },

  extractText(payload: unknown) {
    const data = payload as {
      output_text?: unknown;
      output?: { content?: { type?: string; text?: unknown }[] }[];
      choices?: { message?: { content?: unknown } }[];
    };
    if (typeof data?.output_text === 'string' && data.output_text) {
      return data.output_text;
    }
    if (Array.isArray(data?.output)) {
      const parts: string[] = [];
      for (const item of data.output) {
        for (const chunk of item?.content ?? []) {
          if (typeof chunk?.text === 'string') parts.push(chunk.text);
        }
      }
      if (parts.length) return parts.join('');
    }
    return normalizeContent(data?.choices?.[0]?.message?.content);
  },

  createStreamReader: openaiResponsesStream,

  extractError(payload: unknown) {
    const data = payload as { error?: { message?: string }; message?: string };
    return data?.error?.message || data?.message || '';
  },
};

const anthropic: ProviderAdapter = {
  protocol: 'anthropic',
  label: 'Anthropic Messages',
  defaultBaseUrl: 'https://api.anthropic.com/v1',
  defaultModel: 'claude-sonnet-4-5',

  build(cfg: ProviderConfig, req: ChatRequest) {
    const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, '/messages');
    const system = req.messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n\n');
    const messages = req.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));
    const body = compact({
      model: cfg.model || this.defaultModel,
      max_tokens: 8192,
      ...(system ? { system } : {}),
      messages,
      ...(req.stream ? { stream: true } : {}),
      ...(cfg.reasoning.effort && cfg.reasoning.enabled !== false
        ? { thinking: { type: 'enabled', budget_tokens: effortToBudget(cfg.reasoning.effort) } }
        : {}),
      ...cfg.body,
    });
    return {
      url,
      headers: mergeHeaders(
        {
          'Content-Type': 'application/json',
          ...authHeader('x-api-key', cfg.apiKey),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        cfg.headers,
      ),
      body,
    };
  },

  extractText(payload: unknown) {
    const data = payload as { content?: { type?: string; text?: unknown }[] };
    if (!Array.isArray(data?.content)) return '';
    return data.content
      .filter((block) => block?.type === 'text' && typeof block.text === 'string')
      .map((block) => block.text as string)
      .join('');
  },

  createStreamReader: anthropicStream,

  extractError(payload: unknown) {
    const data = payload as { error?: { message?: string }; message?: string };
    return data?.error?.message || data?.message || '';
  },
};

function effortToBudget(effort: string): number {
  const table: Record<string, number> = {
    low: 2048,
    minimal: 1024,
    medium: 8192,
    high: 16384,
    xhigh: 32768,
  };
  return table[effort] ?? 4096;
}

/** content 可能是字符串，也可能是分段数组 */
function normalizeContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        const p = part as { text?: unknown; type?: string };
        return typeof p?.text === 'string' ? p.text : '';
      })
      .join('');
  }
  return '';
}

export const ADAPTERS: Record<ProviderAdapter['protocol'], ProviderAdapter> = {
  'openai-chat': openaiChat,
  'openai-responses': openaiResponses,
  anthropic,
};

export function getAdapter(protocol: ProviderAdapter['protocol']): ProviderAdapter {
  return ADAPTERS[protocol] ?? openaiChat;
}
