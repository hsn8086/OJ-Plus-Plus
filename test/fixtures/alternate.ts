import { startApp } from '../../src/app.ts';
import { createBrowserPlatform } from '../../src/platforms/browser.ts';
import type { SiteAdapter } from '../../src/sites/types.ts';

/** 用完全不同的 DOM 验证通用功能不依赖牛客选择器。不是对外支持的 OJ。 */
const site: SiteAdapter = {
  id: 'test-site',
  name: '测试站点',
  hosts: ['fixture.test'],
  collectSections(doc) {
    const content = doc.querySelector<HTMLElement>('article');
    const heading = doc.querySelector<HTMLElement>('h1');
    return content && heading ? [{
      kind: 'statement', label: '题面', content,
      toolbar: { anchor: heading, position: 'afterend' },
      result: { anchor: content, position: 'afterend' },
    }] : [];
  },
  prepareContent() {},
  mountSettingsButton(button, doc) { doc.querySelector('nav')!.append(button); },
  observe(doc, onChange) {
    const observer = new MutationObserver(onChange);
    observer.observe(doc.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  },
};

export function start() {
  return startApp(createBrowserPlatform(), site);
}
