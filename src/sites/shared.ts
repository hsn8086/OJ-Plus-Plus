export function prepareMathContent(root: HTMLElement): void {
  root.querySelectorAll('[class*="ojpp-"], .btn-copy, .copy-btn').forEach(e => e.remove());
  const math = (tex: string, display: boolean) => {
    const span = root.ownerDocument.createElement('span');
    span.dataset.ojppMath = display ? 'display' : 'inline';
    span.textContent = tex;
    return span;
  };
  for (const script of root.querySelectorAll<HTMLScriptElement>('script[type^="math/tex"]')) {
    script.replaceWith(math(script.textContent ?? '', script.type.includes('mode=display')));
  }
  for (const katex of root.querySelectorAll<HTMLElement>('.katex')) {
    const tex = katex.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
    if (tex == null) continue;
    const display = katex.parentElement?.classList.contains('katex-display') ?? false;
    (display ? katex.parentElement! : katex).replaceWith(math(tex, display));
  }
  root.querySelectorAll('.MathJax, .MathJax_Display, .MathJax_SVG, .MathJax_SVG_Display, .MathJax_Preview').forEach(e => e.remove());
  // HTML statements can still contain raw TeX while MathJax is loading.
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (!node.parentElement?.closest('pre,code,script,style,[data-ojpp-math],.katex')) texts.push(node as Text);
  }
  for (const text of texts) {
    const value = text.data;
    const pattern = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
    const matches = [...value.matchAll(pattern)];
    if (!matches.length) continue;
    const fragment = root.ownerDocument.createDocumentFragment();
    let start = 0;
    for (const match of matches) {
      fragment.append(value.slice(start, match.index));
      fragment.append(math(match[1] ?? match[2] ?? match[3] ?? match[4], match[1] != null || match[4] != null));
      start = match.index! + match[0].length;
    }
    fragment.append(value.slice(start));
    text.replaceWith(fragment);
  }
}

export function observeSite(doc: Document, onChange: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(onChange, 100); };
  const observer = new MutationObserver(records => {
    if (records.some(r => {
      const el = r.target instanceof Element ? r.target : r.target.parentElement;
      return !el?.closest('[class*="ojpp-"], .CodeMirror, .cm-editor, .ace_editor, .monaco-editor, .katex, .MathJax, .MathJax_SVG');
    })) schedule();
  });
  observer.observe(doc.body, { subtree: true, childList: true, characterData: true });
  doc.defaultView?.addEventListener('popstate', schedule);
  doc.defaultView?.addEventListener('hashchange', schedule);
  return () => {
    clearTimeout(timer); observer.disconnect();
    doc.defaultView?.removeEventListener('popstate', schedule);
    doc.defaultView?.removeEventListener('hashchange', schedule);
  };
}

export function mountNavSettings(button: HTMLButtonElement, doc: Document, selector: string): void {
  const nav = doc.querySelector<HTMLElement>(selector);
  if (nav) {
    if (nav.tagName === 'UL') {
      let slot = nav.querySelector<HTMLElement>(':scope > .ojpp-settings-slot');
      if (!slot) { slot = doc.createElement('li'); slot.className = 'ojpp-settings-slot'; nav.prepend(slot); }
      slot.append(button);
    } else nav.prepend(button);
  } else {
    button.classList.add('ojpp-settings-floating');
    doc.body.append(button);
  }
}
