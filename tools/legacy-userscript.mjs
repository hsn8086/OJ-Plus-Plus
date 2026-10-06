// 为已安装的 NowcoderBetter 保留脚本身份，升级后继续访问原有 GM 存储。
// 实现全部来自同一次构建，只替换 metadata；新安装使用 oj-plus-plus.user.js。
import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('../dist/oj-plus-plus.user.js', import.meta.url), 'utf8');
const end = source.indexOf('// ==/UserScript==');
if (end < 0) throw new Error('缺少 userscript metadata');
const legacyURL = 'https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/nowcoder-better.user.js';
const header = source.slice(0, end)
  .replace(/^(\/\/ @name\s+).*$/m, '$1NowcoderBetter')
  .replace(/^(\/\/ @namespace\s+).*$/m, '$1https://github.com/hsn8086/NowcoderBetter')
  .replace(/^(\/\/ @downloadURL\s+).*$/m, `$1${legacyURL}`)
  .replace(/^(\/\/ @updateURL\s+).*$/m, `$1${legacyURL}`);
await writeFile(new URL('../dist/nowcoder-better.user.js', import.meta.url), header + source.slice(end));
