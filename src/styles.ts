export const CSS = `
/* ---------- 内联图标工具栏 ---------- */
.ncb-toolbar {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  margin-left: 8px;
  vertical-align: middle;
}
.ncb-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: #8a9099;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
}
.ncb-icon-btn:hover {
  background: rgba(0, 0, 0, .06);
  color: #24292f;
}
.ncb-icon-btn:focus-visible {
  outline: 2px solid #bfdbfe;
  outline-offset: 1px;
}
.ncb-icon-btn[data-state="busy"] { color: #2563eb; }
.ncb-icon-btn[data-state="busy"] svg { animation: ncb-spin 1s linear infinite; }
.ncb-icon-btn[data-state="done"] { color: #067647; }
.ncb-icon-btn[data-state="error"] { color: #b42318; }
.ncb-icon-btn[data-state="active"] { color: #2563eb; background: rgba(37, 99, 235, .1); }
.ncb-icon-btn:disabled { cursor: default; }
@keyframes ncb-spin { to { transform: rotate(360deg); } }

/* 右上角设置入口 */
.ncb-settings-host {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
}
.ncb-settings-host .ncb-icon-btn { color: #cfd3d8; }
.ncb-settings-host .ncb-icon-btn:hover {
  background: rgba(255, 255, 255, .14);
  color: #fff;
}
.ncb-icon-btn.ncb-settings-floating {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 2147482998;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, .92);
  border-color: #d0d7de;
  color: #57606a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .12);
}

/* ---------- 译文面板 ---------- */
.ncb-result {
  margin: 10px 0;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  background: #fcfdfe;
  overflow: hidden;
}
.ncb-result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background: #f6f8fa;
  border-bottom: 1px solid #e6e9ee;
  font-size: 12px;
}
.ncb-result-title { font-weight: 600; color: #57606a; }
.ncb-result-status { color: #8a9099; flex: 1; }
.ncb-result-status[data-kind="error"] { color: #b42318; }
.ncb-result-actions { display: flex; gap: 2px; }
.ncb-result-actions .ncb-icon-btn { width: 22px; height: 22px; }
.ncb-result-body {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.75;
  color: #1f2328;
  overflow-x: auto;
}
.ncb-result-body > :first-child { margin-top: 0; }
.ncb-result-body > :last-child { margin-bottom: 0; }
.ncb-result-body img { max-width: 100%; }
.ncb-result-body table { border-collapse: collapse; margin: 8px 0; }
.ncb-result-body th, .ncb-result-body td {
  border: 1px solid #d0d7de;
  padding: 4px 8px;
}
.ncb-result-body pre {
  background: #f6f8fa;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}
.ncb-result-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background: rgba(175, 184, 193, .2);
  padding: 1px 4px;
  border-radius: 3px;
}
.ncb-result-body pre code { background: none; padding: 0; }
.ncb-collapsed .ncb-result-body { display: none; }

.ncb-md-source {
  white-space: pre-wrap;
  word-break: break-word;
  background: #f6f8fa;
  border: 1px dashed #d0d7de;
  border-radius: 6px;
  padding: 10px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
}

/* ---------- 设置面板 ---------- */
.ncb-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .45);
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.ncb-panel {
  width: min(860px, 100%);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #1f2328;
  border-radius: 10px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, .28);
  font-size: 13px;
  line-height: 1.6;
}
.ncb-panel * { box-sizing: border-box; }
.ncb-panel-head {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e6e9ee;
}
.ncb-panel-head h3 { margin: 0; font-size: 15px; flex: 1; }
.ncb-panel-body { padding: 12px 16px; overflow-y: auto; }
.ncb-panel-foot {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #e6e9ee;
}
.ncb-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
.ncb-tab {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  color: #57606a;
  background: transparent;
  font: inherit;
}
.ncb-tab[data-active="1"] { background: #eef2f7; color: #1f2328; font-weight: 600; }
.ncb-field { margin-bottom: 12px; }
.ncb-field > label { display: block; font-weight: 600; margin-bottom: 4px; }
.ncb-hint { color: #6b7280; font-size: 12px; margin-top: 3px; }
.ncb-panel input[type="text"],
.ncb-panel input[type="password"],
.ncb-panel input[type="number"],
.ncb-panel select,
.ncb-panel textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font: inherit;
  background: #fff;
  color: inherit;
}
.ncb-panel textarea {
  resize: vertical;
  min-height: 64px;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
}
.ncb-panel input:focus, .ncb-panel select:focus, .ncb-panel textarea:focus {
  outline: 2px solid #bfdbfe;
  border-color: #2563eb;
}
.ncb-row { display: flex; gap: 10px; align-items: flex-end; }
.ncb-row > .ncb-field { flex: 1; min-width: 0; }
.ncb-row > .ncb-btn { flex: none; margin-bottom: 12px; }
.ncb-check { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
.ncb-check input { margin-top: 3px; }
.ncb-check label { flex: 1; }
.ncb-provider-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.ncb-provider-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  cursor: pointer;
}
.ncb-provider-item[data-active="1"] { border-color: #2563eb; background: #f5f8ff; }
.ncb-provider-item .ncb-provider-name { font-weight: 600; flex: 1; }
.ncb-provider-item .ncb-provider-meta { color: #6b7280; font-size: 12px; }
.ncb-status {
  margin-top: 8px;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 160px;
  overflow-y: auto;
}
.ncb-status[data-kind="error"] { color: #b42318; }
.ncb-status[data-kind="ok"] { color: #067647; }

.ncb-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147482999;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .5px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(37, 99, 235, .4);
}
.ncb-fab:hover { background: #1d4ed8; }

.ncb-toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483001;
  background: #1f2328;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .25);
  max-width: 420px;
}
.ncb-toast[data-kind="error"] { background: #b42318; }
`;
