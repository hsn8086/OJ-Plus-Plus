import { t } from '../i18n/index.ts';
import type { ContentSection, SiteAdapter } from './types.ts';

/**
 * Codeforces 的公式有两种完全不同的形态，取决于题目年代：
 *
 * 老题（约 2019 前）：服务端直接渲染成 HTML，页面里没有 LaTeX 源。
 *   形如 <span class="tex-span"><i>n</i> × <i>m</i></span>
 *   上下标是 <sup class="upper-index"> / <sub class="lower-index">。
 *   这类只能按结构还原成 LaTeX。
 *
 * 新题（约 2019 后）：服务器输出 $$$...$$$，由 MathJax 在浏览器里渲染。
 *   渲染后原始 TeX 保留在 <script type="math/tex"> 里（display 公式带 mode=display），
 *   渲染出来的节点（.MathJax*、.MJX*）是副本，必须丢弃，否则会和源重复。
 *
 * 所以适配器要同时处理：优先用 MathJax 源码，其次还原老的 .tex-span。
 */

/** MathJax 渲染出的节点，都是 script 源码的副本。 */
const MATHJAX_RENDERED = [
  '.MathJax', '.MathJax_Display', '.MathJax_Preview', '.MathJax_CHTML',
  '.MathJax_SVG', '.MathJax_SVG_Display', '.mjx-chtml', '.MJXc-display',
  '.MJX_Assistive_MathML', '.MJXp-math',
].join(', ');

/** 老题 .tex-span 里用于排版的字符，转成 LaTeX 命令。 */
const TEX_CHAR_MAP: Record<string, string> = {
  '×': '\\times ',
  '≤': '\\le ',
  '≥': '\\ge ',
  '≠': '\\ne ',
  '±': '\\pm ',
  '∞': '\\infty ',
  '·': '\\cdot ',
  '−': '-',
  '–': '-',
  '⌊': '\\lfloor ',
  '⌋': '\\rfloor ',
  '⌈': '\\lceil ',
  '⌉': '\\rceil ',
  '∑': '\\sum ',
  '∏': '\\prod ',
  '→': '\\to ',
  '⋅': '\\cdot ',
};

/**
 * 把老题的 .tex-span 结构还原成 LaTeX。
 *
 * 只认识 <i>（变量）、<sub>/<sup>（上下标）和少量排版字符。
 * 认不出来时保留原文，宁可少转换也不能丢内容。
 */
function texSpanToLatex(node: Element): string {
  let out = '';
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = child.textContent ?? '';
      let mapped = '';
      for (const ch of text) mapped += TEX_CHAR_MAP[ch] ?? ch;
      out += mapped;
      continue;
    }
    if (child.nodeType !== 1) continue;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();
    const inner = texSpanToLatex(el);
    if (tag === 'i' || tag === 'em') {
      // <i> 是变量名，单个字母直接写，多字符（如 sin）用 \mathrm
      out += /^[a-zA-Z]$/.test(inner) ? inner : `\\mathrm{${inner}}`;
    } else if (tag === 'sub') {
      out += `_{${inner}}`;
    } else if (tag === 'sup') {
      out += `^{${inner}}`;
    } else {
      out += inner;
    }
  }
  // 老题用不间断空格分隔，LaTeX 里换成普通空格
  return out.replace(/\u2009|\u00a0|\u2002|\u2003/g, ' ').trim();
}

/** 老题独立成段的公式会被包在单独的 p 里，此时用 $$...$$ */
function isStandaloneSpan(span: Element): boolean {
  const parent = span.closest('p, div');
  if (!parent) return false;
  return (parent.textContent ?? '').trim() === (span.textContent ?? '').trim()
    && (parent.textContent ?? '').trim().length > 0;
}

