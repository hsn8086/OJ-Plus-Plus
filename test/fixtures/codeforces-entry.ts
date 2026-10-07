import { startApp } from '../../src/app.ts';
import { createBrowserPlatform } from '../../src/platforms/browser.ts';
import { codeforces } from '../../src/sites/codeforces.ts';

/** 用真实抓取的 Codeforces 题面验证适配器，不依赖 GM 或网络。 */
export function start() {
  return startApp(createBrowserPlatform(), codeforces);
}
