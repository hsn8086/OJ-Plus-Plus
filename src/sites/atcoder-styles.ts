const scope = 'html[data-ojpp-theme="dark"]';

export const ATCODER_DARK = `
${scope} { color-scheme: dark; }
${scope} body, ${scope} #main-container, ${scope} #main-div, ${scope} #main-container .container,
${scope} #contest-nav-tabs {
  background: #1c2128; color: #cdd9e5;
}
${scope} a:not([class*="user-"]):not(.btn) { color: #539bf5; }
${scope} a:not([class*="user-"]):hover { color: #79b8ff; }
${scope} .navbar, ${scope} .navbar-default, ${scope} .navbar-inverse,
${scope} .panel, ${scope} .panel-default, ${scope} .well, ${scope} .modal-content,
${scope} .dropdown-menu, ${scope} .popover, ${scope} .list-group-item,
${scope} .select2-drop, ${scope} .select2-results { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${scope} .panel-heading, ${scope} .panel-footer, ${scope} .modal-header,
${scope} .modal-footer, ${scope} .popover-title { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${scope} .navbar a, ${scope} .dropdown-menu>li>a { color: #cdd9e5; }
${scope} .dropdown-menu>li>a:hover, ${scope} .dropdown-menu>li>a:focus,
${scope} .navbar .open>a, ${scope} .nav>li>a:hover, ${scope} .nav>li>a:focus,
${scope} .nav-tabs>li.active>a, ${scope} .nav-tabs>li.active>a:hover,
${scope} .pagination>.active>a { background: #2d333b; color: #79b8ff; border-color: #373e47; }
${scope} .nav-tabs, ${scope} hr, ${scope} .table>thead>tr>th,
${scope} .table>tbody>tr>td, ${scope} .table>tbody>tr>th, ${scope} .table-bordered,
${scope} .table-bordered>thead>tr>th, ${scope} .table-bordered>tbody>tr>td { border-color: #373e47; }
${scope} .table-striped>tbody>tr:nth-of-type(odd), ${scope} .table-striped>tbody>tr:nth-child(odd)>td,
${scope} .table-striped>tbody>tr:nth-child(odd)>th { background: #22272e; }
${scope} .table-hover>tbody>tr:hover>td, ${scope} .table-hover>tbody>tr:hover>th { background: #2d333b; }
${scope} .table .success, ${scope} .table .success>td { background: #22392b; }
${scope} .table .warning, ${scope} .table .warning>td { background: #3c3424; }
${scope} .table .danger, ${scope} .table .danger>td { background: #422c30; }
${scope} input:not([type=checkbox]):not([type=radio]), ${scope} select, ${scope} textarea,
${scope} .form-control, ${scope} .select2-container .select2-choice,
${scope} .select2-container .select2-choice .select2-arrow, ${scope} .select2-search input {
  background: #1c2128; background-image: none; color: #cdd9e5; border-color: #373e47;
}
${scope} .select2-results .select2-highlighted { background: #2d333b; color: #79b8ff; }
${scope} .btn-default, ${scope} .btn-default:focus, ${scope} .pagination>li>a,
${scope} .pagination>li>span { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${scope} .btn-default:hover { background: #2d333b; }
${scope} pre, ${scope} code, ${scope} .source-code-for-copy { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${scope} #task-statement var, ${scope} .katex { color: inherit; background: transparent; }
${scope} .alert-info { background: #203247; color: #9bc4ef; border-color: #354c66; }
${scope} .alert-warning { background: #3c3424; color: #e5c07b; border-color: #665537; }
${scope} .alert-danger { background: #422c30; color: #f3a6ac; border-color: #694047; }
${scope} .alert-success { background: #22392b; color: #8bc89a; border-color: #365d40; }
${scope} .text-muted, ${scope} .help-block, ${scope} small { color: #909dab; }
${scope} blockquote { border-color: #536170; }
${scope} .close { color: #cdd9e5; text-shadow: none; opacity: .8; }
${scope} #main-div { box-shadow: none; }
${scope} #fixed-server-timer { background: #22272e; color: #cdd9e5; border-color: #373e47; }
${scope} .select2-container .select2-selection--single,
${scope} .select2-dropdown, ${scope} .select2-search__field {
  background: #1c2128; color: #cdd9e5; border-color: #373e47;
}
${scope} .select2-container .select2-selection--single .select2-selection__rendered { color: #cdd9e5; }
${scope} .select2-container .select2-results__option[aria-selected=true] { background: #2d333b; }
${scope} .select2-container .select2-results__option--highlighted[aria-selected] { background: #354961; color: #fff; }
${scope} .table>tbody>tr.success>th, ${scope} .table>tbody>tr>th.success { background: #22392b; }
${scope} .table>tbody>tr.danger>th, ${scope} .table>tbody>tr>th.danger { background: #422c30; }
${scope} .table>tbody>tr.warning>th, ${scope} .table>tbody>tr>th.warning { background: #3c3424; }
${scope} .user-gray { color: #a0a0a0 !important; }
${scope} .user-brown { color: #b78b66 !important; }
${scope} .user-green { color: #57ab5a !important; }
${scope} .user-cyan { color: #56c7c7 !important; }
${scope} .user-blue { color: #539bf5 !important; }
${scope} .user-yellow { color: #d8cf55 !important; }
${scope} .user-orange { color: #f0883e !important; }
${scope} .user-red { color: #f85149 !important; }
`;
