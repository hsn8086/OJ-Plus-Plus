const d = 'html[data-ojpp-theme="dark"]';
export const QOJ_DARK = `
${d} body, ${d} .uoj-content, ${d} .container, ${d} .tab-content { background: #1c2128; color: #cdd9e5; }
${d} a:not([class*="uoj-username"]):not(.btn) { color: #539bf5; }
${d} .navbar, ${d} .card, ${d} .card-body, ${d} .card-header, ${d} .panel,
${d} .panel-body, ${d} .panel-heading, ${d} .list-group-item, ${d} .dropdown-menu,
${d} .modal-content, ${d} .bg-light, ${d} .bg-white, ${d} .jumbotron {
  background: #22272e !important; color: #cdd9e5; border-color: #373e47;
}
${d} .dropdown-item, ${d} .nav-link, ${d} .navbar-light .navbar-nav .nav-link { color: #cdd9e5; }
${d} .dropdown-item:hover, ${d} .nav-tabs .nav-link.active, ${d} .nav-link:hover,
${d} .page-link:hover { background: #2d333b; color: #79b8ff; }
${d} .page-link, ${d} .page-item.disabled .page-link, ${d} .btn-default, ${d} .btn-light {
  background: #22272e; color: #cdd9e5; border-color: #373e47;
}
${d} pre, ${d} code { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${d} input:not([type=checkbox]):not([type=radio]), ${d} textarea, ${d} select,
${d} .form-control, ${d} .custom-select { background: #1c2128; color: #cdd9e5; border-color: #373e47; }
${d} .table, ${d} .table td, ${d} .table th, ${d} hr, ${d} .nav-tabs { color: #cdd9e5; border-color: #373e47; }
${d} .table-striped tbody tr:nth-of-type(odd), ${d} thead, ${d} .table-active { background: #22272e; }
${d} .table-hover tbody tr:hover { background: #2d333b; color: #cdd9e5; }
${d} .alert-info { background: #203247; color: #9bc4ef; border-color: #354c66; }
${d} .alert-warning { background: #3c3424; color: #e5c07b; border-color: #665537; }
${d} .alert-danger { background: #422c30; color: #f3a6ac; border-color: #694047; }
${d} .text-muted, ${d} .text-secondary, ${d} .uoj-text-gray { color: #909dab !important; }
${d} .uoj-username { color: #cdd9e5; }
${d} .uoj-username-blue { color: #539bf5; }
${d} .uoj-username-green { color: #57ab5a; }
${d} .uoj-username-red { color: #f85149; }
${d} .uoj-username-purple { color: #b392f0; }
${d} .unrated, ${d} .uoj-username-grey { color: #cdd9e5; }
${d} .alert-success { background: #1e2f24; color: #a5d6a7; border-color: #2d4a33; }

/* shjs 语法高亮（提交代码视图）：亮色系配色换深色 */
${d} .sh_keyword, ${d} .sh_type, ${d} .sh_preproc, ${d} .sh_tag, ${d} .sh_link,
${d} .sh_selector, ${d} .sh_reserved { color: #ff7b72; }
${d} .sh_string, ${d} .sh_chardef, ${d} .sh_number, ${d} .sh_specialchar,
${d} .sh_regexp, ${d} .sh_value { color: #a5d6ff; }
${d} .sh_function, ${d} .sh_property, ${d} .sh_attribute, ${d} .sh_name,
${d} .sh_variable, ${d} .sh_title { color: #d2a8ff; }
${d} .sh_comment, ${d} .sh_documentation, ${d} .sh_comment_linetoscheme,
${d} .sh_multicomment { color: #8b949e; }
${d} .sh_operator, ${d} .sh_brackets, ${d} .sh_cbracket, ${d} .sh_symbol,
${d} .sh_ip { color: #ff9e64; }
${d} .sh_cbracket, ${d} .sh_label, ${d} .sh_import, ${d} .sh_package { color: #79b8ff; }
`;
