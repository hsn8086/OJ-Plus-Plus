# OJ++ 文档索引

欢迎来到 OJ++ 设计系统文档！根据你的需求选择合适的文档：

---

## 🚀 快速开始

### 我想...

#### 了解 v2.0 重构做了什么
👉 [`v2-refactor-summary.md`](./v2-refactor-summary.md)

**包含**：重构目标、关键变化对比、视觉/交互改进、验证结果

**适合**：项目接手者、代码审查者、想快速了解变化的人

---

#### 查找某个设计规范（颜色、字号、圆角等）
👉 [`design-quick-reference.md`](./design-quick-reference.md)

**包含**：设计 Token 速查表、组件规范速查、动画规范、检查清单

**适合**：正在写代码的开发者、需要快速查找数值的人

---

#### 深入理解设计决策和原则
👉 [`design-system.md`](./design-system.md)

**包含**：完整的设计系统（6000+ 字），包括设计理念、所有规范的详细说明、决策理由

**适合**：设计师、需要理解"为什么"的开发者、要制定新规范的人

---

#### 查看如何使用某个组件
👉 [`component-library.md`](./component-library.md)

**包含**：所有组件的代码示例、API 文档、使用方法、调试技巧

**适合**：正在实现新功能的开发者、需要复制粘贴代码的人

---

## 📖 文档详情

### 1. v2.0 重构总结
**文件**：`v2-refactor-summary.md`  
**字数**：~3000 字  
**阅读时间**：10 分钟

**内容大纲**：
- 🎯 项目目标
- ✨ 重构成果
- 📊 关键指标对比
- 🎨 视觉变化
- 🔄 交互变化
- 🚀 动画改进
- 📝 设计原则
- 🎯 未来扩展
- ✅ 验证结果
- 📋 检查清单

---

### 2. 设计快速参考
**文件**：`design-quick-reference.md`  
**字数**：~1500 字  
**阅读时间**：5 分钟

**内容大纲**：
- 一句话总结
- 核心设计决策
- 设计 Token 速查
- 组件规范速查
- 动画规范
- 字号层级
- 可访问性清单
- 与 v1.0 对比
- 设计检查（3 秒自查）
- CodeMirror 6 集成

**最常用**：
```css
/* 快速查找 */
--spacing-md: 12px
--radius-md: 8px
--duration-modal: 300ms
--color-accent: #4c6ef5
```

---

### 3. 完整设计系统
**文件**：`design-system.md`  
**字数**：~6000 字  
**阅读时间**：20-30 分钟

**内容大纲**：
1. 设计理念
2. 设计原则
3. 颜色系统（浅色/暗色）
4. 排版系统
5. 间距系统
6. 圆角系统
7. 阴影系统
8. 动效系统
9. 组件设计规范
10. 交互模式
11. 布局策略
12. 响应式设计
13. 可访问性
14. 性能优化
15. 未来扩展
16. 设计检查清单

**核心原则**：
- **图形优先**：用图标、颜色、位置代替文字
- **极致紧凑**：减少留白，提高信息密度
- **即时反馈**：每个操作都有视觉响应
- **形式追随功能**：形状暗示功能

---

### 4. 组件库文档
**文件**：`component-library.md`  
**字数**：~4000 字  
**阅读时间**：15-20 分钟

**内容大纲**：
- 基础组件（按钮、输入框、下拉、复选框）
- 布局组件（分段、行、导航头）
- 卡片组件（提供商卡片、预设卡片）
- 反馈组件（Toast、状态框）
- 模态组件（模态框）
- 动画工具（错开、进入、退出）
- 工具函数
- 图标库
- 主题切换
- 国际化
- 完整示例
- 调试技巧
- 贡献指南

**最常用**：
```typescript
// 创建按钮
const btn = iconButton(ICON_TRANSLATE, '翻译');

// 创建表单字段
const fieldEl = field('标签', input, '提示');

// 应用错开动画
applyStagger(items, 0, 20);
```

---

## 🎯 按场景查找

### 我要添加一个新按钮

1. **查规范**：[`design-quick-reference.md`](./design-quick-reference.md) → "组件规范速查"
2. **看示例**：[`component-library.md`](./component-library.md) → "图标按钮"
3. **理解原则**：[`design-system.md`](./design-system.md) → "图形优先"

### 我要修改某个颜色

