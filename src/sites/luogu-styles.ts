const d = 'html[data-ojpp-theme="dark"]';
export const LUOGU_DARK = `
${d} body, ${d} #app, ${d} .lfe-body, ${d} main, ${d} .main-container,
${d} .main-container.lside-nav, ${d} .columba-content-wrap {
  background: #1c2128 !important; color: #cdd9e5;
}
/* 洛谷新页面把主题变量塞行内 style（--theme-*）——用 !important
   自定义属性覆盖，一处解掉所有 themed 元素的白底 */
${d} [style*="--theme-"] {
  --theme-navi-back: #22272e !important;
  --theme-navi-fore: #cdd9e5 !important;
  --theme-navi-fore-rgb: 205,217,229 !important;
  --theme-body-back: #1c2128 !important;
  --theme-body-image: none !important;
  --theme-body-image-repeat: repeat !important;
  --theme-body-color: #cdd9e5 !important;
  --theme-body-color-filter: none !important;
  --theme-body-mid-mask: none !important;
  --theme-card-background: #22272e !important;
  --theme-card-backdrop-filter: none !important;
}
${d} .theme-page {
  --theme-body-back: #1c2128 !important;
  --theme-body-image: none !important;
  --theme-body-mid-mask: none !important;
  --theme-card-background: #22272e !important;
}
${d} .top-bar, ${d} .top-bar .breadcrumb { background: #22272e; color: #cdd9e5; }
${d} .l-card, ${d} .lfe-form-sz-middle, ${d} .lfe-dialog,
${d} .lfe-dropdown, ${d} .dropdown, ${d} .dropdown-content,
${d} .popup, ${d} .modal, ${d} .popover { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} .lfe-marked, ${d} .lfe-marked-wrap, ${d} .lfe-h1, ${d} .lfe-h2, ${d} .lfe-h3,
${d} .stat-text, ${d} .lfe-caption { color: #cdd9e5; }
${d} nav, ${d} .sidebar, ${d} .user-nav, ${d} .nav-container, ${d} .nav-bar,
${d} .sidebar.lside, ${d} .lside {
  --theme-navi-back: #22272e !important; --theme-navi-fore: #cdd9e5 !important;
  --theme-navi-fore-rgb: 205,217,229 !important;
  background: #22272e !important; color: #cdd9e5;
}
${d} a:not([class*="lcolor"]):not([class*="user-"]):not(.lfe-button) { color: #539bf5; }
${d} a:not([class*="lcolor"]):hover { color: #79b8ff; }
${d} input:not([type=checkbox]):not([type=radio]), ${d} textarea, ${d} select {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} pre, ${d} .lfe-marked pre, ${d} .io-sample pre, ${d} :not(pre)>code {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} pre code, ${d} code[class*=language], ${d} .lfe-marked code,
${d} .code-container code { background: transparent; color: #cdd9e5; }
${d} .io-sample, ${d} .io-sample .header, ${d} .io-sample .title { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} table, ${d} th, ${d} td, ${d} hr, ${d} .l-card { border-color: #373e47; }
${d} th, ${d} tr:nth-child(even) { background: #22272e; }
${d} .katex { color: inherit; }
${d} .lcolor--grey-3, ${d} .lcolor--grey-4, ${d} .lcolor--grey-5 { color: #909dab; }

/* ---------- 自定义组件补漏 ---------- */
/* 列表/表格分割线 #e8e8e8 太亮 */
${d} .list-wrap.border .row:not(:last-child),
${d} .list-wrap.border .header-wrap,
${d} .row:not(:last-child),
${d} .page-bar.border { border-color: #373e47 !important; }

/* 「共计 N 条结果」等黑字半透明 */
${d} .result .count, ${d} .result .number, ${d} .count .number { color: #cdd9e5; }
${d} .result .count { color: #909dab; }

/* 分页按钮白底白字 */
${d} .page-bar button, ${d} .page-bar .page-item, ${d} .pagination button {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} .page-bar button:hover { background: #22272e; border-color: #539bf5; }
${d} .page-bar button.selected, ${d} .page-bar button.active {
  background: #539bf5; color: #fff; border-color: #539bf5;
}

/* 评测记录代码框（lfe-code 组件）与工具条 */
${d} lfe-code, ${d} .code-container, ${d} .code-toolbar,
${d} .code-toolbar button, ${d} .code-toolbar a, ${d} .code-toolbar span {
  background: #161b22; color: #cdd9e5; border-color: #373e47;
}
${d} .code-container:hover > .copy-button:hover { background: #30363d; }
/* one-light 语法色 → 深色友好 */
${d} .token.comment, ${d} .token.prolog { color: #8b949e; }
${d} .token.keyword, ${d} .token.tag, ${d} .token.selector { color: #ff7b72; }
${d} .token.string, ${d} .token.char, ${d} .token.builtin, ${d} .token.inserted,
${d} .token.regex, ${d} .token.attr-value, ${d} .code-snippet { color: #a5d6ff; }
${d} .token.number, ${d} .token.atrule, ${d} .token.property { color: #79c0ff; }
${d} .token.function, ${d} .token.class-name, ${d} .token.attr-name { color: #d2a8ff; }
${d} .token.operator, ${d} .token.punctuation, ${d} .token.entity, ${d} .token.url { color: #ff9e64; }
${d} .token.boolean, ${d} .token.constant, ${d} .token.unit { color: #79c0ff; }
${d} .token.deleted { color: #ffa198; }
${d} .token.important, ${d} .token.bold { color: #ff7b72; }
${d} .token.italic { color: #cdd9e5; }

/* 自定义下拉面板全是白底（dropdown 元素 / 各弹层） */
${d} .l-dropdown, ${d} .select-dropdown, ${d} .setting-dropdown,
${d} .date-picker-dropdown, ${d} .time-picker-dropdown,
${d} dropdown-operations, ${d} dropdown,
${d} .dropdown > ul, ${d} .options, ${d} .option-list {
  background: #22272e !important; color: #cdd9e5; border-color: #373e47 !important;
}
${d} .dropdown > ul > li:hover, ${d} .dropdown-operations > ul li:hover,
${d} dropdown-operations > ul li:hover, ${d} .setting-dropdown li:hover,
${d} .option:hover { background: #30363d !important; }
${d} .option, ${d} .dropdown li, ${d} .date-picker-dropdown *, ${d} .time-picker-dropdown * { color: #cdd9e5; }
${d} .option.active { background: #539bf5 !important; color: #fff !important; border-color: #539bf5 !important; }
${d} .calendar-days .day, ${d} .calendar-years .year, ${d} .time-item { color: #cdd9e5 !important; }
${d} .calendar-days .day.other-month, ${d} .calendar-days .day.disabled,
${d} .column-header, ${d} .clear-btn, ${d} .time-column .column-header { color: #6e7681 !important; }
${d} .calendar-footer, ${d} .time-footer, ${d} .column-header { border-color: #373e47 !important; }
${d} .calendar-days .day.selected, ${d} .calendar-years .year.selected,
${d} .time-column .time-item.selected { background: #539bf5 !important; color: #fff !important; }
${d} .calendar-days .day:hover:not(.selected),
${d} .calendar-years .year:hover:not(.selected),
${d} .time-column .time-item:hover { background: #30363d !important; color: #79b8ff !important; }
${d} .calendar-days .day.today:not(.selected) { border-color: #539bf5 !important; color: #539bf5 !important; }

/* 比赛题切换：选中态是全亮蓝底 */
${d} .contest-problem { border-color: #373e47; }
${d} .contest-problem.current {
  background: #1f5fa3 !important; border-color: #539bf5; color: #fff;
}
${d} .contest-problem.current .contest-problem-no, ${d} .contest-problem.current * { color: #fff; }
${d} .contest-problem:not(.current):hover { background: #30363d; border-color: #539bf5; }

/* 筛选/块项控件统一深色 */
${d} .block-item, ${d} .lform-input, ${d} .l-select, ${d} .lfe-select {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} .block-item button, ${d} .lform-input button { background: #1c2128; color: #cdd9e5; border-color: #373e47; }
${d} .combo-wrapper .text, ${d} .block-item .text, ${d} .combo .text,
${d} .lfe-select .text, ${d} .l-select .text { background: #1c2128; color: #cdd9e5; border-color: #373e47; }

/* ---------- 老版主页（am-* amazeui） ---------- */
${d} .am-panel, ${d} .am-panel-hd, ${d} .am-panel-bd,
${d} .am-comment, ${d} .am-comment-hd, ${d} .am-comment-bd,
${d} .am-comment-main, ${d} .am-comment-flip,
${d} .lg-article, ${d} .lg-index-content, ${d} .lg-index-calendar,
${d} .lg-index-stat, ${d} .lg-index-benben, ${d} .lg-right,
${d} .sidebar.lside, ${d} .am-slider, ${d} .am-slides,
${d} .feed-li, ${d} .am-viewport, ${d} .am-list {
  background: #22272e; color: #cdd9e5; border-color: #373e47;
}
${d} .am-panel-default, ${d} .am-panel-primary, ${d} .am-panel-success, ${d} .am-panel-danger {
  border-color: #373e47;
}
${d} .am-panel-hd, ${d} .am-panel-title, ${d} .am-comment-hd,
${d} .am-comment-author, ${d} .am-comment-meta, ${d} .am-comment-title,
${d} .lg-article h1, ${d} .lg-article h2, ${d} .lg-article h3,
${d} .lg-article p, ${d} .lg-article td, ${d} .lg-article th,
${d} .lg-article li, ${d} .lg-article span, ${d} .lg-article div,
${d} .lg-index-content *, ${d} .lg-right * { color: #cdd9e5; border-color: #373e47; }
${d} .lg-article a, ${d} .lg-index-content a, ${d} .lg-right a,
${d} .am-comment a, ${d} .am-panel a { color: #539bf5; }
${d} .am-comment a:hover, ${d} .am-panel a:hover { color: #79b8ff; }
${d} .lg-fg-bluedark, ${d} .lg-fg-greendark { color: #79b8ff; }
${d} .am-slider .am-viewport, ${d} .am-slider .am-slides li,
${d} .am-slider .caption, ${d} .am-slider .flex-control-nav,
${d} .am-slider .flex-direction-nav { background: #22272e; color: #cdd9e5; }
${d} .sidebar .nav-pills li a, ${d} .sidebar .nav-link,
${d} .am-list li, ${d} .am-list li a { background: #22272e; color: #cdd9e5; border-color: #373e47; }
/* 新版 .lside 图标条：链接不叠底块，保持透明靠 hover/active 指示 */
${d} .sidebar.lside a { background: transparent; border-color: transparent; }
${d} .sidebar .nav-pills li a:hover, ${d} .am-list li a:hover { background: #30363d; color: #79b8ff; }
${d} .am-comment .am-comment-avatar, ${d} .am-comment img { background: transparent; }
${d} .am-panel > .am-panel-bd, ${d} .am-panel > .am-panel-hd { border-color: #373e47; }
${d} .lg-article hr, ${d} .lg-index-content hr, ${d} .am-list li { border-color: #373e47; }

/* ---------- 题库/题单/筛选区 ---------- */
${d} .title, ${d} .title.no-wrap, ${d} .entry, ${d} .toggle-tag,
${d} .count, ${d} .number, ${d} li, ${d} .provider-display,
${d} .luogu-username, ${d} .liquid-text, ${d} .card-title,
${d} .card-desc, ${d} .card-bottom, ${d} .bottom-item { color: #cdd9e5 !important; }
${d} .entry, ${d} .toggle-tag, ${d} .card-desc { color: #909dab; }
${d} .tag-button { background: #1c2128 !important; color: #cdd9e5 !important; border-color: #373e47 !important; }
${d} .tag-button:hover { background: #30363d; color: #79b8ff; border-color: #539bf5; }
${d} .tag-button.selected, ${d} .tag-button.active { background: #539bf5; color: #fff; border-color: #539bf5; }
${d} .refined-input, ${d} .search-text { background: #1c2128; color: #cdd9e5; border-color: #373e47; }
${d} .refined-input input, ${d} .search-text input { background: transparent; color: #cdd9e5; }
${d} .progress-frame { background: #30363d; border-color: #30363d; }
${d} .bottom-wrap, ${d} .bottom-wrap.float { background: #22272e; border-color: #373e47; }
${d} .bottom-wrap .toolbar, ${d} .bottom-wrap .toolbar-left { background: transparent; }
${d} .training-card { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} .training-card:hover { border-color: #539bf5; }
${d} .training-card .card-title, ${d} .training-card .card-desc,
${d} .training-card .card-bottom, ${d} .training-card .bottom-item { color: #cdd9e5; }
${d} .training-card .card-desc { color: #909dab; }
${d} .training-card a { color: #539bf5; }
${d} .training-card a:hover { color: #79b8ff; }

/* ---------- 讨论/文章/图床/云剪贴板 ---------- */
/* 通用黑字（name/time/content/meta/copyright 等） */
${d} .name, ${d} .content, ${d} .time, ${d} .meta,
${d} .copyright, ${d} .detail, ${d} .info { color: #cdd9e5 !important; }
${d} .time, ${d} .meta, ${d} .copyright, ${d} .info { color: #909dab !important; }
/* 白底容器 */
${d} .drop, ${d} .image-block, ${d} .casket, ${d} .casket.cs-main,
${d} .cs-header, ${d} .cs-footer, ${d} .refined-input,
${d} .article-card, ${d} .article-list, ${d} .discuss-list,
${d} .feed-card, ${d} .user-card, ${d} .stat-card {
  background: #22272e; color: #cdd9e5; border-color: #373e47;
}
${d} .drop:hover { border-color: #539bf5; }
${d} .cs-footer *, ${d} .cs-header * { color: #cdd9e5; }
/* CM5 编辑器（云剪贴板/贴代码） */
${d} .CodeMirror, ${d} .CodeMirror-lines, ${d} .cm-gutters,
${d} .cm-gutter, ${d} .cm-lineNumbers, ${d} .cm-foldGutter {
  background: #161b22; color: #cdd9e5; border-color: #373e47;
}
${d} .cm-cursor { border-color: #cdd9e5; }
${d} .cm-line, ${d} .cm-line * { color: #cdd9e5; }
${d} .cm-selected, ${d} .CodeMirror-focused .cm-selected { background: rgba(83,155,245,.25); }
${d} .cm-m-luogu .cm-comment, ${d} .cm-comment { color: #8b949e; }
${d} .cm-keyword, ${d} .cm-tag, ${d} .cm-property { color: #ff7b72; }
${d} .cm-string, ${d} .cm-string-2, ${d} .cm-atom, ${d} .cm-regexp { color: #a5d6ff; }
${d} .cm-number, ${d} .cm-attribute, ${d} .cm-qualifier { color: #79c0ff; }
${d} .cm-variable, ${d} .cm-def, ${d} .cm-type { color: #d2a8ff; }
${d} .cm-operator, ${d} .cm-meta, ${d} .cm-bracket { color: #ff9e64; }
${d} .cm-builtin, ${d} .cm-header, ${d} .cm-link { color: #79b8ff; }
${d} .cm-error { color: #ffa198; }
/* 兜底：所有剩余元素边框色统一（只动 border 不动背景） */
${d} div, ${d} span, ${d} p, ${d} li, ${d} ul, ${d} ol,
${d} section, ${d} article, ${d} aside, ${d} nav,
${d} header, ${d} footer, ${d} fieldset { border-color: #373e47; }
/* 兜底：剩余偏暗文字 */
${d} .main *, ${d} .l-card * { border-color: #373e47; }
/* 提交卡/常用浅黑字 */
${d} .light-black, ${d} .l-card .header, ${d} .combo-wrapper .text,
${d} .l-radio, ${d} .l-check, ${d} .lfe-radio, ${d} .l-checkbox,
${d} [id^="LRadio"], ${d} [id^="LCheck"], ${d} .l-card.burger *,
${d} .combo-wrapper .arrow, ${d} .combo-wrapper svg, ${d} .combo-wrapper path { color: #cdd9e5 !important; }

/* ---------- 题库 tab 条（洛谷/主题库/…） ---------- */
${d} ul.luogu.luogu { background: #22272e !important; }
${d} ul.luogu li { color: #cdd9e5; }
${d} ul.luogu li.selected { background: #539bf5 !important; color: #fff; }
${d} ul.luogu li:hover { background: #30363d; color: #79b8ff; }

/* ---------- 筛选 tag / 切换标签 ---------- */
${d} .toggle-tag { background: #1c2128; border-color: #373e47; color: #cdd9e5; }
${d} .toggle-tag:hover { background: #30363d; color: #79b8ff; }
${d} .toggle-tag.active, ${d} .toggle-tag.selected { background: #539bf5; color: #fff; }

/* ---------- 题单分类卡（训练列表） ---------- */
${d} .category-card.category-card { background: #22272e !important; border-color: #373e47 !important; }
${d} .category-card.category-card:hover { border-color: #539bf5 !important; }
${d} .category-card.category-card.active { background: #2d333b !important; border-color: #539bf5 !important; }
${d} .category-card .title, ${d} .category-card .desc { color: #cdd9e5; }
${d} .category-card .desc { color: #909dab; }

/* ---------- 训练进度环 ---------- */
${d} circle[fill="#fff"], ${d} circle[fill="white"] { fill: #22272e; }
${d} circle[stroke="#f2f2f2"], ${d} circle[stroke="#e8e8e8"], ${d} circle[stroke="#fff"] { stroke: #373e47; }

/* ---------- 比赛列表 ---------- */
${d} .contest-card { border-color: #373e47; }
${d} .contest-card a.name, ${d} a.name { color: #79b8ff; }
${d} .contest-card a.name:hover, ${d} a.name:hover { color: #539bf5; }
${d} .title-row, ${d} .row.space-between { border-color: #373e47; }
${d} .list-wrap, ${d} .list, ${d} .list-scroll { border-color: #373e47; }
${d} .header { border-color: #373e47 !important; }

/* ---------- 侧边栏：仅父级 li 提供悬停背景，链接不叠底块/下划线 ---------- */
${d} .sidebar.lside .nav-group > ul > li {
  background: transparent !important; border-bottom: 0 !important;
}
${d} .sidebar.lside .nav-group > ul > li:hover,
${d} .sidebar.lside .nav-group > ul > li:focus-within { background: #30363d !important; }
${d} .sidebar.lside .nav-group > ul > li > a {
  background: transparent !important; background-image: none !important;
  border-bottom: 0 !important; box-shadow: none !important;
  text-decoration: none !important; filter: none !important; transition: none !important;
  color: #cdd9e5 !important;
}
${d} .sidebar.lside .nav-group > ul > li > a::before,
${d} .sidebar.lside .nav-group > ul > li > a::after { content: none !important; }
${d} .sidebar.lside .nav-group > ul > li > a:hover,
${d} .sidebar.lside .nav-group > ul > li > a:focus-visible,
${d} .sidebar.lside .nav-group > ul > li > a.router-link-exact-active { color: #79b8ff !important; }
${d} .sidebar.lside .nav-group > ul > li > a:focus-visible { outline: 2px solid #539bf5; outline-offset: -2px; }
${d} .sidebar.lside .nav-group > ul > li > a > .title { color: inherit !important; }

/* ---------- 陶片放逐/动态 author 卡 ---------- */
${d} .author, ${d} .author.author { background: #22272e !important; color: #cdd9e5; }
${d} .author a, ${d} .author .name { color: #79b8ff; }

/* ---------- 文章广场/文章 ---------- */
/* 标题链接 Vue 行内绑 rgba(0,0,0,.85)——行内只能用 !important 压 */
${d} .row.title a, ${d} .row .title a, ${d} a[href*="/article/"] { color: #79b8ff !important; }
${d} a[href*="/article/"]:hover { color: #539bf5 !important; }
/* 分类标签（算法·理论/休闲·娱乐 这类无类的 .name span） */
${d} .wrap .name, ${d} .article-card .name { background: #30363d; color: #cdd9e5; }
${d} .article-card, ${d} .card { background: #22272e; border-color: #373e47; }

/* ---------- Highcharts（主页通过数统计图，SVG 属性与行内 fill 均需覆盖） ---------- */
${d} #app-old .highcharts-root text,
${d} #app-old .highcharts-root tspan { fill: #cdd9e5 !important; color: #cdd9e5 !important; }
${d} #app-old .highcharts-grid-line,
${d} #app-old .highcharts-axis-line,
${d} #app-old .highcharts-tick { stroke: #373e47; }
${d} #app-old .highcharts-tooltip-box:not(.highcharts-shadow) { fill: #22272e; stroke: #768390; }
${d} #app-old .highcharts-tooltip .highcharts-shadow { display: none; }
${d} #app-old .highcharts-column-series .highcharts-point { fill: #56b6c2; stroke: #56b6c2; }
${d} #app-old .highcharts-column-series .highcharts-point-hover { fill: #8cdae3; stroke: #8cdae3; }
${d} #app-old .highcharts-area { fill: rgba(83,155,245,.2); }
${d} #app-old .highcharts-tooltip tspan[style*="fill:#7cb5ec"] { fill: #79b8ff !important; }
${d} #app-old .highcharts-tooltip tspan[style*="fill:#434348"] { fill: #56b6c2 !important; }

/* ---------- 老主页打卡卡：只给打卡按钮上底色，保留用户名链接 ---------- */
${d} .lg-punch { background: #22272e; color: #cdd9e5; }
${d} #app-old .lg-punch h2 a { background: transparent !important; color: #79b8ff !important; }
${d} #app-old .lg-punch a[name="punch"] {
  background: #245f99 !important; color: #fff !important; border-color: #539bf5 !important;
}
${d} #app-old .lg-punch a[name="punch"]:hover,
${d} #app-old .lg-punch a[name="punch"]:focus-visible { background: #2c70b1 !important; color: #fff !important; }
${d} #home-center-nav > .feed-selector > a { background: transparent; color: #cdd9e5 !important; }
${d} #home-center-nav > .feed-selector > a:hover { background: #30363d; }
${d} #home-center-nav > .feed-selector.am-active > a { background: #245f99 !important; color: #fff !important; }

/* ---------- 文章页侧栏动作/彩色链接 ---------- */
${d} .side .actions a { color: #cdd9e5; }
${d} .side .actions a:hover { color: #79b8ff; }
${d} .colored-link-selector a span, ${d} .l-card.collections a span,
${d} .colored-link-selector span { background: transparent !important; color: #cdd9e5; }

/* ---------- 筛选卡/搜索框 ---------- */
${d} .filter-card { background: #22272e; border-color: #373e47; }
${d} .filter-card .filter-label, ${d} .filter-card .filter-result-count { color: #cdd9e5 !important; }
${d} .refined-input, ${d} .refined-input.keyword { background: #1c2128 !important; color: #cdd9e5; border-color: #373e47 !important; }
${d} .refined-input > input { background: transparent !important; color: #cdd9e5; }
${d} .refined-input > .east, ${d} .refined-input > .west,
${d} .refined-input .search-icon { background: transparent !important; color: #909dab !important; }
${d} .refined-input > input::placeholder { color: #909dab; opacity: 1; }
${d} .block-item.category { background: transparent; }
${d} .block-item.category > ul.rmj { background: #22272e !important; }
${d} .block-item.category > ul.rmj > li:not(.selected):hover { background: #30363d; }

/* ---------- 比赛名链接去底，避免文章分类的 .wrap .name 误伤 ---------- */
${d} .contest-card .title-row a.name { background: transparent !important; }

/* ---------- 通用按钮/链接对比 ---------- */
${d} .lfe-button--primary, ${d} .l-button--primary, ${d} button.primary { color: #fff; }
${d} .punch, ${d} .checkin, ${d} [class*="check"][class*="btn"], ${d} [class*="punch"] { color: #cdd9e5; }
`
