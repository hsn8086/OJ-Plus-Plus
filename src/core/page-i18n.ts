/**
 * 站点界面本地化：把站点自有的英文界面文本换成中文。
 * 只动文本节点与 input/button 的 value——
 * 不翻译专有名词（语言名、主题名等），只翻通用标签。
 */

export interface PageI18nRule {
  /** 生效范围选择器；多组用逗号 */
  scope: string;
  /** 文本节点内容（trim 后精确匹配）→ 中文 */
  map?: Record<string, string>;
  /** input/button 的 value 或文本（trim 后精确匹配）→ 中文 */
  values?: Record<string, string>;
}

/**
 * 把 rules 应用到 doc。
 * 文本按单个文本节点匹配——一个元素里「Input + [Copy 钮]」这类
 * 文本和子元素混排的，只替换文本部分，不动子元素。
 * 翻译过/跳过过的文本节点记 data 标记防止重复。
 */
export function applyPageI18n(doc: Document, rules: PageI18nRule[]): void {
  for (const rule of rules) {
    for (const scope of doc.querySelectorAll(rule.scope)) {
      if (rule.map) {
        const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        const hit: { node: Text; to: string }[] = [];
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const text = n.textContent?.trim();
          if (text && rule.map[text]) {
            hit.push({ node: n as Text, to: rule.map[text] });
          }
        }
        for (const { node, to } of hit) {
          node.textContent = node.textContent?.replace(node.textContent.trim(), to) ?? node.textContent;
        }
      }
      if (rule.values) {
        for (const el of scope.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')) {
          if (el.dataset.ojppI18n) continue;
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
