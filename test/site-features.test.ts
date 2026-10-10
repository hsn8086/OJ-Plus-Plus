import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultSettings, migrate, isAutoTranslateEnabled, isSiteFeatureEnabled } from '../src/core/config.ts';

test('site feature overrides are independent and legacy defaults remain enabled', () => {
  const settings = defaultSettings();
  assert.equal(isSiteFeatureEnabled(settings, 'qoj', 'translation'), true);
  settings.siteFeatures.qoj = { translation: false, darkMode: false };
  settings.autoTranslate = { '*': true };
  assert.equal(isAutoTranslateEnabled(settings, 'qoj'), false);
  assert.equal(isAutoTranslateEnabled(settings, 'luogu'), true);
  assert.equal(isSiteFeatureEnabled(settings, 'qoj', 'pageI18n'), true);
  assert.equal(isSiteFeatureEnabled(settings, 'luogu', 'darkMode'), true);
});

test('site feature migration retains only known boolean overrides', () => {
  const settings = migrate({ siteFeatures: {
    qoj: { translation: false, editor: true, darkMode: 'false', unknown: true },
    luogu: null, nowcoder: [],
  }, autoTranslate: true });
  assert.deepEqual(settings.siteFeatures, { qoj: { translation: false, editor: true } });
  assert.equal(isAutoTranslateEnabled(settings, 'nowcoder'), true);
  assert.deepEqual(migrate({ siteFeatures: null }).siteFeatures, {});
});
