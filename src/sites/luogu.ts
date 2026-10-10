import { applyPageI18n } from '../core/page-i18n.ts';
import { mountNavSettings, observeSite, prepareMathContent } from './shared.ts';
import { LUOGU_DARK } from './luogu-styles.ts';
import type { ContentSection, SiteAdapter } from './types.ts';

const fields: Record<string, string> = {
  '题目背景': 'background', 'Background': 'background',
  '题目描述': 'description', 'Description': 'description', 'Problem Description': 'description',
  '输入格式': 'formatI', 'Input Format': 'formatI',
  '输出格式': 'formatO', 'Output Format': 'formatO',
  '说明/提示': 'hint', '说明 / 提示': 'hint', 'Hint': 'hint', 'Hints': 'hint',
};

/** Modern Luogu embeds the original Markdown, while rendered KaTeX omits MathML. */
export function luoguMarkdown(doc: Document, field: string): string | undefined {
  try {
    const context = JSON.parse(doc.querySelector('#lentille-context')?.textContent ?? '{}');
    const problem = context.data?.problem;
    const pid = /\/problem\/([^/?#]+)/.exec(new URL(doc.URL).pathname)?.[1];
    if (!pid || problem?.pid !== pid) return undefined;
    const source = problem.content?.[field];
    return typeof source === 'string' ? source : undefined;
  } catch { return undefined; }
}

const en: Record<string, string> = {
  '题目背景': 'Background', '题目描述': 'Description', '输入格式': 'Input Format',
  '输出格式': 'Output Format', '输入输出样例': 'Samples', '说明/提示': 'Hints',
  '题目列表': 'Problems', '提交答案': 'Submit', '提交记录': 'Submissions', '查看题解': 'Editorials',
  '题目反馈': 'Feedback', '标签': 'Tags', '显示算法标签': 'Show tags', '相关讨论': 'Discussions',
  '进入讨论版': 'Open discussions', '查看讨论': 'View discussions', '推荐题目': 'Recommended problems',
  '查看推荐': 'Show recommendations', '复制 Markdown': 'Copy Markdown', '复制': 'Copy',
  '展开': 'Expand', '进入 IDE 模式': 'Open IDE', '加入题单': 'Add to problem list', '复制题目': 'Copy problem',
  '题目编号': 'Problem ID', '提供者': 'Provider', '难度': 'Difficulty', '历史分数': 'Best score',
  '提交': 'Submissions', '通过': 'Accepted', '时间限制': 'Time limit', '内存限制': 'Memory limit',
  '个人中心': 'Profile', '用户设置': 'Settings', '练习情况': 'Practice', '我的题库': 'My problems',
  '我的专栏': 'My articles', '收藏夹': 'Bookmarks', '我的工单': 'Support tickets', '锁定': 'Lock', '登出': 'Sign out',
};

export const luogu: SiteAdapter = {
  id: 'luogu', name: '洛谷 / Luogu', hosts: ['www.luogu.com.cn', 'www.luogu.com'],
  darkStyles: LUOGU_DARK, preserveInlineColors: true,
  styles: '.user-nav > .ojpp-settings-btn { margin: 0 8px; } .ojpp-settings-floating { position: fixed; right: 18px; bottom: 18px; z-index: 1000; }',
  collectSections(doc) {
    const sections: ContentSection[] = [];
    for (const heading of doc.querySelectorAll<HTMLElement>('.l-card.problem > h2, .problem-content > h2')) {
      const label = [...heading.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      const key = fields[label];
      if (!key) continue;
      let content = heading.nextElementSibling as HTMLElement | null;
      while (content?.className.startsWith('ojpp-')) content = content.nextElementSibling as HTMLElement | null;
      if (!content?.matches('.lfe-marked-wrap, .marked, .markdown-body') || !content.textContent?.trim()) continue;
      sections.push({ kind: key === 'formatI' ? 'input' : key === 'formatO' ? 'output' : 'statement',
        label, content, identity: `${new URL(doc.URL).pathname}:${key}`, markdown: () => luoguMarkdown(doc, key),
        toolbar: { anchor: heading, position: 'beforeend', align: 'right' }, result: { anchor: content, position: 'afterend' } });
    }
    return sections;
  },
  prepareContent: prepareMathContent,
  mountSettingsButton(button, doc) { mountNavSettings(button, doc, '.user-nav:not(.rside), .nav-container'); },
  observe: observeSite,
  i18nPage(doc, locale) {
    if (locale !== 'en') return;
    applyPageI18n(doc, [{ scope: 'nav, .user-nav, header .stat, .l-card > h2, .l-card > h3, .problem-block-actions, .io-sample .header, .l-card .lfe-caption, .l-card > a', map: en }]);
  },
};
