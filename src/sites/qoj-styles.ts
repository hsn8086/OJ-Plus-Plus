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
`;
