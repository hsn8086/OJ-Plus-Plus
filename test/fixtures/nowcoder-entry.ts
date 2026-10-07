import { startApp } from '../../src/app.ts';
import { createBrowserPlatform } from '../../src/platforms/browser.ts';
import { nowcoder } from '../../src/sites/nowcoder.ts';

/** 用真实抓取的牛客题面验证适配器与界面语言切换。 */
export function start() {
  return startApp(createBrowserPlatform(), nowcoder);
}
