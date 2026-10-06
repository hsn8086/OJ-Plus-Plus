import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json' with { type: 'json' };
import { APP_NAME, REPOSITORY } from './src/brand.ts';
import { siteMatches } from './src/sites/index.ts';

const downloadURL = `${REPOSITORY.replace('github.com', 'raw.githubusercontent.com')}/main/dist/oj-plus-plus.user.js`;

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/entries/userscript.ts',
      userscript: {
        name: APP_NAME,
        namespace: REPOSITORY,
        version: pkg.version,
        description: 'OJ-Plus-Plus：AI 题面翻译、Markdown 视图与一键复制',
        author: 'hsn8086',
        license: 'GPL-3.0',
        homepageURL: REPOSITORY,
        supportURL: `${REPOSITORY}/issues`,
        downloadURL,
        updateURL: downloadURL,
        match: siteMatches,
        connect: ['*'],
        grant: ['GM_xmlhttpRequest', 'GM_getValue', 'GM_setValue', 'GM_setClipboard'],
        'run-at': 'document-idle',
      },
      build: { fileName: 'oj-plus-plus.user.js', autoGrant: false },
    }),
  ],
});
