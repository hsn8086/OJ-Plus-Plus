# OJ++ 组件库

这份文档列出所有可复用的 UI 组件及其使用方法。

---

## 基础组件

### 图标按钮（Icon Button）

**用途**：工具栏、操作按钮

```typescript
import { iconButton } from './ui/buttons.ts';
import { ICON_TRANSLATE } from './ui/icons.ts';

const btn = iconButton(ICON_TRANSLATE, '翻译');
btn.addEventListener('click', () => {
  // 处理点击
});
```

**状态**：

```typescript
// 加载中
btn.dataset.state = 'busy';

// 成功
btn.dataset.state = 'done';

// 错误
btn.dataset.state = 'error';

// 激活
btn.dataset.state = 'active';

// 重置
btn.dataset.state = '';
```

**样式**：
- 尺寸：32×32px
- 颜色：灰色 → 悬浮深色
- 按压：`scale(0.92)`

---

### 文字按钮（Text Button）

**用途**：主要操作、次要操作

```html
<button class="ojpp-btn">次要操作</button>
<button class="ojpp-btn ojpp-btn-primary">主要操作</button>
<button class="ojpp-btn ojpp-btn-danger">危险操作</button>
<button class="ojpp-btn ojpp-btn-ghost">幽灵按钮</button>
```

**样式**：
- 高度：32px
- 字号：12px
- 按压：`scale(0.96)`

---

### 输入框（Input）

**文本输入**：

```html
<input type="text" placeholder="请输入...">
```

**密码输入**：

```html
<input type="password" placeholder="请输入密码">
```

**数字输入**：

```html
<input type="number" min="0" step="1">
```

**样式**：
- 内边距：8px 10px
- 字号：13px
- 圆角：6px
- 聚焦：蓝色边框 + 外发光

---

### 文本域（Textarea）

```html
<textarea placeholder="多行文本..."></textarea>
```

**样式**：
- 最小高度：64px
- 字体：等宽字体（配置用）
- 字号：12px
- 可垂直调整大小

---

### 下拉选择（Select）

```html
<select>
  <option value="1">选项 1</option>
  <option value="2">选项 2</option>
</select>
```

**样式**：
- 继承输入框样式
- 浏览器原生下拉箭头

---

### 复选框行（Checkbox Row）

```typescript
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
  input.id = `ojpp-${newId()}`;
  input.addEventListener('change', () => onChange(input.checked));
  
  const wrap = el('label');
  wrap.htmlFor = input.id;
  wrap.append(
    el('div', undefined, label),
    el('div', 'ojpp-hint', hint)
  );
  
  row.append(input, wrap);
  return row;
}
```

**用法**：

```typescript
const check = checkRow(
  '自动翻译',
  settings.autoTranslate,
  '打开页面后自动翻译',
  (v) => settings.autoTranslate = v
);
container.append(check);
```

---

### 表单字段（Form Field）

```typescript
function field(
  label: string,
  control: HTMLElement,
  hint?: string
): HTMLElement {
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
```

**用法**：

```typescript
const input = textInput('', '请输入...');
const fieldEl = field(
  '目标语言',
  input,
  '例如：简体中文'
);
container.append(fieldEl);
```

---

## 布局组件

### 分段（Section）

```typescript
function section(
  title: string,
  badge?: string
): {
  header: HTMLElement;
  body: HTMLElement;
  container: HTMLElement;
} {
  const container = el('div', 'ojpp-section');
  const header = el('div', 'ojpp-section-header');
  const titleEl = el('h4', 'ojpp-section-title', title);
  
  header.append(titleEl);
  
  if (badge) {
    const badgeEl = el('span', 'ojpp-section-badge', badge);
    header.append(badgeEl);
  }
  
  const body = el('div', 'ojpp-section-body');
  container.append(header, body);
  
  return { header, body, container };
}
```

**用法**：

```typescript
const sec = section('通用设置', '3');
sec.body.append(
  field('语言', localeSelect),
  field('主题', themeSelect)
);
container.append(sec.container);
```

---

### 行布局（Row）

```html
<div class="ojpp-row">
  <div class="ojpp-field">...</div>
  <div class="ojpp-field">...</div>
</div>
```

**样式**：
- 自动填充网格
- 最小宽度：140px
- 间距：12px

---

### 导航头（Picker Head）

```html
<div class="ojpp-picker-head">
  <button class="ojpp-btn ojpp-btn-ghost">← 返回</button>
  <strong>标题</strong>
</div>
```

**用途**：子视图顶部导航

---

## 卡片组件

### 提供商卡片（Provider Card）

```html
<div class="ojpp-provider-item" data-active="1">
  <input type="radio" name="provider">
  <div class="ojpp-provider-text">
    <div class="ojpp-provider-name">OpenAI</div>
    <div class="ojpp-provider-meta">OpenAI Chat · gpt-4</div>
  </div>
  <span class="ojpp-provider-badge">使用中</span>
  <button class="ojpp-provider-edit">✎</button>
</div>
```

