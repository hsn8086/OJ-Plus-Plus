import { APP_NAME } from '../brand.ts';
import { testConnection } from '../core/ai.ts';
import { resolveLocale, setLocale, t } from '../i18n/index.ts';
import { applyTheme } from './theme.ts';
import {
  PROTOCOL_LABEL,
  PROVIDER_PRESETS,
  createProvider,
  newId,
  migrate,
} from '../core/config.ts';
import type { Locale, Protocol, ProviderConfig, Settings, Theme } from '../core/types.ts';
import type { HttpTransport } from '../platforms/types.ts';

export interface SettingsPanelOptions {
  settings: Settings;
  /** next 为 null 表示恢复默认 */
  onChange(next: Settings | null): Promise<void>;
  request: HttpTransport;
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
  const wrap = el('div', 'ojpp-field');
  const labelNode = el('label', undefined, label);
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(control.tagName)) {
    control.id ||= `ojpp-field-${newId()}`;
    labelNode.htmlFor = control.id;
  }
  wrap.append(labelNode, control);
  if (hint) wrap.append(el('div', 'ojpp-hint', hint));
  return wrap;
}

function textInput(
  value: string,
  placeholder = '',
  type: 'text' | 'password' | 'number' = 'text',
): HTMLInputElement {
  const input = el('input') as HTMLInputElement;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  return input;
}

