import { startApp } from '../app.ts';
import { createBrowserPlatform } from '../platforms/browser.ts';
import { resolveSite } from '../sites/index.ts';
import { toast } from '../ui/toast.ts';

// 调试构建显式选择浏览器 API，不经过 GM API 探测或回退。
const site = resolveSite(new URL(location.href));
if (site) void startApp(createBrowserPlatform(), site).catch((error) => toast(String(error), 'error'));
