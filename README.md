# OJ++

[![release](https://img.shields.io/github/v/release/hsn8086/OJ-Plus-Plus?display_name=tag)](https://github.com/hsn8086/OJ-Plus-Plus/releases)
[![license](https://img.shields.io/github/license/hsn8086/OJ-Plus-Plus)](LICENSE)
[![userscript](https://img.shields.io/badge/userscript-Tampermonkey-0b5)](dist/oj-plus-plus.user.js)

OJ++（OJ-Plus-Plus）是一个可扩展的在线评测站增强工具。它把 AI 题面翻译、Markdown 查看和复制能力做成通用功能，再通过站点适配器连接具体 OJ，通过运行平台适配器连接 Tampermonkey、浏览器调试环境和未来的 Chrome 扩展。

目前内置牛客竞赛适配器，正式构建为油猴脚本，验证页面为 `ac.nowcoder.com` 竞赛题目页。其他 OJ 和 Chrome CRX 还没有作为发布目标提供，但核心接口已经独立出来。

![翻译题面](docs/images/translate.png)

## 功能

- **AI 题面翻译**：题目描述、输入/输出描述、题解分别提供翻译按钮，译文显示在原文下方。
- **流式显示**：边生成边渲染，首屏更快。可以在设置里关闭；服务商或脚本管理器不支持时自动退回一次性请求。
- **公式保留**：站点适配器先把页面公式还原成 LaTeX，模型翻译后用 KaTeX 渲染。
- **Markdown 查看与复制**：从内容副本生成 Markdown，不替换原页面 DOM，因此页面原有交互可以继续使用。
- **多提供商**：支持 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages，以及自定义地址、请求头和请求体字段。API Key 可以留空，此时不发送认证头，适配本地推理服务。
- **长题面分段**：关闭整段翻译后按标题、段落和行切分内容。
- **平台解耦**：通用代码只依赖存储、HTTP 请求和剪贴板接口。油猴平台使用 GM API，浏览器平台使用 `localStorage`、`fetch` 和 Clipboard API。

## 安装

需要先安装 [Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey。

| 版本 | 安装地址 |
| --- | --- |
| 正式版 | [oj-plus-plus.user.js](https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/oj-plus-plus.user.js) |
| 本地开发版 | 构建后安装 `dist/oj-plus-plus.user.js` |

现有 `NowcoderBetter` 用户可以继续通过旧文件名更新：

```text
https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/nowcoder-better.user.js
```

新安装请使用 `oj-plus-plus.user.js`。卸载脚本后，脚本管理器里的配置也可以手动删除；升级时旧的 `ncb:settings` 会迁移到 `ojpp:settings`。

## 第一次使用

1. 打开牛客竞赛题目页，点击页面右上角的齿轮。
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

- 脚本管理器只提供 `GM_xmlhttpRequest` 的 `onprogress`（累计文本），没有可读流。有些实现不触发这个回调，此时首帧之后没有内容可渲染，会自动改走一次性请求。
- 正文随时可能停在半个 `$...$`、半个代码块上。渲染前会先把未闭合的部分隐去，否则每一帧都会闪出渲染报错。
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
    settings-store.ts   平台无关的配置读写与旧键迁移
    translate.ts        分段翻译编排
    types.ts            通用配置和协议接口
  sites/
    types.ts            OJ 站点适配器接口
    index.ts            站点注册和 URL 分派
    nowcoder.ts         牛客选择器、公式和动态 DOM 适配
  platforms/
    types.ts            存储、HTTP、剪贴板接口
    userscript.ts       Tampermonkey / Violentmonkey 实现
    browser.ts          普通浏览器调试实现
  ui/
    section.ts          区域工具栏和翻译流程
    result-panel.ts     通用译文面板
    settings-panel.ts   通用设置面板
    markdown.ts         HTML 副本到 Markdown、KaTeX 渲染
    buttons.ts          图标按钮和复制反馈
    styles.ts           通用样式
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

`stream` 是可选的，不实现就退化为一次性请求。它的回调收到的是**累计**文本而不是增量，这样 GM 的 `onprogress` 和 `fetch` 的 reader 都能对上同一个契约。

Chrome 扩展可以把 `storage` 映射到 `chrome.storage.local`，把 `request` 放到扩展后台或 service worker，再使用一个新的入口调用 `startApp`。页面功能不需要知道请求来自 GM API 还是扩展消息通道。

## 开发与验证

```bash
pnpm install
pnpm check          # 类型检查、16 个单元测试、构建油猴脚本
pnpm test:browser   # 离线浏览器回归，不需要真实 API Key
pnpm screenshots     # 生成 README 截图
```

浏览器回归会使用本地 fixture，不启动 mock AI 服务，也不依赖真实 OJ 页面。它覆盖：

- 实际 userscript 构建和 GM 请求通道，页面 `fetch` 被故意禁用。
- 牛客站点公式还原、Markdown、复制、动态插入和结果渲染。
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

**旧配置没有出现。** 打开新脚本后，第一次读取会把 `ncb:settings` 迁移到 `ojpp:settings`。如果脚本管理器使用了隔离的脚本存储，请确认旧脚本和新脚本运行在同一个脚本管理器中。

## 反馈

请在 [GitHub Issues](https://github.com/hsn8086/OJ-Plus-Plus/issues) 提交问题。报错时附上协议、状态码和脱敏后的响应信息，不要提交 API Key。

## 许可

[GPL-3.0](LICENSE)。公式处理思路参考了 [OJBetter](https://github.com/beijixiaohu/OJBetter)。
