import assert from 'node:assert/strict';
import { test } from 'node:test';
import { themePreference } from '../src/ui/theme-start.ts';

test('early theme respects explicit theme and per-site dark-mode overrides', () => {
  assert.deepEqual(themePreference(undefined, 'luogu'), { theme: 'auto', enabled: true });
  const settings = { theme: 'dark', siteFeatures: { luogu: { darkMode: false } } };
  assert.deepEqual(themePreference(settings, 'luogu'), { theme: 'dark', enabled: false });
  assert.deepEqual(themePreference(settings, 'codeforces'), { theme: 'dark', enabled: true });
  assert.deepEqual(themePreference({ theme: 'invalid' }, 'luogu'), { theme: 'auto', enabled: true });
});
