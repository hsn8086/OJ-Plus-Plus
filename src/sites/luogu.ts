import { applyPageI18n } from '../core/page-i18n.ts';
import { mountNavSettings, observeSite, prepareMathContent } from './shared.ts';
import { LUOGU_DARK } from './luogu-styles.ts';
import type { ContentSection, EditorLanguage, EditorTestResult, SiteAdapter } from './types.ts';

const fields: Record<string, string> = {
  '题目背景': 'background', 'Background': 'background',
  '题目描述': 'description', 'Description': 'description', 'Problem Description': 'description',
  '输入格式': 'formatI', 'Input Format': 'formatI',
  '输出格式': 'formatO', 'Output Format': 'formatO',
  '说明/提示': 'hint', '说明 / 提示': 'hint', 'Hint': 'hint', 'Hints': 'hint',
};

/** Modern Luogu embeds the original Markdown, while rendered KaTeX omits MathML. */
export function luoguMarkdown(doc: Document, field: string): string | undefined {
  try {
    const context = JSON.parse(doc.querySelector('#lentille-context')?.textContent ?? '{}');
    const problem = context.data?.problem;
    const pid = /\/problem\/([^/?#]+)/.exec(new URL(doc.URL).pathname)?.[1];
    if (!pid || problem?.pid !== pid) return undefined;
    const source = problem.content?.[field];
    return typeof source === 'string' ? source : undefined;
  } catch { return undefined; }
}

/** 洛谷 IDE 语言表（/api/ide_submit 与 /fe/api/problem/submit 共用的数字 id）。 */
const LUOGU_LANGUAGES: readonly EditorLanguage[] = [
  { id: '12', name: 'C++17', mode: 'cpp' },
  { id: '11', name: 'C++14', mode: 'cpp' },
  { id: '34', name: 'C++23', mode: 'cpp' },
  { id: '27', name: 'C++20', mode: 'cpp' },
  { id: '4', name: 'C++11', mode: 'cpp' },
  { id: '28', name: 'C++14 (GCC 9)', mode: 'cpp' },
  { id: '3', name: 'C++98', mode: 'cpp' },
  { id: '2', name: 'C', mode: 'cpp' },
  { id: '7', name: 'Python 3', mode: 'python' },
  { id: '25', name: 'PyPy 3', mode: 'python' },
  { id: '8', name: 'Java 8', mode: 'text' },
  { id: '33', name: 'Java 21', mode: 'text' },
  { id: '15', name: 'Rust', mode: 'text' },
  { id: '14', name: 'Go', mode: 'text' },
  { id: '19', name: 'Haskell', mode: 'text' },
  { id: '30', name: 'OCaml', mode: 'text' },
  { id: '31', name: 'Julia', mode: 'text' },
  { id: '32', name: 'Lua', mode: 'text' },
  { id: '21', name: 'Kotlin/JVM', mode: 'text' },
  { id: '22', name: 'Scala', mode: 'text' },
  { id: '17', name: 'C# Mono', mode: 'text' },
  { id: '9', name: 'Node.js LTS', mode: 'text' },
  { id: '16', name: 'PHP', mode: 'text' },
  { id: '13', name: 'Ruby', mode: 'text' },
  { id: '23', name: 'Perl', mode: 'text' },
  { id: '1', name: 'Pascal', mode: 'text' },
];

function luoguContext(doc: Document): Record<string, any> {
  try { return JSON.parse(doc.querySelector('#lentille-context')?.textContent ?? '{}'); }
  catch { return {}; }
}

function luoguCsrf(doc: Document): string {
  return doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

/* ws2 推送协议：心跳即订阅。
 * 帧 = [chanLen][chan][type][param]，订阅 = 每 ≤20s 在频道上发 type=192；
 * 广播回推 = type=16，payload 是 JSON（recordId/type/execute 等）。 */
const LUOGU_WS2 = 'wss://ws2.luogu.com.cn/ws';
const wsEncoder = new TextEncoder();
const wsDecoder = new TextDecoder();

function ws2Frame(channel: string, type: number, param = ''): Uint8Array {
  const c = wsEncoder.encode(channel), p = wsEncoder.encode(param);
  const frame = new Uint8Array(1 + c.length + 1 + p.length);
  frame[0] = c.length;
  frame.set(c, 1);
  frame[1 + c.length] = type;
  frame.set(p, 1 + c.length + 1);
  return frame;
}

/** 在 Ide:U{uid} 频道上等待 recordId === rid 的 compile/execute 推送。 */
function luoguIdeResult(channel: string, rid: number): Promise<EditorTestResult> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(LUOGU_WS2);
    ws.binaryType = 'arraybuffer';
    let heartbeat = 0;
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearInterval(heartbeat);
      clearTimeout(timeout);
      try { ws.close(); } catch { /* noop */ }
      fn();
    };
    const timeout = setTimeout(() => finish(() => reject(new Error('洛谷评测超时'))), 120_000);
    ws.onopen = () => {
      ws.send(ws2Frame(channel, 192));
      heartbeat = window.setInterval(() => {
        try { ws.send(ws2Frame(channel, 192)); } catch { /* closed */ }
      }, 15_000);
    };
    ws.onerror = () => finish(() => reject(new Error('洛谷推送通道连接失败')));
    ws.onclose = () => finish(() => reject(new Error('洛谷推送通道已断开')));
    ws.onmessage = (event) => {
      if (!(event.data instanceof ArrayBuffer)) return;
      const bytes = new Uint8Array(event.data);
      const channelLen = bytes[0] ?? 0;
      if (bytes.length < 1 + channelLen + 1) return;
      if (bytes[1 + channelLen] !== 16) return; // 只看广播帧
      let data: any;
      try { data = JSON.parse(wsDecoder.decode(bytes.slice(1 + channelLen + 1))); }
      catch { return; }
      if (data?.recordId !== rid) return;
      if (data.type === 'compile') {
        if (data.success) return; // 编译过 → 等 execute 帧
        finish(() => resolve({ output: '', error: '编译失败', stderr: String(data.desc ?? ''), verdict: 'Compile Error' }));
        return;
      }
      if (data.type === 'execute') {
        const x = data.execute ?? {};
        const error = x.error ? String(x.error)
          : x.signal ? `Received signal ${x.signal}`
          : x.exit_code ? `Exit code ${x.exit_code}` : undefined;
        finish(() => resolve({
          output: String(data.output ?? ''),
          error,
          verdict: x.error ?? undefined,
          used: `${x.real_time ?? '?'}ms ${x.memory ?? '?'}kb`,
        }));
      }
    };
  });
}

