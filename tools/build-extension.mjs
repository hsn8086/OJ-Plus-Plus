import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { sites, siteMatches } from '../src/sites/index.ts';
import { EARLY_THEME_CSS } from '../src/ui/theme-start.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = root + 'dist-extension';
const assets = JSON.parse(await readFile(new URL('./runtime-assets.json', import.meta.url), 'utf8'));
const cache = root + '.cache/wasm-runtimes';
const exec = promisify(execFile);
await mkdir(cache, { recursive: true });
for (const asset of assets) {
  const path = `${cache}/${asset.file}`;
  const valid = async () => existsSync(path) && createHash('sha256').update(await readFile(path)).digest('hex') === asset.sha256;
  if (!await valid()) {
    console.log(`Downloading pinned runtime ${asset.file}`);
    await exec('curl', ['--fail', '--location', '--max-time', '120', '--silent', '--show-error', asset.url, '-o', path]);
  }
  if (!await valid()) throw new Error(`Runtime checksum mismatch: ${asset.file}`);
}
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const [name, source, format] of [
  ['theme-start', 'src/entries/theme-start.ts', 'iife'],
  ['content', 'src/entries/extension.ts', 'iife'],
  ['main-world', 'src/extension/main-world.ts', 'iife'],
  ['background', 'src/extension/background.ts', 'es'],
  ['offscreen', 'src/extension/offscreen.ts', 'es'],
  ['runner', 'src/extension/runner.worker.ts', 'es'],
  ['options', 'src/extension/options.ts', 'es'],
]) {
  await build({ configFile: false, root, logLevel: 'warn',
    // The browser bundle uses PDF.js' packaged main-thread worker, not import.meta asset resolution.
    define: {
      ...(format === 'iife' ? { 'import.meta.url': 'undefined' } : {}),
      __OJPP_THEME_HOSTS__: JSON.stringify(Object.fromEntries(sites.filter(site => site.darkStyles)
        .flatMap(site => site.hosts.map(host => [host, site.id])))),
    },
    build: {
    outDir: out, emptyOutDir: false, target: 'es2022', minify: false,
    lib: { entry: root + source, formats: [format], name: 'OJPP', fileName: () => `${name}.js` },
    rollupOptions: { output: { codeSplitting: false } },
  } });
  // Chromium's extension loader rejects Unicode noncharacters even in valid UTF-8.
  // PDF.js embeds U+FFFF in lookup strings; keep its meaning with JS escapes.
  const script = `${out}/${name}.js`;
  const code = await readFile(script, 'utf8');
  await writeFile(script, code.replace(/[\uFDD0-\uFDEF\uFFFE\uFFFF]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')));
}
// Browser-injected styles are available before the first content paint.
for (const site of sites) {
  if (site.darkStyles) await writeFile(`${out}/theme-${site.id}.css`, EARLY_THEME_CSS + site.darkStyles);
}
const pkg = JSON.parse(await readFile(root + 'package.json', 'utf8'));
const manifest = {
  manifest_version: 3, name: 'OJ++', version: pkg.version, minimum_chrome_version: '120',
  description: 'OJ translation, dark themes and local C/C++/Python sample testing.',
  permissions: ['storage', 'offscreen', 'clipboardWrite'],
  optional_host_permissions: ['https://*/*', 'http://*/*'],
  background: { service_worker: 'background.js', type: 'module' },
  action: { default_title: 'OJ++ — provider permissions and local runtime' },
  options_page: 'options.html',
  content_scripts: [
    ...sites.filter(site => site.darkStyles).map(site => ({
      matches: site.hosts.map(host => `https://${host}/*`),
      css: [`theme-${site.id}.css`], js: ['theme-start.js'], run_at: 'document_start',
    })),
    { matches: siteMatches, js: ['main-world.js'], run_at: 'document_start', world: 'MAIN' },
    { matches: siteMatches, js: ['content.js'], run_at: 'document_idle' },
  ],
  web_accessible_resources: [{ resources: ['katex/*', 'katex/fonts/*'], matches: siteMatches }],
  content_security_policy: { extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'" },
};
await writeFile(out + '/manifest.json', JSON.stringify(manifest, null, 2));
await writeFile(out + '/offscreen.html', '<!doctype html><meta charset="utf-8"><script type="module" src="offscreen.js"></script>');
await writeFile(out + '/options.html', '<!doctype html><meta charset="utf-8"><title>OJ++</title><style>body{font:16px system-ui;max-width:900px;margin:40px auto;padding:20px}button{margin:8px;padding:8px}p{line-height:1.6}</style><main></main><script type="module" src="options.js"></script>');
await mkdir(out + '/runtimes', { recursive: true });
for (const asset of assets) await cp(`${cache}/${asset.file}`, `${out}/runtimes/${asset.file}`);
await mkdir(out + '/katex', { recursive: true });
await cp(root + 'node_modules/katex/dist/katex.min.css', out + '/katex/katex.min.css');
await cp(root + 'node_modules/katex/dist/fonts', out + '/katex/fonts', { recursive: true });
await cp(root + 'node_modules/katex/LICENSE', out + '/katex/LICENSE');
await cp(root + 'THIRD_PARTY_NOTICES.md', out + '/THIRD_PARTY_NOTICES.md');
await cp(root + 'LICENSE', out + '/LICENSE');
await cp(root + 'docs/licenses', out + '/licenses', { recursive: true });
await cp(root + 'tools/runtime-assets.json', out + '/runtimes/asset-lock.json');
console.log(`Built ${out} (local C11/C++17/Python 3.11, no bundled LSP)`);
