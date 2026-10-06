export const CSS = `
/* ---------- 内联图标工具栏 ---------- */
.ojpp-toolbar {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  margin-left: 8px;
  vertical-align: middle;
}
.ojpp-icon-btn {
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
.ojpp-icon-btn:hover {
  background: rgba(0, 0, 0, .06);
  color: #24292f;
}
.ojpp-icon-btn:focus-visible {
  outline: 2px solid #bfdbfe;
  outline-offset: 1px;
}
.ojpp-icon-btn[data-state="busy"] { color: #2563eb; }
.ojpp-icon-btn[data-state="busy"] svg { animation: ojpp-spin 1s linear infinite; }
.ojpp-icon-btn[data-state="done"] { color: #067647; }
.ojpp-icon-btn[data-state="error"] { color: #b42318; }
.ojpp-icon-btn[data-state="active"] { color: #2563eb; background: rgba(37, 99, 235, .1); }
.ojpp-icon-btn:disabled { cursor: default; }
@keyframes ojpp-spin { to { transform: rotate(360deg); } }

/* 右上角设置入口 */
.ojpp-icon-btn.ojpp-settings-floating {
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
.ojpp-result {
  margin: 10px 0;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  background: #fcfdfe;
  overflow: hidden;
}
.ojpp-result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background: #f6f8fa;
  border-bottom: 1px solid #e6e9ee;
  font-size: 12px;
}
.ojpp-result-title { font-weight: 600; color: #57606a; }
.ojpp-result-status { color: #8a9099; flex: 1; }
.ojpp-result-status[data-kind="error"] { color: #b42318; }
.ojpp-result-actions { display: flex; gap: 2px; }
.ojpp-result-actions .ojpp-icon-btn { width: 22px; height: 22px; }
.ojpp-result-body {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.75;
  color: #1f2328;
  overflow-x: auto;
}
.ojpp-result-body > :first-child { margin-top: 0; }
.ojpp-result-body > :last-child { margin-bottom: 0; }
.ojpp-result-body img { max-width: 100%; }
.ojpp-result-body table { border-collapse: collapse; margin: 8px 0; }
.ojpp-result-body th, .ojpp-result-body td {
  border: 1px solid #d0d7de;
  padding: 4px 8px;
}
.ojpp-result-body pre {
  background: #f6f8fa;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
}
.ojpp-result-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background: rgba(175, 184, 193, .2);
  padding: 1px 4px;
  border-radius: 3px;
}
.ojpp-result-body pre code { background: none; padding: 0; }
.ojpp-collapsed .ojpp-result-body { display: none; }

.ojpp-md-source {
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
.ojpp-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .45);
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.ojpp-panel {
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
.ojpp-panel * { box-sizing: border-box; }
.ojpp-panel-head {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e6e9ee;
}
.ojpp-panel-head h3 { margin: 0; font-size: 15px; flex: 1; }
.ojpp-panel-body { padding: 12px 16px; overflow-y: auto; }
.ojpp-panel-foot {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #e6e9ee;
}
.ojpp-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
.ojpp-tab {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  color: #57606a;
  background: transparent;
  font: inherit;
}
.ojpp-tab[data-active="1"] { background: #eef2f7; color: #1f2328; font-weight: 600; }
.ojpp-field { margin-bottom: 12px; }
.ojpp-field > label { display: block; font-weight: 600; margin-bottom: 4px; }
.ojpp-hint { color: #6b7280; font-size: 12px; margin-top: 3px; }
.ojpp-panel input[type="text"],
.ojpp-panel input[type="password"],
.ojpp-panel input[type="number"],
.ojpp-panel select,
.ojpp-panel textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font: inherit;
  background: #fff;
  color: inherit;
}
.ojpp-panel textarea {
  resize: vertical;
  min-height: 64px;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
}
.ojpp-panel input:focus, .ojpp-panel select:focus, .ojpp-panel textarea:focus {
  outline: 2px solid #bfdbfe;
  border-color: #2563eb;
}
.ojpp-row { display: flex; gap: 10px; align-items: flex-end; }
.ojpp-row > .ojpp-field { flex: 1; min-width: 0; }
.ojpp-row > .ojpp-btn { flex: none; }
.ojpp-check { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
.ojpp-check input { margin-top: 3px; }
.ojpp-check label { flex: 1; }
.ojpp-provider-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.ojpp-provider-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid #e6e9ee;
  border-radius: 6px;
  cursor: pointer;
}
.ojpp-provider-item[data-active="1"] { border-color: #2563eb; background: #f5f8ff; }
.ojpp-provider-item .ojpp-provider-name { font-weight: 600; flex: 1; }
.ojpp-provider-item .ojpp-provider-meta { color: #6b7280; font-size: 12px; }
.ojpp-status {
  margin-top: 8px;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 160px;
  overflow-y: auto;
}
.ojpp-status[data-kind="error"] { color: #b42318; }
.ojpp-status[data-kind="ok"] { color: #067647; }

.ojpp-btn {
  padding: 6px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #fff;
  color: #1f2328;
  font: inherit;
  cursor: pointer;
}
.ojpp-btn-primary { background: #2563eb; color: #fff; border-color: #2563eb; }
.ojpp-btn-danger { color: #b42318; }
.ojpp-btn-ghost { border-color: transparent; background: transparent; }
.ojpp-btn:disabled { cursor: wait; opacity: .6; }

.ojpp-toast {
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
.ojpp-toast[data-kind="error"] { background: #b42318; }
`;
