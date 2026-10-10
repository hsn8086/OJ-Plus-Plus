import { SETTINGS_KEY, migrate } from '../core/config.ts';
import { resolveLocale } from '../i18n/index.ts';
import { providerOrigin } from './provider-permissions.ts';

let generation = 0;
async function render() {
  const current = ++generation;
  const settings = migrate((await chrome.storage.local.get(SETTINGS_KEY))[SETTINGS_KEY]);
  if (current !== generation) return;
  const zh = resolveLocale(settings.locale) === 'zh';
  const main = document.querySelector('main')!;
  main.replaceChildren();
  const title = document.createElement('h1'); title.textContent = zh ? 'OJ++ 扩展' : 'OJ++ Extension'; main.append(title);
  const info = document.createElement('p');
  info.textContent = zh
    ? '授权相应服务域名后即可请求。测试连接使用当前填写的配置，不需要先保存；本地运行使用包内 WASM，不上传源码。'
    : 'Authorize the provider domain to enable requests. Connection tests use the current draft without saving it. Local execution uses packaged WASM and does not upload source code.';
  main.append(info);

  const appendProvider = async (name: string, baseUrl: string, requested = false) => {
    let origin: string, pattern: string;
    try { ({ origin, pattern } = providerOrigin(baseUrl)); } catch { return; }
    const allowed = await chrome.permissions.contains({ origins: [pattern] });
    if (current !== generation) return;
    const row = document.createElement('section');
    row.dataset.origin = origin;
    if (requested) row.dataset.requestedOrigin = origin;
    const text = document.createElement('p'); text.textContent = `${name} — ${origin}`;
    const button = document.createElement('button');
    button.textContent = allowed ? (zh ? '已授权' : 'Authorized') : (zh ? '授权访问' : 'Authorize access');
    button.disabled = allowed;
    const status = document.createElement('p');
    if (requested) status.textContent = allowed
      ? (zh ? '授权已完成，连接测试会继续。可以返回原来的页面查看结果。' : 'Access granted. The connection test will continue; return to the original tab for the result.')
      : (zh ? '原页面正在等待授权。授权后会继续测试，关闭本页可取消。' : 'The original tab is waiting. Grant access to continue the test, or close this tab to cancel.');
    button.onclick = async () => {
      try {
        if (await chrome.permissions.request({ origins: [pattern] })) await render();
        else status.textContent = zh ? '未授权。可以重试，或关闭本页取消测试。' : 'Permission was not granted. Retry, or close this tab to cancel the test.';
      } catch (error) { status.textContent = String(error); }
    };
    row.append(text, button, status); main.append(row);
  };

  const requested = new URL(location.href).searchParams.get('authorize');
  if (requested) await appendProvider(zh ? '正在测试的提供商' : 'Provider being tested', requested, true);
  for (const provider of settings.providers) await appendProvider(provider.name, provider.baseUrl);
  if (current !== generation) return;
  const runtime = document.createElement('p');
  runtime.textContent = zh
    ? '本地运行：C11 / C++17（Clang 8 + libc++）、Python 3.11.3（CPython WASI）。不是 GCC 或 PyPy；不包含 LSP。'
    : 'Local execution: C11 / C++17 (Clang 8 + libc++), Python 3.11.3 (CPython WASI). No bundled LSP.';
  main.append(runtime);
}
void render();
chrome.storage.onChanged.addListener(() => { void render(); });
chrome.permissions.onAdded.addListener(() => { void render(); });
chrome.permissions.onRemoved.addListener(() => { void render(); });
