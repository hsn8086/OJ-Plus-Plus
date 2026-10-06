// 校验构建产物的 @version 与 package.json 一致。
//
// 这个检查是为了防一个已经犯过的错：bump package.json 后忘记重新构建，
// 结果 dist 里的版本号停在旧值，脚本管理器对比版本后认为"无更新"，
// 而 GitHub 上却已经有新 tag。
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

const files = ['dist/oj-plus-plus.user.js'];
const problems = [];

for (const file of files) {
  const source = await readFile(new URL(file, root), 'utf8');
  const match = /^\/\/ @version\s+(\S+)$/m.exec(source);
  const version = match?.[1];
  if (!version) {
    problems.push(`${file}: 找不到 @version`);
  } else if (version !== pkg.version) {
    problems.push(`${file}: @version=${version}，package.json=${pkg.version}`);
  }
  // 下载地址要指向当前仓库
  if (!/OJ-Plus-Plus\/main\/dist\/oj-plus-plus\.user\.js/.test(source)) {
    problems.push(`${file}: downloadURL 未指向当前仓库`);
  }
}

if (problems.length) {
  console.error('构建产物校验失败：');
  for (const p of problems) console.error('  -', p);
  console.error('\n提示：先执行 pnpm build 再发布。');
  process.exit(1);
}
console.log(`✓ dist 版本一致：${pkg.version}`);
