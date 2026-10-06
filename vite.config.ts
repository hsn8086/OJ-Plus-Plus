import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'NowcoderBetter',
        namespace: 'https://github.com/hsn8086/NowcoderBetter',
        version: pkg.version,
        description: '牛客竞赛增强：AI 题面翻译、Markdown 视图与一键复制',
        author: 'hsn8086',
        license: 'GPL-3.0',
        icon: 'https://www.nowcoder.com/favicon.ico',
        match: ['https://ac.nowcoder.com/*', 'https://www.nowcoder.com/*'],
        connect: ['*'],
        grant: [
          'GM_xmlhttpRequest',
          'GM_setValue',
          'GM_getValue',
          'GM_deleteValue',
          'GM_listValues',
          'GM_addStyle',
          'GM_setClipboard',
          'GM_registerMenuCommand',
        ],
        'run-at': 'document-idle',
      },
      build: {
        fileName: 'nowcoder-better.user.js',
        autoGrant: false,
      },
    }),
  ],
});
