export const CSS = `
/* ---------- CSS 变量：设计 Token ---------- */
:root {
  /* 缓动曲线 */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  
  /* 时长 */
  --duration-press: 100ms;
  --duration-tooltip: 150ms;
  --duration-dropdown: 200ms;
  --duration-modal: 300ms;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.08);
  
  /* 颜色 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #f1f3f5;
  --color-bg-hover: rgba(0, 0, 0, 0.04);
  
  --color-border: #e9ecef;
  --color-border-hover: #dee2e6;
  --color-border-focus: #4c6ef5;
  
  --color-text-primary: #212529;
  --color-text-secondary: #495057;
  --color-text-tertiary: #868e96;
  
  --color-accent: #4c6ef5;
  --color-accent-bg: rgba(76, 110, 245, 0.08);
  --color-accent-light: #dbe4ff;
  
  --color-success: #40c057;
  --color-success-bg: rgba(64, 192, 87, 0.08);
  --color-danger: #fa5252;
  --color-danger-bg: rgba(250, 82, 82, 0.08);
}

/* ---------- 工具栏 ---------- */
.ojpp-toolbar {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  margin-left: var(--spacing-sm);
  vertical-align: middle;
}

.ojpp-toolbar-right {
  float: right;
  margin-left: var(--spacing-md);
  margin-right: 0;
}

.ojpp-toolbar-block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  width: 100%;
  margin: 2px 0 6px;
}

.ojpp-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.ojpp-icon-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.ojpp-icon-btn:active {
  transform: scale(0.92);
}

.ojpp-icon-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

.ojpp-icon-btn[data-state="busy"] { 
  color: var(--color-accent); 
  pointer-events: none;
}
.ojpp-icon-btn[data-state="busy"] svg { 
  animation: ojpp-spin 1s linear infinite; 
}
.ojpp-icon-btn[data-state="done"] { color: var(--color-success); }
.ojpp-icon-btn[data-state="error"] { color: var(--color-danger); }
.ojpp-icon-btn[data-state="active"] { 
  color: var(--color-accent); 
  background: var(--color-accent-bg); 
}
.ojpp-icon-btn:disabled { 
  cursor: not-allowed; 
  opacity: 0.4;
}

@keyframes ojpp-spin { 
  to { transform: rotate(360deg); } 
}

.ojpp-icon-btn.ojpp-settings-floating {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 2147482998;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  transition: 
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out);
}

.ojpp-icon-btn.ojpp-settings-floating:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);
}

.ojpp-icon-btn.ojpp-settings-floating:active {
  transform: scale(0.9);
  box-shadow: var(--shadow-sm);
}

/* ---------- 结果面板 ---------- */
.ojpp-result {
  margin: 12px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-result:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.ojpp-result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
}

.ojpp-result-title { 
  font-weight: 600; 
  color: var(--color-text-secondary); 
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ojpp-result-status { 
  color: var(--color-text-tertiary); 
  flex: 1;
  font-size: 11px;
}
.ojpp-result-status[data-kind="error"] { color: var(--color-danger); }

.ojpp-result-actions { 
  display: flex; 
  gap: 2px;
  margin: -4px -4px -4px 0;
}
.ojpp-result-actions .ojpp-icon-btn { 
  width: 24px; 
  height: 24px; 
}

.ojpp-result-body {
  padding: 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
  overflow-x: auto;
}

.ojpp-result-body > :first-child { margin-top: 0; }
.ojpp-result-body > :last-child { margin-bottom: 0; }
.ojpp-result-body img { max-width: 100%; }
.ojpp-result-body table { 
  border-collapse: collapse; 
  margin: 12px 0; 
}
.ojpp-result-body th, 
.ojpp-result-body td {
  border: 1px solid var(--color-border);
  padding: 6px 10px;
}
.ojpp-result-body pre {
  background: var(--color-bg-secondary);
  padding: 12px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
}
.ojpp-result-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background: var(--color-bg-tertiary);
  padding: 2px 5px;
  border-radius: 3px;
}
.ojpp-result-body pre code { 
  background: none; 
  padding: 0; 
}

.ojpp-collapsed .ojpp-result-body { 
  display: none; 
}

.ojpp-streaming .ojpp-result-body > :last-child::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: text-bottom;
  background: var(--color-accent);
  opacity: 1;
  animation: ojpp-caret 1s steps(2) infinite;
}
@keyframes ojpp-caret { 
  50% { opacity: 0; } 
}

.ojpp-md-source {
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
}

/* ---------- 设置面板 ---------- */
.ojpp-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ojpp-mask-in var(--duration-modal) var(--ease-out);
}

@keyframes ojpp-mask-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ojpp-panel {
  width: min(620px, 100%);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  font-size: 13px;
  line-height: 1.5;
  animation: ojpp-panel-in var(--duration-modal) var(--ease-out);
  overflow: hidden;
}

@keyframes ojpp-panel-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.ojpp-panel * { 
  box-sizing: border-box; 
}

.ojpp-panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
}

.ojpp-back-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-back-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.ojpp-back-btn:active {
  transform: scale(0.92);
}

.ojpp-panel-head h3 { 
  margin: 0; 
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  letter-spacing: -0.01em;
}

.ojpp-panel-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-panel-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.ojpp-panel-close:active {
  transform: scale(0.9);
}

.ojpp-panel-body { 
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.ojpp-panel-foot {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

/* 分段 */
.ojpp-section {
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
}

.ojpp-section:last-child {
  border-bottom: none;
}

.ojpp-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.ojpp-section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ojpp-section-badge {
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
}

.ojpp-section-body {
  display: grid;
  gap: 10px;
}

/* 表单 */
.ojpp-field { 
  display: grid;
  gap: 5px;
}

.ojpp-field > label { 
  font-weight: 500;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.ojpp-panel input[type="text"],
.ojpp-panel input[type="password"],
.ojpp-panel input[type="number"],
.ojpp-panel select,
.ojpp-panel textarea {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 13px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-panel textarea {
  height: auto;
  padding: 8px 10px;
  resize: vertical;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
}

.ojpp-panel input:hover,
.ojpp-panel select:hover,
.ojpp-panel textarea:hover {
  border-color: var(--color-border-hover);
}

.ojpp-panel input:focus, 
.ojpp-panel select:focus,
.ojpp-panel textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}

.ojpp-row { 
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

/* 复选框 */
.ojpp-check { 
  display: flex; 
  align-items: center; 
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background var(--duration-tooltip) var(--ease-out);
  cursor: pointer;
}

.ojpp-check:hover {
  background: var(--color-bg-hover);
}

.ojpp-check input[type="checkbox"] { 
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.ojpp-check label { 
  flex: 1;
  cursor: pointer;
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
}

/* 同一项设置下的多个复选框（如按站点开关自动翻译） */
.ojpp-check-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
}
.ojpp-check-group .ojpp-check {
  flex: 0 0 auto;
}
.ojpp-check-group .ojpp-check label {
  flex: none;
}

/* 提供商摘要 */
.ojpp-provider-summary {
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

/* 提供商列表 */
.ojpp-provider-list { 
  display: grid;
  gap: 6px;
}

.ojpp-provider-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-provider-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  box-shadow: var(--shadow-sm);
}

.ojpp-provider-item:active {
  transform: scale(0.99);
}

.ojpp-provider-item[data-active="1"] { 
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.06);
}

.ojpp-provider-item input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
}

.ojpp-provider-text { 
  min-width: 0;
  display: grid;
  gap: 2px;
}

.ojpp-provider-name { 
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ojpp-provider-meta { 
  color: var(--color-text-tertiary); 
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ojpp-provider-badge {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-success-bg);
  color: var(--color-success);
  font-size: 12px;
}

.ojpp-provider-edit { 
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-provider-edit:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.ojpp-provider-edit:active {
  transform: scale(0.9);
}

/* 添加按钮 */
.ojpp-add-provider {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  margin-bottom: 10px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-tertiary);
  font: inherit;
  font-size: 24px;
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-add-provider:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.ojpp-add-provider:active {
  transform: scale(0.99);
}

/* 预设网格 */
.ojpp-preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.ojpp-preset-item {
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-preset-item:hover { 
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
  box-shadow: var(--shadow-sm);
}

.ojpp-preset-item:active {
  transform: scale(0.98);
}

.ojpp-preset-name { 
  font-weight: 600;
  font-size: 12px;
}

.ojpp-preset-meta { 
  font-size: 10px; 
  color: var(--color-text-tertiary); 
  word-break: break-all;
  line-height: 1.3;
}

/* 状态 */
.ojpp-status {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
}

.ojpp-status[data-kind="error"] { 
  color: var(--color-danger);
  background: var(--color-danger-bg);
}

.ojpp-status[data-kind="ok"] { 
  color: var(--color-success);
  background: var(--color-success-bg);
}

/* 按钮 */
.ojpp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    border-color var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-btn:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
}

.ojpp-btn:active {
  transform: scale(0.96);
}

.ojpp-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.ojpp-btn-primary { 
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ojpp-btn-primary:hover {
  background: #4263eb;
  border-color: #4263eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ojpp-btn-primary:active {
  background: #3b5bdb;
  border-color: #3b5bdb;
}

.ojpp-btn-danger { 
  color: var(--color-danger);
  border-color: transparent;
  background: transparent;
}

.ojpp-btn-danger:hover {
  background: var(--color-danger-bg);
  border-color: var(--color-danger);
}

.ojpp-btn:disabled { 
  cursor: not-allowed;
  opacity: 0.4;
  pointer-events: none;
}

/* Toast */
.ojpp-toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483001;
  background: var(--color-text-primary);
  color: white;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  max-width: 320px;
  animation: ojpp-toast-in var(--duration-dropdown) var(--ease-out);
  backdrop-filter: blur(12px);
}

@keyframes ojpp-toast-in {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ojpp-toast[data-kind="error"] { 
  background: var(--color-danger);
}

.ojpp-toast[data-kind="success"] {
  background: var(--color-success);
}

/* ---------- 题目页代码编辑器 ---------- */
.ojpp-editor {
  margin: 12px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  overflow: hidden;
  font-size: 13px;
}

.ojpp-editor-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--color-border);
}

.ojpp-editor-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-primary);
}

.ojpp-editor-lang {
  height: 26px;
  max-width: 220px;
  padding: 0 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 12px;
}

.ojpp-editor-spacer { flex: 1; }

.ojpp-btn-sm {
  height: 26px;
  padding: 0 10px;
  font-size: 11px;
}

.ojpp-editor-cm .cm-editor {
  max-height: 420px;
}
.ojpp-editor-cm .cm-scroller {
  max-height: 420px;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}

.ojpp-editor-custom {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 8px 10px;
  border-top: 1px solid var(--color-border);
}

.ojpp-editor-input {
  flex: 1;
  min-height: 56px;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  resize: vertical;
}

.ojpp-editor-results:empty { display: none; }
.ojpp-editor-results {
  border-top: 1px solid var(--color-border);
}

.ojpp-editor-empty {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.ojpp-editor-result {
  padding: 8px 10px;
}
.ojpp-editor-result + .ojpp-editor-result {
  border-top: 1px dashed var(--color-border);
}

.ojpp-editor-result-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.ojpp-editor-result-name { color: var(--color-text-secondary); font-weight: 500; }
.ojpp-editor-result-status { color: var(--color-accent); }
.ojpp-editor-result-status.ok { color: var(--color-success); }
.ojpp-editor-result-status.warn { color: #e8890c; }
.ojpp-editor-result-status.error { color: var(--color-danger); }

.ojpp-editor-result-body {
  margin-top: 6px;
  display: grid;
  gap: 6px;
}

.ojpp-editor-out {
  margin: 0;
  padding: 6px 8px;
  max-height: 160px;
  overflow: auto;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--color-text-primary);
  white-space: pre-wrap;
  word-break: break-all;
}
.ojpp-editor-out.expected { color: var(--color-text-tertiary); }
.ojpp-editor-out.error { color: var(--color-danger); }

.ojpp-editor-used {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.ojpp-editor-submitok,
.ojpp-editor-submiterr {
  padding: 8px 10px;
  font-size: 12px;
}
.ojpp-editor-submitok { color: var(--color-success); }
.ojpp-editor-submitok a { color: var(--color-accent); }
.ojpp-editor-submiterr { color: var(--color-danger); }

/* 响应式 */
@media (max-width: 640px) {
  .ojpp-panel {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .ojpp-preset-grid {
    grid-template-columns: 1fr;
  }
  
  .ojpp-row {
    grid-template-columns: 1fr;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .ojpp-icon-btn:active,
  .ojpp-btn:active,
  .ojpp-provider-item:active,
  .ojpp-preset-item:active {
    transform: none;
  }
}
`;

