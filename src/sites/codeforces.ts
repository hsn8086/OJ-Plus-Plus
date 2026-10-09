import { t } from '../i18n/index.ts';
import type { ContentSection, EditorLanguage, EditorTestResult, SiteAdapter } from './types.ts';

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

const CF_LANGUAGES: readonly EditorLanguage[] = [
  { id: '54', name: 'GNU G++17 7.3.0', mode: 'cpp' },
  { id: '89', name: 'GNU G++20 13.2', mode: 'cpp' },
  { id: '91', name: 'GNU G++23 14.2', mode: 'cpp' },
  { id: '43', name: 'GNU GCC C11 5.1.0', mode: 'cpp' },
  { id: '87', name: 'Java 21 64bit', mode: 'java' },
  { id: '36', name: 'Java 8 32bit', mode: 'java' },
  { id: '31', name: 'Python 3.13.2', mode: 'python' },
  { id: '70', name: 'PyPy 3.10 (7.3.15)', mode: 'python' },
  { id: '7', name: 'Python 2.7.18', mode: 'python' },
  { id: '32', name: 'Go 1.22.2', mode: 'text' },
  { id: '75', name: 'Rust 1.89.0', mode: 'text' },
  { id: '83', name: 'Kotlin 1.7.20', mode: 'text' },
  { id: '65', name: 'C# 8 (.NET Core 3.1)', mode: 'text' },
];

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
    html[data-ojpp-theme="dark"] .ttypography a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .problem-statement a:not(.rated-user):not([class*="user-"]) {
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
    /* 站点把 .ttypography 里的 pre 设成深红（#800000），
       暗色下像一块深红色字。统一改成正常文本色 */
    html[data-ojpp-theme="dark"] .problem-statement pre,
    html[data-ojpp-theme="dark"] .ttypography pre {
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

    /* ---------- 折叠博客底部的渐隐 ---------- */
    /* /top 折叠的博文在底部用 ::before 铺一条 rgba(255,255,255,0)→#fff
       的渐隐遮罩，暗色下是一条浅蓝白带。改成渐隐到页面底色 */
    html[data-ojpp-theme="dark"] .collapsible-topic.collapsed .content .collapsible-topic-options::before {
      background-image: linear-gradient(rgba(28, 33, 40, 0), #1c2128) !important;
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
    html[data-ojpp-theme="dark"] .datatable td,
    /* datatable 外面还有一层包装容器，站点给它设了 #e1e1e1 */
    html[data-ojpp-theme="dark"] .datatable > div,
    html[data-ojpp-theme="dark"] div.datatable > div {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    /* 分页信息那一行（“1-50 of 1234”） */
    html[data-ojpp-theme="dark"] .datatable .pagination,
    html[data-ojpp-theme="dark"] .datatable > div:last-child {
      background: #22272e !important;
      color: #909dab;
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
    /* 提交结果的颜色：按站点真实语义映射到暗色可读版——
       CF 亮态是 accepted=#00aa00 绿、rejected(WA/TLE/RE)=#0000aa 深蓝、
       failed/hacked=红、waiting=灰。暗色里换成对应的可读色 */
    html[data-ojpp-theme="dark"] .verdict-accepted,
    html[data-ojpp-theme="dark"] .verdict-accepted-challenged,
    html[data-ojpp-theme="dark"] .verdict-successful-challenge {
      color: #57ab5a !important;
    }
    /* rejected 在 CF 是深蓝色（WA/TLE/RE），暗色下提亮成可读蓝 */
    html[data-ojpp-theme="dark"] .verdict-rejected,
    html[data-ojpp-theme="dark"] .verdict-unsuccessful-challenge,
    html[data-ojpp-theme="dark"] .verdict-format-judged {
      color: #8ab4ff !important;
    }
    html[data-ojpp-theme="dark"] .verdict-failed,
    html[data-ojpp-theme="dark"] .verdict-challenged,
    html[data-ojpp-theme="dark"] .verdict-wrong-answer {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .verdict-waiting,
    html[data-ojpp-theme="dark"] .verdict-in-queue,
    html[data-ojpp-theme="dark"] .verdict-judging {
      color: #909dab !important;
    }
    /* 逐条测试的 verdict_type：welldone=OK 绿、error=失败红、pending 灰 */
    html[data-ojpp-theme="dark"] .welldone,
    html[data-ojpp-theme="dark"] .welldone .verdict {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .verdict_type.error,
    html[data-ojpp-theme="dark"] .verdict_type.error .verdict {
      color: #f85149 !important;
    }
    /* 未判定的 "Verdict: ?" 用灰，别用亮白 */
    html[data-ojpp-theme="dark"] .verdict_type:not(.welldone):not(.error),
    html[data-ojpp-theme="dark"] .verdict_type:not(.welldone):not(.error) .verdict {
      color: #909dab !important;
    }
    /* 比赛状态（Finished / Running 等）：站点用 #3b5998 深蓝，深底上看不清 */
    html[data-ojpp-theme="dark"] .contest-state-phase {
      color: #79b8ff !important;
    }
    /* 页脚链接：站点用 #0000cc 深蓝 */
    html[data-ojpp-theme="dark"] #footer,
    html[data-ojpp-theme="dark"] #footer a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .switchToMobile {
      color: #768390 !important;
    }
    html[data-ojpp-theme="dark"] #footer a:hover {
      color: #adbac7 !important;
    }
    /* 标签块：chip 底色贴平所在容器，只留描边 */
    html[data-ojpp-theme="dark"] .tag-box,
    html[data-ojpp-theme="dark"] .tag-box a,
    html[data-ojpp-theme="dark"] .roundbox .tag-box {
      background: transparent;
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

    /* ---------- 全局链接 ---------- */
    /* 站点几乎所有正文链接都是 #0000cc 这种深蓝，深底上对比不足。
       这是提交记录、状态、博客、题面里最普遍的问题，所以放在最前面兜底。 */
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):visited {
      color: #539bf5;
    }
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):hover,
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):active {
      color: #79b8ff;
    }
    /* 已访问过的链接不要变成紫色，暗色下同样难读 */
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):visited {
      color: #b083f0;
    }

    /* ---------- 评级颜色 ---------- */
    /* 站点用 .user-* 类给用户名上色，色值是纯红/纯蓝/gray 这类，
       在深底上要么刺眼要么看不清。这里换成同色系的亮版本，
       保持“颜色代表段位”这个语义，只调整明度。 */
    /* 用户名几乎总是 <a class="rated-user user-段位">。
       段位色必须同时命中 a 和普通元素：站点自己的 a { color } 会跟
       .user-* 抢，而 color: inherit 是错的——那会继承父元素（通常是
       没有段位类的 td），段位色就整个丢了。
       所以这里对两类元素都直接写死颜色，并且一律 !important。 */
    html[data-ojpp-theme="dark"] .user-black,
    html[data-ojpp-theme="dark"] a.user-black { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-gray,
    html[data-ojpp-theme="dark"] a.user-gray { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-green,
    html[data-ojpp-theme="dark"] a.user-green { color: #57ab5a !important; }
    html[data-ojpp-theme="dark"] .user-cyan,
    html[data-ojpp-theme="dark"] a.user-cyan { color: #39c5bb !important; }
    html[data-ojpp-theme="dark"] .user-blue,
    html[data-ojpp-theme="dark"] a.user-blue { color: #539bf5 !important; }
    html[data-ojpp-theme="dark"] .user-violet,
    html[data-ojpp-theme="dark"] a.user-violet { color: #c297ff !important; }
    html[data-ojpp-theme="dark"] .user-orange,
    html[data-ojpp-theme="dark"] a.user-orange { color: #f0883e !important; }
    html[data-ojpp-theme="dark"] .user-red,
    html[data-ojpp-theme="dark"] a.user-red { color: #f85149 !important; }
    /* 站点还按具体分数给类名（user-1200 ~ user-4000），
       这些也是段位色：>=4000 红，2400-3999 橙，2100-2399 紫，1600-2099 蓝，
       1200-1599 青，<1200 灰。覆盖最常见的几档。 */
    html[data-ojpp-theme="dark"] .user-4000,
    html[data-ojpp-theme="dark"] a.user-4000,
    html[data-ojpp-theme="dark"] [class*="user-4"] { color: #f85149 !important; }
    html[data-ojpp-theme="dark"] [class*="user-3"],
    html[data-ojpp-theme="dark"] [class*="user-2"],
    html[data-ojpp-theme="dark"] [class*="user-24"],
    html[data-ojpp-theme="dark"] [class*="user-25"],
    html[data-ojpp-theme="dark"] [class*="user-26"],
    html[data-ojpp-theme="dark"] [class*="user-27"],
    html[data-ojpp-theme="dark"] [class*="user-28"],
    html[data-ojpp-theme="dark"] [class*="user-29"],
    html[data-ojpp-theme="dark"] [class*="user-30"],
    html[data-ojpp-theme="dark"] [class*="user-31"],
    html[data-ojpp-theme="dark"] [class*="user-32"],
    html[data-ojpp-theme="dark"] [class*="user-33"],
    html[data-ojpp-theme="dark"] [class*="user-34"],
    html[data-ojpp-theme="dark"] [class*="user-35"],
    html[data-ojpp-theme="dark"] [class*="user-36"],
    html[data-ojpp-theme="dark"] [class*="user-37"],
    html[data-ojpp-theme="dark"] [class*="user-38"],
    html[data-ojpp-theme="dark"] [class*="user-39"] { color: #f0883e !important; }
    html[data-ojpp-theme="dark"] [class*="user-21"],
    html[data-ojpp-theme="dark"] [class*="user-22"],
    html[data-ojpp-theme="dark"] [class*="user-23"] { color: #c297ff !important; }
    html[data-ojpp-theme="dark"] [class*="user-16"],
    html[data-ojpp-theme="dark"] [class*="user-17"],
    html[data-ojpp-theme="dark"] [class*="user-18"],
    html[data-ojpp-theme="dark"] [class*="user-19"],
    html[data-ojpp-theme="dark"] [class*="user-20"] { color: #539bf5 !important; }
    html[data-ojpp-theme="dark"] [class*="user-12"],
    html[data-ojpp-theme="dark"] [class*="user-13"],
    html[data-ojpp-theme="dark"] [class*="user-14"],
    html[data-ojpp-theme="dark"] [class*="user-15"] { color: #39c5bb !important; }
    html[data-ojpp-theme="dark"] [class*="user-1"],
    html[data-ojpp-theme="dark"] [class*="user-0"] { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-legendary,
    html[data-ojpp-theme="dark"] a.user-legendary { color: #f85149 !important; }
    /* admin/头衔类没有段位色，给个中性亮色 */
    html[data-ojpp-theme="dark"] .user-admin,
    html[data-ojpp-theme="dark"] a.user-admin { color: #cdd9e5 !important; }
    /* legendary 段位的首字母被站点强制成黑色（.user-legendary::first-letter），
       深底上就变成“首字母看不见、其余红色”。改成白色首字母。
       注意 ::first-letter 只能对块级容器生效，站点在 span 上也做了处理。 */
    html[data-ojpp-theme="dark"] .user-legendary::first-letter,
    html[data-ojpp-theme="dark"] a.user-legendary::first-letter,
    html[data-ojpp-theme="dark"] .legendary-user-first-letter,
    html[data-ojpp-theme="dark"] .legendary-user-first-letter::first-letter {
      color: #ffffff !important;
    }
    /* 段位色写在里面的 span 上时（站点有这种结构），别被外层规则盖掉 */
    html[data-ojpp-theme="dark"] .rated-user span[class*="user-"] {
      color: inherit !important;
    }

    /* ---------- 表格（提交记录、状态、排行榜等） ---------- */
    /* 站点给状态表用了浅色底与斑马纹，暗色下是整片亮块 */
    html[data-ojpp-theme="dark"] table.status-frame-datatable,
    html[data-ojpp-theme="dark"] .status-frame-datatable,
    html[data-ojpp-theme="dark"] table.problems,
    html[data-ojpp-theme="dark"] table.standings,
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] table {
      background: #22272e;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable tr,
    html[data-ojpp-theme="dark"] .datatable tr,
    html[data-ojpp-theme="dark"] table tr {
      background: #22272e !important;
      border-color: #373e47 !important;
    }
    /* 斑马纹：隔行稍亮一点，保留可读性 */
    html[data-ojpp-theme="dark"] .status-frame-datatable tr:nth-child(even),
    html[data-ojpp-theme="dark"] .datatable tr:nth-child(even),
    html[data-ojpp-theme="dark"] table tr:nth-child(even) {
      background: #272d36 !important;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable th,
    html[data-ojpp-theme="dark"] .status-frame-datatable td,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] .datatable td,
    html[data-ojpp-theme="dark"] table th,
    html[data-ojpp-theme="dark"] table td {
      background: transparent !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable th,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] table th {
      background: #2d333b !important;
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] table tr:hover td,
    html[data-ojpp-theme="dark"] .datatable tr:hover td {
      background: #2d333b !important;
    }
    /* 表头里的排序箭头/小图标是深色 PNG */
    html[data-ojpp-theme="dark"] table th img,
    html[data-ojpp-theme="dark"] .datatable th img {
      filter: invert(1) brightness(1.3);
    }
    /* 比赛报名/设置这类表单：.table-form 是表单布局表，不是数据表。
       站点本来就让它透明贴页面，但上面 table 的全局斑马纹把它
       染成了花花绿绿的隔行。统一还原透明，贴回 #1c2128 底色 */
    html[data-ojpp-theme="dark"] .table-form,
    html[data-ojpp-theme="dark"] .table-form tr,
    html[data-ojpp-theme="dark"] .table-form tr:nth-child(even),
    html[data-ojpp-theme="dark"] .table-form th,
    html[data-ojpp-theme="dark"] .table-form td,
    html[data-ojpp-theme="dark"] .table-form .field-name,
    /* 协议条款的滚框（站点是 #ffffdd 高亮框）也统一回底色——
       它仍留边框，能看出是个可滚动的框 */
    html[data-ojpp-theme="dark"] .table-form textarea {
      background: transparent !important;
    }
    /* 表格分页条 */
    html[data-ojpp-theme="dark"] .pagination,
    html[data-ojpp-theme="dark"] .pagination span,
    html[data-ojpp-theme="dark"] .pagination a:not(.rated-user):not([class*="user-"]) {
      background: transparent !important;
      color: #adbac7;
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .pagination span.active {
      background: #2d333b !important;
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] .pagination a:hover {
      background: #2d333b !important;
    }

    /* ---------- 表单（提交页、筛选面板） ---------- */
    /* 站点大量使用原生 select / input，暗色下会是白底。
       这里统一处理，并去掉 Chrome 的原生立体感。 */
    html[data-ojpp-theme="dark"] select,
    html[data-ojpp-theme="dark"] input[type="text"],
    html[data-ojpp-theme="dark"] input[type="password"],
    html[data-ojpp-theme="dark"] input[type="number"],
    html[data-ojpp-theme="dark"] input[type="email"],
    html[data-ojpp-theme="dark"] input:not([type]),
    html[data-ojpp-theme="dark"] textarea {
      background-color: #2d333b !important;
      color: #cdd9e5 !important;
      border: 1px solid #444c56 !important;
      border-radius: 4px;
      -webkit-appearance: none;
      appearance: none;
    }
    /* select 被去掉原生外观后需要自己补一个下拉箭头 */
    html[data-ojpp-theme="dark"] select {
      background-image: linear-gradient(45deg, transparent 50%, #909dab 50%),
                        linear-gradient(135deg, #909dab 50%, transparent 50%);
      background-position: calc(100% - 14px) calc(50% - 2px), calc(100% - 9px) calc(50% - 2px);
      background-size: 5px 5px, 5px 5px;
      background-repeat: no-repeat;
      padding-right: 24px;
    }
    html[data-ojpp-theme="dark"] input::placeholder,
    html[data-ojpp-theme="dark"] textarea::placeholder {
      color: #768390;
    }
    /* 提交页的代码编辑器（站点用 CodeMirror 或 textarea） */
    html[data-ojpp-theme="dark"] .CodeMirror,
    html[data-ojpp-theme="dark"] .CodeMirror-scroll,
    html[data-ojpp-theme="dark"] .CodeMirror-gutters,
    html[data-ojpp-theme="dark"] #editor,
    html[data-ojpp-theme="dark"] .editor {
      background: #22272e !important;
      color: #cdd9e5 !important;
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .CodeMirror-gutters {
      background: #1c2128 !important;
      border-right-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .CodeMirror-linenumber { color: #768390; }
    html[data-ojpp-theme="dark"] .CodeMirror-cursor { border-left-color: #cdd9e5; }
    html[data-ojpp-theme="dark"] .CodeMirror-selected { background: #373e47 !important; }
    html[data-ojpp-theme="dark"] .CodeMirror-activeline-background { background: #2d333b !important; }
    /* 文件选择按钮 */
    html[data-ojpp-theme="dark"] input[type="file"]::file-selector-button {
      background: #2d333b;
      color: #cdd9e5;
      border: 1px solid #444c56;
      border-radius: 4px;
    }

    /* ---------- 首页 / 公告 ---------- */
    /* 首页公告里的标题与表格：站点用深色文字，暗色下看不见 */
    html[data-ojpp-theme="dark"] .topic,
    html[data-ojpp-theme="dark"] .topic h1,
    html[data-ojpp-theme="dark"] .topic h2,
    html[data-ojpp-theme="dark"] .topic h3,
    html[data-ojpp-theme="dark"] .topic p,
    html[data-ojpp-theme="dark"] .topic li,
    html[data-ojpp-theme="dark"] .topic div,
    html[data-ojpp-theme="dark"] .ttypography h1,
    html[data-ojpp-theme="dark"] .ttypography h2,
    html[data-ojpp-theme="dark"] .ttypography h3,
    html[data-ojpp-theme="dark"] .ttypography h4,
    html[data-ojpp-theme="dark"] .ttypography h5,
    html[data-ojpp-theme="dark"] .ttypography h6 {
      color: #e6edf3;
    }
    /* 首页的评分表：表头原本是深色底、正文是白底 */
    html[data-ojpp-theme="dark"] .topic table,
    html[data-ojpp-theme="dark"] .ttypography table {
      border-color: #373e47 !important;
    }
    /* 公告里的引用块左侧竖线 */
    html[data-ojpp-theme="dark"] .topic blockquote,
    html[data-ojpp-theme="dark"] .ttypography blockquote {
      border-left-color: #475060;
      color: #adbac7;
    }
    /* 隐藏的公告标题（首页 “Hello, Codeforces!” 那种被压暗的标题） */
    html[data-ojpp-theme="dark"] .topic .spoiler-title,
    html[data-ojpp-theme="dark"] .spoiler-title {
      color: #e6edf3;
    }

    /* ---------- 博客 / changelog ---------- */
    html[data-ojpp-theme="dark"] .blog-entry,
    html[data-ojpp-theme="dark"] .blog-entry .title,
    html[data-ojpp-theme="dark"] .blog-entry .info,
    html[data-ojpp-theme="dark"] .comment,
    html[data-ojpp-theme="dark"] .comment .content {
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .blog-entry .title a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .comment a:not(.rated-user):not([class*="user-"]) {
      color: #539bf5 !important;
    }
    /* changelog 里的日期与作者信息 */
    html[data-ojpp-theme="dark"] .blog-entry .info,
    html[data-ojpp-theme="dark"] .comment .info {
      color: #909dab;
    }

    /* ---------- 日历 ---------- */
    html[data-ojpp-theme="dark"] .calendar,
    html[data-ojpp-theme="dark"] .calendar-table,
    html[data-ojpp-theme="dark"] table.calendar {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .calendar td,
    html[data-ojpp-theme="dark"] .calendar th,
    html[data-ojpp-theme="dark"] table.calendar td,
    html[data-ojpp-theme="dark"] table.calendar th {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .calendar .day,
    html[data-ojpp-theme="dark"] table.calendar td.day {
      color: #cdd9e5;
    }
    /* 日历里表示“有比赛”的标记色块，原色在深底上过暗 */
    html[data-ojpp-theme="dark"] .calendar .contest,
    html[data-ojpp-theme="dark"] table.calendar .contest {
      background: #2d333b !important;
      color: #adbac7;
    }

    /* ---------- 搜索框与筛选表单 ---------- */
    /* 状态页的筛选面板：站点用 fieldset 包裹，标题是蓝色 */
    html[data-ojpp-theme="dark"] fieldset,
    html[data-ojpp-theme="dark"] .filter-box {
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] fieldset legend,
    html[data-ojpp-theme="dark"] .filter-box label {
      color: #adbac7;
    }
    /* 筛选面板里的蓝色标签（Problem: / Verdict: 等） */
    html[data-ojpp-theme="dark"] .status-filter label,
    html[data-ojpp-theme="dark"] .filter-box b,
    html[data-ojpp-theme="dark"] .filter-box strong {
      color: #79b8ff;
    }

    /* ---------- 首页列表 ---------- */
    /* 公告与比赛的标题：站点用 #3b5998 深蓝（.topic .title 里的链接）。
       这些链接里混着 .rated-user 用户名（Top rated 那栏就是链接列表），
       不能把段位色一起刷掉，所以一律 :not(.rated-user)。 */
    html[data-ojpp-theme="dark"] .topic .title a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .topic .title,
    html[data-ojpp-theme="dark"] .topic a:not(.rated-user):not([class*="user-"]),
    /* 标题文字实际落在 a 里的 <p> 上，颜色设在那里而不是 a 上 */
    html[data-ojpp-theme="dark"] .topic .title a p,
    html[data-ojpp-theme="dark"] .topic a p,
    html[data-ojpp-theme="dark"] .contestList .contestName a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .recent-actions a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .roundbox .caption a:not(.rated-user):not([class*="user-"]) {
      color: #79b8ff !important;
    }
    /* 首页右栏的“Top rated”之类列表：默认文字色即可。
       必须排除 .rated-user，否则会把段位色一起刷掉——
       “Top rated”里全是红名/橙名，正是最需要保留颜色的地方。 */
    html[data-ojpp-theme="dark"] .personal-sidebar a:not(.rated-user),
    html[data-ojpp-theme="dark"] .sidebox a:not(.rated-user),
    html[data-ojpp-theme="dark"] .roundbox a:not(.rated-user) {
      color: #cdd9e5 !important;
    }
    /* 公告的 rating 变化：.topic-rating 是 #008000 深绿 */
    html[data-ojpp-theme="dark"] .topic-rating,
    html[data-ojpp-theme="dark"] .green,
    html[data-ojpp-theme="dark"] .rating-up {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .red,
    html[data-ojpp-theme="dark"] .rating-down {
      color: #f85149 !important;
    }

    /* ---------- 博客与评论区 ---------- */
    /* 博客标题：站点的结构是 h3 > a，没有稳定的 class，
       所以直接按标签层级选，并排除页脚等区域 */
    html[data-ojpp-theme="dark"] #pageContent h3 a,
    html[data-ojpp-theme="dark"] #pageContent h3,
    html[data-ojpp-theme="dark"] .blog-entry h3 a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .blog-entry .title {
      color: #79b8ff !important;
    }
    /* 评论的投票分数：正值 #008000、负值 #800000 */
    html[data-ojpp-theme="dark"] .commentRating,
    html[data-ojpp-theme="dark"] .commentRating span {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .commentRating.negative,
    html[data-ojpp-theme="dark"] .commentRating.negative span {
      color: #f85149 !important;
    }
    /* 代码高亮（Google prettify）：站点为浅色背景设计的配色，
       深底上几乎全是深色，直接按语法类别换成亮色版本 */
    html[data-ojpp-theme="dark"] .prettyprint,
    html[data-ojpp-theme="dark"] code.prettyprint,
    html[data-ojpp-theme="dark"] pre.prettyprint {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .prettyprint .pln,
    html[data-ojpp-theme="dark"] .prettyprint .pun { color: #cdd9e5 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .kwd,
    html[data-ojpp-theme="dark"] .prettyprint .kwd span { color: #f47067 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .typ,
    html[data-ojpp-theme="dark"] .prettyprint .atn { color: #79b8ff !important; }
    html[data-ojpp-theme="dark"] .prettyprint .lit,
    html[data-ojpp-theme="dark"] .prettyprint .str,
    html[data-ojpp-theme="dark"] .prettyprint .atv { color: #8ddb8c !important; }
    html[data-ojpp-theme="dark"] .prettyprint .com { color: #768390 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .tag { color: #f47067 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .dec,
    html[data-ojpp-theme="dark"] .prettyprint .var { color: #dcbdfb !important; }
    html[data-ojpp-theme="dark"] .prettyprint .fun { color: #dcbdfb !important; }

    /* ---------- 提交结果单元格 ---------- */
    /* .cell-rejected（-1/被拒绝）、.cell-accepted（已解决）等
       站点用的是浅灰/浅蓝，深底上都偏暗。按语义上色 */
    html[data-ojpp-theme="dark"] .cell-rejected {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .cell-accepted,
    html[data-ojpp-theme="dark"] .cell-solved,
    html[data-ojpp-theme="dark"] .cell-ok {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .cell-verdict,
    html[data-ojpp-theme="dark"] .cell-time {
      color: #909dab;
    }
    /* standings 里的得分与名次 */
    html[data-ojpp-theme="dark"] .cell-rank,
    html[data-ojpp-theme="dark"] .cell-points {
      color: #cdd9e5;
    }

    /* ---------- 表单控件（筛选、提交等） ---------- */
    /* SumoSelect 下拉框：站点给它设了白底，暗色下是个白块 */
    html[data-ojpp-theme="dark"] .SumoSelect p.CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect .CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect select,
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper ul li {
      background: #2d333b !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper ul li:hover {
      background: #373e47 !important;
    }
    /* 展开列表的底色也要深——展开才是用户常看的样子 */
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper.multiple,
    html[data-ojpp-theme="dark"] .SumoSelect.open .optWrapper,
    html[data-ojpp-theme="dark"] .SumoSelect .MultiControls {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    /* 选项里的复选框 i：站点是白底小方框 */
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper li.opt i,
    html[data-ojpp-theme="dark"] .SumoSelect .select-all > span i {
      background: #22272e !important;
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .select-all.partial > span i,
    html[data-ojpp-theme="dark"] .SumoSelect .select-all.selected > span i {
      background: #57ab5a !important;
      border-color: transparent !important;
    }
    /* 下拉箭头：站点把一张黑色三角 PNG 放在 label>i 的 background-image，
       直接改色没用——是图片。用 filter 反成亮色箭头。 */
    html[data-ojpp-theme="dark"] .SumoSelect p.CaptionCont label i,
    html[data-ojpp-theme="dark"] .SumoSelect .CaptionCont label i {
      filter: invert(0.8) !important;
    }
    /* 展开时的底色 */
    html[data-ojpp-theme="dark"] .SumoSelect.open > .CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect:focus > .CaptionCont {
      background: #2d333b !important;
      border-color: #539bf5 !important;
    }
    /* 筛选标签（“Gym”那类的蓝色） */
    html[data-ojpp-theme="dark"] .setting-name label,
    html[data-ojpp-theme="dark"] .setting-name,
    html[data-ojpp-theme="dark"] .settings-form label {
      color: #cdd9e5 !important;
    }
    /* 站点把部分 label 设成 #3b5998 深蓝，暗色下看不见 */
    html[data-ojpp-theme="dark"] label {
      color: #cdd9e5;
    }

    /* ---------- 星级评分控件（gym 筛选的 Difficulty） ---------- */
    /* 站点用 rating.png 精灵图画“空星+白底”的整条，反转颜色
       太突兀。改成纯 CSS 重绘：隐藏精灵图，用 ::before 画 5 颗
       空星（深色实心星，视觉上像描边），已选中的那一条叠金色
       实心星，靠 li 的宽度裁掉多余的部分——站点本来就是用
       width 控制选几颗，所以 hover/选择都能自动工作。 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"],
    html[data-ojpp-theme="dark"] ul.vote-list {
      background-image: none !important;
      filter: none !important;
      position: relative;
    }
    /* 未选中的空星：深色实心星，读作“空/未选” */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"]::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #3d434d;
      white-space: nowrap;
      pointer-events: none;
    }
    /* 已选中的那一条：同样 5 颗星，亮金色。li 用 overflow:hidden
       + 站点设置的 width 来裁，所以选几颗就显示几颗。 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li[id^="vote-current-"],
    html[data-ojpp-theme="dark"] ul.vote-list li[id^="vote-current-"] {
      background-image: none !important;
      overflow: hidden;
      white-space: nowrap;
      filter: none !important;
    }
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li[id^="vote-current-"]::before,
    html[data-ojpp-theme="dark"] ul.vote-list li[id^="vote-current-"]::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #f0883e;
      white-space: nowrap;
      pointer-events: none;
    }
    /* hover 预览：站点给 a.vote-item:hover 铺 rating.gif 下半截
       （白底金星精灵，GIF 无 alpha），暗色下是一条白块。去精灵，
       同样用 ::before 画金星，锚点 width 裁掉多余的星 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item,
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item:hover,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item:hover {
      background-image: none !important;
      overflow: hidden;
    }
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item:hover::before,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item:hover::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #f0883e;
      white-space: nowrap;
      text-indent: 0;
      pointer-events: none;
    }

    /* ---------- 题目副标签（standard input/output、时限） ---------- */
    /* 站点给这些 .notice 设了浅灰底做“信息条”，暗色下是一块
       和背景不一样的灰块。直接透明，只留文字色 */
    html[data-ojpp-theme="dark"] .notice {
      background: transparent !important;
      border: none !important;
      color: #909dab !important;
    }
    /* 但 .notice 里的文字要可读——站点给 td .notice 设过灰，优先级不够会输 */
    html[data-ojpp-theme="dark"] .notice *,
    html[data-ojpp-theme="dark"] td .notice,
    html[data-ojpp-theme="dark"] .notice a {
      color: #909dab !important;
    }

    /* ---------- 倒计时/截止标签 ---------- */
    /* “Until closing X days” 里的时间是 span.countdown，站点给 #777 深灰。
       按“截止”语义上色成琥珀色。注意别用 .irt——那其实是 datatable
       的圆角精灵图 class，之前误认作倒计时元素 */
    html[data-ojpp-theme="dark"] .countdown,
    html[data-ojpp-theme="dark"] .countdown * {
      color: #f0883e !important;
      border-color: #f0883e !important;
    }

    /* ---------- datatable/roundbox 的角精灵图 ---------- */
    /* CF 的圆角是靠 ilt/irt/ilb/irb 几个小 PNG 角落图拼出来的。
       暗色下这些白色角落图会变成白块。全部去掉，容器自己给
       border-radius 保持圆角 */
    html[data-ojpp-theme="dark"] .ilt,
    html[data-ojpp-theme="dark"] .irt,
    html[data-ojpp-theme="dark"] .ilb,
    html[data-ojpp-theme="dark"] .irb,
    html[data-ojpp-theme="dark"] .lt,
    html[data-ojpp-theme="dark"] .rt,
    html[data-ojpp-theme="dark"] .lb,
    html[data-ojpp-theme="dark"] .rb {
      background-image: none !important;
    }
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] .borderTopRound {
      border-radius: 4px;
    }

    /* ---------- 个人资料与图表 ---------- */
    /* 评分曲线图例的白底 */
    html[data-ojpp-theme="dark"] .legend,
    html[data-ojpp-theme="dark"] .legend div {
      background: transparent !important;
      color: #cdd9e5;
    }
    /* 评分曲线图本体是 canvas，不动它 */

    /* ---------- 题号行的通过/未通过标记 ---------- */
    /* 站点的做/未做标记分两处：① td.act（操作列图标格）上浅底色，
       ② td.id 左侧 6px 彩色条（border-left）。两处都用同色。
       之前写成 .accepted-problem td 把整行染绿——多了，且 td.id 的
       6px 浅绿条在暗底下太刺眼。改成：td.act 给深色底，td.id 的左条
       换成就感分明但不刺眼的色相 */
    html[data-ojpp-theme="dark"] tr.accepted-problem td.act,
    html[data-ojpp-theme="dark"] .accepted-problem td.act,
    html[data-ojpp-theme="dark"] td.act.accepted-problem {
      background: #1d2b1d !important;
      color: #a6d189;
    }
    html[data-ojpp-theme="dark"] tr.accepted-problem td.id,
    html[data-ojpp-theme="dark"] .accepted-problem td.id {
      border-left-color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] tr.rejected-problem td.act,
    html[data-ojpp-theme="dark"] .rejected-problem td.act,
    html[data-ojpp-theme="dark"] td.act.rejected-problem {
      background: #451d1d !important;
      color: #f85149;
    }
    html[data-ojpp-theme="dark"] tr.rejected-problem td.id,
    html[data-ojpp-theme="dark"] .rejected-problem td.id {
      border-left-color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] tr.submitted-verdict-problem td.act,
    html[data-ojpp-theme="dark"] .submitted-verdict-problem td.act,
    html[data-ojpp-theme="dark"] td.act.submitted-verdict-problem {
      background: #1c2b3d !important;
      color: #79b8ff;
    }
    html[data-ojpp-theme="dark"] tr.submitted-verdict-problem td.id,
    html[data-ojpp-theme="dark"] .submitted-verdict-problem td.id {
      border-left-color: #79b8ff !important;
    }
    /* 普通行的 td.act（尤其斑马行 td.act.dark）：站点是 #f8f8f8 白底，
       暗色下是白块。改成透明让它跟行底色一致 */
    html[data-ojpp-theme="dark"] td.act,
    html[data-ojpp-theme="dark"] td.act.dark,
    html[data-ojpp-theme="dark"] .act.dark {
      background: transparent !important;
    }

    /* ---------- 排行榜标记 ---------- */
    /* 站点用 #ff0000 纯红和 #008000 纯绿标“失败/成功”，
       深底上要么刺眼要么太暗。换成亮版本，语义不变 */
    html[data-ojpp-theme="dark"] .cell-failed-system-test,
    html[data-ojpp-theme="dark"] .cell-challenged {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .successfulChallengeCount,
    html[data-ojpp-theme="dark"] .successful-submission,
    html[data-ojpp-theme="dark"] .successful-test {
      color: #57ab5a !important;
    }

    /* ---------- 提交详情的 I/O 对比块 ---------- */
    /* .file .text 是 #ddd，test-for-popup pre #eee，sample-tests pre #efefef，
       test-example-line-even #e0e0e0——全是浅块，暗色下是大片白 */
    html[data-ojpp-theme="dark"] .file,
    html[data-ojpp-theme="dark"] .file .text,
    html[data-ojpp-theme="dark"] .file .name,
    html[data-ojpp-theme="dark"] .test-for-popup pre,
    html[data-ojpp-theme="dark"] .test-for-popup,
    html[data-ojpp-theme="dark"] .sample-tests pre {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    /* 别碰 .test-example-line-even/odd——题面里靠它做奇偶交替，
       前面已有专门规则（even #2d333b / odd #22272e），盖掉就分不清行了 */
    html[data-ojpp-theme="dark"] .file pre,
    html[data-ojpp-theme="dark"] .file .text pre,
    html[data-ojpp-theme="dark"] .sample-tests pre * {
      color: #cdd9e5 !important;
    }
    /* .file 的标题行（Input / Participant's output / Jury's answer） */
    html[data-ojpp-theme="dark"] .file .name {
      color: #909dab !important;
    }

    /* ---------- facebox 弹窗（view source / hack 等所有弹层） ---------- */
    /* #facebox .content 站点给的是 #fff，a.close 也是白底，暗色下
       整个弹窗是一块大白板。内部 .source-popup / pre 都是透明的，
       把容器压成页面底色即可 */
    html[data-ojpp-theme="dark"] #facebox .content,
    html[data-ojpp-theme="dark"] #facebox .popup .content {
      background-color: #1d2127 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] #facebox a.close {
      background-color: #1d2127 !important;
    }
    html[data-ojpp-theme="dark"] #facebox .source-popup pre,
    html[data-ojpp-theme="dark"] #facebox pre {
      background-color: #22272e;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] #facebox hr {
      border-color: #373e47;
      background-color: #373e47;
    }
    /* 高亮块：站点用 --highlighted-* 浅彩底，暗色下深底 */
    html[data-ojpp-theme="dark"] [style*="background-color: rgb(221, 238, 255)"],
    html[data-ojpp-theme="dark"] [style*="background-color: #ddeeff"],
    html[data-ojpp-theme="dark"] [style*="background-color: rgb(239, 239, 239)"] {
      background-color: #22272e !important;
    }
    /* 过滤框/代码预览的输入与预览区 */
    html[data-ojpp-theme="dark"] .filter-box input,
    html[data-ojpp-theme="dark"] .datatable .filter input,
    html[data-ojpp-theme="dark"] .datatable input {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .markItUpPreviewFrame {
      background: #22272e !important;
      border-color: #373e47;
    }
    /* ---------- text-label-* 状态徽章 ---------- */
    /* 站点用浅彩底+深字，暗色下要反成深底+亮字 */
    html[data-ojpp-theme="dark"] .text-label-blue,
    html[data-ojpp-theme="dark"] .text-label-info {
      background: #1c3a5e !important;
      color: #79b8ff !important;
    }
    html[data-ojpp-theme="dark"] .text-label-green,
    html[data-ojpp-theme="dark"] .text-label-success {
      background: #1d3a2c !important;
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .text-label-yellow,
    html[data-ojpp-theme="dark"] .text-label-warning {
      background: #4a3a1a !important;
      color: #f0883e !important;
    }
    html[data-ojpp-theme="dark"] .text-label-red,
    html[data-ojpp-theme="dark"] .text-label-error {
      background: #4a2323 !important;
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .text-label-gray,
    html[data-ojpp-theme="dark"] .text-label-muted {
      background: #373e47 !important;
      color: #909dab !important;
    }

    /* ---------- 目录页（Catalog） ---------- */
    /* 目录/更新历史里的深蓝字与黑色时间戳 */
    html[data-ojpp-theme="dark"] ._catalogFolderName,
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_name,
    html[data-ojpp-theme="dark"] ._catalogNode ._nameBody,
    html[data-ojpp-theme="dark"] .caption {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .format-humantime,
    html[data-ojpp-theme="dark"] .humantime,
    html[data-ojpp-theme="dark"] time {
      color: #909dab !important;
    }
    /* 目录的增删记录：del 浅红、ins 浅绿 */
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_value del,
    html[data-ojpp-theme="dark"] del {
      background: #3d2b2b !important;
      color: #f85149 !important;
      text-decoration-color: #f85149;
    }
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_value ins,
    html[data-ojpp-theme="dark"] ins {
      background: #1d2b1d !important;
      color: #57ab5a !important;
      text-decoration-color: #57ab5a;
    }
    /* 目录的文件/文件夹图标：站点用 icon-* 字体渲染，
       还把颜色写进 style="color:black" 或站点 !important 规则里。
       必须 !important + 覆盖 ::before 才能抢到。 */
    html[data-ojpp-theme="dark"] [class*="icon-"],
    html[data-ojpp-theme="dark"] [class*="icon-"]::before,
    html[data-ojpp-theme="dark"] [class*="icon-"]::after,
    html[data-ojpp-theme="dark"] .icon-file,
    html[data-ojpp-theme="dark"] .icon-folder {
      color: #cdd9e5 !important;
    }
    /* 站点对目录树里的 icon 用 black !important，点名覆盖 */
    html[data-ojpp-theme="dark"] ._catalogBlogEntry ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._catalogFolder ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._catalogNode i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._nameContent i[class*="icon-"] {
      color: #909dab !important;
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
       有些还写成内联 style="color: black"，所以要用 !important。
       但必须排除 .rated-user：“Top rated”这类列表里全是
       红名/橙名，笼统的 a 规则会把段位色一起刷掉。 */
    html[data-ojpp-theme="dark"] .roundbox a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .sidebox a:not(.rated-user):not([class*="user-"]),
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

  /* ---------- 代码编辑器（CM6 + customtest + submit） ---------- */
  editor: {
    languages: CF_LANGUAGES,

    editorMountPoint(doc) {
      // 题目页：挂在 .problem-statement 之后
      const statement = doc.querySelector<HTMLElement>('.problem-statement');
      if (!statement) return null;
      const parent = statement.parentElement;
      if (!parent) return null;
      return { anchor: statement, position: 'afterend' };
    },

    problemCode(doc) {
      // /problemset/problem/1/A → "1A"；/contest/242/problem/B → "242B"；/gym/106748/problem/A → "106748A"
      const p = doc.location.pathname;
      const m = /^\/problemset\/problem\/(\d+)\/([A-Z]\w*)/.exec(p)
        ?? /^\/(?:contest|gym)\/(\d+)\/problem\/([A-Z]\w*)/.exec(p);
      return m ? `${m[1]}${m[2]}` : null;
    },

    getSamples(doc) {
      // 两种结构都覆盖：
      // - 每对样例一个 .sample-test（多数题）
      // - 一个 .sample-test 里连排多对 .input/.output（如 535/A）
      // 统一按文档序收集所有 input/output pre 配对
      const inputs = [...doc.querySelectorAll<HTMLElement>('.sample-tests .input pre, .sample-test .input pre')];
      const outputs = [...doc.querySelectorAll<HTMLElement>('.sample-tests .output pre, .sample-test .output pre')];
      const out: { input: string; output: string }[] = [];
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]?.innerText?.trim();
        if (input !== undefined) {
          out.push({ input, output: outputs[i]?.innerText?.trim() ?? '' });
        }
      }
      return out;
    },

    async runCustomTest(code, languageId, input) {
      // 真实路径（页内 JS）：POST /data/customtest {action:'submitSourceCode'}
      // 拿 customTestSubmitId，再轮询 {action:'getVerdict'}。
      // 原生表单 POST 到页面 URL 只会退回表单页，不建任务。
      const csrf = csrfToken();
      const submitBody = new URLSearchParams({
        csrf_token: csrf,
        communityCode: '',
        action: 'submitSourceCode',
        programTypeId: languageId,
        sourceCode: code,
        source: code,
        input,
        tabSize: '4',
        output: '',
        _tta: ttaValue(),
      });
      const submitRes = await fetch('/data/customtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: submitBody.toString(),
      });
      const submitJson = (await submitRes.json()) as {
        customTestSubmitId?: number | string;
        error?: string;
      };
      if (!submitJson?.customTestSubmitId) {
        return { output: '', error: submitJson?.error ?? '提交失败（customTestSubmitId 为空）' };
      }
      const id = String(submitJson.customTestSubmitId);
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 1500));
        const vb = new URLSearchParams({
          csrf_token: csrf,
          communityCode: '',
          action: 'getVerdict',
          customTestSubmitId: id,
        });
        const vr = await fetch('/data/customtest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: vb.toString(),
        });
        const vj = (await vr.json().catch(() => null)) as {
          verdict?: string;
          output?: string;
          stat?: string;
        } | null;
        if (vj?.verdict != null) {
          const result: EditorTestResult = {
            output: String(vj.output ?? ''),
            used: [vj.verdict, vj.stat].filter(Boolean).join(', ') || undefined,
            verdict: vj.verdict,
          };
          if (vj.verdict !== 'OK' && !result.output) {
            result.error = result.used;
          }
          return result;
        }
      }
      return { output: '', error: '等待判题结果超时' };
    },

    async submit(code, languageId, problemCode) {
      const csrf = csrfToken();
      const doc = await postFormToIframe('/problemset/submit', {
        csrf_token: csrf,
        action: 'submitSolutionFormSubmitted',
        submittedProblemCode: problemCode,
        programTypeId: languageId,
        source: code,
        tabSize: '4',
        ftaa: ftaaValue(),
        bfaa: bfaaValue(),
        _tta: ttaValue(),
      });
      const url = doc.URL;
      // 所有 .error.* 元素的错误文本（重复代码、空源码、未知题号等）
      const errors = [...doc.querySelectorAll('.error, .forbidden')]
        .map((e) => e.textContent?.trim())
        .filter((t): t is string => !!t);
      const errorText = errors.length ? errors.join('; ') : undefined;
      const ok = /\/(?:contest\/\d+|gym\/\d+)?\/?(my|status)/.test(url) || /status|contest\/\d+\/my/.test(url);
      return { ok: ok && !errorText, url: ok ? url : undefined, error: errorText ?? (ok ? undefined : parseSubmitError(doc)) };
    },
  },
};

/** .property-title 后面要跟冒号（如 "time limit per test: "），.section-title 不要。 */
function selectorEndsWithProperty(el: Element): boolean {
  return el.classList.contains('property-title');
}

/* ---------- 编辑器辅助 ---------- */


function csrfToken(): string {
  return document.querySelector<HTMLInputElement>('input[name="csrf_token"]')?.value ?? '';
}

function ttaValue(): string {
  return document.querySelector<HTMLInputElement>('input[name="_tta"]')?.value ?? '237';
}

function ftaaValue(): string {
  return antiBotToken('ftaa');
}

function bfaaValue(): string {
  return antiBotToken('bfaa');
}

/** ftaa/bfaa 是页面脚本注入的 window 全局（反自动化参数）。 */
function antiBotToken(name: 'ftaa' | 'bfaa'): string {
  const win = window as unknown as Record<string, string | undefined>;
  const direct = win[`_${name}`] ?? win[name];
  if (typeof direct === 'string' && direct) return direct;
  for (const s of document.querySelectorAll('script:not([src])')) {
    const m = new RegExp(`_${name}\\s*=\\s*"([^"]+)"`).exec(s.textContent ?? '')
      ?? new RegExp(`${name}\\s*:\\s*"([^"]+)"`).exec(s.textContent ?? '');
    if (m) return m[1];
  }
  return '';
}

function parseSubmitError(doc: Document): string | undefined {
  // CF 的错误通常带 .error.for__* 类名；兜底找正文里的错误字样
  const errEl = doc.querySelector('[class*="error"]');
  const t = errEl?.textContent?.trim();
  if (t) return t.slice(0, 200);
  const text = doc.body?.textContent ?? '';
  const m = /(?:have|must|cannot|can't|empty|invalid|choose|select|required|denied)[^\n]{0,120}/i.exec(text);
  return m?.[0]?.trim();
}

/**
 * 两段式隐藏 iframe 表单提交：
 * 先 GET 目标页（customtest/submit），再在其文档内建表单 POST。
 * 这样 Referer 就是目标页自身，和用户在页面上点按钮完全一致——
 * fetch/跨页 iframe POST 都会被服务端退回表单页。
 */
function postFormToIframe(
  pageUrl: string,
  fields: Record<string, string>,
): Promise<Document> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    // allow-scripts 不能给：CF 有 frame-buster，被嵌页会把自己的内容清空。
    // 服务端渲染的表单与结果照常可读，同源 + 表单提交足够。
    frame.setAttribute('sandbox', 'allow-same-origin allow-forms');
    frame.style.display = 'none';
    let submitted = false;
    let prevDoc: Document | null = null;
    const done = () => {
      clearInterval(poll);
      clearTimeout(timeout);
      setTimeout(() => frame.remove(), 200);
    };
    const timeout = setTimeout(() => {
      done();
      reject(new Error('请求超时'));
    }, 90_000);
    const poll = setInterval(() => {
      let doc: Document | null = null;
      try {
        doc = frame.contentDocument;
      } catch {
        return;
      }
      if (!doc) return;
      if (!submitted) {
        // 第一段：等目标页加载完，在其文档内建表单提交。
        // 用 URL + readyState 判断，不依赖 load 事件时序。
        if (!doc.URL.includes(pageUrl) || doc.readyState !== 'complete') return;
        prevDoc = doc;
        const form = doc.createElement('form');
        form.method = 'POST';
        form.action = '';
        form.style.display = 'none';
        for (const [name, value] of Object.entries(fields)) {
          const input = doc.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.append(input);
        }
        doc.body.append(form);
        submitted = true;
        HTMLFormElement.prototype.submit.call(form);
      } else {
        // 第二段：POST 响应换上新 Document（引用变了即到达）
        if (doc === prevDoc) return;
        if (doc.readyState !== 'complete') return;
        done();
        resolve(doc);
      }
    }, 250);
    document.body.append(frame);
    frame.src = pageUrl;
  });
}