**样式**：
- 网格布局：`auto 1fr auto auto`
- 激活状态：蓝色边框 + 背景
- 悬浮：加深边框 + 阴影

---

### 预设卡片（Preset Card）

```html
<button class="ojpp-preset-item">
  <span class="ojpp-preset-name">OpenAI</span>
  <span class="ojpp-preset-meta">api.openai.com</span>
</button>
```

**网格布局**：

```css
.ojpp-preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}
```

---

### 添加按钮（Add Button）

```html
<button class="ojpp-add-provider" title="添加提供商">
  +
</button>
```

**样式**：
- 高度：56px
- 虚线边框
- 大号 + 符号
- 悬浮变蓝

---

## 反馈组件

### Toast

```typescript
import { toast } from './ui/toast.ts';

toast('操作成功', 'success');
toast('发生错误', 'error');
toast('信息提示', 'info');
```

**样式**：
- 位置：右下角
- 时长：成功 3 秒，错误 6 秒
- 动画：从下方滑入 + 缩放

---

### 状态框（Status）

```html
<div class="ojpp-status" data-kind="error">
  错误信息
</div>

<div class="ojpp-status" data-kind="ok">
  成功信息
</div>
```

**用途**：表单验证、操作结果

---

## 模态组件

### 模态框（Modal）

```typescript
const mask = el('div', 'ojpp-mask');
const panel = el('div', 'ojpp-panel');

const head = el('div', 'ojpp-panel-head');
const titleNode = el('h3', undefined, '标题');
const closeBtn = el('button', 'ojpp-panel-close');
closeBtn.innerHTML = iconX;
head.append(titleNode, closeBtn);

const body = el('div', 'ojpp-panel-body');
// 添加内容

const foot = el('div', 'ojpp-panel-foot');
const saveBtn = el('button', 'ojpp-btn ojpp-btn-primary', '保存');
foot.append(saveBtn);

panel.append(head, body, foot);
mask.append(panel);
document.body.append(mask);
```

**关闭动画**：

```typescript
const close = () => {
  mask.style.transition = 'opacity 300ms var(--ease-out)';
  mask.style.opacity = '0';
  
  panel.style.transition = 'opacity 300ms var(--ease-out), transform 300ms var(--ease-out)';
  panel.style.opacity = '0';
  panel.style.transform = 'scale(0.96) translateY(20px)';
  
  setTimeout(() => mask.remove(), 300);
};
```

---

## 动画工具

### 错开动画（Stagger）

```typescript
import { applyStagger } from './ui/animations.ts';

const items = Array.from(container.children) as HTMLElement[];
applyStagger(items, 0, 20);  // 延迟 20ms
```

**效果**：每个元素从 `translateY(8px) opacity:0` 依次进入

---

### 进入动画（Enter）

```typescript
import { applyEnterAnimation } from './ui/animations.ts';

applyEnterAnimation(element, 300);
```

**效果**：从 `scale(0.95) opacity:0` 到完全可见

---

### 退出动画（Exit）

```typescript
import { applyExitAnimation } from './ui/animations.ts';

await applyExitAnimation(element, 300);
element.remove();
```

**效果**：返回 Promise，动画结束后 resolve

---

## 工具函数

### 创建元素

```typescript
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
```

**用法**：

```typescript
const btn = el('button', 'ojpp-btn', '保存');
const div = el('div', 'ojpp-field');
```

---

### 生成唯一 ID

```typescript
import { newId } from '../core/config.ts';

const id = newId();  // 例如："abc123xyz"
```

**用途**：表单字段的 `id` 和 `for` 属性

---

### 文本输入工具

```typescript
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
```

---

## 图标库

### 内置图标

```typescript
// src/ui/icons.ts
export const ICON_TRANSLATE = svg('...');  // 翻译
export const ICON_MARKDOWN = svg('...');   // Markdown
export const ICON_COPY = svg('...');       // 复制
export const ICON_SETTINGS = svg('...');   // 设置
export const ICON_CHECK = svg('...');      // 完成
export const ICON_CHEVRON = svg('...');    // 收起
export const ICON_CHEVRON_RIGHT = svg('...'); // 展开
export const ICON_CROSS = svg('...');      // 失败
export const ICON_SPINNER = svg('...');    // 加载中
```

### 自定义图标

```typescript
function svg(path: string, viewBox = '0 0 24 24'): string {
  return `<svg viewBox="${viewBox}" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

// 使用
const iconCode = svg(
  '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  '0 0 24 24'
);
```

**规范**：
- `viewBox`: `0 0 24 24`
- `stroke-width`: 2（标准），2.5（强调）
- `stroke-linecap/linejoin`: `round`
- `aria-hidden`: `true`（装饰性图标）

---

## 主题切换

### 应用主题

```typescript
import { applyTheme } from './ui/theme.ts';

