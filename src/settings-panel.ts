import { testConnection } from './ai';
import {
  PROTOCOL_LABEL,
  PROVIDER_PRESETS,
  createProvider,
  newId,
} from './config';
import type { Protocol, ProviderConfig, Settings } from './types';

export interface SettingsPanelOptions {
  settings: Settings;
  /** next 为 null 表示恢复默认 */
  onChange(next: Settings | null): void;
  onClose(): void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function field(label: string, control: HTMLElement, hint?: string): HTMLElement {
  const wrap = el('div', 'ncb-field');
  const lab = el('label', undefined, label);
  wrap.append(lab, control);
  if (hint) wrap.append(el('div', 'ncb-hint', hint));
  return wrap;
}

function textInput(value: string, placeholder = '', type = 'text'): HTMLInputElement {
  const input = el('input') as HTMLInputElement;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  return input;
}

export function openSettingsPanel(options: SettingsPanelOptions): void {
  const draft: Settings = structuredClone(options.settings);
  let selectedId: string | null =
    draft.activeProviderId ?? draft.providers[0]?.id ?? null;

  const mask = el('div', 'ncb-mask');
  const panel = el('div', 'ncb-panel');

  const head = el('div', 'ncb-panel-head');
  head.append(el('h3', undefined, 'NowcoderBetter 设置'));
  const closeBtn = el('button', 'ncb-btn ncb-btn-ghost', '关闭');
  head.append(closeBtn);

  const body = el('div', 'ncb-panel-body');
  const tabs = el('div', 'ncb-tabs');
  const tabGeneral = el('button', 'ncb-tab', '翻译设置');
  const tabProvider = el('button', 'ncb-tab', '提供商');
  const tabAdvanced = el('button', 'ncb-tab', '高级');
  tabs.append(tabGeneral, tabProvider, tabAdvanced);

  const content = el('div');
  body.append(tabs, content);

  const foot = el('div', 'ncb-panel-foot');
  const resetBtn = el('button', 'ncb-btn ncb-btn-danger', '恢复默认');
  const cancelBtn = el('button', 'ncb-btn', '取消');
  const saveBtn = el('button', 'ncb-btn ncb-btn-primary', '保存');
  foot.append(resetBtn, cancelBtn, saveBtn);

  panel.append(head, body, foot);
  mask.append(panel);

  let activeTab: 'general' | 'provider' | 'advanced' = 'general';

  const render = () => {
    tabGeneral.dataset.active = activeTab === 'general' ? '1' : '0';
    tabProvider.dataset.active = activeTab === 'provider' ? '1' : '0';
    tabAdvanced.dataset.active = activeTab === 'advanced' ? '1' : '0';
    content.replaceChildren();
    if (activeTab === 'general') content.append(renderGeneral());
    else if (activeTab === 'provider') content.append(renderProviders());
    else content.append(renderAdvanced());
  };

  function renderGeneral(): HTMLElement {
    const box = el('div');

    const langInput = textInput(draft.targetLang, '简体中文');
    langInput.addEventListener('input', () => (draft.targetLang = langInput.value));
    box.append(
      field('目标语言', langInput, '译文使用的语言，例如 简体中文 / English / 日本語。'),
    );

    const promptArea = el('textarea') as HTMLTextAreaElement;
    promptArea.value = draft.extraPrompt;
    promptArea.placeholder = '例如：专有名词保留英文原文；解释尽量简短。';
    promptArea.addEventListener('input', () => (draft.extraPrompt = promptArea.value));
    box.append(field('追加提示词', promptArea, '会拼接到内置翻译提示词之后。'));

    box.append(
      checkRow(
        '整段翻译',
        draft.translateWholeBlock,
        '开启后把整块内容一次性发给模型，上下文更完整；关闭则按标题和段落切块，适合超长题面或上下文窗口较小的模型。',
        (v) => (draft.translateWholeBlock = v),
      ),
    );
    box.append(
      checkRow(
        '自动翻译题面',
        draft.autoTranslate,
        '打开题目页后自动翻译题目描述区域。',
        (v) => (draft.autoTranslate = v),
      ),
    );

    const row = el('div', 'ncb-row');
    const timeout = textInput(String(draft.timeoutMs), '120000', 'number');
    timeout.addEventListener('input', () => {
      const n = Number(timeout.value);
      if (Number.isFinite(n) && n > 0) draft.timeoutMs = n;
    });
    const retries = textInput(String(draft.retries), '1', 'number');
    retries.addEventListener('input', () => {
      const n = Number(retries.value);
      if (Number.isFinite(n) && n >= 0) draft.retries = n;
    });
    row.append(
      field('超时（毫秒）', timeout),
      field('失败重试次数', retries, '仅对网络错误和 5xx 生效。'),
    );
    box.append(row);

    return box;
  }

  function renderProviders(): HTMLElement {
    const box = el('div');
    const list = el('div', 'ncb-provider-list');

    draft.providers.forEach((provider) => {
      const item = el('div', 'ncb-provider-item');
      item.dataset.active = provider.id === selectedId ? '1' : '0';

      const radio = el('input') as HTMLInputElement;
      radio.type = 'radio';
      radio.name = 'ncb-provider';
      radio.checked = provider.id === selectedId;
      radio.addEventListener('change', () => {
        selectedId = provider.id;
        draft.activeProviderId = provider.id;
        render();
      });

      const name = el('span', 'ncb-provider-name', provider.name || '未命名');
      const meta = el(
        'span',
        'ncb-provider-meta',
        `${PROTOCOL_LABEL[provider.protocol]} · ${provider.model || '未填模型'}`,
      );

      item.append(radio, name, meta);
      item.addEventListener('click', (event) => {
        if (event.target === radio) return;
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      });
      list.append(item);
    });

    box.append(list);

    const addRow = el('div', 'ncb-row');
    const presetSelect = el('select') as HTMLSelectElement;
    PROVIDER_PRESETS.forEach((preset, index) => {
      const option = el('option') as HTMLOptionElement;
      option.value = String(index);
      option.textContent = preset.label;
      presetSelect.append(option);
    });
    const addBtn = el('button', 'ncb-btn', '新增');
    addBtn.addEventListener('click', () => {
      const preset = PROVIDER_PRESETS[Number(presetSelect.value)];
      const provider = createProvider(preset);
      draft.providers.push(provider);
      selectedId = provider.id;
      draft.activeProviderId = provider.id;
      render();
    });
    addRow.append(field('从预设新增', presetSelect), addBtn);
    box.append(addRow);

    const current = draft.providers.find((p) => p.id === selectedId);
    if (current) box.append(renderProviderEditor(current));

    return box;
  }

  function renderProviderEditor(provider: ProviderConfig): HTMLElement {
    const box = el('div');
    const heading = el('div', 'ncb-field');
    heading.append(el('label', undefined, '配置详情'));
    box.append(heading);

    const nameInput = textInput(provider.name, '给这个配置起个名字');
    nameInput.addEventListener('input', () => {
      provider.name = nameInput.value;
      render();
    });
    box.append(field('备注名', nameInput));

    const protocolSelect = el('select') as HTMLSelectElement;
    (Object.keys(PROTOCOL_LABEL) as Protocol[]).forEach((key) => {
      const option = el('option') as HTMLOptionElement;
      option.value = key;
      option.textContent = PROTOCOL_LABEL[key];
      option.selected = provider.protocol === key;
      protocolSelect.append(option);
    });
    protocolSelect.addEventListener('change', () => {
      provider.protocol = protocolSelect.value as Protocol;
      render();
    });
    box.append(
      field('接口协议', protocolSelect, '决定请求体格式与响应解析方式。'),
    );

    const baseInput = textInput(provider.baseUrl, 'https://api.openai.com/v1');
    baseInput.addEventListener('input', () => (provider.baseUrl = baseInput.value));
    box.append(
      field(
        '接口地址',
        baseInput,
        '填到 /v1 即可，脚本会自动补 /chat/completions、/responses 或 /messages；也可直接填完整端点。',
      ),
    );

    const modelInput = textInput(provider.model, 'gpt-4o-mini');
    modelInput.addEventListener('input', () => (provider.model = modelInput.value));
    box.append(field('模型', modelInput));

    const keyInput = textInput(provider.apiKey, 'sk-...', 'password');
    keyInput.addEventListener('input', () => (provider.apiKey = keyInput.value));
    box.append(
      field('API Key', keyInput, '只保存在本地浏览器存储里，不会上传到任何第三方。'),
    );

    const row = el('div', 'ncb-row');
    const reasoningSelect = el('select') as HTMLSelectElement;
    [
      { value: 'default', label: '跟随模型默认' },
      { value: 'enabled', label: '开启' },
      { value: 'disabled', label: '关闭' },
    ].forEach(({ value, label }) => {
      const option = el('option') as HTMLOptionElement;
      option.value = value;
      option.textContent = label;
      option.selected =
        value === 'default'
          ? provider.reasoning.enabled === null
          : value === 'enabled'
            ? provider.reasoning.enabled === true
            : provider.reasoning.enabled === false;
      reasoningSelect.append(option);
    });
    reasoningSelect.addEventListener('change', () => {
      const v = reasoningSelect.value;
      provider.reasoning.enabled =
        v === 'default' ? null : v === 'enabled';
    });

    const effortInput = textInput(provider.reasoning.effort, 'low / medium / high');
    effortInput.addEventListener(
      'input',
      () => (provider.reasoning.effort = effortInput.value),
    );
    row.append(
      field('推理开关', reasoningSelect, '对应 thinking 字段，部分服务商才支持。'),
      field('推理强度', effortInput, '对应 reasoning_effort / reasoning.effort。'),
    );
    box.append(row);

    const tempInput = textInput(
      provider.temperature === null ? '' : String(provider.temperature),
      '留空使用接口默认值',
    );
    tempInput.addEventListener('input', () => {
      const raw = tempInput.value.trim();
      provider.temperature = raw === '' ? null : Number(raw);
    });
    box.append(field('temperature', tempInput));

    const headerArea = el('textarea') as HTMLTextAreaElement;
    headerArea.value = Object.entries(provider.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    headerArea.placeholder = 'X-Custom-Header: value\n每行一个';
    headerArea.addEventListener('input', () => {
      provider.headers = parsePairs(headerArea.value);
    });
    box.append(
      field('额外请求头', headerArea, '每行 Key: Value，会覆盖同名默认请求头。'),
    );

    const bodyArea = el('textarea') as HTMLTextAreaElement;
    bodyArea.value = JSON.stringify(provider.body ?? {}, null, 2);
    bodyArea.placeholder = '{}';
    bodyArea.addEventListener('input', () => {
      try {
        const parsed = JSON.parse(bodyArea.value || '{}');
        if (parsed && typeof parsed === 'object') provider.body = parsed;
        bodyArea.style.borderColor = '';
      } catch {
        bodyArea.style.borderColor = '#b42318';
      }
    });
    box.append(
      field('额外请求体字段', bodyArea, 'JSON 对象，会合并进请求体，可覆盖任意字段。'),
    );

    const status = el('div', 'ncb-status');
    const actions = el('div', 'ncb-row');
    const testBtn = el('button', 'ncb-btn', '测试连接');
    const dupBtn = el('button', 'ncb-btn', '复制配置');
    const delBtn = el('button', 'ncb-btn ncb-btn-danger', '删除配置');

    testBtn.addEventListener('click', async () => {
      testBtn.disabled = true;
      status.dataset.kind = '';
      status.textContent = '正在测试…';
      try {
        const reply = await testConnection(draft, provider);
        status.dataset.kind = 'ok';
        status.textContent = `连接成功，模型回复：${reply.slice(0, 200)}`;
      } catch (error) {
        status.dataset.kind = 'error';
        status.textContent = `连接失败：${
          error instanceof Error ? error.message : String(error)
        }`;
      } finally {
        testBtn.disabled = false;
      }
    });

    dupBtn.addEventListener('click', () => {
      const copy: ProviderConfig = {
        ...structuredClone(provider),
        id: newId(),
        name: `${provider.name} 副本`,
      };
      draft.providers.push(copy);
      selectedId = copy.id;
      draft.activeProviderId = copy.id;
      render();
    });

    delBtn.addEventListener('click', () => {
      if (draft.providers.length <= 1) {
        status.dataset.kind = 'error';
        status.textContent = '至少保留一个配置。';
        return;
      }
      draft.providers = draft.providers.filter((p) => p.id !== provider.id);
      if (draft.activeProviderId === provider.id) {
        draft.activeProviderId = draft.providers[0]?.id ?? null;
      }
      selectedId = draft.activeProviderId;
      render();
    });

    actions.append(testBtn, dupBtn, delBtn);
    box.append(actions, status);
    return box;
  }

  function renderAdvanced(): HTMLElement {
    const box = el('div');
    const info = el('div', 'ncb-hint');
    info.innerHTML =
      '所有配置保存在浏览器本地存储（GM_setValue），请求由脚本直接发出，不经过任何中间服务器。<br>' +
      '遇到跨域或 401 时，先点“提供商”里的“测试连接”确认地址与 Key。';
    box.append(info);

    const exportArea = el('textarea') as HTMLTextAreaElement;
    exportArea.value = JSON.stringify(
      { ...draft, providers: draft.providers.map((p) => ({ ...p, apiKey: '***' })) },
      null,
      2,
    );
    exportArea.readOnly = true;
    box.append(field('配置预览（已隐藏 Key）', exportArea));

    const importArea = el('textarea') as HTMLTextAreaElement;
    importArea.placeholder = '粘贴导出的 JSON 后点“导入”';
    const importBtn = el('button', 'ncb-btn', '导入');
    const status = el('div', 'ncb-status');
    importBtn.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(importArea.value);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.providers)) {
          throw new Error('缺少 providers 数组');
        }
        const merged = parsed as Settings;
        draft.targetLang = merged.targetLang ?? draft.targetLang;
        draft.extraPrompt = merged.extraPrompt ?? draft.extraPrompt;
        draft.providers = merged.providers;
        draft.activeProviderId = merged.activeProviderId ?? merged.providers[0]?.id ?? null;
        selectedId = draft.activeProviderId;
        status.dataset.kind = 'ok';
        status.textContent = '导入成功，保存后生效。';
        render();
      } catch (error) {
        status.dataset.kind = 'error';
        status.textContent = `导入失败：${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    });
    box.append(field('导入配置', importArea), importBtn, status);
    return box;
  }

  function checkRow(
    label: string,
    value: boolean,
    hint: string,
    onChange: (v: boolean) => void,
  ): HTMLElement {
    const row = el('div', 'ncb-check');
    const input = el('input') as HTMLInputElement;
    input.type = 'checkbox';
    input.checked = value;
    input.id = `ncb-${label}`;
    input.addEventListener('change', () => onChange(input.checked));
    const wrap = el('label');
    wrap.htmlFor = input.id;
    wrap.append(el('div', undefined, label), el('div', 'ncb-hint', hint));
    row.append(input, wrap);
    return row;
  }

  tabGeneral.addEventListener('click', () => {
    activeTab = 'general';
    render();
  });
  tabProvider.addEventListener('click', () => {
    activeTab = 'provider';
    render();
  });
  tabAdvanced.addEventListener('click', () => {
    activeTab = 'advanced';
    render();
  });

  const close = () => {
    mask.remove();
    document.removeEventListener('keydown', onKey);
    options.onClose();
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  saveBtn.addEventListener('click', () => {
    if (!draft.activeProviderId && draft.providers[0]) {
      draft.activeProviderId = draft.providers[0].id;
    }
    options.onChange(draft);
    close();
  });
  cancelBtn.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  resetBtn.addEventListener('click', () => {
    if (!confirm('确定恢复默认设置？当前配置会被清空。')) return;
    options.onChange(null);
    close();
  });
  mask.addEventListener('click', (event) => {
    if (event.target === mask) close();
  });
  document.addEventListener('keydown', onKey);

  render();
  document.body.append(mask);
}

function parsePairs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf(':');
    if (index <= 0) continue;
    out[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
  }
  return out;
}
