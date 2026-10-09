import { t } from '../i18n/index.ts';
import { applyPageI18n } from '../core/page-i18n.ts';
import type { ContentSection, SiteAdapter } from './types.ts';

function equationFromImg(img: HTMLImageElement): string | null {
  const src = img.getAttribute('src') ?? '';
  const alt = img.getAttribute('alt')?.trim();
  if (alt && /equation|tex/i.test(src)) return alt;
  const match = /[?&]tex=([^&]+)/.exec(src);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * 牛客用公式做缩进（如 \hspace{15pt}），这些不是内容。
 * 不滤掉的话，它们会污染提示词，译文里也会冒出一堆空白公式。
 */
function isSpacingOnly(latex: string): boolean {
  return !latex
    .replace(/\\(hspace|hfill|quad|qquad|,|;|:|!)\s*(\{[^{}]*\})?/g, '')
    .replace(/[\s~]/g, '');
}

/** 牛客用 \hspace{23pt}\bullet\, 模拟列表项，转成 Markdown 列表标记。 */
function isBullet(latex: string): boolean {
  return /^\\(hspace\s*\{[^{}]*\})?\s*\\bullet\b/.test(latex.trim());
}

export const nowcoder: SiteAdapter = {
  id: 'nowcoder',
  get name() { return t('site.nowcoder'); },
  hosts: ['ac.nowcoder.com', 'www.nowcoder.com'],
  styles: `
    .ojpp-nowcoder-settings {
      display: inline-flex; align-items: center; margin-left: 8px;
    }
    .ojpp-nowcoder-settings .ojpp-icon-btn { color: #cfd3d8; }
    .ojpp-nowcoder-settings .ojpp-icon-btn:hover {
      background: rgba(255, 255, 255, .14); color: #fff;
    }
  `,

  collectSections(doc) {
    const sections: ContentSection[] = [];
    const add = (
      content: HTMLElement | null,
      heading: HTMLElement | null,
      kind: ContentSection['kind'],
      label: string,
    ) => {
      if (!content || !heading || !content.textContent?.trim()) return;
      sections.push({
        kind,
        label,
        content,
        toolbar: {
          anchor: heading,
          position: 'beforeend',
          // 标题行最右边：牛客的标题是块级元素，float 后不会撑高行高
          align: 'right',
        },
        result: { anchor: content, position: 'afterend' },
      });
    };

    add(
      doc.querySelector('.subject-question'),
      doc.querySelector('.subject-item-title'),
      'statement',
      t('section.statement'),
    );

    for (const heading of doc.querySelectorAll<HTMLElement>('.subject-describe > h2')) {
      const label = heading.textContent ?? '';
      if (!/描述/.test(label)) continue;
      let sibling = heading.nextElementSibling;
      while (sibling && sibling.tagName !== 'PRE' && sibling.tagName !== 'H2') {
        sibling = sibling.nextElementSibling;
      }
      if (sibling?.tagName !== 'PRE') continue;
      const isInput = /输入/.test(label);
      add(
        sibling as HTMLElement,
        heading,
        isInput ? 'input' : 'output',
        isInput ? t('section.input') : t('section.output'),
      );
    }

    // 示例块里的补充说明（“说明”“备注”“提示”等）和输入/输出并列，
    // 但它们在 .subject-describe > h2 之外，所以单独找。
    // 这些文字常常解释样例答案，不翻译会显得题面不完整。
    // 兄弟元素可能是 div.question-oi-cont，也可能直接是 pre，所以不依赖 class。
    for (const heading of doc.querySelectorAll<HTMLElement>('h2')) {
      const label = (heading.textContent ?? '').trim();
      if (!/^(说明|备注|提示|注意)/.test(label)) continue;
      const body = heading.nextElementSibling;
      if (!body || !body.textContent?.trim()) continue;
      // 示例块的“输入”“输出”各有自己的 pre，别重复收集
      if (body.querySelector('textarea')) continue;
      // 站点自带的标题文字直接用，它是题面原文的一部分
      add(body as HTMLElement, heading, 'output', label.replace(/[:：]\s*$/, ''));
    }

    for (const content of doc.querySelectorAll<HTMLElement>('div.nc-post-content')) {
      add(content, content, 'solution', t('section.solution'));
    }
    return sections;
  },

  prepareContent(root) {
    // 新版页面用 KaTeX 渲染，真正的 LaTeX 在 annotation[encoding="application/x-tex"] 里。
    // 不处理的话，Turndown 会把 katex-mathml 和 katex-html 两份文本一起抓下来。
    for (const katex of root.querySelectorAll<HTMLElement>('.katex')) {
      const tex = katex
        .querySelector('annotation[encoding="application/x-tex"]')
        ?.textContent?.trim();
      if (!tex) continue;
      const wrapper = katex.parentElement;
      const display = wrapper?.classList.contains('katex-display') ?? false;
      const target = display && wrapper ? wrapper : katex;
      if (isSpacingOnly(tex)) {
        target.remove();
        continue;
      }
      const math = root.ownerDocument.createElement('span');
      if (isBullet(tex)) {
        // 列表标记不能进公式，否则 KaTeX 会渲染成孤立的圆点。
        // 也不用 "- "：Turndown 会把行首的减号转义成 \- ，这里用真正的项目符号。
        math.textContent = '• ';
        target.replaceWith(math);
        continue;
      }
      math.setAttribute('data-ojpp-math', display ? 'display' : 'inline');
      math.textContent = tex;
      target.replaceWith(math);
    }

    // 旧版页面把公式渲染成 <img src=".../equation?tex=...">。
    for (const img of root.querySelectorAll('img')) {
      const latex = equationFromImg(img);
      if (latex === null) continue;
      const math = root.ownerDocument.createElement('span');
      math.setAttribute('data-ojpp-math', 'inline');
      math.textContent = latex;
      img.replaceWith(math);
    }

    // 牛客输入/输出描述使用 pre 排版正文，不应被当成 Markdown 代码块。
    if (root.tagName === 'PRE' && !root.querySelector('code')) {
      const paragraph = root.ownerDocument.createElement('div');
      paragraph.innerHTML = root.innerHTML;
      root.replaceChildren(paragraph);
    }
  },

  mountSettingsButton(button, doc) {
    const header = doc.querySelector('.header-right') ?? doc.querySelector('.header-bar');
    if (header) {
      const host = doc.createElement('span');
      host.className = 'ojpp-nowcoder-settings';
      if (header.matches('.header-bar')) host.style.marginLeft = 'auto';
      host.append(button);
      header.append(host);
    } else {
      button.classList.add('ojpp-settings-floating');
      doc.body.append(button);
    }
  },

  observe(doc, onChange) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (timer !== undefined) return;
      timer = setTimeout(() => {
        timer = undefined;
        onChange();
      }, 100);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(doc.body, { childList: true, subtree: true });
    const onClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('.more-unfold, .js-full-question, .js-small-question')
      ) {
        schedule();
      }
    };
    doc.addEventListener('click', onClick);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      doc.removeEventListener('click', onClick);
    };
  },

  i18nPage(doc, locale) {
    // 牛客界面本来就中文；这里只兜少数漏网英文（ide/提交区）
    if (locale !== 'zh') return;
    applyPageI18n(doc, [
      {
        scope: '.question-ide, .submit-box, .nc-post-content',
        map: {
          'Run': '运行',
          'Submit': '提交',
          'Reset': '重置',
          'Editor': '编辑器',
          'Sample': '样例',
        },
        values: {
          'Run': '运行',
          'Submit': '提交',
          'Submit code': '提交代码',
        },
      },
    ]);
  },
};
