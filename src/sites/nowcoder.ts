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

export const nowcoder: SiteAdapter = {
  id: 'nowcoder',
  name: '牛客',
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
          position: kind === 'solution' ? 'beforebegin' : 'beforeend',
        },
        result: { anchor: content, position: 'afterend' },
      });
    };

    add(
      doc.querySelector('.subject-question'),
      doc.querySelector('.subject-item-title'),
      'statement',
      '题目描述',
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
        isInput ? '输入描述' : '输出描述',
      );
    }

    for (const content of doc.querySelectorAll<HTMLElement>('div.nc-post-content')) {
      add(content, content, 'solution', '题解');
    }
    return sections;
  },

  prepareContent(root) {
    for (const img of root.querySelectorAll('img')) {
      const latex = equationFromImg(img);
      if (latex === null) continue;
      const math = root.ownerDocument.createElement('span');
      math.setAttribute('data-ojpp-math', '');
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
};
