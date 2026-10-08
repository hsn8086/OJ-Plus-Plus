# OJ++ 设计概要

## 一句话总结

**图形优先、文字最少化、极致紧凑**——用户一眼就能知道怎么做，而不是盯着文字看。

---

## 核心设计决策

### 1. 图标代替文字

| 元素 | 实现 |
|------|------|
| 关闭 | ✕ 圆形按钮 |
| 返回 | ← + 文字 |
| 添加 | + 大号图标 |
| 编辑 | ✎ 小图标 |

### 2. 紧凑尺寸

| 元素 | 尺寸 |
|------|------|
| 面板宽度 | 680px（←900px） |
| 按钮高度 | 32px（←40px） |
| 字号 | 13px 正文（←14px） |
| 图标按钮 | 32×32px |

### 3. 减少装饰

- **无卡片阴影**：仅面板有阴影
- **边框分隔**：代替分段间距
- **扁平配色**：Mantine 风格（更柔和）

### 4. 堆栈导航

```
主视图 → 列表视图 → 编辑视图
         ←返回      ←返回
```

---

## 设计 Token（快速参考）

```css
/* 尺寸 */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px

/* 圆角 */
--radius-sm: 6px   /* 按钮、输入框 */
--radius-md: 8px   /* 卡片 */
--radius-lg: 12px  
--radius-xl: 16px  /* 面板 */

/* 时长 */
--duration-press: 100ms
--duration-tooltip: 150ms
--duration-dropdown: 200ms
--duration-modal: 300ms

/* 缓动 */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1)
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)

/* 颜色 */
--color-accent: #4c6ef5  /* Mantine 蓝 */
--color-success: #40c057
--color-danger: #fa5252
```

---

## 组件规范速查

### 按钮

```css
height: 32px;
padding: 0 14px;
font-size: 12px;
border-radius: 6px;
```

```css
/* 图标按钮 */
width: 32px;
height: 32px;
```

```css
/* 按压反馈 */
.ojpp-btn:active { transform: scale(0.96); }
.ojpp-icon-btn:active { transform: scale(0.92); }
```

### 输入框

```css
padding: 8px 10px;
font-size: 13px;
border: 1px solid var(--color-border);
border-radius: 6px;
```

### 卡片

```css
padding: 12px;
border: 1.5px solid var(--color-border);
border-radius: 8px;
/* 无阴影 */
```

### 分段

```css
padding: 20px 24px;
border-bottom: 1px solid var(--color-border);
/* 无卡片包裹 */
```

---

## 动画规范

### 进入/退出

```javascript
// 进入
from: { opacity: 0, transform: 'scale(0.96) translateY(20px)' }
to: { opacity: 1, transform: 'scale(1) translateY(0)' }

// 退出：反向
```

### 错开动画

```javascript
applyStagger(items, 0, 20);  // 延迟 20ms
```

### 按压反馈

```css
transition: transform 100ms var(--ease-out);
:active { transform: scale(0.92-0.96); }
```

---

## 字号层级

| 用途 | 字号 | 字重 |
|------|------|------|
| 面板标题 | 17px | 600 |
| 分段标题 | 13px | 600 |
| 正文 | 13px | 400 |
| 标签 | 12px | 500 |
| 提示 | 11px | 400 |
| 徽章 | 10px | 700 |

---

## 可访问性清单

- [ ] 图标按钮有 `aria-label`
- [ ] 触摸目标 ≥ 32px
- [ ] 焦点环 2px 蓝色
- [ ] 颜色对比度 ≥ 4.5:1
- [ ] 支持 `prefers-reduced-motion`
- [ ] 键盘可访问（Tab + Escape）

---

## 与 v1.0 对比

| 指标 | v1.0 | v2.0 |
|------|------|------|
| 面板宽度 | 900px | 680px ↓ |
| 按钮高度 | 40px | 32px ↓ |
| 正文字号 | 14px | 13px ↓ |
| 分段间距 | 24px | 0（边框） |
| 图标按钮 | 24px | 32px ↑ |
| 导航模式 | 标签页 | 堆栈 |
| 文字量 | 多 | 少 |

---

## 设计检查（3 秒自查）

新组件设计时问自己：

1. **能用图标吗？** 如果是，就别用文字
2. **能更紧凑吗？** 减少 20-30% 的留白
3. **有按压反馈吗？** 所有可点击元素都应该缩放
4. **触摸目标够大吗？** 至少 32×32px
5. **颜色传达状态吗？** 蓝/绿/红，别依赖文字

---

## CodeMirror 6 集成（未来）

### 触发

```typescript
// 工具栏添加图标按钮
const editorBtn = iconButton(iconCode, '打开编辑器');
```

### 布局

```
[题面译文面板]
[代码编辑器] ← 240px 高，可拖动
  └─ 工具栏：[ 📋 复制 ] [ ✨ 格式化 ] [ ⛶ 全屏 ]
```

### 样式保持一致

- 边框：`1px solid var(--color-border)`
- 圆角：`8px`
- 工具栏按钮：`32×32px`
- 字体：`ui-monospace 13px`

---

## 快速上手

### 1. 阅读完整文档

```
docs/design-system.md
```

### 2. 参考现有组件

```typescript
// 查看按钮实现
src/ui/buttons.ts

// 查看设置面板
src/ui/settings-panel.ts

// 查看样式定义
src/ui/styles.ts
```

### 3. 使用动画工具

```typescript
import { applyStagger, applyEnterAnimation } from './ui/animations.ts';

// 错开进入
applyStagger(items, 0, 20);

// 单个元素进入
applyEnterAnimation(element, 200);
```

---

## 贡献指南

### 提交新组件前

1. 运行 `pnpm build` 确保构建成功
2. 检查设计清单（上方）
3. 在 Chrome DevTools 中测试动画（播放速度 0.25x）
4. 测试键盘导航
5. 测试触摸设备（或 DevTools 模拟）

### 代码风格

- 使用 CSS 变量，不硬编码
- 动画仅用 `transform` 和 `opacity`
- 图标按钮必须有 `aria-label`
- 时长不超过 300ms

---

**版本**：2.0  
**更新**：2025-01-07  
**维护者**：OJ++ 团队
