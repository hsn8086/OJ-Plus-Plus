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
}

/** 默认不翻译的祖先选择器：代码块、编辑器、我们脚本注入的 UI */
const DEFAULT_EXCLUDE =
  'pre, code, textarea, script, style, noscript, option, .cm-editor, .ace_editor, .MathJax, .tex-span, [class*="ojpp-"]';

/**
 * 把 rules 应用到 doc。
 * 文本按单个文本节点匹配——一个元素里「Input + [Copy 钮]」这类
 * 文本和子元素混排的，只替换文本部分，不动子元素。
 */
export function applyPageI18n(doc: Document, rules: PageI18nRule[]): void {
  for (const rule of rules) {
    const exclude = rule.exclude ?? DEFAULT_EXCLUDE;
    const prefixEntries = rule.prefixMap ? Object.entries(rule.prefixMap) : null;
    for (const scope of doc.querySelectorAll(rule.scope)) {
      if (rule.map || prefixEntries) {
        const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        const hit: { node: Text; from: string; to: string }[] = [];
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const parent = n.parentElement;
          if (!parent || parent.closest(exclude) || parent.dataset.ojppI18n === 'skip') continue;
          const text = n.textContent?.trim();
          if (!text) continue;
          // 剥掉菜单装饰前缀（→、»、&raquo; 渲染出的箭头），保留箭头只翻文本
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
          node.textContent = node.textContent?.replace(from, to) ?? node.textContent;
        }
      }
      if (rule.values) {
        for (const el of scope.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')) {
          if (el.dataset.ojppI18n || el.closest(exclude)) continue;
          const v = (el.tagName === 'INPUT' ? (el as HTMLInputElement).value : el.textContent)?.trim() ?? '';
          if (v && rule.values[v]) {
            if (el.tagName === 'INPUT' && (el as HTMLInputElement).value) {
              (el as HTMLInputElement).value = rule.values[v];
            } else {
              el.textContent = rule.values[v];
            }
            el.dataset.ojppI18n = '1';
          }
        }
      }
    }
  }
}