export const codeforces: SiteAdapter = {
  id: 'codeforces',
  get name() { return t('site.codeforces'); },
  hosts: ['codeforces.com', 'm1.codeforces.com', 'm2.codeforces.com', 'codeforces.ml'],
  styles: `
    .ojpp-codeforces-settings {
      display: inline-flex; align-items: center; margin-left: 10px; vertical-align: middle;
    }
    .ojpp-codeforces-settings .ojpp-icon-btn { color: #fff; }
    .ojpp-codeforces-settings .ojpp-icon-btn:hover {
      background: rgba(255, 255, 255, .2); color: #fff;
    }
  `,

  /**
   * Codeforces 自己只有浅色主题，所以这里为它补一套暗色。
   *
   * 只覆盖页面骨架与题面文字、链接、表格和代码块这些阅读相关的部分，
   * 不去动导航栏和按钮，避免把站点自己的配色改坏。
   */
  darkStyles: `
    html[data-ojpp-theme="dark"] body {
      background: #1c2128; color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] #pageContent,
    html[data-ojpp-theme="dark"] .content-with-sidebar {
      background: #1c2128; color: #cdd9e5;
    }
    /* 题面正文：Codeforces 用 .ttypography 包住题面与博客正文 */
    html[data-ojpp-theme="dark"] .ttypography,
    html[data-ojpp-theme="dark"] .problem-statement {
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement .header .title,
    html[data-ojpp-theme="dark"] .problem-statement .section-title {
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] .problem-statement .property-title {
      color: #909dab;
    }
    html[data-ojpp-theme="dark"] .ttypography a,
    html[data-ojpp-theme="dark"] .problem-statement a {
      color: #539bf5;
    }
    /* 样例的输入/输出块 */
    html[data-ojpp-theme="dark"] .problem-statement .sample-test,
    html[data-ojpp-theme="dark"] .problem-statement .input,
    html[data-ojpp-theme="dark"] .problem-statement .output {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .title {
      color: #909dab;
    }
    html[data-ojpp-theme="dark"] .problem-statement pre,
    html[data-ojpp-theme="dark"] .ttypography pre {
      background: #22272e; color: #cdd9e5; border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .problem-statement code,
    html[data-ojpp-theme="dark"] .ttypography code {
      background: rgba(99, 110, 123, .4); color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement table,
    html[data-ojpp-theme="dark"] .ttypography table {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .problem-statement th,
    html[data-ojpp-theme="dark"] .problem-statement td,
    html[data-ojpp-theme="dark"] .ttypography th,
    html[data-ojpp-theme="dark"] .ttypography td {
      border-color: #373e47;
    }
    /* 侧边栏与信息框 */
    html[data-ojpp-theme="dark"] .roundbox,
    html[data-ojpp-theme="dark"] .sidebox,
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] .datatable td,
    html[data-ojpp-theme="dark"] .datatable th {
      background: #22272e; border-color: #373e47; color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .roundbox .caption,
    html[data-ojpp-theme="dark"] .sidebox .caption {
      background: #2d333b; color: #cdd9e5;
    }
    /* 二级菜单与标签页 */
    html[data-ojpp-theme="dark"] .second-level-menu,
    html[data-ojpp-theme="dark"] .second-level-menu-list {
      background: #22272e;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li a {
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li.current a {
      background: #2d333b;
    }
    /* 题面里的公式（老题的 .tex-span 与 MathJax 渲染结果） */
    html[data-ojpp-theme="dark"] .MathJax,
    html[data-ojpp-theme="dark"] .MathJax_Preview,
    html[data-ojpp-theme="dark"] .MJXp-math {
      color: #cdd9e5;
    }
    /* 顶部导航：Codeforces 原本就是深色，这里只压暗一点并统一色调 */
    html[data-ojpp-theme="dark"] #header,
    html[data-ojpp-theme="dark"] .menu-box,
    html[data-ojpp-theme="dark"] .menu-list-container {
      background: #161b22;
    }
  `,

  collectSections(doc) {
    const sections: ContentSection[] = [];
    const statement = doc.querySelector<HTMLElement>('.problem-statement');
    if (!statement) return sections;

    const add = (
      content: HTMLElement | null,
      heading: HTMLElement | null,
      kind: ContentSection['kind'],
      label: string,
    ) => {
      if (!content || !heading || !content.textContent?.trim()) return;
      sections.push({
        kind,
        label,
        content,
        // 放到标题行最右边：Codeforces 的 .section-title 与标题同级，
        // 同一行右对齐比紧跟标题更整齐。
        toolbar: { anchor: heading, position: 'beforeend', align: 'right' },
        result: { anchor: content, position: 'afterend' },
      });
    };

    // 题面正文是 .header 之后的第一个 div，输入/输出/样例/提示各有自己的容器。
    const body = statement.querySelector<HTMLElement>('.header + div');
    add(body, statement.querySelector<HTMLElement>('.header .title'), 'statement', t('section.statement'));
    add(
      statement.querySelector<HTMLElement>('.input-specification'),
      statement.querySelector<HTMLElement>('.input-specification .section-title'),
      'input',
      t('section.input'),
    );
    add(
      statement.querySelector<HTMLElement>('.output-specification'),
      statement.querySelector<HTMLElement>('.output-specification .section-title'),
      'output',
      t('section.output'),
    );
    // 样例不翻译：输入输出块是测试数据，译文会破坏可复制性
    add(
      statement.querySelector<HTMLElement>('.note'),
      statement.querySelector<HTMLElement>('.note .section-title'),
      'output',
      t('section.note'),
    );
    return sections;
  },

  prepareContent(root) {
    const doc = root.ownerDocument;

    // 新题：MathJax 的渲染副本必须先删，否则同一公式会出现两份。
    // 源码 script 是唯一可靠的 LaTeX 来源，稍后再统一转换。
    for (const rendered of root.querySelectorAll(MATHJAX_RENDERED)) {
      // 只在后面确实跟着源码时才删，避免其他渲染器下把内容删空
      const next = rendered.nextElementSibling;
      const prev = rendered.previousElementSibling;
      const hasSource =
        next?.matches('script[type^="math/tex"]') ||
        prev?.matches('script[type^="math/tex"]');
      if (hasSource) rendered.remove();
    }

    // 新题：把 <script type="math/tex"> 还原成 $...$ / $$...$$。
    // 用 script 而不是渲染节点，能拿到原始 LaTeX。
    for (const script of root.querySelectorAll<HTMLScriptElement>('script[type^="math/tex"]')) {
      const latex = (script.textContent ?? '').trim();
      if (!latex) {
        script.remove();
        continue;
      }
      const math = doc.createElement('span');
      math.setAttribute(
        'data-ojpp-math',
        /mode\s*=\s*display/.test(script.type) ? 'display' : 'inline',
      );
      math.textContent = latex;
      script.replaceWith(math);
    }

    // 老题：服务端渲染的 .tex-span，没有 LaTeX 源，只能按结构还原。
    // 只处理最外层，嵌套的会由递归覆盖。
    for (const span of root.querySelectorAll<HTMLElement>('.tex-span')) {
      if (span.parentElement?.closest('.tex-span')) continue;
      const latex = texSpanToLatex(span);
      if (!latex) {
        span.remove();
        continue;
      }
      const math = doc.createElement('span');
      math.setAttribute('data-ojpp-math', isStandaloneSpan(span) ? 'display' : 'inline');
      math.textContent = latex;
      span.replaceWith(math);
    }

    // 代码字体与等宽文本：Turndown 会当成普通文字，包成行内代码更准确
    for (const tt of root.querySelectorAll<HTMLElement>('.tex-font-style-tt, .text-verb')) {
      const code = doc.createElement('code');
      code.textContent = tt.textContent ?? '';
      tt.replaceWith(code);
    }

    // 粗体/斜体/删除线的语义标签，转成 Markdown 标记
    const inlineStyles: [string, string, string][] = [
      ['.tex-font-style-bf', '**', '**'],
      ['.tex-font-style-it', '*', '*'],
      ['.tex-font-style-sl', '*', '*'],
      ['.tex-font-style-striked', '~~', '~~'],
    ];
    for (const [selector, open, close] of inlineStyles) {
      for (const el of root.querySelectorAll<HTMLElement>(selector)) {
        const text = el.textContent ?? '';
        if (!text) continue;
        el.replaceWith(doc.createTextNode(`${open}${text}${close}`));
      }
    }

    // 标题类元素用加粗，避免 Turndown 生成无意义的空行
    for (const el of root.querySelectorAll<HTMLElement>('.section-title, .property-title')) {
      const text = (el.textContent ?? '').trim();
      if (!text) continue;
      const bold = doc.createElement('strong');
      bold.textContent = selectorEndsWithProperty(el) ? `${text}: ` : text;
      el.replaceWith(bold);
    }

    // 复制按钮是界面元素，不属于题面
    for (const el of root.querySelectorAll('.input-output-copier')) el.remove();
  },

  mountSettingsButton(button, doc) {
    // 主菜单栏是页面里唯一稳定的顶部容器
    const menu = doc.querySelector('.menu-list.main-menu-list') ?? doc.querySelector('#header');
    if (menu) {
      const host = doc.createElement('li');
      host.className = 'ojpp-codeforces-settings';
      host.append(button);
      menu.append(host);
    } else {
      button.classList.add('ojpp-settings-floating');
      doc.body.append(button);
    }
  },

  observe(doc, onChange) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (timer !== undefined) return;
      timer = setTimeout(() => {
        timer = undefined;
        onChange();
      }, 150);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(doc.body, { childList: true, subtree: true });
    // MathJax 渲染完成后公式才可用，但它的渲染不总是触发 childList，
    // 所以在首次加载和 MathJax 就绪时各补一次。
    const onReady = () => schedule();
    doc.addEventListener('DOMContentLoaded', onReady);
    window.addEventListener('load', onReady);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      doc.removeEventListener('DOMContentLoaded', onReady);
      window.removeEventListener('load', onReady);
    };
  },
};

/** .property-title 后面要跟冒号（如 "time limit per test: "），.section-title 不要。 */
function selectorEndsWithProperty(el: Element): boolean {
  return el.classList.contains('property-title');
}
