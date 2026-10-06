import MarkdownIt from 'markdown-it';
import katex from 'katex';
import TurndownService from 'turndown';

/**
 * 流式模式：行内数学规则扫到末尾仍没找到收尾符时，
 * 把起始位置记到 unclosedMath，供 stabilizeMarkdown 判断这一帧是否完成。
 */
let streamingMode = false;
let unclosedMath: number[] = [];

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
    filter: (node) =>
      node.nodeName === 'SPAN' && (node as HTMLElement).hasAttribute('data-ojpp-math'),
    replacement: (_content, node) => {
      const latex = node.textContent ?? '';
      const delimiter = (node as HTMLElement).dataset.ojppMath === 'display' ? '$$' : '$';
      return `${delimiter}${latex}${delimiter}`;
    },
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

/**
 * 判断一个还没收尾的 $ 是否可能真的是公式。
 *
 * 只看开头的字符不够：$1,3,5,\cdots 以数字开头，但带 LaTeX 命令，是公式；
 * 价格 $5 到 $10 里两段都没有反斜杠、下标或上下标，是货币。
 * 所以判断依据是“有没有 LaTeX 语法特征”，而不是“第一个字符是什么”。
 */
function looksLikeLatex(text: string): boolean {
  const head = text.slice(0, 60);
  // 有 LaTeX 语法特征：命令、上下标、括号等
  if (/\\[a-zA-Z]+|[_^{}]|\\[(),;:]/.test(head)) return true;
  // 没有语法特征时，看开头：字母/符号开头多半是公式，数字开头是货币
  return !/^[\d\s]/.test(head);
}

/** markdown-it + $...$ / $$...$$ 数学公式 */
function mathPlugin(md: MarkdownIt): void {
  const inlineRule = (state: any, silent: boolean) => {
    const start = state.pos;
    if (state.src[start] !== '$') return false;
    const max = state.posMax;
    // $$...$$ 也可以出现在行内（如“复杂度是 $$O(n)$$，其中…”）
    const display = state.src[start + 1] === '$';
    const open = display ? 2 : 1;
    let pos = start + open;
    while (pos < max) {
      const ch = state.src[pos];
      if (ch === '\\') {
        pos += 2;
        continue;
      }
      if (ch === '\n') {
        // 行内公式不跨行；若已扫到行尾还没收尾，流式下记为未完成
        if (streamingMode && looksLikeLatex(state.src.slice(start + open))) {
          unclosedMath.push(start);
        }
        return false;
      }
      if (ch === '$') {
        // 行内公式不能跨过 $$ 的边界，否则会把 $$ 当成 $ 的收尾
        if (display) {
          if (state.src[pos + 1] !== '$') {
            pos += 1;
            continue;
          }
        } else if (state.src[pos + 1] === '$') {
          pos += 1;
          continue;
        }
        const content = state.src.slice(start + open, pos);
        if (!content.trim()) {
          pos += open;
          continue;
        }
        // $ 形式的公式首尾不能是空白，避免把“价格 $5 到 $10”当成公式。
        // 但要继续往后找，因为后面可能还有真正的公式；只有扫到末尾仍未收尾
        // 且这段内容看着像 LaTeX 时，才记为未完成。
        if (!display && /^\s|\s$/.test(content)) {
          pos += 1;
          continue;
        }
        if (silent) return true;
        const token = state.push('math_inline', 'math', 0);
        token.content = content;
        token.meta = { display };
        state.pos = pos + open;
        return true;
      }
      pos += 1;
    }
    // 扫到行尾或文本末尾还没找到收尾符。
    // 只有看起来真的像 LaTeX 才记为未完成，否则“价格从 $5 到 $10”
    // 这种会把整段文字切掉。
    if (streamingMode && looksLikeLatex(state.src.slice(start + open))) {
      unclosedMath.push(start);
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

  md.renderer.rules.math_inline = (tokens, idx) => {
    const display = tokens[idx].meta?.display === true;
    const html = render(tokens[idx].content, display);
    // 行内出现的 $$...$$ 单独成段，否则会和前后文字挤在一行
    return display ? `<p>${html}</p>\n` : html;
  };
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

/**
 * 流式渲染时，正文随时可能停在半个公式、半个代码块或半行上。
 *
 * 判定“未闭合”不能靠数 $ 个数或看渲染结果：
 *   - `用 \`$\` 表示美元` 里的 $ 在代码里，本来就该显示；
 *   - `价格从 $5 到 $10` 里的 $ 是货币，不是公式。
 * 这两种都会被启发式误判。所以公式用解析器级判定：
 * 流式模式下，行内规则扫到末尾仍没找到收尾符时，记下位置。
 */
export function stabilizeMarkdown(source: string): string {
  let text = source;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const cut = incompleteStart(text);
    if (cut === null) return text;
    const next = text.slice(0, cut);
    if (next === text) return text;
    text = next;
  }
  return text;
}

/** 返回最靠前的“未完成构造”的起始位置；没有则返回 null */
function incompleteStart(text: string): number | null {
  if (!text) return null;

  // 未闭合的围栏代码块：连开头的 ``` 一起隐去，等闭合后再显示
  const fences = [...text.matchAll(/^(?:`{3,}|~{3,})/gm)];
  if (fences.length % 2 === 1) return fences[fences.length - 1].index;

  // 未闭合的行内代码
  const ticks = [...text.matchAll(/(?<!`)`(?!`)/g)];
  if (ticks.length % 2 === 1) return ticks[ticks.length - 1].index;

  // 未闭合的公式：由解析器在流式模式下记录，而不是猜。
  // 行内规则不管 $$ 开头且内容还没成型的情况（如 “复杂度是 $$O(”），
  // 所以这里再直接找一下未配对的 $$。
  const doubles = [...text.matchAll(/\$\$/g)];
  if (doubles.length % 2 === 1) {
    return doubles[doubles.length - 1].index;
  }

  const positions: number[] = [];
  streamingMode = true;
  unclosedMath = [];
  try {
    md.render(text);
    positions.push(...unclosedMath);
  } finally {
    streamingMode = false;
    unclosedMath = [];
  }
  return positions.length ? Math.min(...positions) : null;
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
