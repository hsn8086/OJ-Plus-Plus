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
`;
