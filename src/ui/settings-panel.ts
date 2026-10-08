import { APP_NAME } from '../brand.ts';
import { testConnection } from '../core/ai.ts';
import { resolveLocale, setLocale, t } from '../i18n/index.ts';
import { applyTheme } from './theme.ts';
import {
  PROTOCOL_LABEL,
  PROVIDER_PRESETS,
  createProvider,
  newId,
} from '../core/config.ts';
import type { Locale, Protocol, ProviderConfig, Settings, Theme } from '../core/types.ts';
import type { HttpTransport } from '../platforms/types.ts';
import { applyStagger } from './animations.ts';

export interface SettingsPanelOptions {
  settings: Settings;
  onChange(next: Settings | null): Promise<void>;
  request: HttpTransport;
  onClose(): void;
}

// SVG 图标
const iconChevronLeft = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const iconPlus = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-7-7h14"/></svg>';
const iconPencil = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const iconX = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const iconCheck = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

type View = 'main' | 'providers' | 'edit' | 'picker';

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

export function openSettingsPanel(options: SettingsPanelOptions): () => void {
  const draft: Settings = structuredClone(options.settings);

  const mask = el('div', 'ojpp-mask');
  const panel = el('div', 'ojpp-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  const head = el('div', 'ojpp-panel-head');
  const backBtn = el('button', 'ojpp-back-btn');
  backBtn.innerHTML = iconChevronLeft;
  backBtn.style.display = 'none';
  const titleNode = el('h3');
  const closeBtn = el('button', 'ojpp-panel-close');
  closeBtn.innerHTML = iconX;
  closeBtn.setAttribute('aria-label', t('common.close'));
  head.append(backBtn, titleNode, closeBtn);

  const body = el('div', 'ojpp-panel-body');

  const foot = el('div', 'ojpp-panel-foot');
  const resetBtn = el('button', 'ojpp-btn ojpp-btn-danger', t('settings.reset'));
  const saveBtn = el('button', 'ojpp-btn ojpp-btn-primary', t('common.save'));
  const saveStatus = el('span', 'ojpp-status');
  saveStatus.setAttribute('role', 'status');
  foot.append(resetBtn, saveStatus, saveBtn);

  panel.append(head, body, foot);
  mask.append(panel);

  // 保存草稿
  const save = () => {
    // 自动保存到 draft，不需要手动调用
  };

  // 视图切换
  /**
   * 切换界面语言后，面板自身的固定文案（标题、底部按钮）也要重新取词。
   * 只重绘 body 会留下中文的标题与按钮，看起来像只翻了一半。
   */
  const retitle = () => {
    closeBtn.setAttribute('aria-label', t('common.close'));
    resetBtn.textContent = t('settings.reset');
    saveBtn.textContent = t('common.save');
    // 标题跟着当前视图走，这里只处理固定文案；
    // switchView 会在自己那条分支里再设一次标题。
  };

  const switchView = (view: View, data?: string) => {
    retitle();
    if (view === 'main') {
      titleNode.textContent = APP_NAME;
      backBtn.style.display = 'none';
      body.replaceChildren(renderMain());
    } else if (view === 'providers') {
      titleNode.textContent = t('settings.providers');
      backBtn.style.display = 'flex';
      backBtn.onclick = () => switchView('main');
      body.replaceChildren(renderProviders());
    } else if (view === 'edit' && data) {
      const provider = draft.providers.find((p) => p.id === data);
      if (provider) {
        titleNode.textContent = provider.name || t('common.unnamed');
        backBtn.style.display = 'flex';
        backBtn.onclick = () => switchView('providers');
        body.replaceChildren(renderEdit(provider));
      }
    } else if (view === 'picker') {
      titleNode.textContent = t('settings.addProvider');
      backBtn.style.display = 'flex';
      backBtn.onclick = () => switchView('providers');
      body.replaceChildren(renderPicker());
    }
  };

  // 主视图
  function renderMain(): HTMLElement {
    const container = el('div');

    // 通用设置
    const sec1 = section(t('settings.general'));

    // 语言和主题（网格）
    const row1 = el('div', 'ojpp-row');
    const localeSelect = select([
      ['auto', t('settings.localeAuto')],
      ['zh', '中文'],
      ['en', 'English'],
    ], draft.locale);
    localeSelect.onchange = () => {
      draft.locale = localeSelect.value as Locale;
      setLocale(resolveLocale(draft.locale));
      switchView('main');
    };

    const themeSelect = select([
      ['auto', t('settings.themeAuto')],
      ['light', t('settings.themeLight')],
      ['dark', t('settings.themeDark')],
    ], draft.theme);
    themeSelect.onchange = () => {
      draft.theme = themeSelect.value as Theme;
      applyTheme(draft.theme);
    };

    row1.append(
      field(t('settings.language'), localeSelect),
      field(t('settings.theme'), themeSelect)
    );

    const targetInput = input(draft.targetLang, t('settings.targetLangPlaceholder'));
    targetInput.oninput = () => draft.targetLang = targetInput.value;

    const promptArea = el('textarea') as HTMLTextAreaElement;
    promptArea.value = draft.extraPrompt;
    promptArea.placeholder = t('settings.extraPromptPlaceholder');
    promptArea.style.minHeight = '60px';
    promptArea.oninput = () => draft.extraPrompt = promptArea.value;

    sec1.body.append(
      row1,
      field(t('settings.targetLang'), targetInput),
      field(t('settings.extraPrompt'), promptArea)
    );
    container.append(sec1.container);

    // 翻译行为
    const sec2 = section(t('settings.behavior'));
    sec2.body.append(
      check(t('settings.wholeBlock'), draft.translateWholeBlock, (v) => draft.translateWholeBlock = v),
      check(t('settings.autoTranslate'), draft.autoTranslate, (v) => draft.autoTranslate = v),
      check(t('settings.streaming'), draft.streaming, (v) => draft.streaming = v),
    );

    // 超时和重试
    const row2 = el('div', 'ojpp-row');
    const timeoutInput = input(String(draft.timeoutMs), '120000');
    timeoutInput.type = 'number';
    timeoutInput.oninput = () => {
      const n = Number(timeoutInput.value);
      if (Number.isFinite(n) && n > 0) draft.timeoutMs = n;
    };
    const retriesInput = input(String(draft.retries), '1');
    retriesInput.type = 'number';
    retriesInput.oninput = () => {
      const n = Number(retriesInput.value);
      if (Number.isFinite(n) && n >= 0) draft.retries = n;
    };
    row2.append(
      field(t('settings.timeout'), timeoutInput),
      field(t('settings.retries'), retriesInput)
    );
    sec2.body.append(row2);
    container.append(sec2.container);

    // 提供商摘要
    const sec3 = section(t('settings.providers'), String(draft.providers.length));
    const active = draft.providers.find((p) => p.id === draft.activeProviderId);
    const summary = el('div', 'ojpp-provider-summary');
    if (active) {
      summary.textContent = `${active.name || t('common.unnamed')} · ${active.model || '—'}`;
    } else {
      summary.textContent = t('settings.noProvider');
    }
    const manageBtn = el('button', 'ojpp-btn ojpp-btn-primary', t('settings.manage'));
    manageBtn.onclick = () => switchView('providers');
    sec3.body.append(summary, manageBtn);
    container.append(sec3.container);

    requestAnimationFrame(() => {
      const sections = Array.from(container.querySelectorAll('.ojpp-section')) as HTMLElement[];
      applyStagger(sections, 0, 15);
    });

    return container;
  }

  // 提供商列表
  function renderProviders(): HTMLElement {
    const container = el('div', 'ojpp-section-body');
    container.style.padding = '16px';

    const addBtn = el('button', 'ojpp-add-provider');
    addBtn.innerHTML = iconPlus;
    addBtn.title = t('settings.addProvider');
    addBtn.onclick = () => switchView('picker');
    container.append(addBtn);

    if (draft.providers.length === 0) {
      const empty = el('div', 'ojpp-hint', t('settings.noProvider'));
      empty.style.textAlign = 'center';
      empty.style.padding = '40px 20px';
      container.append(empty);
      return container;
    }

    const list = el('div', 'ojpp-provider-list');
    draft.providers.forEach((p) => {
      const item = el('div', 'ojpp-provider-item');
      item.dataset.active = p.id === draft.activeProviderId ? '1' : '0';

      const radio = el('input') as HTMLInputElement;
      radio.type = 'radio';
      radio.name = 'provider';
      radio.checked = p.id === draft.activeProviderId;
      radio.onclick = () => {
        draft.activeProviderId = p.id;
        switchView('providers');
      };

      const text = el('div', 'ojpp-provider-text');
      text.append(
        el('div', 'ojpp-provider-name', p.name || t('common.unnamed')),
        el('div', 'ojpp-provider-meta', `${PROTOCOL_LABEL[p.protocol]} · ${p.model || '—'}`)
      );

      const badge = el('span', 'ojpp-provider-badge', iconCheck);
      badge.innerHTML = iconCheck;
      if (p.id !== draft.activeProviderId) badge.style.visibility = 'hidden';

      const editBtn = el('button', 'ojpp-provider-edit');
      editBtn.innerHTML = iconPencil;
      editBtn.title = t('settings.edit');
      editBtn.onclick = (e) => {
        e.stopPropagation();
        switchView('edit', p.id);
      };

      item.onclick = () => switchView('edit', p.id);
      item.append(radio, text, badge, editBtn);
      list.append(item);
    });

    container.append(list);

    requestAnimationFrame(() => {
      const items = Array.from(list.children) as HTMLElement[];
      applyStagger(items, 0, 15);
    });

    return container;
  }

  // 编辑提供商
  function renderEdit(provider: ProviderConfig): HTMLElement {
    const container = el('div');

    const sec1 = section(t('settings.basic'));
    const nameInput = input(provider.name, t('settings.providerNamePlaceholder'));
    nameInput.oninput = () => {
      provider.name = nameInput.value;
      titleNode.textContent = nameInput.value || t('common.unnamed');
      save();
    };

    const protocolSelect = select(
      (Object.keys(PROTOCOL_LABEL) as Protocol[]).map((k) => [k, PROTOCOL_LABEL[k]]),
      provider.protocol
    );
    protocolSelect.onchange = () => {
      provider.protocol = protocolSelect.value as Protocol;
      save();
    };

    const baseInput = input(provider.baseUrl, 'https://api.openai.com/v1');
    baseInput.oninput = () => {
      provider.baseUrl = baseInput.value;
      save();
    };

    const modelInput = input(provider.model, 'gpt-4o');
    modelInput.oninput = () => {
      provider.model = modelInput.value;
      save();
    };

    const keyInput = input(provider.apiKey, '', 'password');
    keyInput.oninput = () => {
      provider.apiKey = keyInput.value;
      save();
    };

    // 协议与模型并排一行；el() 只接受 (tag, className, text)，
    // 多出来的子元素要用 append，不能当参数传。
    const protocolModelRow = el('div', 'ojpp-row');
    protocolModelRow.append(
      field(t('settings.protocol'), protocolSelect),
      field(t('settings.model'), modelInput),
    );
    sec1.body.append(
      field(t('settings.providerName'), nameInput),
      protocolModelRow,
      field(t('settings.baseUrl'), baseInput),
      field('API Key', keyInput),
    );
    container.append(sec1.container);

    // 高级选项
    const sec2 = section(t('settings.advancedOptions'));

    // Reasoning
    const row1 = el('div', 'ojpp-row');
    const reasoningSelect = select([
      ['', t('settings.effortDefault')],
      ['enabled', t('settings.effortEnabled')],
      ['disabled', t('settings.effortDisabled')],
    ], provider.reasoning.enabled === null ? '' : provider.reasoning.enabled ? 'enabled' : 'disabled');
    reasoningSelect.onchange = () => {
      const v = reasoningSelect.value;
      provider.reasoning.enabled = v === '' ? null : v === 'enabled';
      save();
    };

    const effortSelect = select([
      ['', t('settings.effortDefault')],
      ['low', 'Low'],
      ['medium', 'Medium'],
      ['high', 'High'],
    ], provider.reasoning.effort || '');
    effortSelect.onchange = () => {
      provider.reasoning.effort = effortSelect.value;
      save();
    };

    row1.append(
      field(t('settings.reasoning'), reasoningSelect),
      field(t('settings.reasoningEffort'), effortSelect)
    );
    sec2.body.append(row1);

    // Headers
    const headersArea = el('textarea') as HTMLTextAreaElement;
    headersArea.value = Object.entries(provider.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    headersArea.placeholder = t('settings.headersPlaceholder');
    headersArea.style.minHeight = '60px';
    headersArea.oninput = () => {
      provider.headers = parsePairs(headersArea.value);
      save();
    };
    sec2.body.append(field(t('settings.headers'), headersArea));

    // Body
    const bodyArea = el('textarea') as HTMLTextAreaElement;
    bodyArea.value = JSON.stringify(provider.body ?? {}, null, 2);
    bodyArea.placeholder = '{}';
    bodyArea.style.minHeight = '60px';
    bodyArea.oninput = () => {
      try {
        const parsed = JSON.parse(bodyArea.value || '{}');
        if (parsed && typeof parsed === 'object') {
          provider.body = parsed;
          bodyArea.style.borderColor = '';
          save();
        }
      } catch {
        bodyArea.style.borderColor = 'var(--color-danger)';
      }
    };
    sec2.body.append(field(t('settings.body'), bodyArea));

    container.append(sec2.container);

    // 操作区
    const sec3 = section(t('settings.actions'));
    const status = el('div', 'ojpp-status');
    const actions = el('div', 'ojpp-row');
    
    const testBtn = el('button', 'ojpp-btn', t('settings.test'));
    testBtn.onclick = async () => {
      testBtn.disabled = true;
      status.textContent = t('settings.testing');
      status.dataset.kind = '';
      try {
        const reply = await testConnection(options.request, draft, provider);
        status.dataset.kind = 'ok';
        status.textContent = t('settings.testOk', { reply: reply.slice(0, 100) });
      } catch (error) {
        status.dataset.kind = 'error';
        status.textContent = t('settings.testFail', {
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        testBtn.disabled = false;
      }
    };

    const dupBtn = el('button', 'ojpp-btn', t('settings.duplicate'));
    dupBtn.onclick = () => {
      const copy: ProviderConfig = {
        ...structuredClone(provider),
        id: newId(),
        name: t('settings.providerCopySuffix', { name: provider.name }),
      };
      draft.providers.push(copy);
      draft.activeProviderId = copy.id;
      switchView('edit', copy.id);
    };

    const delBtn = el('button', 'ojpp-btn ojpp-btn-danger', t('settings.delete'));
    delBtn.onclick = () => {
      if (draft.providers.length <= 1) {
        status.dataset.kind = 'error';
        status.textContent = t('settings.keepOne');
        return;
      }
      if (!confirm(t('settings.deleteConfirm', { name: provider.name || t('common.unnamed') }))) {
        return;
      }
      draft.providers = draft.providers.filter((p) => p.id !== provider.id);
      if (draft.activeProviderId === provider.id) {
        draft.activeProviderId = draft.providers[0]?.id ?? null;
      }
      switchView('providers');
    };

    actions.append(testBtn, dupBtn, delBtn);
    sec3.body.append(actions, status);
    container.append(sec3.container);

    requestAnimationFrame(() => {
      const sections = Array.from(container.querySelectorAll('.ojpp-section')) as HTMLElement[];
      applyStagger(sections, 0, 15);
    });

    return container;
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

  // 选择预设
  function renderPicker(): HTMLElement {
    const container = el('div');
    container.style.padding = '16px';

    const search = input('', t('settings.search'));
    search.oninput = () => paint(search.value);
    container.append(search);

    const grid = el('div', 'ojpp-preset-grid');
    container.append(grid);

    const paint = (query: string) => {
      grid.replaceChildren();
      const q = query.trim().toLowerCase();
      // 自定义排在最前，方便自己填地址；否则用户要滚到底才能找到
      const matched = PROVIDER_PRESETS.filter(
        (preset) =>
          !q || preset.label.toLowerCase().includes(q) || preset.baseUrl.toLowerCase().includes(q),
      ).sort((a, b) => (a.key === 'custom' ? -1 : b.key === 'custom' ? 1 : 0));

      matched.forEach((preset) => {
        const item = el('button', 'ojpp-preset-item');
        item.append(el('span', 'ojpp-preset-name', preset.label));
        // 自定义没有 baseUrl，不显示空的 meta 行
        const meta = preset.baseUrl.replace(/^https?:\/\//, '');
        if (meta) item.append(el('span', 'ojpp-preset-meta', meta));
        item.onclick = () => {
          const provider = createProvider(preset);
          draft.providers.push(provider);
          draft.activeProviderId = provider.id;
          switchView('edit', provider.id);
        };
        grid.append(item);
      });

      if (matched.length === 0) {
        grid.append(el('div', 'ojpp-hint', t('settings.noMatch')));
      }

      requestAnimationFrame(() => {
        const items = Array.from(grid.querySelectorAll('.ojpp-preset-item')) as HTMLElement[];
        applyStagger(items, 0, 10);
      });
    };

    paint('');
    requestAnimationFrame(() => search.focus());

    return container;
  }

  // 工具函数
  function section(title: string, badge?: string) {
    const container = el('div', 'ojpp-section');
    const header = el('div', 'ojpp-section-header');
    const titleEl = el('h4', 'ojpp-section-title', title);
    header.append(titleEl);
    if (badge) {
      header.append(el('span', 'ojpp-section-badge', badge));
    }
    const body = el('div', 'ojpp-section-body');
    container.append(header, body);
    return { header, body, container };
  }

  function field(label: string, control: HTMLElement) {
    const wrap = el('div', 'ojpp-field');
    const labelNode = el('label', undefined, label);
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(control.tagName)) {
      control.id ||= `ojpp-${newId()}`;
      labelNode.htmlFor = control.id;
    }
    wrap.append(labelNode, control);
    return wrap;
  }

  function input(value: string, placeholder = '', type: 'text' | 'password' = 'text') {
    const input = el('input') as HTMLInputElement;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    return input;
  }

  function select(options: Array<[string, string]>, value: string) {
    const select = el('select') as HTMLSelectElement;
    options.forEach(([val, label]) => {
      const option = el('option') as HTMLOptionElement;
      option.value = val;
      option.textContent = label;
      option.selected = val === value;
      select.append(option);
    });
    return select;
  }

  function check(label: string, value: boolean, onChange: (v: boolean) => void) {
    const row = el('div', 'ojpp-check');
    const input = el('input') as HTMLInputElement;
    input.type = 'checkbox';
    input.checked = value;
    input.id = `ojpp-${newId()}`;
    input.onchange = () => onChange(input.checked);
    const labelEl = el('label', undefined, label);
    labelEl.htmlFor = input.id;
    row.append(input, labelEl);
    return row;
  }

  // 关闭逻辑
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    mask.style.transition = 'opacity 300ms var(--ease-out)';
    mask.style.opacity = '0';
    panel.style.transition = 'opacity 300ms var(--ease-out), transform 300ms var(--ease-out)';
    panel.style.opacity = '0';
    panel.style.transform = 'scale(0.96) translateY(20px)';
    setTimeout(() => {
      mask.remove();
      document.removeEventListener('keydown', onKey);
      options.onClose();
    }, 300);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  const persist = async (next: Settings | null) => {
    saveBtn.disabled = resetBtn.disabled = true;
    saveStatus.textContent = '';
    try {
      await options.onChange(next);
      close();
    } catch (error) {
      saveStatus.dataset.kind = 'error';
      saveStatus.textContent = t('settings.saveFailed', {
        message: error instanceof Error ? error.message : String(error)
      });
    } finally {
      saveBtn.disabled = resetBtn.disabled = false;
    }
  };

  saveBtn.onclick = () => {
    if (!draft.activeProviderId && draft.providers[0]) {
      draft.activeProviderId = draft.providers[0].id;
    }
    void persist(draft);
  };

  closeBtn.onclick = close;

  resetBtn.onclick = () => {
    if (confirm(t('settings.resetConfirm'))) void persist(null);
  };

  // 点击遮罩关闭。
  //
  // 难点是要区分两种情况：
  //   1. 用户点了遮罩（面板外）→ 应该关闭
  //   2. 用户在面板里拖选文字，松开时指针落在遮罩上
  //      → 不应该关闭，否则拖选文字就会误关设置
  //
  // 浏览器在拖选结束后会向遮罩补发一对 pointerdown/pointerup，
  // 坐标几乎相同，光看位移分辨不出来。
  // 也不能用“一段时间内忽略所有点击”，那样用户得点两次才关得掉。
  //
  // 可靠的做法是记录指针按下时到底在谁身上：
  // 只有“按下也在遮罩上”才关闭。拖选是从面板内部开始的，
  // 补发的那对事件虽然 target 是遮罩，但 press 会被标记为来自面板。
  let maskPress: { id: number; fromMask: boolean } | undefined;
  mask.onpointerdown = (e) => {
    if (e.button !== 0) {
      maskPress = undefined;
      return;
    }
    maskPress = { id: e.pointerId, fromMask: e.target === mask };
  };
  mask.onpointercancel = () => { maskPress = undefined; };
  mask.onpointerup = (e) => {
    const press = maskPress;
    maskPress = undefined;
    // 按下时不在遮罩上（例如从面板里拖选过来），不关闭
    if (!press || press.id !== e.pointerId || !press.fromMask) return;
    if (e.target !== mask) return;
    close();
  };
  // 拖选起点在面板里时，把补发到遮罩的 pointerdown 标记成“不是从遮罩开始”
  panel.addEventListener('pointerdown', (e) => {
    maskPress = { id: e.pointerId, fromMask: false };
  }, true);

  document.addEventListener('keydown', onKey);
  switchView('main');
  document.body.append(mask);

  return close;
}
