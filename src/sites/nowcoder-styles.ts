const d = 'html[data-ojpp-theme="dark"]';

export const NOWCODER_DARK = `
${d} { color-scheme: dark; }
${d} body, ${d} .nk-container, ${d} .nk-main, ${d} .nk-content,
${d} .nk-acm-container, ${d} .content-board, ${d} .nc-el-container,
${d} .question-main, ${d} .question-content, ${d} .subject-box {
  background: #1c2128; color: #cdd9e5;
}
${d} .module-box, ${d} .module-head, ${d} .module-body, ${d} .subject-main,
${d} .subject-item-wrap, ${d} .subject-item, ${d} .question-intr, ${d} .question-oi-bd,
${d} .question-oi-hd, ${d} .code-editor-header, ${d} .code-editor-header.theme-default,
${d} .panel-header, ${d} .panel-body, ${d} .panel-footer, ${d} .code-editor-footer,
${d} .nc-post-content, ${d} .menu-list, ${d} .dropdown-menu, ${d} .select-options,
${d} .tooltip-inner, ${d} .pop-box, ${d} .pop-content, ${d} .pop-main {
  background: #22272e; color: #cdd9e5; border-color: #373e47;
}
${d} .header-bar, ${d} .nk-header, ${d} .nk-footer, ${d} .acm-header,
${d} .menu-box, ${d} .menu-line-box { background: #22272e; color: #cdd9e5; }
${d} .acm-header a, ${d} .menu-box a { color: #cdd9e5; }
${d} .menu-box .selected, ${d} .menu-box li:hover { background: #2d333b; }
${d} .subject-question, ${d} .subject-describe, ${d} .subject-item-title,
${d} .question-title, ${d} .question-oi-cont, ${d} .module-head h1,
${d} .module-head h2, ${d} .module-head h3, ${d} .module-head h4,
${d} .code-editor-header, ${d} .panel-header { color: #cdd9e5; }
${d} a:not(.btn):not([class*="level-"]):not([class*="user-"]) { color: #539bf5; }
${d} a:not(.btn):hover { color: #79b8ff; }
${d} pre, ${d} .subject-describe pre, ${d} .question-oi-cont pre,
${d} :not(pre)>code { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} input:not([type=checkbox]):not([type=radio]), ${d} select, ${d} textarea,
${d} .input-txt, ${d} .input-box, ${d} .search-box, ${d} .search-input {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${d} .btn-default, ${d} .btn-white, ${d} .btn-copy, ${d} .copy,
${d} .pagination a, ${d} .pagination li { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} table, ${d} th, ${d} td, ${d} .module-box, ${d} .subject-item,
${d} .panel-header, ${d} .question-oi-bd, ${d} .question-oi-hd,
${d} .code-editor-header, ${d} hr { border-color: #373e47; }
${d} th, ${d} thead td, ${d} .table-tr-head { background: #22272e; color: #cdd9e5; }
${d} tbody tr:nth-child(odd) { background: #22272e; }
${d} tbody tr:hover { background: #2d333b; }
${d} .CodeMirror, ${d} .CodeMirror-gutters { background: #1c2128; color: #cdd9e5; border-color: #373e47; }
${d} .CodeMirror-cursor { border-left-color: #cdd9e5; }
${d} .CodeMirror-selected { background: #354961; }
${d} .CodeMirror-activeline-background { background: #22272e; }
${d} .CodeMirror-linenumber { color: #909dab; }
${d} .result, ${d} .test-result, ${d} .result-panel, ${d} .test-panel { background: #1c2128; color: #cdd9e5; }
${d} .code-editor-header.theme-default, ${d} .el-popover, ${d} .el-dialog,
${d} .el-message-box, ${d} .el-select-dropdown, ${d} .el-dropdown-menu,
${d} .el-popper { background: #22272e !important; color: #cdd9e5; border-color: #373e47; }
${d} .el-select-dropdown__item, ${d} .el-dropdown-menu__item, ${d} .el-dialog__title,
${d} .panel-header .tab-item, ${d} .el-popover__title { color: #cdd9e5; }
${d} .el-select-dropdown__item.hover, ${d} .el-select-dropdown__item:hover,
${d} .el-dropdown-menu__item:hover { background: #2d333b; }
${d} .el-input__inner, ${d} .el-textarea__inner { background: #1c2128; color: #cdd9e5; border-color: #373e47; }
${d} .el-popper[x-placement^=bottom] .popper__arrow::after { border-bottom-color: #22272e; }
${d} .el-popper[x-placement^=top] .popper__arrow::after { border-top-color: #22272e; }
${d} .gray, ${d} .color-gray, ${d} .text-muted, ${d} .subject-limit { color: #909dab; }
${d} .katex { color: inherit; }
`;
