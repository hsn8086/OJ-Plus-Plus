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
    if (locale === 'en') {
      // 目标语言英文：把牛客中文界面翻成英文
      applyPageI18n(doc, [
        {
          scope: 'body',
          map: NC_I18N_EN,
          prefixMap: NC_I18N_EN_PREFIX,
          values: NC_I18N_EN_VALUES,
        },
      ]);
      return;
    }
    if (locale !== 'zh') return;
    // 牛客界面本来就中文；只兜少数漏网英文
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

/** 牛客界面文本 → 英文（目标语言=en 时）。 */
const NC_I18N_EN: Record<string, string> = {
  // 题目页
  '输入': 'Input',
  '输出': 'Output',
  '输入描述:': 'Input description:',
  '输入描述：': 'Input description:',
  '输出描述:': 'Output description:',
  '输出描述：': 'Output description:',
  '说明': 'Note',
  '示例': 'Example',
  '示例1': 'Example 1',
  '复制': 'Copy',
  '题目描述': 'Problem description',
  '题目纠错': 'Report error',
  '返回全部题目': 'All problems',
  '比赛主页': 'Contest home',
  '我的提交': 'My submissions',
  '提交记录': 'Submissions',
  '题解': 'Solutions',
  '讨论': 'Discussions',
  '只看题目内容': 'Problem only',
  '做题遇到困难？': 'Stuck?',
  '查看编程常见问题': 'FAQ',
  '查看语言环境详情': 'Environment details',
  // IDE
  '在线IDE': 'Online IDE',
  '自测输入': 'Test input',
  '自测运行': 'Test run',
  '自测输入输出': 'Test I/O',
  '运行结果': 'Result',
  '提交': 'Submit',
  '保存并提交': 'Save & Submit',
  '运行': 'Run',
  '重置': 'Reset',
  '主题': 'Theme',
  '字体大小': 'Font size',
  '键位绑定': 'Key bindings',
  '编辑器快捷键': 'Editor shortcuts',
  '代码右缩进': 'Indent right',
  '代码左缩进': 'Indent left',
  '代码自动补全': 'Auto complete',
  '行注释': 'Line comment',
  '撤销': 'Undo',
  '通用': 'General',
  '快速加载复制代码': 'Load template',
  '快速加载最优代码': 'Load best code',
  '检测': 'Check',
  '函数方法参数文档提示': 'Parameter hints',
  '剪切': 'Cut',
  '2个空格': '2 spaces',
  '4个空格': '4 spaces',
  '8个空格': '8 spaces',
  // 判定
  '已通过': 'Accepted',
  '答案错误': 'Wrong Answer',
  '编译错误': 'Compile Error',
  '运行错误': 'Runtime Error',
  '超出时间限制': 'Time Limit Exceeded',
  '超出内存限制': 'Memory Limit Exceeded',
  '等待评测': 'Pending',
  '评测中': 'Judging',
  '部分通过': 'Partial',
  // 导航与通用
  '竞赛': 'Contests',
  '题库': 'Problems',
  '课程': 'Courses',
  '求职': 'Jobs',
  '登录': 'Login',
  '注册': 'Register',
  '登出': 'Logout',
  '搜索': 'Search',
  '设置': 'Settings',
  '难度': 'Difficulty',
  '通过率': 'Acceptance',
  '标签': 'Tags',
  '上一题': 'Previous',
  '下一题': 'Next',
  '收藏': 'Favorite',
  '分享': 'Share',
  '默认': 'Default',
  '牛客经典': 'Nowcoder Classic',
  '列表加载中...': 'Loading...',
  '列表加载中…': 'Loading…',
  '加大': 'Bigger',
  '更大': 'Bigger',
  '大': 'Large',
  '小': 'Small',
  '中': 'Medium',
  '编辑器设置': 'Editor settings',
  '牛客网': 'Nowcoder',
  '比赛': 'Contest',
  '练习': 'Practice',
};

const NC_I18N_EN_PREFIX: Record<string, string> = {
  '载入示例': 'Load sample',
  '加载中': 'Loading',
  '列表加载中': 'Loading',
};

const NC_I18N_EN_VALUES: Record<string, string> = {
  '提交': 'Submit',
  '运行': 'Run',
  '保存并提交': 'Save & Submit',
  '重置': 'Reset',
};
