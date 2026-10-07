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
    /* 齿轮放在登录区、用户名左边 */
    .ojpp-codeforces-settings {
      display: inline-flex; align-items: center;
      margin-right: 6px; vertical-align: middle;
    }
    .ojpp-codeforces-settings .ojpp-icon-btn {
      width: 22px; height: 22px; vertical-align: middle;
    }
  `,

  /**
   * Codeforces 自己只有浅色主题，这里为它补一套暗色。
   *
   * 站点用外部 CSS（style.css、problem-statement.css、roundbox.css 等），
   * 这些规则的选择器都很具体，所以覆盖时要写同等或更高的优先级。
   * 只处理阅读相关部分：正文、样例块、侧边栏、表格、二级菜单。
   * 导航栏原本就是深色，不动。
   */
  darkStyles: `
    /* ---------- 页面骨架 ---------- */
    html[data-ojpp-theme="dark"],
    html[data-ojpp-theme="dark"] body,
    html[data-ojpp-theme="dark"] #body,
    html[data-ojpp-theme="dark"] #pageContent,
    html[data-ojpp-theme="dark"] .content-with-sidebar {
      background: #1c2128 !important;
      color: #cdd9e5;
    }

    /* ---------- 题面 ---------- */
    html[data-ojpp-theme="dark"] .ttypography,
    html[data-ojpp-theme="dark"] .problem-statement {
      color: #cdd9e5;
    }
    /* 题面容器自带背景：站点给 .ttypography 和 .problem-statement 都设过底色，
       暗色下会与页面背景形成色差。全部置为透明，让它们统一继承页面背景。 */
    html[data-ojpp-theme="dark"] .problem-statement,
    html[data-ojpp-theme="dark"] .problemindexholder,
    html[data-ojpp-theme="dark"] .problem-frames,
    html[data-ojpp-theme="dark"] .ttypography {
      background-color: transparent !important;
    }
    html[data-ojpp-theme="dark"] .problem-statement .header .title {
      color: #e6edf3;
    }
    /* 时限、内存限制的标签是 #666，暗色下几乎看不见 */
    html[data-ojpp-theme="dark"] .problem-statement .property-title,
    html[data-ojpp-theme="dark"] .problem-statement .section-title {
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] .problem-statement .section-title {
      border-bottom-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .ttypography a,
    html[data-ojpp-theme="dark"] .problem-statement a {
      color: #539bf5;
    }

    /* 样例的输入/输出：站点把 pre 设成 #efefef，必须显式覆盖 */
    html[data-ojpp-theme="dark"] .problem-statement .sample-tests pre,
    html[data-ojpp-theme="dark"] .problem-statement pre {
      background-color: #22272e !important;
      color: #cdd9e5;
    }
    /* 样例按行高亮：偶数行 #E0E0E0，奇数行白 */
    html[data-ojpp-theme="dark"] .problem-statement .test-example-line-even {
      background-color: #2d333b !important;
    }
    html[data-ojpp-theme="dark"] .problem-statement .test-example-line-odd {
      background-color: #22272e !important;
    }
    /* 站点脚本会把高亮的测试行染成 #FFFDE7（内联样式），
       以及配套的 .testCaseMarker 标记块。
       这里只覆盖带内联高亮色的行，不要写成 .test-example-line，
       否则会盖掉奇偶行的交替底色。 */
    html[data-ojpp-theme="dark"] .problem-statement [style*="FFFDE7"],
    html[data-ojpp-theme="dark"] .problem-statement [style*="fffde7"] {
      background-color: #3a3320 !important;
    }
    html[data-ojpp-theme="dark"] .testCaseMarker {
      border-color: #d9a441 !important;
    }
    html[data-ojpp-theme="dark"] .notice {
      background: #2d333b;
      color: #cdd9e5;
      border-color: #444c56;
    }
    html[data-ojpp-theme="dark"] .problem-statement .sample-test,
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .input,
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .output {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .title {
      color: #909dab;
    }
    /* 样例块的输入输出标题栏（站点用 .input .title / .output .title） */
    html[data-ojpp-theme="dark"] .problem-statement .input .title,
    html[data-ojpp-theme="dark"] .problem-statement .output .title {
      background: #2d333b;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement .input-output-copier {
      color: #909dab;
      border-color: #444c56;
    }
    /* 悬停时站点把背景设成 #def，暗色下会闪一下亮蓝 */
    html[data-ojpp-theme="dark"] .problem-statement .input-output-copier:hover,
    html[data-ojpp-theme="dark"] .copier-small:hover {
      background-color: #373e47 !important;
      color: #cdd9e5 !important;
    }

    html[data-ojpp-theme="dark"] .problem-statement code,
    html[data-ojpp-theme="dark"] .ttypography code {
      background: rgba(99, 110, 123, .4);
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement table,
    html[data-ojpp-theme="dark"] .ttypography table,
    html[data-ojpp-theme="dark"] .problem-statement th,
    html[data-ojpp-theme="dark"] .problem-statement td,
    html[data-ojpp-theme="dark"] .ttypography th,
    html[data-ojpp-theme="dark"] .ttypography td {
      border-color: #373e47;
    }
    /* 题面里的引用与分隔线 */
    html[data-ojpp-theme="dark"] .problem-statement blockquote,
    html[data-ojpp-theme="dark"] .ttypography blockquote {
      border-left-color: #373e47;
      color: #adbac7;
    }
    html[data-ojpp-theme="dark"] .problem-statement hr,
    html[data-ojpp-theme="dark"] .ttypography hr {
      border-color: #373e47;
    }

    /* ---------- 公式 ---------- */
    html[data-ojpp-theme="dark"] .MathJax,
    html[data-ojpp-theme="dark"] .MathJax_Preview,
    html[data-ojpp-theme="dark"] .MathJax_Display,
    html[data-ojpp-theme="dark"] .MJXp-math,
    html[data-ojpp-theme="dark"] .mjx-chtml {
      color: #cdd9e5 !important;
    }

    /* ---------- 侧边栏信息框 ---------- */
    /* .roundbox 的圆角是四张 png 图片，暗色下会露出白角，直接去掉 */
    html[data-ojpp-theme="dark"] .roundbox,
    html[data-ojpp-theme="dark"] .sidebox {
      background: #22272e !important;
      border-color: #373e47;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .roundbox .roundbox-lt,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-rt,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-lb,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-rb {
      background-image: none;
    }
    html[data-ojpp-theme="dark"] .roundbox .caption,
    html[data-ojpp-theme="dark"] .sidebox .caption {
      color: #e6edf3;
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .roundbox .titled,
    html[data-ojpp-theme="dark"] .roundbox .bottom-links {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .roundbox .bottom-links,
    html[data-ojpp-theme="dark"] .roundbox .dark {
      background-color: #2d333b;
    }
    /* 侧边栏里的“Practice”按钮：站点是白底，暗色下太刺眼 */
    html[data-ojpp-theme="dark"] .sidebox .button,
    html[data-ojpp-theme="dark"] .sidebox a.button,
    html[data-ojpp-theme="dark"] .roundbox a.button {
      background: #2d333b !important;
      color: #cdd9e5 !important;
      border-color: #444c56;
    }
    /* 收藏星星那一行 */
    html[data-ojpp-theme="dark"] .sidebox .favourite,
    html[data-ojpp-theme="dark"] .sidebox .star {
      background: #2d333b;
    }

    /* ---------- 表格（最近提交、标签等） ---------- */
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] .datatable td {
      background: #22272e;
      border-color: #373e47;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .datatable th {
      background: #2d333b;
    }
    html[data-ojpp-theme="dark"] .datatable tr:hover td {
      background: #2d333b;
    }
    html[data-ojpp-theme="dark"] .roundbox table.rtable td,
    html[data-ojpp-theme="dark"] .roundbox table.rtable th {
      border-color: #373e47;
    }
    /* 提交结果的颜色：原色在深色底上对比不足 */
    html[data-ojpp-theme="dark"] .verdict-accepted { color: #57ab5a; }
    html[data-ojpp-theme="dark"] .verdict-rejected { color: #f47067; }
    /* 比赛状态（Finished / Running 等）：站点用 #3b5998 深蓝，深底上看不清 */
    html[data-ojpp-theme="dark"] .contest-state-phase {
      color: #79b8ff !important;
    }
    /* 页脚链接：站点用 #0000cc 深蓝 */
    html[data-ojpp-theme="dark"] #footer,
    html[data-ojpp-theme="dark"] #footer a,
    html[data-ojpp-theme="dark"] .switchToMobile {
      color: #768390 !important;
    }
    html[data-ojpp-theme="dark"] #footer a:hover {
      color: #adbac7 !important;
    }
    /* 标签块 */
    html[data-ojpp-theme="dark"] .tag-box,
    html[data-ojpp-theme="dark"] .tag-box a,
    html[data-ojpp-theme="dark"] .roundbox .tag-box {
      background: #2d333b;
      border-color: #444c56;
      color: #cdd9e5;
    }

    /* ---------- 顶部导航 ---------- */
    /* 站点给菜单项设了 color:#000（style.css 的 .menu-list li a），
       背景被我们压暗后黑字就看不见了 */
    html[data-ojpp-theme="dark"] .menu-list li a {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .menu-list li a:hover {
      color: #e6edf3 !important;
    }
    html[data-ojpp-theme="dark"] .menu-list li.current {
      border-bottom-color: #539bf5;
    }

    /* 顶部区域分两条：上面是 logo / 登录，下面是主导航。
       站点本来就是这样分的（#header 与 .menu-box）。
       上条与页面底色一致，不留色块；下条稍亮一点，把导航栏衬托出来。 */
    html[data-ojpp-theme="dark"] #header {
      background: #1c2128 !important;
      border-color: transparent !important;
    }
    html[data-ojpp-theme="dark"] .menu-box,
    html[data-ojpp-theme="dark"] .roundbox.menu-box,
    html[data-ojpp-theme="dark"] .menu-list-container {
      background: #2a313c !important;
      border-color: transparent !important;
    }
    /* 两层之间加一条细线，让分隔看得出来 */
    html[data-ojpp-theme="dark"] .menu-box {
      border-top: 1px solid #3b434e !important;
    }
    /* 登录区与语言选择：站点用的是深蓝 #0000cc，在深底上几乎看不清 */
    html[data-ojpp-theme="dark"] #header a,
    html[data-ojpp-theme="dark"] .lang-chooser a {
      color: #79b8ff !important;
    }
    html[data-ojpp-theme="dark"] #header a:hover,
    html[data-ojpp-theme="dark"] .lang-chooser a:hover {
      color: #a5d6ff !important;
    }

    /* Codeforces 的 logo 是白底深字的 PNG（无 alpha）。
       invert 把白底变黑、深字变亮，再用 screen 混合让黑色消失，
       于是白底透明、文字反色，不需要额外的图片资源。 */
    html[data-ojpp-theme="dark"] #header img[alt="Codeforces"] {
      filter: invert(1) hue-rotate(180deg) brightness(1.1);
      mix-blend-mode: screen;
    }

    /* ---------- 二级菜单（题目页的 Problems / Submit code 那一排） ---------- */
    /* 站点的当前项背景是两张 PNG 圆角图（backLava/leftLava）定位出来的，
       暗色下会形成一条条横向色带。全部去掉图片，改成扁平的纯色。 */
    html[data-ojpp-theme="dark"] .second-level-menu,
    html[data-ojpp-theme="dark"] .second-level-menu-list {
      background: transparent !important;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .leftLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .bottomLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .cornerLava {
      background-image: none !important;
      background-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li a {
      background: transparent !important;
      color: #adbac7 !important;
      border: none;
      border-radius: 4px;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li a:hover {
      color: #e6edf3 !important;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li.current a {
      color: #e6edf3 !important;
    }

    /* ---------- 提示条与代码编辑器 ---------- */
    html[data-ojpp-theme="dark"] div.alert-info,
    html[data-ojpp-theme="dark"] div.alert-warning,
    html[data-ojpp-theme="dark"] div.alert-error,
    html[data-ojpp-theme="dark"] div.alert-success {
      background: #2d333b;
      border-color: #444c56;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .highlight {
      background: #3a3320 !important;
    }
    /* 顶部搜索框：站点给它设了 #f4f4f4 和放大镜背景图 */
    html[data-ojpp-theme="dark"] input.search,
    html[data-ojpp-theme="dark"] .search {
      background-color: #232a33 !important;
      color: #cdd9e5;
      border-color: #475060;
    }
    /* 输入框、下拉框、按钮：站点默认白底，暗色下会刺眼 */
    html[data-ojpp-theme="dark"] input:not([type="checkbox"]):not([type="radio"]),
    html[data-ojpp-theme="dark"] select,
    html[data-ojpp-theme="dark"] textarea {
      background-color: #2d333b;
      color: #cdd9e5;
      border-color: #444c56;
    }
    /* 提交类按钮：站点用 border:2px outset 做立体感，
       暗色下看起来像 90 年代的控件。改成扁平样式。 */
    html[data-ojpp-theme="dark"] input[type="submit"],
    html[data-ojpp-theme="dark"] input[type="button"],
    html[data-ojpp-theme="dark"] button,
    html[data-ojpp-theme="dark"] .button {
      background-color: #2d333b !important;
      color: #cdd9e5 !important;
      border: 1px solid #444c56 !important;
      border-radius: 4px;
    }
    html[data-ojpp-theme="dark"] input[type="submit"]:hover,
    html[data-ojpp-theme="dark"] input[type="button"]:hover,
    html[data-ojpp-theme="dark"] button:hover {
      background-color: #373e47 !important;
    }

    /* ---------- 侧边栏里的链接 ---------- */
    /* 站点给侧边栏链接设了黑色（a.not-decorated 等），
       有些还写成内联 style="color: black"，所以要用 !important */
    html[data-ojpp-theme="dark"] .roundbox a,
    html[data-ojpp-theme="dark"] .sidebox a,
    html[data-ojpp-theme="dark"] .roundbox li,
    html[data-ojpp-theme="dark"] .sidebox li {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .roundbox a:hover,
    html[data-ojpp-theme="dark"] .sidebox a:hover {
      color: #539bf5 !important;
    }
    /* 侧边栏列表项的圆点标记 */
    html[data-ojpp-theme="dark"] .roundbox ul li::before,
    html[data-ojpp-theme="dark"] .sidebox ul li::before {
      color: #768390;
    }
    /* “Contest materials”这类列表：站点给 li 加了 1px 白边框，
       暗色下每行都套一圈亮框。改成素色分隔线，鼠标悬停时再高亮。 */
    html[data-ojpp-theme="dark"] .sidebar-menu ul li,
    html[data-ojpp-theme="dark"] .sidebox ul li {
      border: none !important;
      border-bottom: 1px solid #2d333b !important;
      border-radius: 0;
      background: transparent;
    }
    html[data-ojpp-theme="dark"] .sidebar-menu ul li:last-child,
    html[data-ojpp-theme="dark"] .sidebox ul li:last-child {
      border-bottom: none !important;
    }
    html[data-ojpp-theme="dark"] .sidebar-menu ul li:hover,
    html[data-ojpp-theme="dark"] .sidebox ul li:hover {
      background: #2d333b !important;
    }
    /* 悬停时链接要变亮。站点没有给 hover 设颜色，
       之前悬停后文字仍然很淡，看起来像被禁用。 */
    html[data-ojpp-theme="dark"] .sidebar-menu ul li a:hover,
    html[data-ojpp-theme="dark"] .sidebox ul li a:hover {
      color: #e6edf3 !important;
    }
    /* 资源语言标记（如 (en)）：站点是 #666，深底上看不清 */
    html[data-ojpp-theme="dark"] .resource-locale {
      color: #768390 !important;
    }
    /* 删除资源的小叉：原图是 10x10 灰度 PNG（白底 + 深色叉），
       深底上几乎看不见。invert 会把白底也变成深色方块，
       所以用 mix-blend-mode: screen 让白色消失、只留叉的轮廓。 */
    html[data-ojpp-theme="dark"] .delete-resource-link {
      filter: invert(1);
      mix-blend-mode: screen;
      opacity: .75;
    }
    html[data-ojpp-theme="dark"] .delete-resource-link:hover {
      opacity: 1;
    }
    /* 侧边栏顶部收起/展开的箭头图标（同样是深色小图） */
    html[data-ojpp-theme="dark"] .sidebar-menu .caption .top-links img,
    html[data-ojpp-theme="dark"] .sidebox .caption img {
      filter: invert(1);
      mix-blend-mode: screen;
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
      /**
       * 覆盖工具栏锚点：题面要挂在标题区之后，而不是标题本身。
       * 传入它就表示“另起一行”，与 heading 是否是同一个元素无关。
       */
      toolbarAnchor?: HTMLElement | null,
    ) => {
      if (!content || !heading || !content.textContent?.trim()) return;
      const blockLevel = !!toolbarAnchor;
      const anchor = toolbarAnchor ?? heading;
      sections.push({
        kind,
        label,
        content,
        // 题面工具栏放在标题区下方（时限/内存限制之后）单独一行靠右；
        // 其余区域跟着各自的小标题，同一行右对齐。
        toolbar: blockLevel
          ? { anchor, position: 'afterend', align: 'block-right' }
          : { anchor, position: 'beforeend', align: 'right' },
        result: { anchor: content, position: 'afterend' },
      });
    };

    // 题面正文是 .header 之后的第一个 div，输入/输出/样例/提示各有自己的容器。
    //
    // 不能用 `.header + div`：工具栏就插在 .header 之后，
    // 下次 reconcile 时这个选择器会指向工具栏自身，
    // 导致把工具栏当成题面正文。改成排除自己的兄弟节点。
    const header = statement.querySelector<HTMLElement>('.header');
    const body = [...statement.children]
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .find((node) => node !== header && !node.classList.contains('ojpp-toolbar'));
    add(body ?? null, statement.querySelector<HTMLElement>('.header .title'), 'statement', t('section.statement'), header);
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
    // 放到登录区里、用户名左边。
    // .lang-chooser 的第二个 div 就是 “用户名 | Logout” 那一行。
    const loginRow = doc.querySelector('.lang-chooser > div:last-child');
    if (loginRow) {
      const host = doc.createElement('span');
      host.className = 'ojpp-codeforces-settings';
      host.append(button);
      // 插到最前面，于是齿轮在用户名左侧
      loginRow.prepend(host);
      return;
    }
    // 没登录时 .lang-chooser 只有语言切换，退回到导航栏
    const menu = doc.querySelector('.menu-list.main-menu-list') ?? doc.querySelector('#header');
    if (menu) {
      const host = doc.createElement('li');
      host.className = 'ojpp-codeforces-settings';
      host.append(button);
      menu.append(host);
      return;
    }
    button.classList.add('ojpp-settings-floating');
    doc.body.append(button);
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
