import type { Protocol, ProviderConfig, Settings } from './types';

export const SETTINGS_KEY = 'ncb:settings';

export const DEFAULT_TARGET_LANG = '简体中文';

export const PROTOCOL_LABEL: Record<Protocol, string> = {
  'openai-chat': 'OpenAI Chat Completions',
  'openai-responses': 'OpenAI Responses',
  anthropic: 'Anthropic Messages',
};

export interface ProviderPreset {
  key: string;
  label: string;
  protocol: Protocol;
  baseUrl: string;
  model: string;
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    key: 'openai',
    label: 'OpenAI（Chat Completions）',
    protocol: 'openai-chat',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  {
    key: 'openai-responses',
    label: 'OpenAI（Responses）',
    protocol: 'openai-responses',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  {
    key: 'anthropic',
    label: 'Anthropic Claude',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-5',
  },
  {
    key: 'deepseek',
    label: 'DeepSeek',
    protocol: 'openai-chat',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  {
    key: 'openrouter',
    label: 'OpenRouter',
    protocol: 'openai-chat',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o-mini',
  },
  {
    key: 'custom',
    label: '自定义（兼容 OpenAI Chat）',
    protocol: 'openai-chat',
    baseUrl: '',
    model: '',
  },
];

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createProvider(preset: ProviderPreset): ProviderConfig {
  return {
    id: newId(),
    name: preset.label,
    protocol: preset.protocol,
    baseUrl: preset.baseUrl,
    apiKey: '',
    model: preset.model,
    headers: {},
    body: {},
    reasoning: { enabled: null, effort: '' },
    temperature: null,
  };
}

export function defaultSettings(): Settings {
  const openai = createProvider(PROVIDER_PRESETS[0]);
  return {
    version: 1,
    activeProviderId: openai.id,
    providers: [openai],
    targetLang: DEFAULT_TARGET_LANG,
    extraPrompt: '',
    translateWholeBlock: true,
    autoTranslate: false,
    timeoutMs: 120_000,
    retries: 1,
  };
}

/** 合并磁盘上的旧配置，保证新增字段有默认值 */
export function migrate(raw: unknown): Settings {
  const base = defaultSettings();
  if (!raw || typeof raw !== 'object') return base;
  const input = raw as Partial<Settings>;
  const providers = Array.isArray(input.providers)
    ? input.providers
        .filter((p): p is ProviderConfig => !!p && typeof p === 'object')
        .map((p) => ({
          ...createProvider(PROVIDER_PRESETS[0]),
          ...p,
          headers: p.headers ?? {},
          body: p.body ?? {},
          reasoning: p.reasoning ?? { enabled: null, effort: '' },
        }))
    : base.providers;
  const settings: Settings = {
    ...base,
    ...input,
    providers,
    version: base.version,
  };
  if (!settings.providers.some((p) => p.id === settings.activeProviderId)) {
    settings.activeProviderId = settings.providers[0]?.id ?? null;
  }
  return settings;
}
