import { t } from '../i18n/index.ts';
import type { Protocol, ProviderConfig, Settings } from './types.ts';

export const SETTINGS_KEY = 'ojpp:settings';

export const DEFAULT_TARGET_LANG = '简体中文';

export const DEFAULT_MODEL = 'gpt-6-luna';

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
    model: DEFAULT_MODEL,
  },
  {
    key: 'openai-responses',
    label: 'OpenAI（Responses）',
    protocol: 'openai-responses',
    baseUrl: 'https://api.openai.com/v1',
    model: DEFAULT_MODEL,
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
    get label() { return t('preset.customOpenAI'); },
    protocol: 'openai-chat',
    baseUrl: '',
    model: DEFAULT_MODEL,
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
    autoTranslate: {},
    timeoutMs: 120_000,
    retries: 1,
    streaming: true,
    locale: 'auto',
    theme: 'auto',
    editorEnabled: true,
    editorFontSize: 13,
    editorLspUrl: '',
    editorLanguage: {},
    editorCode: {},
  };
}

/** 合并磁盘上的旧配置，保证新增字段有默认值 */
export function migrate(raw: unknown): Settings {
  const base = defaultSettings();
  if (!raw || typeof raw !== 'object') return base;
  const input = raw as Partial<Settings> & { providers?: unknown };
  const providers = Array.isArray(input.providers)
    ? input.providers
        .filter((p): p is ProviderConfig => !!p && typeof p === 'object')
        .map((p) => {
          const merged = {
            ...createProvider(PROVIDER_PRESETS[0]),
            ...p,
            headers: p.headers ?? {},
            body: p.body ?? {},
            reasoning: p.reasoning ?? { enabled: null, effort: '' },
          };
          // 早期版本把 temperature 放在顶层，统一并进 body
          const legacy = (p as { temperature?: number | null }).temperature;
          if (typeof legacy === 'number') {
            merged.body = { temperature: legacy, ...merged.body };
          }
          return merged;
        })
    : base.providers;
  const settings: Settings = {
    ...base,
    ...input,
    autoTranslate: normalizeAutoTranslate(input.autoTranslate),
    providers,
    version: base.version,
  };
  // 草稿代码最多留 30 份，超出按最近更新淘汰
  if (settings.editorCode && typeof settings.editorCode === 'object') {
    const entries = Object.entries(settings.editorCode).filter(
      ([, v]) => v && typeof v === 'object' && typeof (v as { code?: unknown }).code === 'string'
    );
    entries.sort((a, b) => (b[1].updated ?? 0) - (a[1].updated ?? 0));
    settings.editorCode = Object.fromEntries(entries.slice(0, 30));
  } else {
    settings.editorCode = {};
  }
  if (!settings.providers.some((p) => p.id === settings.activeProviderId)) {
    settings.activeProviderId = settings.providers[0]?.id ?? null;
  }
  return settings;
}

/** 旧版 autoTranslate 是全局 boolean：true 表示所有站点都开。迁移成站点 id 映射，'*' 表示「全站」。 */
function normalizeAutoTranslate(raw: unknown): Record<string, boolean> {
  if (typeof raw === 'boolean') return raw ? { '*': true } : {};
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'boolean') out[key] = value;
  }
  return out;
}

/** 某站点是否开启自动翻译；siteId 规则优先于 '*'。 */
export function isAutoTranslateEnabled(settings: Settings, siteId: string): boolean {
  return settings.autoTranslate[siteId] ?? settings.autoTranslate['*'] ?? false;
}
