import { startApp } from '../app.ts';
import { resolveSite } from '../sites/index.ts';
import { createExtensionPlatform } from '../platforms/extension.ts';

const site = resolveSite(new URL(location.href));
if (site) {
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = chrome.runtime.getURL('katex/katex.min.css'); css.dataset.ojppKatex = '1';
  document.head.append(css);
  void startApp(createExtensionPlatform(), site);
}