applyTheme('light');  // 浅色
applyTheme('dark');   // 暗色
applyTheme('auto');   // 跟随系统
```

### 监听系统主题

```typescript
import { watchSystemTheme } from './ui/theme.ts';

const stopWatch = watchSystemTheme(() => {
  // 系统主题变化时调用
  applyTheme(settings.theme);
});

// 取消监听
stopWatch();
```

---

## 国际化

### 获取文案

```typescript
import { t } from '../i18n/index.ts';

const text = t('common.save');  // "保存" 或 "Save"
const withParams = t('settings.testFail', { message: 'timeout' });
```

### 切换语言

```typescript
import { setLocale, resolveLocale } from '../i18n/index.ts';

setLocale(resolveLocale('zh'));  // 中文
setLocale(resolveLocale('en'));  // 英文
setLocale(resolveLocale('auto')); // 跟随浏览器
```

---

## 完整示例

### 创建一个设置页面

```typescript
import { el, field, section, textInput, applyStagger } from './utils.ts';
import { t } from '../i18n/index.ts';

function renderSettings(settings: Settings): HTMLElement {
  const container = el('div');
  
  // 创建分段
  const sec = section(t('settings.tab.general'));
  
  // 添加字段
  const langInput = textInput(settings.targetLang, t('settings.targetLangPlaceholder'));
  langInput.addEventListener('input', () => {
    settings.targetLang = langInput.value;
  });
  
  sec.body.append(
    field(t('settings.targetLang'), langInput, t('settings.targetLangHint'))
  );
  
  container.append(sec.container);
  
  // 应用错开动画
  requestAnimationFrame(() => {
    const sections = Array.from(container.querySelectorAll('.ojpp-section')) as HTMLElement[];
    applyStagger(sections, 0, 20);
  });
  
  return container;
}
```

---

### 创建一个卡片列表

```typescript
function renderProviders(providers: ProviderConfig[]): HTMLElement {
  const list = el('div', 'ojpp-provider-list');
  
  providers.forEach((provider) => {
    const item = el('div', 'ojpp-provider-item');
    
    // Radio
    const radio = el('input') as HTMLInputElement;
    radio.type = 'radio';
    radio.name = 'provider';
    radio.checked = provider.id === activeId;
    
    // 文本
    const text = el('div', 'ojpp-provider-text');
    text.append(
      el('div', 'ojpp-provider-name', provider.name),
      el('div', 'ojpp-provider-meta', `${provider.protocol} · ${provider.model}`)
    );
    
    // 徽章
    const badge = el('span', 'ojpp-provider-badge', t('settings.inUse'));
    if (provider.id !== activeId) badge.style.visibility = 'hidden';
    
    // 编辑按钮
    const edit = el('button', 'ojpp-provider-edit');
    edit.innerHTML = iconPencil;
    edit.title = t('settings.editProvider');
    
    item.append(radio, text, badge, edit);
    list.append(item);
  });
  
  // 应用错开动画
  requestAnimationFrame(() => {
    const items = Array.from(list.children) as HTMLElement[];
    applyStagger(items, 0, 20);
  });
  
  return list;
}
```

---

## 样式覆盖

### 自定义颜色

```css
:root {
  --color-accent: #5c7cfa;  /* 覆盖默认蓝色 */
}
```

### 自定义圆角

```css
:root {
  --radius-md: 10px;  /* 更大的圆角 */
}
```

### 自定义时长

```css
:root {
  --duration-modal: 400ms;  /* 更慢的动画 */
}
```

---

## 调试技巧

### 查看动画

1. 打开 Chrome DevTools
2. 按 `Cmd+Shift+P` 打开命令面板
3. 输入 "Show Animations"
4. 触发动画，查看时间轴

### 慢速播放

```javascript
// 在控制台执行
document.documentElement.style.setProperty('--duration-modal', '3000ms');
```

### 禁用动画

```javascript
// 在控制台执行
document.documentElement.style.setProperty('--duration-press', '0ms');
document.documentElement.style.setProperty('--duration-tooltip', '0ms');
document.documentElement.style.setProperty('--duration-dropdown', '0ms');
document.documentElement.style.setProperty('--duration-modal', '0ms');
```

---

## 贡献新组件

### 1. 创建组件文件

```typescript
// src/ui/my-component.ts
export function createMyComponent(options: Options): HTMLElement {
  const el = document.createElement('div');
  el.className = 'ojpp-my-component';
  
  // 实现组件
  
  return el;
}
```

### 2. 添加样式

```css
/* src/ui/styles.ts */
.ojpp-my-component {
  /* 样式 */
}
```

### 3. 编写文档

在本文件中添加新组件的使用方法。

### 4. 测试

```typescript
// test/ui.test.ts
import { createMyComponent } from '../src/ui/my-component.ts';

test('MyComponent renders correctly', () => {
  const comp = createMyComponent({ /* options */ });
  assert(comp instanceof HTMLElement);
});
```

---

**版本**：2.0  
**更新**：2025-01-07  
**维护者**：OJ++ 团队
