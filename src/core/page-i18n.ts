/**
 * 站点界面本地化：把站点自有的英文界面文本换成中文。
 * 只动文本节点与 input/button 的 value——
 * 不翻译专有名词（语言名、主题名等），只翻通用标签。
 */

export interface PageI18nRule {
  /** 生效范围选择器；多组用逗号 */
  scope: string;
  /**
   * 文本节点所在祖先若匹配此选择器则跳过。
   * 默认排除代码、编辑器、脚本自身 UI。
   */
  exclude?: string;
  /** 文本节点内容（trim 后精确匹配）→ 中文 */
  map?: Record<string, string>;
  /** 文本节点内容（trim 后以前缀匹配）→ 中文，如 verdict "Wrong answer on test 3" */
  prefixMap?: Record<string, string>;
  /** input/button 的 value 或文本（trim 后精确匹配）→ 中文 */
  values?: Record<string, string>;
  /** 正则替换：pattern → 替换（作用在每个文本节点 textContent 上，OJBetter subs 的原始格式） */
  replaceMap?: Record<string, string>;
  /** input/button 的正则替换（作用于 value 或文本内容） */
  replaceValues?: Record<string, string>;
}

/** 默认不翻译的祖先选择器：代码块、编辑器、我们脚本注入的 UI */
const DEFAULT_EXCLUDE =
  'pre, code, textarea, script, style, noscript, option, .cm-editor, .ace_editor, .MathJax, .tex-span, [class*="ojpp-"]:not([data-ojpp-site-content])';

interface OriginalText {
  before: string;
  after: string;
  value: boolean;
  children?: Node[];
}
const originals = new WeakMap<Document, Map<Node, OriginalText>>();

function translated(node: Node, next: string, value = false): void {
  const doc = node.ownerDocument!;
  let records = originals.get(doc);
  if (!records) originals.set(doc, records = new Map());
  const current = value ? (node as HTMLInputElement).value : node.textContent ?? '';
  if (current === next) return;
  let original = records.get(node);
  // A live site can reuse the same node for a different label.
  if (!original || current !== original.after) {
    original = { before: current, after: next, value,
      ...(node.nodeType === 1 && !value ? { children: [...node.childNodes] } : {}) };
    records.set(node, original);
  }
  original.after = next;
  if (value) (node as HTMLInputElement).value = next;
  else node.textContent = next;
}

/** 恢复仍由本地化逻辑持有的文本，不覆盖站点在此后更新的内容。 */
export function restorePageI18n(doc: Document): void {
  const records = originals.get(doc);
  if (!records) return;
  for (const [node, saved] of records) {
    const current = saved.value ? (node as HTMLInputElement).value : node.textContent;
    if (node.isConnected && current === saved.after) {
      if (saved.value) (node as HTMLInputElement).value = saved.before;
      else if (saved.children) (node as Element).replaceChildren(...saved.children);
      else node.textContent = saved.before;
    }
    if (node.nodeType === 1) (node as HTMLElement).removeAttribute('data-ojpp-i18n');
  }
  records.clear();
}

/**
 * 把 rules 应用到 doc。
 * 文本按单个文本节点匹配——一个元素里「Input + [Copy 钮]」这类
 * 文本和子元素混排的，只替换文本部分，不动子元素。
 */
export function applyPageI18n(doc: Document, rules: PageI18nRule[]): void {
  const records = originals.get(doc);
  if (records) for (const node of records.keys()) if (!node.isConnected) records.delete(node);
  for (const rule of rules) {
    const exclude = rule.exclude ?? DEFAULT_EXCLUDE;
    const prefixEntries = rule.prefixMap ? Object.entries(rule.prefixMap) : null;
    for (const scope of doc.querySelectorAll(rule.scope)) {
      if (rule.map || prefixEntries || rule.replaceMap) {
        const replaceEntries = rule.replaceMap ? Object.entries(rule.replaceMap) : null;
        const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        const hit: { node: Text; from: string; to: string }[] = [];
        const regexHit: { node: Text; pattern: string; to: string }[] = [];
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const parent = n.parentElement;
          if (!parent || parent.closest(exclude) || parent.dataset.ojppI18n === 'skip') continue;
          const text = n.textContent?.trim();
          if (!text) continue;
          if (replaceEntries) {
            for (const [pattern, to] of replaceEntries) {
              try {
                if (text.match(new RegExp(pattern))) {
                  regexHit.push({ node: n as Text, pattern, to });
                }
              } catch { /* 非法正则跳过 */ }
            }
          }
          // 剥掉菜单装饰前缀（→、»、▸ 渲染出的箭头），保留箭头只翻文本
          const arrow = /^[\u2192\u00bb\u25b8\u2794\u279C>\s]+\s*/.exec(text)?.[0] ?? '';
          const core = arrow ? text.slice(arrow.length).trim() : text;
          if (rule.map?.[core]) {
            hit.push({ node: n as Text, from: core, to: rule.map[core] });
            continue;
          }
          if (rule.map?.[text]) {
            hit.push({ node: n as Text, from: text, to: rule.map[text] });
            continue;
          }
          if (prefixEntries) {
            for (const [from, to] of prefixEntries) {
              const target = arrow ? core : text;
              if (target === from || target.startsWith(from + ' ') || target.startsWith(from + ',')) {
                hit.push({ node: n as Text, from, to });
                break;
              }
            }
          }
        }
        for (const { node, from, to } of hit) {
          translated(node, (node.textContent ?? '').replace(from, to));
        }
        for (const { node, pattern, to } of regexHit) {
          try {
            translated(node, (node.textContent ?? '').replace(new RegExp(pattern, 'g'), to));
          } catch { /* 非法正则跳过 */ }
        }
      }
      if (rule.values) {
        for (const el of [ ...(scope.matches('input, button') ? [scope as HTMLInputElement | HTMLButtonElement] : []), ...scope.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button') ]) {
          if (el.dataset.ojppI18n || el.closest(exclude)) continue;
          const v = (el.tagName === 'INPUT' ? (el as HTMLInputElement).value : el.textContent)?.trim() ?? '';
          if (v && rule.values[v]) {
            if (el.tagName === 'INPUT' && (el as HTMLInputElement).value) {
              translated(el, rule.values[v], true);
            } else {
              translated(el, rule.values[v]);
            }
            el.dataset.ojppI18n = '1';
          }
        }
      }
      if (rule.replaceValues) {
        for (const el of [ ...(scope.matches('input, button') ? [scope as HTMLInputElement | HTMLButtonElement] : []), ...scope.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button') ]) {
          if (el.closest(exclude)) continue;
          const raw = el.tagName === 'INPUT' ? (el as HTMLInputElement).value : el.textContent;
          if (!raw) continue;
          let v = raw;
          for (const [pattern, to] of Object.entries(rule.replaceValues)) {
            try {
              v = v.replace(new RegExp(pattern, 'g'), to);
            } catch { /* 非法正则跳过 */ }
          }
          if (v !== raw) {
            if (el.tagName === 'INPUT' && (el as HTMLInputElement).value) {
              translated(el, v, true);
            } else {
              translated(el, v);
            }
          }
        }
      }
    }
  }
}
