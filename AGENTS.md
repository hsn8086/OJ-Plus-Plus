# OJ-Plus-Plus 工作约定

## 卡住时换任务，不要打转

同一个问题排查/扫描/试错两三次还没进展，就停手去做列表里其他任务，做完后在汇报里说明哪项卡住了、卡在哪、需要什么信息（URL / 截图 / DOM 片段）。不要在同一页面上重复跑本质相同的探测脚本。

## 暗色模式排查要点

- Codeforces 很多样式是**交互态才出现**的（hover、点击后弹层）。DOM 扫描之前先确认要不要模拟交互（`page.hover`、`page.click`），静态扫描扫不到动态出现的元素。
- `background-color` 扫描抓不到 `background-image` 白色精灵图和渐变——要单独扫 `backgroundImage`。
- 定位元素优先用页面里真实的表单/容器 id（如 `#gym-filter-form`），不要用「找 N 个 img/svg 子元素」这类猜测式全页扫描。

## 验证

- `pnpm check`：单测 + tsc + 构建 + verify-dist。
- 浏览器实测走 Playwright MCP；改 `src/sites/codeforces.ts` 后要用 `node --experimental-strip-types /tmp/gen-css.mjs` 重新生成 `/tmp/ojpp-dark.css` 再注入。
- fixture 要保留真实站点结构，太干净会让断言形同虚设。

## 提交

只提交不推送不发版，`dist/` 产物随源码一起提交。
