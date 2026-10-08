# OJ++ 设计系统

本文档定义了 OJ++ 项目的完整设计系统，包括视觉语言、组件规范、交互模式、动效标准和开发指南。

## 设计原则

### 1. 极简图形化
- **少即是多**：删除所有非必要文字，用图形和布局传达功能
- **一目了然**：用户不需要阅读就能知道如何操作
- **图标优先**：按钮用图标而非文字标签
- **视觉引导**：通过视觉层次和空间关系引导操作流程

### 2. 即时反馈
- 所有交互元素必须有即时视觉反馈（悬浮、按压、聚焦）
- 状态变化通过动画平滑过渡，避免突变
- 异步操作显示进度和结果

### 3. 物理感
- 使用弹性缓动曲线模拟真实物理
- 按压反馈模拟触觉
- 元素的"重量"通过动画时长体现

### 4. 性能优先
- 仅动画 GPU 加速的属性（transform, opacity）
- 避免重排（reflow）和重绘（repaint）
- 支持 `prefers-reduced-motion`

### 5. 可访问性
- 完整的键盘导航支持
- ARIA 标签和语义化 HTML
- 高色彩对比度（WCAG AA 标准）
- 可选的减少动效模式

---

## 颜色系统

### 浅色主题

| Token | 值 | 用途 |
|-------|---|------|
| `--color-bg-primary` | `#ffffff` | 主背景 |
| `--color-bg-secondary` | `#f8f9fa` | 次级背景（分段头、卡片） |
| `--color-bg-tertiary` | `#f1f3f5` | 三级背景（悬浮状态） |
| `--color-bg-hover` | `rgba(0,0,0,0.04)` | 悬浮叠加层 |
| `--color-border` | `#e9ecef` | 默认边框 |
| `--color-border-hover` | `#dee2e6` | 悬浮边框 |
| `--color-border-focus` | `#4c6ef5` | 聚焦边框 |
| `--color-text-primary` | `#212529` | 主文字 |
| `--color-text-secondary` | `#495057` | 次要文字 |
| `--color-text-tertiary` | `#868e96` | 辅助文字 |
| `--color-accent` | `#4c6ef5` | 强调色（蓝色） |
| `--color-accent-bg` | `rgba(76,110,245,0.08)` | 强调色背景 |
| `--color-accent-light` | `#dbe4ff` | 强调色浅色 |
| `--color-success` | `#40c057` | 成功状态 |
| `--color-success-bg` | `rgba(64,192,87,0.08)` | 成功背景 |
| `--color-danger` | `#fa5252` | 危险状态 |
| `--color-danger-bg` | `rgba(250,82,82,0.08)` | 危险背景 |

### 暗色主题

| Token | 值 | 用途 |
|-------|---|------|
| `--color-bg-primary` | `#1a1b1e` | 主背景 |
| `--color-bg-secondary` | `#25262b` | 次级背景 |
| `--color-bg-tertiary` | `#2c2e33` | 三级背景 |
| `--color-bg-hover` | `rgba(255,255,255,0.05)` | 悬浮叠加层 |
| `--color-border` | `#373a40` | 默认边框 |
| `--color-border-hover` | `#495057` | 悬浮边框 |
| `--color-border-focus` | `#748ffc` | 聚焦边框 |
| `--color-text-primary` | `#ececec` | 主文字 |
| `--color-text-secondary` | `#c1c2c5` | 次要文字 |
| `--color-text-tertiary` | `#909296` | 辅助文字 |
| `--color-accent` | `#748ffc` | 强调色（蓝色） |
| `--color-success` | `#51cf66` | 成功状态 |
| `--color-danger` | `#ff6b6b` | 危险状态 |

---

## 排版系统

### 字体族