const en: Record<string, string> = {
  '题目背景': 'Background', '题目描述': 'Description', '输入格式': 'Input Format',
  '输出格式': 'Output Format', '输入输出样例': 'Samples', '说明/提示': 'Hints',
  '题目列表': 'Problems', '提交答案': 'Submit', '提交记录': 'Submissions', '查看题解': 'Editorials',
  '题目反馈': 'Feedback', '标签': 'Tags', '显示算法标签': 'Show tags', '相关讨论': 'Discussions',
  '进入讨论版': 'Open discussions', '查看讨论': 'View discussions', '推荐题目': 'Recommended problems',
  '查看推荐': 'Show recommendations', '复制 Markdown': 'Copy Markdown', '复制': 'Copy',
  '展开': 'Expand', '进入 IDE 模式': 'Open IDE', '加入题单': 'Add to problem list', '复制题目': 'Copy problem',
  '题目编号': 'Problem ID', '提供者': 'Provider', '难度': 'Difficulty', '历史分数': 'Best score',
  '提交': 'Submissions', '通过': 'Accepted', '时间限制': 'Time limit', '内存限制': 'Memory limit',
  '个人中心': 'Profile', '用户设置': 'Settings', '练习情况': 'Practice', '我的题库': 'My problems',
  '我的专栏': 'My articles', '收藏夹': 'Bookmarks', '我的工单': 'Support tickets', '锁定': 'Lock', '登出': 'Sign out',
};

