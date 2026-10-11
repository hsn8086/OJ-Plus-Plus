import { LOCAL_LANGUAGES } from '../execution/languages.ts';
import { t } from '../i18n/index.ts';
import { applyPageI18n } from '../core/page-i18n.ts';
import { mountNavSettings, observeSite, prepareMathContent } from './shared.ts';
import { QOJ_DARK } from './qoj-styles.ts';
import type { ContentSection, SiteAdapter } from './types.ts';

const pdfJobs = new WeakMap<Document, Map<string, { text?: string; samples?: string; error?: string }>>();
const notify = new WeakMap<Document, () => void>();

function pdfSection(doc: Document): ContentSection | null {
  const frame = doc.querySelector<HTMLIFrameElement>('#statements-pdf');
  if (!frame || new URL(frame.src, doc.URL).origin !== new URL(doc.URL).origin) return null;
  let jobs = pdfJobs.get(doc);
  if (!jobs) pdfJobs.set(doc, jobs = new Map());
  let job = jobs.get(frame.src);
  if (!job) {
    job = {};
    jobs.set(frame.src, job);
    const pending = job;
    void import('./pdf-text.ts').then(async module => {
      const text = await module.extractPDFText(frame.src);
      const { statement, samples } = module.splitPdfSamples(text);
      pending.text = statement;
      pending.samples = samples;
      notify.get(doc)?.();
    }).catch(error => {
      pending.error = String(error);
      console.warn('[OJ++] QOJ PDF text extraction:', error);
    });
  }
  if (!job.text) return null;
  let content = doc.querySelector<HTMLDetailsElement>('.ojpp-qoj-pdf-text');
  if (content && content.dataset.url !== frame.src) { content.remove(); content = null; }
  if (!content) {
    content = doc.createElement('details');
    content.className = 'ojpp-qoj-pdf-text';
    content.dataset.url = frame.src;
    const summary = doc.createElement('summary');
    summary.textContent = t('site.pdfText');
    const pre = doc.createElement('pre');
    pre.textContent = job.text;
    content.append(summary, pre);
    frame.after(content);
  }
  const text = job.text;
  const samples = job.samples;
  return { kind: 'statement', label: t('section.statement'), content, ownedContent: true,
    identity: frame.src, markdown: () => text, pdf: true, pdfSamples: samples,
    images: () => import('./pdf-text.ts').then(m => m.renderPDFImages(frame.src)),
    toolbar: { anchor: content, position: 'beforebegin', align: 'block-right' },
    result: { anchor: content, position: 'afterend' } };
}

const zh: Record<string, string> = {
  'Contests': '比赛', 'Category': '分类', 'Problems': '题库', 'Submissions': '提交记录', 'Blogs': '博客',
  'Statement': '题面', 'Languages': '语言', 'Submit': '提交', 'Custom Test': '自定义测试',
  'Discussions & Issues': '讨论与问题', 'Statistics': '统计', 'Logout': '退出登录', 'Login': '登录',
  'Register': '注册', 'Search': '搜索', 'Time Limit:': '时间限制：', 'Memory Limit:': '内存限制：',
  'Total points:': '总分：', 'Difficulty:': '难度：', '[show]': '[显示]', 'Rank': '排名',
  'Score': '分数', 'Time': '用时', 'Memory': '内存', 'User': '用户', 'Problem': '题目',
  'Submission Time': '提交时间', 'Result': '结果', 'Language': '语言', 'Source Code': '源代码',
  'Input': '输入', 'Output': '输出', 'Sample Input': '样例输入', 'Sample Output': '样例输出',
  'Input Format': '输入格式', 'Output Format': '输出格式', 'Constraints': '约束条件',
  'Prev': '上一页', 'Next': '下一页', 'Previous': '上一页', 'Standings': '排行榜',
  'use advanced editor': '使用高级编辑器', 'Text Editor': '文本编辑器', 'Upload File': '上传文件',
};

export const qoj: SiteAdapter = {
  id: 'qoj', name: 'QOJ', hosts: ['qoj.ac'], darkStyles: QOJ_DARK, preserveInlineColors: true,
  styles: '.ojpp-qoj-pdf-text pre { white-space: pre-wrap; max-height: 400px; overflow: auto; } .ojpp-settings-floating { position: fixed; right: 18px; bottom: 18px; z-index: 1000; }',
  collectSections(doc) {
    const sections: ContentSection[] = [];
    for (const content of doc.querySelectorAll<HTMLElement>('.uoj-article')) {
      if (!content.textContent?.trim() || content.closest('#tab-submit-answer, #tab-custom-test')) continue;
      sections.push({ kind: /\/problem\//.test(new URL(doc.URL).pathname) ? 'statement' : 'article',
        label: t('section.statement'), content, identity: new URL(doc.URL).pathname,
        toolbar: { anchor: content, position: 'beforebegin', align: 'block-right' },
        result: { anchor: content, position: 'afterend' } });
    }
    const pdf = pdfSection(doc);
    if (pdf) sections.push(pdf);
    return sections;
  },
  editor: {
    localOnly: true, languages: LOCAL_LANGUAGES,
    editorMountPoint(doc) { const anchor = doc.querySelector<HTMLElement>('#tab-statement'); return anchor ? { anchor, position: 'beforeend' } : null; },
    problemCode(doc) { return /\/problem\/(\d+)/.exec(new URL(doc.URL).pathname)?.[1] ?? null; },
    getSamples(doc) {
      const inputs: string[] = [], outputs: string[] = [];
      for (const heading of doc.querySelectorAll('.uoj-article h3, .uoj-article h4')) {
        const label = heading.textContent?.trim() ?? '';
        const target = /^(Sample Input|样例输入|输入样例)/i.test(label) ? inputs : /^(Sample Output|样例输出|输出样例)/i.test(label) ? outputs : null;
        if (!target) continue;
        let next = heading.nextElementSibling;
        while (next && !/^H[1-4]$/.test(next.tagName)) {
          const pre = next.matches('pre') ? next : next.querySelector('pre');
          if (pre) { target.push(pre.textContent ?? ''); break; }
          next = next.nextElementSibling;
        }
      }
      return inputs.slice(0, outputs.length).map((input, i) => ({ input, output: outputs[i] }));
    },
  },
  prepareContent: prepareMathContent,
  mountSettingsButton(button, doc) { mountNavSettings(button, doc, '.navbar-nav, .uoj-header .float-right'); },
  observe(doc, onChange) {
    notify.set(doc, onChange);
    const stop = observeSite(doc, onChange);
    return () => { notify.delete(doc); stop(); };
  },
  i18nPage(doc, locale) {
    if (locale !== 'zh') return;
    applyPageI18n(doc, [{ scope: '.navbar, .nav, .pagination, .uoj-content label, .uoj-content th, .uoj-content button, .uoj-content .btn, .uoj-content h3, .uoj-content h4', map: zh }]);
  },
};