1. **查 Token**：[`design-quick-reference.md`](./design-quick-reference.md) → "设计 Token"
2. **理解用途**：[`design-system.md`](./design-system.md) → "颜色系统"
3. **检查对比度**：确保符合 WCAG AA 标准（4.5:1）

### 我要添加一个动画

1. **判断是否需要**：[`design-system.md`](./design-system.md) → "动效系统"
2. **选择曲线和时长**：[`design-quick-reference.md`](./design-quick-reference.md) → "动画规范"
3. **使用工具**：[`component-library.md`](./component-library.md) → "动画工具"

### 我要集成 CodeMirror 6

1. **阅读设计方案**：[`design-system.md`](./design-system.md) → "未来扩展"
2. **参考快速概要**：[`design-quick-reference.md`](./design-quick-reference.md) → "CodeMirror 6 集成"
3. **保持风格一致**：遵循现有组件的样式规范

### 我要审查一个 PR

1. **对比变化**：[`v2-refactor-summary.md`](./v2-refactor-summary.md) → "关键指标对比"
2. **检查清单**：[`design-quick-reference.md`](./design-quick-reference.md) → "设计检查"
3. **验证规范**：确保符合设计系统

---

## 📝 文档维护

### 更新优先级

| 优先级 | 何时更新 | 更新哪些文档 |
|--------|----------|-------------|
| **高** | 添加新组件 | `component-library.md` |
| **高** | 修改设计 Token | `design-quick-reference.md` + `design-system.md` |
| **中** | 修改交互逻辑 | `design-system.md` → "交互模式" |
| **中** | 优化动画 | `design-system.md` → "动效系统" |
| **低** | 修复 bug | 一般不需要更新文档 |

### 文档同步检查

在提交 PR 前，检查是否需要更新文档：

```bash
# 如果修改了 src/ui/styles.ts
→ 更新 design-quick-reference.md（Token 定义）

# 如果添加了新组件
→ 更新 component-library.md（使用示例）

# 如果修改了交互逻辑
→ 更新 design-system.md（交互模式）

# 如果完成了大版本更新
→ 创建新的 summary 文档
```

---

## 🔗 外部资源

### 设计灵感来源

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Emil Kowalski 的博客](https://emilkowal.ski/)
- [Mantine UI](https://mantine.dev/) - 配色参考
- [Radix UI](https://www.radix-ui.com/) - 组件参考

### 动画参考

- [Cubic Bezier Generator](https://cubic-bezier.com/)
- [Chrome DevTools Animation Inspector](https://developer.chrome.com/docs/devtools/css/animations/)

### 可访问性

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 💡 贡献指南

### 提交新文档

1. 创建文档文件（Markdown）
2. 在本索引中添加链接
3. 提交 PR，说明文档用途

### 改进现有文档

1. 直接修改对应文档
2. 如果是大改，更新本索引的"内容大纲"
3. 提交 PR，说明改进内容

### 文档风格

- **简洁**：直接说重点，避免冗长
- **实用**：提供代码示例和数值
- **结构化**：使用标题、列表、表格
- **可搜索**：使用关键词，便于 Cmd+F

---

## ❓ 常见问题

### Q: 哪个文档最重要？

A: 对于开发者，`design-quick-reference.md` 和 `component-library.md` 最常用。对于理解设计决策，`design-system.md` 最重要。

### Q: 我只想快速查个数值，看哪个？

A: `design-quick-reference.md` → "设计 Token 速查"

### Q: 我想理解某个设计为什么这么做，看哪个？

A: `design-system.md`，每个规范都有"设计理由"说明

### Q: 我想复制粘贴代码，看哪个？

A: `component-library.md`，有完整的代码示例

### Q: 文档太长了，有没有精简版？

A: `design-quick-reference.md` 就是精简版，1500 字，5 分钟读完

### Q: 我要给新人介绍项目，推荐哪个？

A: 先看 `v2-refactor-summary.md`（了解变化），再看 `design-quick-reference.md`（学习规范）

---

## 📈 文档更新历史

| 日期 | 版本 | 变化 |
|------|------|------|
| 2025-01-07 | 2.0 | 完成 v2.0 重构，创建所有设计文档 |
| - | 1.0 | 项目初始版本 |

---

**维护者**：OJ++ 团队  
**最后更新**：2025-01-07  
**文档版本**：2.0
