import { SETTINGS_KEY, migrate } from '../core/config.ts';

async function render() {
  const main = document.querySelector('main')!;
  main.replaceChildren();
  const title = document.createElement('h1'); title.textContent = 'OJ++ 扩展'; main.append(title);
  const info = document.createElement('p');
  info.textContent = '在支持的 OJ 页面打开齿轮配置翻译服务。在下方授权相应服务域名后即可请求。本地运行使用包内 WASM，不上传源码。'; main.append(info);
  const runtime = document.createElement('p');
  runtime.textContent = '本地运行：C11 / C++17（Clang 8 + libc++）、Python 3.11.3（CPython WASI）。不是 GCC 或 PyPy；不包含 LSP。'; main.append(runtime);
  const settings = migrate((await chrome.storage.local.get(SETTINGS_KEY))[SETTINGS_KEY]);
  for (const provider of settings.providers) {
    let url: URL;
    try { url = new URL(provider.baseUrl); } catch { continue; }
    if (!['http:', 'https:'].includes(url.protocol)) continue;
    const origin = `${url.protocol}//${url.hostname}/*`;
    const row = document.createElement('p');
    const text = document.createElement('span'); text.textContent = `${provider.name} — ${url.origin} `;
    const button = document.createElement('button');
    const allowed = await chrome.permissions.contains({ origins: [origin] });
    button.textContent = allowed ? '已授权' : '授权访问'; button.disabled = allowed;
    button.onclick = async () => {
      try { if (await chrome.permissions.request({ origins: [origin] })) await render(); }
      catch (error) { button.textContent = String(error); }
    };
    row.append(text, button); main.append(row);
  }
}
void render();
chrome.storage.onChanged.addListener(() => { void render(); });