```css
--font-sans: system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

### 字号标准

| 用途 | 字号 | 行高 | 字重 |
|------|------|------|------|
| 面板标题 | 16px | 1.5 | 600 |
| 分段标题 | 12px | 1.3 | 600 |
| 提供商名称 | 12px | 1.3 | 600 |
| 正文 | 13px | 1.5 | 400 |
| 表单标签 | 11px | 1.3 | 500 |
| 按钮文字 | 11px | 1.4 | 500 |
| 元信息 | 11px | 1.3 | 400 |
| 徽章 | 10px | 1 | 700 |

### 字体特性

- **标题大写**：分段标题使用 `text-transform: uppercase` + `letter-spacing: 0.03em`
- **等宽字体**：代码、JSON、headers 使用等宽字体
- **字重层次**：标题 600，按钮/标签 500，正文 400

---

## 间距系统

| Token | 值 | 用途 |
|-------|---|------|
| `--spacing-xs` | 4px | 极小间距（图标内边距） |
| `--spacing-sm` | 8px | 小间距（元素内部） |
| `--spacing-md` | 12px | 中间距（分段内部） |
| `--spacing-lg` | 16px | 大间距（分段边距） |

---

## 圆角系统

| Token | 值 | 用途 |
|-------|---|------|
| `--radius-sm` | 6px | 小圆角（按钮、输入框） |
| `--radius-md` | 8px | 中圆角（卡片、结果面板） |
| `--radius-lg` | 12px | 大圆角（设置面板） |
| `--radius-xl` | 16px | 超大圆角（模态框） |

特殊圆角：
- **圆形**：关闭按钮、徽章使用 `border-radius: 50%`
- **图标按钮**：使用 `--radius-sm`

---

## 阴影系统

| Token | 值 | 用途 |
|-------|---|------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 轻微浮起（卡片悬浮） |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | 中度浮起（按钮悬浮） |
| `--shadow-lg` | `0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)` | 高度浮起（悬浮按钮） |
| `--shadow-xl` | `0 24px 48px rgba(0,0,0,0.16), 0 8px 16px rgba(0,0,0,0.08)` | 最高层级（模态框） |

暗色主题的阴影不透明度加倍。

---

## 动效系统

### 缓动曲线

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* 减速退出 */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* 加速-减速 */
```

**使用指南**：
- **悬浮/聚焦状态**：使用 `ease-out`
- **进入/退出动画**：使用 `ease-out`
- **按压反馈**：使用 `ease-out`

### 时长标准

| Token | 值 | 用途 |
|-------|---|------|
| `--duration-press` | 100ms | 按压反馈 |
| `--duration-tooltip` | 150ms | 悬浮状态、tooltip |
| `--duration-dropdown` | 200ms | 下拉菜单、toast |
| `--duration-modal` | 300ms | 模态框、面板 |

**原则**：
- UI 反馈动画 ≤ 150ms（用户感觉即时）
- 状态切换 200-300ms（流畅但不拖沓）
- 避免 > 400ms 的动画（感觉缓慢）

### 动画属性

**仅动画以下属性**（GPU 加速）：
- `transform`（translate, scale, rotate）
- `opacity`

**避免动画**：
- `width`, `height`（导致重排）
- `top`, `left`（导致重排）
- `color`, `background`（视情况使用，性能较差）

### 进入/退出动画

