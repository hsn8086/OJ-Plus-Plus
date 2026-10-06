import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const CHROME_CANDIDATES = [
  process.env.NCB_CHROME,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
].filter(Boolean);
const exe = CHROME_CANDIDATES.find((p) => existsSync(p));
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const settings = { version:1, activeProviderId:'p1', providers:[{id:'p1',name:'DeepSeek',protocol:'openai-chat',baseUrl:'http://127.0.0.1:8787/v1',apiKey:'sk-demo',model:'deepseek-chat',headers:{},body:{},reasoning:{enabled:null,effort:''}}], targetLang:'简体中文', extraPrompt:'', translateWholeBlock:true, autoTranslate:false, timeoutMs:120000, retries:1 };
const init = `(function(){const store=new Map();store.set('ncb:settings',${JSON.stringify(JSON.stringify(settings))});window.GM_getValue=(k,d)=>{if(!store.has(k))return d;const v=store.get(k);try{return typeof v==='string'?JSON.parse(v):v}catch(e){return v}};window.GM_setValue=(k,v)=>store.set(k,typeof v==='string'?v:JSON.stringify(v));window.GM_deleteValue=(k)=>store.delete(k);window.GM_listValues=()=>Array.from(store.keys());window.GM_addStyle=(css)=>{const s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);return s};window.GM_setClipboard=()=>{};window.GM_xmlhttpRequest=(o)=>{const x=new XMLHttpRequest();x.open(o.method||'GET',o.url,true);const h=o.headers||{};for(const k of Object.keys(h)){try{x.setRequestHeader(k,h[k])}catch(e){}}x.onload=()=>{if(o.onload)o.onload({status:x.status,statusText:x.statusText,responseText:x.responseText,responseHeaders:x.getAllResponseHeaders(),finalUrl:o.url})};x.onerror=()=>{if(o.onerror)o.onerror({error:'network'})};x.send(o.data||null);return{abort:()=>x.abort()}};})();`;
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2 });
await p.addInitScript({ content: init });
await p.goto('https://ac.nowcoder.com/acm/contest/100000/A', { waitUntil: 'domcontentloaded' });
await p.addScriptTag({ url: 'http://127.0.0.1:8791/nowcoder-better.user.js' });
await p.waitForSelector('.ncb-toolbar');
const hide = () => document.querySelectorAll('.el-dialog__wrapper, .el-dialog, .v-modal, .pop-box, .mask, .mask-wrap, .nc-modal, .pop-subject-tips-wrapper').forEach((n) => { if (!n.closest('.ncb-mask')) n.style.display = 'none'; });
await p.evaluate(hide); await p.evaluate(hide);
await p.evaluate(() => document.querySelector('.ncb-translate-btn').click());
await p.waitForTimeout(1500);
await p.evaluate(hide);
await p.locator('.ncb-result').first().scrollIntoViewIfNeeded();
mkdirSync(join(root, 'docs/images'), { recursive: true });
await p.screenshot({ path: join(root, 'docs/images/translate.png') });
await p.evaluate(() => document.querySelector('.ncb-settings-btn').click());
await p.waitForTimeout(300);
await p.evaluate(() => document.querySelectorAll('.ncb-tab')[1].click());
await p.waitForTimeout(300);
await p.screenshot({ path: join(root, 'docs/images/settings-provider.png') });
await b.close();
console.log('ok');