export const DARK_CSS = `
html[data-ojpp-theme="dark"] {
  --color-bg-primary: #1a1b1e;
  --color-bg-secondary: #25262b;
  --color-bg-tertiary: #2c2e33;
  --color-bg-hover: rgba(255, 255, 255, 0.05);
  
  --color-border: #373a40;
  --color-border-hover: #495057;
  --color-border-focus: #748ffc;
  
  --color-text-primary: #ececec;
  --color-text-secondary: #c1c2c5;
  --color-text-tertiary: #909296;
  
  --color-accent: #748ffc;
  --color-accent-bg: rgba(116, 143, 252, 0.12);
  --color-accent-light: rgba(116, 143, 252, 0.15);
  
  --color-success: #51cf66;
  --color-success-bg: rgba(81, 207, 102, 0.12);
  --color-danger: #ff6b6b;
  --color-danger-bg: rgba(255, 107, 107, 0.12);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4);
}

html[data-ojpp-theme="dark"] .ojpp-mask {
  background: rgba(0, 0, 0, 0.6);
}

html[data-ojpp-theme="dark"] .ojpp-icon-btn.ojpp-settings-floating {
  background: rgba(37, 38, 43, 0.92);
}

html[data-ojpp-theme="dark"] .ojpp-icon-btn.ojpp-settings-floating:hover {
  background: rgba(37, 38, 43, 0.98);
}

html[data-ojpp-theme="dark"] .ojpp-panel {
  border: 1px solid var(--color-border);
}

html[data-ojpp-theme="dark"] .ojpp-toast {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

html[data-ojpp-theme="dark"] .ojpp-toast[data-kind="error"] {
  background: var(--color-danger);
  color: white;
  border: none;
}

html[data-ojpp-theme="dark"] .ojpp-toast[data-kind="success"] {
  background: var(--color-success);
  color: white;
  border: none;
}
`;
