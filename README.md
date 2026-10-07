# OJ++

[![release](https://img.shields.io/github/v/release/hsn8086/OJ-Plus-Plus?display_name=tag)](https://github.com/hsn8086/OJ-Plus-Plus/releases)
[![license](https://img.shields.io/github/license/hsn8086/OJ-Plus-Plus)](LICENSE)
[![userscript](https://img.shields.io/badge/userscript-Tampermonkey-0b5)](dist/oj-plus-plus.user.js)

OJ++（OJ-Plus-Plus）是一个可扩展的在线评测站增强工具。它把 AI 题面翻译、Markdown 查看和复制能力做成通用功能，再通过站点适配器连接具体 OJ，通过运行平台适配器连接 Tampermonkey、浏览器调试环境和未来的 Chrome 扩展。

目前内置牛客竞赛和 Codeforces 适配器，正式构建为油猴脚本。其他 OJ 和 Chrome CRX 还没有作为发布目标提供，但核心接口已经独立出来。

![翻译题面](docs/images/translate.png)

## 功能

- **AI 题面翻译**：题目描述、输入/输出描述、题解分别提供翻译按钮，译文显示在原文下方。
- **流式显示**：边生成边渲染，首屏更快。可以在设置里关闭；服务商或脚本管理器不支持时自动退回一次性请求。
- **公式保留**：站点适配器先把页面公式还原成 LaTeX，模型翻译后用 KaTeX 渲染。
- **Markdown 查看与复制**：从内容副本生成 Markdown，不替换原页面 DOM，因此页面原有交互可以继续使用。
- **多提供商**：支持 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages，以及自定义地址、请求头和请求体字段。API Key 可以留空，此时不发送认证头，适配本地推理服务。
- **长题面分段**：关闭整段翻译后按标题、段落和行切分内容。
- **界面语言**：设置面板与按钮支持简体中文和英文，可跟随浏览器语言。
- **站点配色**：可选跟随系统、浅色或暗色。Codeforces 自带一套暗色样式；脚本自己的界面也随主题切换。
- **平台解耦**：通用代码只依赖存储、HTTP 请求和剪贴板接口。油猴平台使用 GM API，浏览器平台使用 `localStorage`、`fetch` 和 Clipboard API。

## 安装

需要先安装 [Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey。

| 版本 | 安装地址 |
| --- | --- |
| 正式版 | [oj-plus-plus.user.js](https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/oj-plus-plus.user.js) |
| 本地开发版 | 构建后安装 `dist/oj-plus-plus.user.js` |

> 项目原名 NowcoderBetter，2026-10 改名为 OJ++。改名后脚本的 `@namespace` 变了，脚本管理器会把它当成新脚本，配置需要重新填写。

## 第一次使用

1. 打开受支持的题目页（牛客竞赛、Codeforces），点击页面右上角的齿轮。
2. 在「提供商」页选择预设，填写 API Key 和模型。
3. 点击「测试连接」，确认接口返回成功后保存。
4. 点击题目标题旁边的翻译图标。

![提供商设置](docs/images/settings-provider.png)

默认模型是 `gpt-6-luna`。`temperature`、`top_p`、`max_tokens` 等参数统一写在「额外请求体字段」中，不再单独显示表单字段。

### 协议选择

| 协议 | 路径 | 请求字段 | 认证头 |
| --- | --- | --- | --- |
| OpenAI Chat Completions | `/chat/completions` | `messages` | `Authorization: Bearer` |
| OpenAI Responses | `/responses` | `input` | `Authorization: Bearer` |
| Anthropic Messages | `/messages` | `system` + `messages` | `x-api-key` |

接口地址填写到 `/v1` 即可，脚本会按协议补全路径；也可以直接填写完整端点。

### 流式显示

开启后请求会带上 `stream: true`，脚本按 SSE 解析增量并逐帧渲染。三处细节值得说明：

- 油猴的流式路径使用 `GM_xmlhttpRequest` 的 `responseType: 'stream'` + `partialSize`。Tampermonkey 会在 `onreadystatechange` 阶段向用户脚本暴露 `ReadableStream`；分片要从 `res.response.getReader()` 读取。`onprogress` 只带进度字段，等 `onload` 才开始读流已经太晚。正常情况下 `onloadend` 关闭流；部分版本只派发 `onload` 时，脚本会等待已排队分片后兜底收尾。
- 不支持 `responseType: 'stream'` 的脚本管理器不会提供可读流，此时自动改走一次性请求（回退请求会去掉 `stream` 参数，否则服务端仍返回 SSE 而无法按 JSON 解析）。
- 已经开始输出后再中断不会重试，避免面板内容回退重来。
- 正文随时可能停在半个公式、半个代码块或半个粗体上。渲染前会做两件事：
  - 结构标记（粗体、斜体、删除线、链接）由 [remend](https://www.npmjs.com/package/remend) 补全。补全不改变可见文字，所以 `**注意` 能立刻以粗体显示，收尾符到达时也不会重画。
  - 公式不能补全。把 `$a+` 补成 `$a+$` 会先把半截公式渲染出来，真内容到达时又得重画。所以未闭合的公式会被隐去，等闭合后再显示。
- 如果流已经开始输出后又中断，不会重新开始，避免用户看到内容回退。

## 代码结构

```text
src/
  app.ts                 通用应用组合根
  brand.ts               产品名和仓库地址
  core/
    ai.ts               重试、错误处理、AI 请求
    config.ts           配置结构、预设与迁移
    providers.ts        三种协议的请求构造与响应解析
    prompt.ts           翻译提示词与分段
    sse.ts              SSE 增量解析
    settings-store.ts   平台无关的配置读写
    translate.ts        分段翻译编排
    types.ts            通用配置和协议接口
  i18n/
    zh.ts               中文文案，同时是键的定义来源
    en.ts               英文文案
    index.ts            取词、占位符替换、语言解析
  sites/
    types.ts            OJ 站点适配器接口
    index.ts            站点注册和 URL 分派
    nowcoder.ts         牛客选择器、公式和动态 DOM 适配
    codeforces.ts       Codeforces 选择器、老题与新题两套公式还原
  platforms/
    types.ts            存储、HTTP、剪贴板接口
    userscript.ts       Tampermonkey / Violentmonkey 实现
    browser.ts          普通浏览器调试实现
  ui/
    section.ts          区域工具栏和翻译流程
    result-panel.ts     通用译文面板
    settings-panel.ts   通用设置面板
    markdown.ts         HTML 副本到 Markdown、KaTeX 渲染、流式稳定化
    buttons.ts          图标按钮和复制反馈
    theme.ts            主题解析与应用
    styles.ts           通用样式（含暗色）
  entries/
    userscript.ts       油猴入口
    browser.ts          浏览器调试入口
```

### 添加一个 OJ

实现 `SiteAdapter`：

- `collectSections` 返回题目描述、输入、输出或题解区域。
- `prepareContent` 在内容副本上处理公式、代码和站点特殊节点。
- `mountSettingsButton` 决定设置入口放到站点哪里。
- `observe` 监听站点的异步渲染，并在页面变化时调用回调。

然后把适配器加入 `src/sites/index.ts`。通用翻译、Markdown 和设置代码不需要修改。

### 添加界面文案

界面文字都走 `src/i18n`：

1. 在 `zh.ts` 加键，中文即默认文案。
2. 在 `en.ts` 补对应英文。两份文件的键集合必须一致，`test/i18n.test.ts` 会检查，也会检查占位符是否两边都在。
3. 代码里用 `t('key', { name: 'x' })` 取值，占位符写成 `{name}`。

未支持的语言会回退英文，而不是回退中文，避免出现半截中文。

### 给站点加暗色主题

在适配器里提供 `darkStyles`，选择器挂在 `html[data-ojpp-theme="dark"]` 下：

```ts
export const site: SiteAdapter = {
  darkStyles: `
    html[data-ojpp-theme="dark"] .my-statement { color: #cdd9e5; }
  `,
};
```

只覆盖阅读相关的部分（正文、链接、代码块、表格），不要去改导航栏和按钮，否则容易把站点自己的配色改坏。站点自身有暗色模式时不必提供。

### 添加一个运行平台

实现 `Platform`：

```ts
interface Platform {
  readonly id: string;
  readonly storage: Storage;
  readonly request: HttpTransport;
  readonly stream?: HttpStreamTransport;
  readonly writeClipboard: (text: string) => Promise<void>;
}
```

`stream` 是可选的，不实现就退化为一次性请求。它的回调收到的是**累计**原始响应文本。浏览器平台把 `ReadableStream` 的增量片段拼成累计文本；油猴平台从 Tampermonkey 的 `res.response` 读取同一个 `ReadableStream` 后再累积，核心层不需要知道具体脚本管理器。

Chrome 扩展可以把 `storage` 映射到 `chrome.storage.local`，把 `request` 放到扩展后台或 service worker，再使用一个新的入口调用 `startApp`。页面功能不需要知道请求来自 GM API 还是扩展消息通道。

## 开发与验证

```bash
pnpm install
pnpm check          # 类型检查、单元测试、构建油猴脚本
pnpm test:browser   # 离线浏览器回归，不需要真实 API Key
pnpm screenshots     # 生成 README 截图
```

浏览器回归会使用本地 fixture，不启动 mock AI 服务，也不依赖真实 OJ 页面。它覆盖：

- 油猴构建的回归会模拟 Tampermonkey 在 `onreadystatechange` 中提供 `ReadableStream`，页面 `fetch` 被故意禁用，验证流分片仍能逐步进入译文面板。
- 牛客站点公式还原、Markdown、复制、动态插入和结果渲染。
- Codeforces 两种公式形态：老题的服务端 `.tex-span` HTML 按结构还原成 LaTeX，新题的 MathJax 源码直接取用，且渲染副本不重复。
- 工具栏靠右对齐：断言它与标题同一行且贴住容器右侧，而不是只看 CSS 类名。
- 暗色主题与界面语言：主题属性落到 `<html>`，题面文字确实变浅，英文界面下按钮文案为英文。
- 流式请求：请求体带 `stream`，中途就能看到部分译文，完成后流式状态清除。
- 设置面板输入焦点、文本拖拽、保存后即时切换配置、取消请求和重复翻译。
- 另一套 DOM 与浏览器平台，验证通用应用不依赖牛客选择器。

本机没有 Playwright 管理的浏览器时，可以指定已有 Chromium：

```bash
OJPP_CHROME=/path/to/Google\ Chrome\ for\ Testing pnpm test:browser
```

## 请求与数据

油猴构建只通过 `GM_xmlhttpRequest` 发 AI 请求，API Key 通过 `GM_setValue` 保存在脚本管理器存储中。普通浏览器入口只用于本地调试，使用 `fetch`，仍然受 CORS 限制；它不会作为油猴脚本的隐藏回退路径。

请求地址是用户在设置面板中填写的地址，项目没有中转服务。配置预览会隐藏 API Key；翻译内容会发送给选定的 AI 提供商。

## 故障排查

**测试连接提示 `Failed to fetch`。** 检查安装的是 `oj-plus-plus.user.js`，而不是把构建产物直接作为普通网页脚本加载。油猴构建需要 `GM_xmlhttpRequest` 权限；直接浏览器调试入口使用 `fetch`，服务端必须允许 CORS。

**返回 401 或 403。** 检查 API Key、模型名和接口协议是否匹配。可以先用「测试连接」查看服务商返回的错误。

**用本地推理服务，没有 Key。** 把 API Key 留空即可，脚本不会发送认证头。如果服务要求任意非空 Key，在「额外请求头」里手动写 `Authorization: Bearer dummy`。

**译文一直不出来，进度条在转。** 如果服务商不支持流式，脚本会在首帧之后自动改走一次性请求；若一直没结果，关掉「流式显示」再试，或点翻译按钮中止后查看错误提示。

**公式显示为源码。** 确认 KaTeX CSS 可以从 jsDelivr 加载。公式的 Markdown 仍会保留 LaTeX，复制结果不受影响。

**从 NowcoderBetter 升级后配置没了。** 脚本管理器的 GM 存储按脚本 uuid 隔离，uuid 由 `@namespace` + `@name` 决定。改名后 uuid 变了，旧配置读不到，需要重新填一次 API Key 和模型。

## 反馈

请在 [GitHub Issues](https://github.com/hsn8086/OJ-Plus-Plus/issues) 提交问题。报错时附上协议、状态码和脱敏后的响应信息，不要提交 API Key。

## 许可

[GPL-3.0](LICENSE)。公式处理思路参考了 [OJBetter](https://github.com/beijixiaohu/OJBetter)。
