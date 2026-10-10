# Chrome 扩展与本地运行

OJ++ 的 MV3 扩展复用油猴版的站点适配、翻译、暗色和设置界面，额外提供本地 C/C++/Python 运行。运行时都在扩展包内，不内置 clangd、Pyright 或其他 LSP 引擎。

## 构建与安装

```sh
pnpm install
pnpm build:extension
pnpm test:extension
pnpm pack:extension
```

首次构建通过 `curl` 下载固定版本的工具链到 `.cache/wasm-runtimes/`，逐个核验 SHA-256。下载地址和摘要见 [`tools/runtime-assets.json`](../tools/runtime-assets.json)。后续构建复用已校验的缓存；需要代理时可设置 `https_proxy` / `http_proxy`。

- `dist-extension/`：Chrome 开发者模式的「加载已解压的扩展」目录。
- `artifacts/ojpp-<版本>-chrome.zip`：分发/商店上传用 ZIP，打包命令需要 `7z`，可用 `OJPP_7ZIP` 指定路径。
- 油猴产物仍为 `dist/oj-plus-plus.user.js`，不包含这套编译器与运行时。

在 `chrome://extensions` 中开启开发者模式，加载 `dist-extension/` 后刷新 OJ 页面。扩展与 Tampermonkey 存储相互独立，需要重新设置提供商；同站点只启用其中一份，以免工具栏重复。

本地 ZIP 不是签名 CRX。Windows/macOS 面向普通用户的正式分发应走商店或适用的企业策略。本仓库没有附签名私钥，也没有自动发布到商店。本轮实际使用 Chrome for Testing 151 验证，manifest 的最低版本设为 120。

## AI 服务授权

在设置面板中编辑提供商后，直接点「测试连接」即可。新域名未授权时，会打开授权页并等待；点击「授权访问」后测试自动继续，关闭授权页则取消本次测试。测试连接使用当前填写的配置，不需要先保存。

也可以在工具栏 OJ++ 图标的选项页中，为已保存的服务域名预授权。

跨域请求由后台发出，支持流式转发和取消。后台只允许请求已保存提供商的 origin，或刚经过测试连接授权的 origin；不能把它当作任意 URL 代理。第三方服务地址从未授权到授权的操作由用户完成。

## 使用本地测试

CF、AtCoder 的编辑器新增「站点运行 / 本地 WASM」选项。扩展还为 QOJ 和洛谷挂载本地编辑器，正式提交继续使用站点原生入口。牛客继续保留自己的原生编辑器，不新增题目页编辑器。

| 本地语言 | 实际环境 |
| --- | --- |
| C | Clang 8，C11，WASI |
| C++ | Clang 8，C++17，libc++，WASI |
| Python | CPython 3.11.3，WASI |

CF/AtCoder 的语言下拉仍用于正式提交。即使选中站点的 C++23/GCC 或 PyPy，本地运行使用的仍是表中的环境，编辑器上方会显示说明。Java 等语言请切换回站点运行。

输入、期望输出、题面样例与自定义样例沿用同一列表。QOJ HTML 和洛谷题面会提取样例；PDF 题目暂需手动添加自定义测试。每条测试分别显示 stdout、stderr 和结果，有 stderr 时保持展开。

- 默认单条运行限时 3 秒，可在编辑器中选择 1/3/5/10/30 秒。
- 编译和运行分开计时，工具链加载/编译的等待上限为 60 秒。
- 本地运行全部按顺序执行，自定义测试在前。再次点击转圈的运行按钮可取消当前测试或整批测试。
- C/C++ 编译结果按源码与语言缓存，多条样例复用；最多保留四份小于 4 MiB 的产物。
- 每次执行使用新的 Worker 和虚拟文件系统。超时、取消后终止 Worker，下次测试可以继续运行。
- 源码上限 512 KiB，输入上限 1 MiB，stdout/stderr 合计上限 1 MiB；C/C++ 产物的线性内存上限为 256 MiB。这不是整个浏览器进程的内存上限。

`bits/stdc++.h` 由兼容头提供，包含标准 C++17 头文件；没有 GCC 的 PBDS，也不提供线程或完整的 C++ 异常展开支持。Clang/libc++、CPython/WASI 与站点的 GCC/PyPy/Linux 环境不同，本地通过样例不能保证正式评测通过。这里的时间是浏览器内执行用时，不是站点评测机的 CPU 时间；不伪造不可获取的内存统计。

## 实现边界

- `src/platforms/extension.ts`：内容脚本通过 Port 访问配置、AI 请求和本地运行。
- `src/extension/background.ts`：权限检查、消息路由、取消和 Offscreen 创建。
- `src/extension/offscreen.ts`：全扩展单队列、编译缓存、Worker watchdog 与空闲回收。
- `src/extension/runner.worker.ts`：Clang/LLD 编译链接、CPython、WASI 内存文件系统及字节级 stdin/stdout/stderr。
- `src/extension/main-world.ts`：只同步原生 ACE 提交字段，不开放任意 JS 执行或网络代理。

WASI 用户程序只拿到虚拟文件系统和显式标准流，没有浏览器 DOM、扩展 API、AI 凭据或宿主文件系统。运行时资产仅从扩展包读取；构建阶段下载和安装后的执行阶段分开。

MV3 service worker 可被浏览器回收，因此用户程序不在那里执行。Offscreen 宿主只在有任务时发送活动消息，空闲一分钟后回收。连接断开时前端显示错误并允许重试。

运行时二进制不入 Git，通过锁定地址和校验和重建。包内包含相应许可证与 [第三方说明](../THIRD_PARTY_NOTICES.md)。

## 验证

`pnpm test:extension` 会创建临时 Chrome profile，实际加载构建出的扩展，执行包内 WASM，而非模拟测试结果：

- 扩展存储与流式 AI 请求桥（API 使用本地测试服务）。
- Python stdin/stdout/stderr、三组题面样例。
- C++ 的真实编译/链接、标准库、`bits/stdc++.h`、编译错误回显。
- 运行超时、点击取消、取消后恢复、输出上限。
- QOJ 与洛谷的扩展专用编辑器及样例运行。

测试不会向 OJ 提交答案，也不会调用付费 AI 服务。测试副本仅预先授予本地 API fixture 的权限；正式构建仍使用可选域名授权。