export const luogu: SiteAdapter = {
  id: 'luogu', name: '洛谷 / Luogu', hosts: ['www.luogu.com.cn', 'www.luogu.com'],
  darkStyles: LUOGU_DARK, preserveInlineColors: true,
  editor: {
    languages: LUOGU_LANGUAGES,
    editorMountPoint(doc) {
      // Creation/editing forms belong to Luogu; only problem-view pages may mount the solution editor.
      if (!/^\/problem\/(?!new(?:\/|$))[^/]+\/?$/.test(new URL(doc.URL).pathname)) return null;
      // 优先接管提交卡（隐藏原生 CM6，我们的面板放进去）；没登录/没有就挂题目卡后面
      const submitBody = doc.querySelector<HTMLElement>('.l-card.burger .body');
      if (submitBody?.querySelector('.v-codemirror')) return { anchor: submitBody, position: 'beforeend' as const };
      const anchor = doc.querySelector<HTMLElement>('.l-card.problem');
      return anchor ? { anchor, position: 'afterend' } : null;
    },
    problemCode(doc) { return /\/problem\/([^/?#]+)/.exec(new URL(doc.URL).pathname)?.[1] ?? null; },
    getSamples(doc) {
      try {
        const problem = JSON.parse(doc.querySelector('#lentille-context')?.textContent ?? '{}').data?.problem;
        if (problem?.pid !== /\/problem\/([^/?#]+)/.exec(new URL(doc.URL).pathname)?.[1]) return [];
        return Array.isArray(problem.samples) ? problem.samples.filter((s: unknown) => Array.isArray(s) && s.length === 2 && s.every(v => typeof v === 'string'))
          .map((s: string[]) => ({ input: s[0], output: s[1] })) : [];
      } catch { return []; }
    },
    /** 站点远程评测：/api/ide_submit 开票 + ws2 Ide:U{uid} 频道推送结果。 */
    async runCustomTest(code, languageId, input) {
      const uid = luoguContext(document).user?.uid;
      if (!uid) throw new Error('需要登录洛谷才能远程评测');
      const res = await fetch('/api/ide_submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': luoguCsrf(document) },
        body: JSON.stringify({ lang: Number(languageId), code, input, o2: '' }),
      });
      const json = await res.json().catch(() => null);
      if (json?.status !== 200 || !json?.data?.rid) {
        throw new Error(typeof json?.errorMessage === 'string' ? json.errorMessage : `洛谷评测失败 (${json?.status ?? res.status})`);
      }
      return luoguIdeResult(`Ide:U${uid}`, json.data.rid);
    },
    /** 正式提交：/fe/api/problem/submit/{pid} → 评测记录页；比赛页要带 ?contestId=。验证码拦截时把洛谷的信息透出来。 */
    async submit(code, languageId, problemCode) {
      const contestId = luoguContext(document).data?.contest?.id
        ?? new URLSearchParams(location.search).get('contestId');
      const path = `/fe/api/problem/submit/${encodeURIComponent(problemCode)}`
        + (contestId ? `?contestId=${encodeURIComponent(String(contestId))}` : '');
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': luoguCsrf(document) },
        body: JSON.stringify({ lang: Number(languageId), code, enableO2: 1 }),
      });
      const json = await res.json().catch(() => null);
      // 成功直接给 {rid}；失败给 {errorType,errorCode,status,errorMessage}
      const rid = json?.rid ?? json?.data?.rid;
      if (res.ok && rid) return { ok: true, url: `/record/${rid}` };
      const message = json?.errorMessage ?? (typeof json?.data === 'string' ? json.data : null) ?? `提交失败 (${res.status})`;
      return { ok: false, error: String(message) };
    },
  },
  styles: '.user-nav > .ojpp-settings-btn { margin: 0 8px; } .ojpp-settings-floating { position: fixed; right: 18px; bottom: 18px; z-index: 1000; } '
    // h2 里 float:right 的工具栏会压住 overflow:hidden 的 BFC 正文——clear 推下去
    + '.l-card.problem .lfe-marked-wrap, .l-card.problem .io-sample { clear: both; } '
    // 启用我们编辑器时，把提交卡 code 模式的原生 CM6 藏起来（文件模式没有 v-codemirror 自动露出）
    + '.l-card.burger .body:has(> .ojpp-editor):has(.v-codemirror) > *:not(.ojpp-editor) { display: none !important; } '
    + '.l-card.burger .body:has(.v-codemirror) { padding-bottom: .3em; }',
  collectSections(doc) {
    const sections: ContentSection[] = [];
    for (const heading of doc.querySelectorAll<HTMLElement>('.l-card.problem > h2, .problem-content > h2')) {
      const label = [...heading.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      const key = fields[label];
      if (!key) continue;
      let content = heading.nextElementSibling as HTMLElement | null;
      while (content?.className.startsWith('ojpp-')) content = content.nextElementSibling as HTMLElement | null;
      if (!content?.matches('.lfe-marked-wrap, .marked, .markdown-body') || !content.textContent?.trim()) continue;
      sections.push({ kind: key === 'formatI' ? 'input' : key === 'formatO' ? 'output' : 'statement',
        label, content, identity: `${new URL(doc.URL).pathname}:${key}`, markdown: () => luoguMarkdown(doc, key),
        toolbar: { anchor: heading, position: 'beforeend', align: 'right' }, result: { anchor: content, position: 'afterend' } });
    }
    return sections;
  },
  prepareContent: prepareMathContent,
  mountSettingsButton(button, doc) { mountNavSettings(button, doc, '.user-nav:not(.rside), .nav-container'); },
  observe: observeSite,
  i18nPage(doc, locale) {
    if (locale !== 'en') return;
    applyPageI18n(doc, [{ scope: 'nav, .user-nav, header .stat, .l-card > h2, .l-card > h3, .problem-block-actions, .io-sample .header, .l-card .lfe-caption, .l-card > a', map: en }]);
  },
};
