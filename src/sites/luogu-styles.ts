const d = 'html[data-ojpp-theme="dark"]';
export const LUOGU_DARK = `
${d} body, ${d} #app, ${d} .lfe-body, ${d} main, ${d} .main-container {
  background: #1c2128; color: #cdd9e5;
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
${d} nav, ${d} .sidebar, ${d} .user-nav, ${d} .nav-container, ${d} .nav-bar {
  --theme-navi-back: #22272e !important; --theme-navi-fore: #cdd9e5 !important;
  --theme-navi-fore-rgb: 205,217,229 !important; background: #22272e; color: #cdd9e5;
}
${d} a:not([class*="lcolor"]):not([class*="user-"]):not(.lfe-button) { color: #539bf5; }
${d} a:not([class*="lcolor"]):hover { color: #79b8ff; }
${d} input:not([type=checkbox]):not([type=radio]), ${d} textarea, ${d} select {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} pre, ${d} .lfe-marked pre, ${d} .io-sample pre, ${d} :not(pre)>code {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
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
`;