export function openSettingsPanel(options: SettingsPanelOptions): () => void {
  const draft: Settings = structuredClone(options.settings);
  let selectedId: string | null =
    draft.activeProviderId ?? draft.providers[0]?.id ?? null;

  const mask = el('div', 'ojpp-mask');
  const panel = el('div', 'ojpp-panel');

  const head = el('div', 'ojpp-panel-head');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  const titleNode = el('h3', undefined, t('app.settingsTitle', { name: APP_NAME }));
  head.append(titleNode);
  const closeBtn = el('button', 'ojpp-btn ojpp-btn-ghost', t('common.close'));
  head.append(closeBtn);

  const body = el('div', 'ojpp-panel-body');
  const tabs = el('div', 'ojpp-tabs');
  const tabGeneral = el('button', 'ojpp-tab', t('settings.tab.general'));
  const tabProvider = el('button', 'ojpp-tab', t('settings.tab.provider'));
  const tabAdvanced = el('button', 'ojpp-tab', t('settings.tab.advanced'));
  tabs.append(tabGeneral, tabProvider, tabAdvanced);

  const content = el('div');
  body.append(tabs, content);

  const foot = el('div', 'ojpp-panel-foot');
  const resetBtn = el('button', 'ojpp-btn ojpp-btn-danger', t('settings.reset'));
  const cancelBtn = el('button', 'ojpp-btn', t('common.cancel'));
  const saveBtn = el('button', 'ojpp-btn ojpp-btn-primary', t('common.save'));
  const saveStatus = el('span', 'ojpp-status');
  saveStatus.setAttribute('role', 'status');
  foot.append(saveStatus, resetBtn, cancelBtn, saveBtn);

  panel.append(head, body, foot);
  mask.append(panel);

  let activeTab: 'general' | 'provider' | 'advanced' = 'general';

  /**
   * 切换界面语言后，面板自身的标题、标签页和按钮也要重新取词。
   * 只重绘 content 会留下中文的标题与按钮，看起来像只翻了一半。
   */
  const retitle = () => {
    const title = t('app.settingsTitle', { name: APP_NAME });
    panel.setAttribute('aria-label', title);
    titleNode.textContent = title;
    closeBtn.textContent = t('common.close');
    tabGeneral.textContent = t('settings.tab.general');
    tabProvider.textContent = t('settings.tab.provider');
    tabAdvanced.textContent = t('settings.tab.advanced');
    resetBtn.textContent = t('settings.reset');
    cancelBtn.textContent = t('common.cancel');
    saveBtn.textContent = t('common.save');
  };

  const render = () => {
    retitle();
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

    // 界面语言：切换后立即重绘，方便马上看到效果
    const localeSelect = el('select') as HTMLSelectElement;
    [
      { value: 'auto', label: t('settings.localeAuto') },
      { value: 'zh', label: t('settings.localeZh') },
      { value: 'en', label: t('settings.localeEn') },
    ].forEach(({ value, label }) => {
      const option = el('option') as HTMLOptionElement;
      option.value = value;
      option.textContent = label;
      option.selected = draft.locale === value;
      localeSelect.append(option);
    });
    localeSelect.addEventListener('change', () => {
      draft.locale = localeSelect.value as Locale;
      setLocale(resolveLocale(draft.locale));
      render();
    });
    box.append(
      field(t('settings.uiLanguage'), localeSelect, t('settings.uiLanguageHint')),
    );

    // 主题：站点没有提供暗色样式时禁用，避免选了没效果
    const themeSelect = el('select') as HTMLSelectElement;
    [
      { value: 'auto', label: t('settings.themeAuto') },
      { value: 'light', label: t('settings.themeLight') },
      { value: 'dark', label: t('settings.themeDark') },
    ].forEach(({ value, label }) => {
      const option = el('option') as HTMLOptionElement;
      option.value = value;
      option.textContent = label;
      option.selected = draft.theme === value;
      themeSelect.append(option);
    });
    themeSelect.addEventListener('change', () => {
      draft.theme = themeSelect.value as Theme;
      applyTheme(draft.theme);
    });
    box.append(field(t('settings.theme'), themeSelect, t('settings.themeHint')));

    const langInput = textInput(draft.targetLang, t('settings.targetLangPlaceholder'));
    langInput.addEventListener('input', () => (draft.targetLang = langInput.value));
    box.append(
      field(t('settings.targetLang'), langInput, t('settings.targetLangHint')),
    );

    const promptArea = el('textarea') as HTMLTextAreaElement;
    promptArea.value = draft.extraPrompt;
    promptArea.placeholder = t('settings.extraPromptPlaceholder');
    promptArea.addEventListener('input', () => (draft.extraPrompt = promptArea.value));
    box.append(field(t('settings.extraPrompt'), promptArea, t('settings.extraPromptHint')));

    box.append(
      checkRow(
        t('settings.wholeBlock'),
        draft.translateWholeBlock,
        t('settings.wholeBlockHint'),
        (v) => (draft.translateWholeBlock = v),
      ),
    );
    box.append(
      checkRow(
        t('settings.autoTranslate'),
        draft.autoTranslate,
        t('settings.autoTranslateHint'),
        (v) => (draft.autoTranslate = v),
      ),
    );
    box.append(
      checkRow(
        t('settings.streaming'),
        draft.streaming,
        t('settings.streamingHint'),
        (v) => (draft.streaming = v),
      ),
    );

    const row = el('div', 'ojpp-row');
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
      field(t('settings.timeout'), timeout),
      field(t('settings.retries'), retries, t('settings.retriesHint')),
    );
    box.append(row);

    return box;
  }

  function renderProviders(): HTMLElement {
    const box = el('div');
    const list = el('div', 'ojpp-provider-list');
    /** 备注名直接改文本，避免重绘导致输入框失焦 */
    const nameRefs = new Map<string, HTMLElement>();

    draft.providers.forEach((provider) => {
      const item = el('div', 'ojpp-provider-item');
      item.dataset.active = provider.id === selectedId ? '1' : '0';

      const radio = el('input') as HTMLInputElement;
      radio.type = 'radio';
      radio.name = 'ojpp-provider';
      radio.checked = provider.id === selectedId;

      const name = el('span', 'ojpp-provider-name', provider.name || t('common.unnamed'));
      const meta = el(
        'span',
        'ojpp-provider-meta',
        `${PROTOCOL_LABEL[provider.protocol]} · ${provider.model || t('common.notFilled')}`,
      );
      nameRefs.set(provider.id, name);

      const select = () => {
        if (selectedId === provider.id) return;
        selectedId = provider.id;
        draft.activeProviderId = provider.id;
        render();
      };
      radio.addEventListener('change', select);
      item.addEventListener('click', (event) => {
        if (event.target === radio) return;
        select();
      });

      item.append(radio, name, meta);
      list.append(item);
    });

    box.append(list);

    const addRow = el('div', 'ojpp-row');
    const presetSelect = el('select') as HTMLSelectElement;
    PROVIDER_PRESETS.forEach((preset, index) => {
      const option = el('option') as HTMLOptionElement;
      option.value = String(index);
      option.textContent = preset.label;
      presetSelect.append(option);
    });
    const addBtn = el('button', 'ojpp-btn', t('settings.add'));
    addBtn.addEventListener('click', () => {
      const preset = PROVIDER_PRESETS[Number(presetSelect.value)];
      const provider = createProvider(preset);
      draft.providers.push(provider);
      selectedId = provider.id;
      draft.activeProviderId = provider.id;
      render();
    });
    addRow.append(field(t('settings.addFromPreset'), presetSelect), addBtn);
    box.append(addRow);

    const current = draft.providers.find((p) => p.id === selectedId);
    if (current) {
      box.append(
        renderProviderEditor(current, (name) => {
          const ref = nameRefs.get(current.id);
          if (ref) ref.textContent = name || t('common.unnamed');
        }),
      );
    }

    return box;
  }

  function renderProviderEditor(
    provider: ProviderConfig,
    onNameChange: (name: string) => void,
  ): HTMLElement {
    const box = el('div');

    const nameInput = textInput(provider.name, t('settings.providerNamePlaceholder'));
    // 只同步数据与列表文字，不重绘面板，否则每敲一个字母都会失焦
    nameInput.addEventListener('input', () => {
      provider.name = nameInput.value;
      onNameChange(nameInput.value);
    });
    box.append(field(t('settings.providerName'), nameInput));

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
    box.append(field(t('settings.protocol'), protocolSelect, t('settings.protocolHint')));

    const baseInput = textInput(provider.baseUrl, 'https://api.openai.com/v1');
    baseInput.addEventListener('input', () => (provider.baseUrl = baseInput.value));
    box.append(field(t('settings.baseUrl'), baseInput, t('settings.baseUrlHint')));

    const modelInput = textInput(provider.model, 'gpt-6-luna');
    modelInput.addEventListener('input', () => (provider.model = modelInput.value));
    box.append(field(t('settings.model'), modelInput));

    const keyInput = textInput(provider.apiKey, t('settings.apiKeyPlaceholder'), 'password');
    keyInput.addEventListener('input', () => (provider.apiKey = keyInput.value));
    box.append(field('API Key', keyInput, t('settings.apiKeyHint')));

    const row = el('div', 'ojpp-row');
    const reasoningSelect = el('select') as HTMLSelectElement;
    [
      { value: 'default', label: t('settings.effortDefault') },
      { value: 'enabled', label: t('settings.effortEnabled') },
      { value: 'disabled', label: t('settings.effortDisabled') },
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
      provider.reasoning.enabled = v === 'default' ? null : v === 'enabled';
    });

    const effortInput = textInput(provider.reasoning.effort, 'low / medium / high');
    effortInput.addEventListener(
      'input',
      () => (provider.reasoning.effort = effortInput.value),
    );
    row.append(
      field(t('settings.reasoning'), reasoningSelect, t('settings.reasoningHint')),
      field(t('settings.reasoningEffort'), effortInput, t('settings.reasoningEffortHint')),
    );
    box.append(row);

    const headerArea = el('textarea') as HTMLTextAreaElement;
    headerArea.value = Object.entries(provider.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    headerArea.placeholder = t('settings.headersPlaceholder');
    headerArea.addEventListener('input', () => {
      provider.headers = parsePairs(headerArea.value);
    });
    box.append(field(t('settings.headers'), headerArea, t('settings.headersHint')));

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
    box.append(field(t('settings.body'), bodyArea, t('settings.bodyHint')));

    const status = el('div', 'ojpp-status');
    const actions = el('div', 'ojpp-row');
    const testBtn = el('button', 'ojpp-btn', t('settings.test'));
    const dupBtn = el('button', 'ojpp-btn', t('settings.copyProvider'));
    const delBtn = el('button', 'ojpp-btn ojpp-btn-danger', t('settings.deleteProvider'));

    testBtn.addEventListener('click', async () => {
      testBtn.disabled = true;
      status.dataset.kind = '';
      status.textContent = t('settings.testing');
      try {
        const reply = await testConnection(options.request, draft, provider);
        status.dataset.kind = 'ok';
        status.textContent = t('settings.testOk', { reply: reply.slice(0, 200) });
      } catch (error) {
        status.dataset.kind = 'error';
        status.textContent = t('settings.testFail', {
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        testBtn.disabled = false;
      }
    });

    dupBtn.addEventListener('click', () => {
      const copy: ProviderConfig = {
        ...structuredClone(provider),
        id: newId(),
        name: t('settings.providerCopySuffix', { name: provider.name }),
      };
      draft.providers.push(copy);
      selectedId = copy.id;
      draft.activeProviderId = copy.id;
      render();
    });

    delBtn.addEventListener('click', () => {
      if (draft.providers.length <= 1) {
        status.dataset.kind = 'error';
        status.textContent = t('settings.keepOne');
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
    const info = el('div', 'ojpp-hint');
    info.textContent = t('settings.providerFooter');
    box.append(info);

    const exportArea = el('textarea') as HTMLTextAreaElement;
    exportArea.value = JSON.stringify(
      {
        ...draft,
        // 空 Key 保持为空，不要显示成 ***，否则导入后以为已经填过
        providers: draft.providers.map((p) => ({
          ...p,
          apiKey: p.apiKey ? '***' : '',
        })),
      },
      null,
      2,
    );
    exportArea.readOnly = true;
    box.append(field(t('settings.preview'), exportArea));

    const importArea = el('textarea') as HTMLTextAreaElement;
    importArea.placeholder = t('settings.importPlaceholder');
    const importBtn = el('button', 'ojpp-btn', t('settings.import'));
    const status = el('div', 'ojpp-status');
    importBtn.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(importArea.value) as Settings;
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.providers)) {
          throw new Error(t('settings.importMissing'));
        }
        Object.assign(draft, migrate(parsed));
        selectedId = draft.activeProviderId;
        status.dataset.kind = 'ok';
        status.textContent = t('settings.importOk');
        render();
      } catch (error) {
        status.dataset.kind = 'error';
        status.textContent = t('settings.importFail', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
    box.append(field(t('settings.importTitle'), importArea), importBtn, status);
    return box;
  }

  function checkRow(
    label: string,
    value: boolean,
    hint: string,
    onChange: (v: boolean) => void,
  ): HTMLElement {
    const row = el('div', 'ojpp-check');
    const input = el('input') as HTMLInputElement;
    input.type = 'checkbox';
    input.checked = value;
    input.id = `ojpp-${label}`;
    input.addEventListener('change', () => onChange(input.checked));
    const wrap = el('label');
    wrap.htmlFor = input.id;
    wrap.append(el('div', undefined, label), el('div', 'ojpp-hint', hint));
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

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    mask.remove();
    document.removeEventListener('keydown', onKey);
    options.onClose();
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  const persist = async (next: Settings | null) => {
    saveBtn.disabled = resetBtn.disabled = true;
    saveStatus.textContent = '';
    try {
      await options.onChange(next);
      close();
    } catch (error) {
      saveStatus.dataset.kind = 'error';
      saveStatus.textContent = t('settings.saveFailed', { message: error instanceof Error ? error.message : String(error) });
    } finally {
      saveBtn.disabled = resetBtn.disabled = false;
    }
  };
  saveBtn.addEventListener('click', () => {
    if (!draft.activeProviderId && draft.providers[0]) {
      draft.activeProviderId = draft.providers[0].id;
    }
    void persist(draft);
  });
  cancelBtn.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  resetBtn.addEventListener('click', () => {
    if (confirm(t('settings.resetConfirm'))) void persist(null);
  });

  // 只有同一次手势从遮罩开始、在遮罩结束，且没有拖动，才关闭。
  let maskPress: { id: number; x: number; y: number } | undefined;
  mask.addEventListener('pointerdown', (event) => {
    maskPress = event.target === mask && event.button === 0
      ? { id: event.pointerId, x: event.clientX, y: event.clientY }
      : undefined;
  });
  mask.addEventListener('pointercancel', () => { maskPress = undefined; });
  mask.addEventListener('pointerup', (event) => {
    const press = maskPress;
    maskPress = undefined;
    if (press && event.pointerId === press.id && event.target === mask &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) < 4) close();
  });
  document.addEventListener('keydown', onKey);

  render();
  document.body.append(mask);
  return close;
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