**模态框进入**：
```css
@keyframes ojpp-mask-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ojpp-panel-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**Toast 进入**：
```css
@keyframes ojpp-toast-in {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

**错开动画**（Stagger）：
```typescript
// 分段依次进入，每个延迟 15ms
applyStagger(sections, 0, 15);
```

### 按压反馈

所有可点击元素：
```css
.interactive:active {
  transform: scale(0.96);  /* 或 0.92、0.97，根据元素大小 */
}
```

**标准**：
- 大按钮/卡片：`scale(0.96-0.97)`
- 中等按钮：`scale(0.92-0.95)`
- 小图标按钮：`scale(0.9-0.92)`

---

## 组件规范

### 图标按钮 (Icon Button)

**尺寸**：
- 标准：32×32px
- 小型：28×28px
- 工具栏：24×24px

**样式**：
```css
.ojpp-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-tertiary);
  transition: 
    background 150ms ease-out,
    color 150ms ease-out,
    transform 100ms ease-out;
}

.ojpp-icon-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.ojpp-icon-btn:active {
  transform: scale(0.92);
}
```

**状态**：
- `[data-state="busy"]`：蓝色 + 旋转动画
- `[data-state="done"]`：绿色
- `[data-state="error"]`：红色
- `[data-state="active"]`：蓝色背景

### 文字按钮 (Text Button)

**尺寸**：
- 高度：30px
- 内边距：0 12px
- 字号：11px

**变体**：
- **默认**：白背景 + 边框
- **主要** (`.ojpp-btn-primary`)：蓝色背景 + 白色文字
- **危险** (`.ojpp-btn-danger`)：红色文字 + 透明背景

**样式**：
```css
.ojpp-btn {
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  transition:
    background 150ms ease-out,
    transform 100ms ease-out;
}

.ojpp-btn:active {
  transform: scale(0.96);
}
```

### 输入框 (Input / Select / Textarea)

**尺寸**：
- 高度：32px
- 内边距：0 10px
- 字号：13px

**状态**：
```css
input:hover {
  border-color: var(--color-border-hover);
}

input:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}
```

**Textarea 特殊样式**：
```css
textarea {
  height: auto;
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
}
```

### 复选框 (Checkbox)

**布局**：
```css
.ojpp-check {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.ojpp-check:hover {
  background: var(--color-bg-hover);
}
```

**尺寸**：
- 复选框：16×16px
- 标签：12px

### 提供商卡片 (Provider Card)

**布局**：
```css
.ojpp-provider-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  padding: 10px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
}
```

**元素**：
- 单选框（18×18px）
- 文字区域（flex: 1）
  - 名称（12px, 600）
  - 元信息（11px, 400）
- 徽章（20×20px，圆形，成功色）
- 编辑按钮（32×32px，图标）

**激活状态**：
```css
.ojpp-provider-item[data-active="1"] {
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.06);
}
```

### 分段 (Section)

**结构**：
```html
<div class="ojpp-section">
  <div class="ojpp-section-header">
    <h4 class="ojpp-section-title">标题</h4>
    <span class="ojpp-section-badge">3</span>
  </div>
  <div class="ojpp-section-body">
    <!-- 内容 -->
  </div>
</div>
```

**样式**：
- 内边距：18px 20px
- 分隔线：底部 1px 边框
- 标题：12px, 600, uppercase, letter-spacing: 0.03em
- 内容间距：10px gap

### 模态框 (Modal)

**结构**：
```html
<div class="ojpp-mask">
  <div class="ojpp-panel">
    <div class="ojpp-panel-head">
      <button class="ojpp-back-btn">←</button>
      <h3>标题</h3>
      <button class="ojpp-panel-close">✕</button>
    </div>
    <div class="ojpp-panel-body"><!-- 内容 --></div>
    <div class="ojpp-panel-foot"><!-- 操作 --></div>
  </div>
</div>
```

**尺寸**：
- 宽度：620px（最大）
- 最大高度：85vh
- 圆角：16px

**动画**：
- 遮罩：300ms fade in
- 面板：300ms scale(0.96→1) + translateY(20px→0) + fade in

### Toast

**位置**：
- 固定在右下角（right: 20px, bottom: 20px）

**样式**：
```css
.ojpp-toast {
  background: var(--color-text-primary);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  animation: ojpp-toast-in 200ms ease-out;
}
```

**变体**：
- **错误**：红色背景
- **成功**：绿色背景
- **信息**：深色背景

**行为**：
- 自动消失（3秒）
- 新 toast 出现时旧的平滑退出

---

## 交互模式

### 导航层级

**三层结构**：
```
主视图 (Main)
  ├─ 提供商列表 (Providers)
  │   ├─ 编辑提供商 (Edit)
  │   └─ 添加提供商 (Picker)
```

**返回按钮**：
- 位置：面板头部左侧（固定）
- 仅在子视图显示
- 图标：`←`（chevron-left）

**标题切换**：
- 主视图：`APP_NAME`
- 列表视图：`提供商`
- 编辑视图：提供商名称（实时更新）
- 选择器：`添加提供商`

### 表单验证

**实时验证**：
- JSON 输入框：解析失败时边框变红
- 数字输入框：非法值不保存

**删除确认**：
- 使用原生 `confirm()` 对话框
- 文案：`删除这个提供商？`

**最后一个提供商保护**：
- 禁止删除唯一提供商
- 显示错误提示：`至少保留一个提供商`

### 状态反馈

**测试连接**：
1. 按钮禁用
2. 状态文字：`正在测试…`
3. 成功：绿色背景 + `连接成功，模型回复：{reply}`
4. 失败：红色背景 + `连接失败：{message}`
5. 按钮恢复

**保存设置**：
1. 按钮禁用
2. 成功：关闭面板
3. 失败：显示错误 + 按钮恢复

### 键盘导航

**快捷键**：
- `Esc`：关闭设置面板
- `Tab`：聚焦下一个元素
- `Shift+Tab`：聚焦上一个元素
- `Enter`：激活按钮/提交表单
- `Space`：切换复选框

**聚焦环**：
```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

---

## 响应式设计

### 断点

| 断点 | 宽度 | 用途 |
|------|------|------|
| 移动端 | ≤ 640px | 手机 |
| 桌面端 | > 640px | 平板、电脑 |

### 移动端适配

**设置面板**：
```css
@media (max-width: 640px) {
  .ojpp-panel {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
```

**网格布局**：
```css
@media (max-width: 640px) {
  .ojpp-row {
    grid-template-columns: 1fr;  /* 单列 */
  }
  
  .ojpp-preset-grid {
    grid-template-columns: 1fr;
  }
}
```

### 触摸优化

- 按钮最小尺寸：28×28px（符合触摸目标）
- 卡片可点击区域：整个卡片
- 禁用触摸高亮：`-webkit-tap-highlight-color: transparent`

---

## 可访问性

### ARIA 标签

```html
<!-- 模态框 -->
<div role="dialog" aria-modal="true">

<!-- 关闭按钮 -->
<button aria-label="关闭">✕</button>

<!-- 状态提示 -->
<div role="status">保存成功</div>
```

### 语义化 HTML

- 使用 `<button>` 而非 `<div onclick>`
- 使用 `<label>` 关联表单控件
- 使用 `<h3>`, `<h4>` 而非 `<div class="title">`

### 键盘导航

- 所有交互元素可通过 Tab 访问
- 聚焦时显示清晰的聚焦环
- 支持 Enter/Space 激活

### 色彩对比

遵循 WCAG AA 标准：
- 正文：至少 4.5:1
- 大字体：至少 3:1
- UI 组件：至少 3:1

**测试工具**：
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker

### 减少动效

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .ojpp-icon-btn:active,
  .ojpp-btn:active {
    transform: none;
  }
}
```

---

## 性能优化

### 动画性能

**仅动画 GPU 加速的属性**：
```css
/* ✅ 好 */
transform: translateY(20px);
opacity: 0;

/* ❌ 差 */
top: 20px;
width: 100%;
```

**使用 will-change（谨慎）**：
```css
.ojpp-panel {
  will-change: transform, opacity;
}
```

**移除 will-change**：
```javascript
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
```

### 渲染性能

**避免布局抖动**：
```typescript
// ❌ 坏：读-写-读-写
elements.forEach(el => {
  const height = el.offsetHeight;  // 读（触发重排）
  el.style.height = height + 10;   // 写
});

// ✅ 好：先读后写
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10;
});
```

**使用 requestAnimationFrame**：
```typescript
// 批量 DOM 操作
requestAnimationFrame(() => {
  const sections = container.querySelectorAll('.ojpp-section');
  applyStagger(sections, 0, 15);
});
```

### 加载性能

**按需加载**：
- 设置面板仅在打开时渲染
- 结果面板仅在翻译后渲染

**移除未使用的 DOM**：
```typescript
mask.remove();  // 关闭面板时移除
```

---

## 未来扩展

### CodeMirror 6 集成

**位置**：
- 在题面翻译结果下方
- 可折叠/展开

**触发方式**：
1. 自动：翻译完成后自动在下方显示编辑器
2. 手动：点击"编辑"按钮打开编辑器

**样式保持一致性**：
```css
.cm-editor {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 13px;
}

.cm-editor.cm-focused {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}
```

**动画方案**：
```typescript
// 展开动画
editor.style.maxHeight = '0';
editor.style.overflow = 'hidden';
requestAnimationFrame(() => {
  editor.style.transition = 'max-height 300ms ease-out';
  editor.style.maxHeight = editor.scrollHeight + 'px';
});

// 监听动画结束
editor.addEventListener('transitionend', () => {
  editor.style.maxHeight = 'none';
  editor.style.overflow = 'auto';
}, { once: true });
```

**功能规划**：
- 语法高亮（Markdown / LaTeX）
- 自动补全（LaTeX 命令、Markdown 语法）
- 行号显示
- 主题跟随系统设置
- 实时预览（可选）
- 格式化按钮

**状态保存**：
```typescript
// 保存编辑状态到 localStorage
localStorage.setItem(`ojpp-edit-${problemId}`, editor.getValue());

// 恢复编辑状态
const saved = localStorage.getItem(`ojpp-edit-${problemId}`);
if (saved) editor.setValue(saved);
```

**工具栏**：
```html
<div class="ojpp-editor-toolbar">
  <button title="格式化">⚡</button>
  <button title="预览">👁</button>
  <button title="全屏">⛶</button>
</div>
```

---

## 设计检查清单

在实现新组件或功能时，使用此清单确保符合设计系统：

### 视觉设计
- [ ] 使用设计 Token（颜色、间距、圆角、阴影）
- [ ] 字体大小和行高符合标准
- [ ] 颜色对比度达到 WCAG AA 标准
- [ ] 浅色和暗色主题都适配

### 交互设计
- [ ] 所有可点击元素有悬浮状态
- [ ] 所有可点击元素有按压反馈（scale）
- [ ] 输入框有聚焦状态（外发光）
- [ ] 异步操作有加载状态
- [ ] 操作结果有成功/失败提示

### 动画
- [ ] 仅动画 `transform` 和 `opacity`
- [ ] 使用标准缓动曲线和时长
- [ ] 动画时长 ≤ 300ms
- [ ] 支持 `prefers-reduced-motion`

### 可访问性
- [ ] 键盘可访问（Tab 导航）
- [ ] 聚焦时有清晰的聚焦环
- [ ] 使用语义化 HTML
- [ ] ARIA 标签完整
- [ ] 触摸目标 ≥ 28×28px

### 性能
- [ ] 避免布局抖动
- [ ] 使用 `requestAnimationFrame` 批量操作
- [ ] 移除未使用的 DOM
- [ ] 避免内存泄漏（移除事件监听器）

### 响应式
- [ ] 移动端布局适配
- [ ] 触摸操作优化
- [ ] 文字不溢出

### 国际化
- [ ] 所有文字通过 `t()` 翻译
- [ ] 不硬编码文字
- [ ] 中英文都测试

---

## 开发指南

### 组件开发

**创建新组件**：
```typescript
function createCard(title: string, content: string): HTMLElement {
  const card = el('div', 'ojpp-card');
  const header = el('div', 'ojpp-card-header', title);
  const body = el('div', 'ojpp-card-body', content);
  card.append(header, body);
  return card;
}
```

**使用设计 Token**：
```css
.ojpp-card {
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-card:hover {
  box-shadow: var(--shadow-md);
}
```

### 动画开发

**添加进入动画**：
```typescript
const element = createCard('标题', '内容');
element.style.opacity = '0';
element.style.transform = 'translateY(20px)';

container.append(element);

requestAnimationFrame(() => {
  element.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
});
```

**使用错开动画**：
```typescript
import { applyStagger } from './animations';

const items = [item1, item2, item3];
applyStagger(items, 0, 30);  // 每个延迟 30ms
```

### 状态管理

**使用本地状态**：
```typescript
let isOpen = false;

function toggle() {
  isOpen = !isOpen;
  element.dataset.state = isOpen ? 'open' : 'closed';
}
```

**CSS 响应状态**：
```css
.ojpp-dropdown[data-state="open"] {
  opacity: 1;
  transform: translateY(0);
}

.ojpp-dropdown[data-state="closed"] {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}
```

### 事件处理

**防止默认行为**：
```typescript
button.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  // 处理点击
});
```

**清理事件监听器**：
```typescript
function cleanup() {
  document.removeEventListener('keydown', onKeyDown);
  mask.remove();
}
```

---

## 版本历史

### v2.1（2024-10）- 极简重构

**核心改进**：
- ✅ 彻底图形化：返回按钮移至面板头部，使用图标
- ✅ 输入框统一：reasoning 字段改为下拉框
- ✅ 尺寸缩小：面板 620px，按钮 30px，字号 11-13px
- ✅ 功能完整：恢复所有高级选项（headers, body, reasoning, 超时, 重试）
- ✅ i18n 修复：添加所有缺失的翻译键

**文件大小**：827.47 kB（gzip: 193.75 kB）

### v2.0（2024-10）- 设计系统重构

**新增**：
- 完整的设计 Token 系统
- 统一的动效系统
- 卡片式设置面板
- 错开动画
- 完整的可访问性支持

**文件大小**：832.27 kB（gzip: 194.18 kB）

### v1.0（初始版本）

**基础功能**：
- AI 题面翻译
- 设置面板
- Markdown 查看
- 多提供商支持

**文件大小**：828.62 kB（gzip: 193.83 kB）

---

## 参考资源

### 设计系统
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)
- [Ant Design](https://ant.design/)

### 动效
- [Framer Motion](https://www.framer.com/motion/)
- [Spring Physics](https://www.react-spring.dev/)
- [Cubic Bezier](https://cubic-bezier.com/)

### 可访问性
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [a11y Project](https://www.a11yproject.com/)

### 性能
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**最后更新**：2024-10-07  
**维护者**：OJ++ 团队
