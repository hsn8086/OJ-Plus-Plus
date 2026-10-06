import MarkdownIt from 'markdown-it';
import katex from 'katex';
import TurndownService from 'turndown';

function createTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });

  // 折叠块 / 无意义容器直接展开
  td.addRule('spoiler', {
    filter: (node) =>
      node.nodeName === 'DIV' &&
      /(spoiler|collapse|fold)/i.test((node as HTMLElement).className ?? ''),
    replacement: (content) => `\n\n${content}\n\n`,
  });

  // 代码块保留语言标注
  td.addRule('fencedCodeBlock', {
    filter: (node, options) =>
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild != null &&
      node.firstChild.nodeName === 'CODE',
    replacement: (_content, node, options) => {
      const code = node.firstChild as HTMLElement;
      const className = code.getAttribute('class') ?? '';
      const language = /language-(\S+)/.exec(className)?.[1] ?? '';
      const text = code.textContent ?? '';
      return `\n\n${options.fence}${language}\n${text.replace(/\n$/, '')}\n${options.fence}\n\n`;
    },
  });

  addGfmTables(td);
  td.addRule('strikethrough', {
    filter: (node) => ['DEL', 'S', 'STRIKE'].includes(node.nodeName),
    replacement: (content) => `~~${content}~~`,
  });

  // 站点适配器还原出的 LaTeX 不应被 Turndown 再次转义。
  td.addRule('math', {
    filter: (node) => node.nodeName === 'SPAN' && (node as HTMLElement).hasAttribute('data-ojpp-math'),
    replacement: (_content, node) => `$${node.textContent ?? ''}$`,
  });
  return td;
}

/** 精简版 GFM 表格规则，避免额外依赖 */
function addGfmTables(td: TurndownService): void {
  td.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: (content, node) => {
      const index = Array.prototype.indexOf.call(
        (node.parentNode as HTMLElement).childNodes,
        node,
      );
      const prefix = index === 0 ? '| ' : ' ';
      return `${prefix}${content.trim().replace(/\|/g, '\\|')} |`;
    },
  });

  td.addRule('tableRow', {
    filter: 'tr',
    replacement: (content, node) => {
      const parent = node.parentNode as HTMLElement;
      const isHeading =
        parent.nodeName === 'THEAD' ||
        (parent.nodeName === 'TABLE' &&
          (parent as HTMLTableElement).rows[0] === node);
      let out = `\n${content}\n`;
      if (isHeading) {
        const count = node.childNodes.length;
        out += `|${' --- |'.repeat(count)}\n`;
      }
      return out;
    },
  });

  td.addRule('table', {
    filter: 'table',
    replacement: (content) => `\n\n${content}\n\n`,
  });

  td.addRule('tableSection', {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: (content) => content,
  });
}

const turndown = createTurndown();

/** 站点预处理只作用于副本，页面 DOM 和事件监听保持原样。 */
export function htmlToMarkdown(node: HTMLElement, prepareContent: (root: HTMLElement) => void): string {
  const clone = node.cloneNode(true) as HTMLElement;
  prepareContent(clone);
  return turndown.turndown(clone).replace(/\n{3,}/g, '\n\n').trim();
}

/** markdown-it + $...$ / $$...$$ 数学公式 */
function mathPlugin(md: MarkdownIt): void {
  const inlineRule = (state: any, silent: boolean) => {
    const start = state.pos;
    if (state.src[start] !== '$') return false;
    if (state.src[start + 1] === '$') return false;
    const max = state.posMax;
    let pos = start + 1;
    while (pos < max) {
      const ch = state.src[pos];
      if (ch === '\\') {
        pos += 2;
        continue;
      }
      if (ch === '$') {
        if (state.src[pos + 1] === '$') {
          pos += 1;
          continue;
        }
        const content = state.src.slice(start + 1, pos);
        if (!content.trim() || /\s$/.test(content)) {
          pos += 1;
          continue;
        }
        if (silent) return true;
        const token = state.push('math_inline', 'math', 0);
        token.content = content;
        state.pos = pos + 1;
        return true;
      }
      if (ch === '\n') return false;
      pos += 1;
    }
    return false;
  };

  const blockRule = (state: any, startLine: number, endLine: number, silent: boolean) => {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(startPos, max).trim();
    if (!line.startsWith('$$')) return false;
    if (silent) return true;

    let content = line.slice(2);
    let nextLine = startLine;
    let closed = content.trimEnd().endsWith('$$');
    if (closed) {
      content = content.trimEnd().slice(0, -2);
    } else {
      while (++nextLine < endLine) {
        const pos = state.bMarks[nextLine] + state.tShift[nextLine];
        const lineMax = state.eMarks[nextLine];
        const text = state.src.slice(pos, lineMax);
        if (text.trimEnd().endsWith('$$')) {
          content += `\n${text.trimEnd().slice(0, -2)}`;
          closed = true;
          break;
        }
        content += `\n${text}`;
      }
    }
    if (!closed) return false;

    const token = state.push('math_block', 'math', 0);
    token.block = true;
    token.content = content.trim();
    token.map = [startLine, nextLine + 1];
    state.line = nextLine + 1;
    return true;
  };

  md.inline.ruler.before('escape', 'math_inline', inlineRule);
  md.block.ruler.before('fence', 'math_block', blockRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });

  const render = (latex: string, displayMode: boolean) => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return `<code>${escapeHtml(latex)}</code>`;
    }
  };

  md.renderer.rules.math_inline = (tokens, idx) =>
    render(tokens[idx].content, false);
  md.renderer.rules.math_block = (tokens, idx) =>
    `<p>${render(tokens[idx].content, true)}</p>\n`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
md.use(mathPlugin);

/** markdown → 安全 HTML（公式走 KaTeX） */
export function renderMarkdown(source: string): string {
  return md.render(source);
}

export const KATEX_CSS_URL = `https://cdn.jsdelivr.net/npm/katex@${katex.version}/dist/katex.min.css`;

let katexCssInjected = false;
/** 懒加载 KaTeX 样式；字体从 CDN 拉取，不塞进 userscript */
export function ensureKatexStyles(): void {
  if (katexCssInjected) return;
  katexCssInjected = true;
  if (document.querySelector('link[data-ojpp-katex]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = KATEX_CSS_URL;
  link.dataset.ojppKatex = '1';
  document.head.appendChild(link);
}
