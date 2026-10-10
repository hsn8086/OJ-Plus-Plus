import { t } from '../i18n/index.ts';
import { atcoderEditor, atcoderLanguageContent, atcoderStatement } from './atcoder-editor.ts';
import { localizeAtcoder } from './atcoder-i18n.ts';
import { ATCODER_DARK } from './atcoder-styles.ts';
import type { ContentSection, SiteAdapter } from './types.ts';

export const atcoder: SiteAdapter = {
  id: 'atcoder', name: 'AtCoder', hosts: ['atcoder.jp'],
  editor: atcoderEditor,
  styles: `
    .navbar-right .ojpp-settings-btn { margin: 8px 6px; }
    #task-statement .ojpp-toolbar { font-size: 14px; }
    #task-statement .ojpp-result { white-space: normal; }
    .ojpp-editor-page .cm-scroller { min-height: 240px; }
    /* Keep the form fields and Cloudflare challenge, but remove duplicate task-page controls. */
    body:has(.ojpp-editor) form.form-code-submit > .form-group:has(#select-lang, #sourceCode),
    body:has(.ojpp-editor) form.form-code-submit button[type="submit"] { display: none !important; }
    /* On native editor pages CM6 owns editing; retain the actual submission textarea. */
    body:has(.ojpp-editor-page, .ojpp-editor) #editor, body:has(.ojpp-editor-page, .ojpp-editor) #plain-textarea,
    body:has(.ojpp-editor-page, .ojpp-editor) .btn-toggle-editor, body:has(.ojpp-editor-page, .ojpp-editor) #btn-customize,
    body:has(.ojpp-editor-page, .ojpp-editor) #btn-open-file { display: none !important; }
  `,
  darkStyles: ATCODER_DARK,
  collectSections(doc) {
    const sections: ContentSection[] = [];
    const root = atcoderStatement(doc);
    if (root) {
      for (const section of root.querySelectorAll<HTMLElement>('section')) {
        const heading = section.querySelector<HTMLElement>('h3');
        if (!heading || !section.textContent?.trim()) continue;
        const label = [...heading.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        // Sample input/output are copied verbatim; translate only explanatory prose below them.
        const sample = section.querySelector('pre[id^="pre-sample"]') || /^(Sample (Input|Output)|入力例|出力例|样例输入|样例输出)\s*\d+/.test(label);
        if (sample) {
          for (const paragraph of [...section.children].filter((e): e is HTMLElement => e instanceof HTMLElement && ['P', 'UL', 'OL'].includes(e.tagName))) {
            sections.push({ kind: 'output', label: t('section.note'), content: paragraph,
              toolbar: { anchor: paragraph, position: 'beforebegin', align: 'block-right' },
              result: { anchor: paragraph, position: 'afterend' } });
          }
          continue;
        }
        const kind = /^(Input|入力|输入)$/.test(label) ? 'input' : /^(Output|出力|输出)$/.test(label) ? 'output' : 'statement';
        const localizedLabel = /^(Constraints|制約|约束条件)$/.test(label) ? t('section.constraints')
          : kind === 'input' ? t('section.input') : kind === 'output' ? t('section.output')
            : /^(Problem Statement|問題文|题目描述)$/.test(label) ? t('section.statement') : label;
        sections.push({ kind, label: localizedLabel, content: section,
          toolbar: { anchor: heading, position: 'beforeend', align: 'right' },
          result: { anchor: section, position: 'afterend' } });
      }
      // Older Japanese-only tasks may have no <section> structure.
      if (!sections.length && !root.querySelector('section')) sections.push({
        kind: 'statement', label: t('section.statement'), content: root,
        toolbar: { anchor: root, position: 'beforebegin', align: 'block-right' }, result: { anchor: root, position: 'afterend' },
      });
    }
    const contest = doc.querySelector<HTMLElement>('#contest-statement');
    if (contest) {
      const content = atcoderLanguageContent(contest);
      if (content.textContent?.trim()) sections.push({
        kind: 'article', label: t('section.contest'), content,
        toolbar: { anchor: content, position: 'beforebegin', align: 'block-right' },
        result: { anchor: content, position: 'afterend' },
      });
    }
    const editorialSelector = /\/editorial\/\d+/.test(new URL(doc.URL).pathname)
      ? '#main-container h2 + hr + div:not(.clearfix)' : '#main-container .editorial';
    for (const content of doc.querySelectorAll<HTMLElement>(editorialSelector)) {
      if (!content.textContent?.trim()) continue;
      sections.push({ kind: 'solution', label: t('section.solution'), content,
        toolbar: { anchor: content, position: 'beforebegin', align: 'block-right' }, result: { anchor: content, position: 'afterend' } });
    }
    for (const content of doc.querySelectorAll<HTMLElement>('.blog-post')) {
      if (!content.textContent?.trim()) continue;
      const heading = content.parentElement?.querySelector<HTMLElement>('.post-heading h3');
      sections.push({ kind: 'article', label: t('section.blog'), content,
        toolbar: { anchor: heading ?? content, position: heading ? 'beforeend' : 'beforebegin', align: 'right' },
        result: { anchor: content, position: 'afterend' } });
    }
    return sections;
  },
  prepareContent(root) {
    root.querySelectorAll('.btn-copy, .div-btn-copy, .ojpp-toolbar, .ojpp-result').forEach(e => e.remove());
    // AtCoder renders <var> with KaTeX today; older pages use MathJax or raw TeX.
    for (const math of root.querySelectorAll<HTMLElement>('var, .katex-display, .katex')) {
      if (!root.contains(math)) continue;
      const tex = math.querySelector('annotation[encoding="application/x-tex"]')?.textContent ??
        (math.tagName === 'VAR' && !math.querySelector('.MathJax') ? math.textContent : null);
      if (tex === null) continue;
      const node = root.ownerDocument.createElement('span');
      const display = math.classList.contains('katex-display');
      node.setAttribute('data-ojpp-math', display ? 'display' : 'inline');
      node.textContent = tex;
      math.replaceWith(node);
    }
    for (const script of root.querySelectorAll<HTMLScriptElement>('script[type^="math/tex"]')) {
      const display = script.type.includes('mode=display');
      const span = root.ownerDocument.createElement('span');
      span.setAttribute('data-ojpp-math', display ? 'display' : 'inline');
      span.textContent = script.textContent;
      script.replaceWith(span);
    }
    root.querySelectorAll('.MathJax, .MathJax_Display, .MathJax_Preview').forEach(e => e.remove());
  },
  mountSettingsButton(button, doc) {
    const nav = doc.querySelector('.navbar-right');
    if (nav) {
      const li = doc.createElement('li');
      li.className = 'ojpp-settings-entry';
      li.append(button);
      nav.querySelector('.ojpp-settings-entry')?.remove();
      nav.insertBefore(li, nav.lastElementChild);
    } else doc.body.append(button);
  },
  observe(doc, onChange) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(records => {
      const relevant = records.some(record => {
        const el = record.target instanceof Element ? record.target : record.target.parentElement;
        return !el?.closest('[class*="ojpp-"], .ace_editor, .katex, .MathJax');
      });
      if (!relevant) return;
      clearTimeout(timer);
      timer = setTimeout(onChange, 120);
    });
    observer.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => { clearTimeout(timer); observer.disconnect(); };
  },
  i18nPage: localizeAtcoder,
};
