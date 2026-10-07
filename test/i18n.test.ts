import assert from 'node:assert/strict';
import { test } from 'node:test';
import { en } from '../src/i18n/en.ts';
import { zh } from '../src/i18n/zh.ts';
import { getLocale, onLocaleChange, resolveLocale, setLocale, t } from '../src/i18n/index.ts';
import { resolveTheme } from '../src/ui/theme.ts';

test('两个语言目录的键完全一致', () => {
  const zhKeys = Object.keys(zh).sort();
  const enKeys = Object.keys(en).sort();
  // 缺键会让界面在英文下漏出中文，多键说明删文案时没同步
  assert.deepEqual(enKeys, zhKeys, 'en.ts 与 zh.ts 的键集合必须一致');
});

test('占位符在两个语言里都保持原样', () => {
  const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
  for (const key of Object.keys(zh) as (keyof typeof zh)[]) {
    assert.deepEqual(
      placeholders(en[key]),
      placeholders(zh[key]),
      `${key} 的占位符不一致：zh=${zh[key]} en=${en[key]}`,
    );
  }
});

test('t() 替换占位符，缺参时保留原样', () => {
  setLocale('zh');
  assert.equal(t('app.settingsSaved'), '设置已保存');
  assert.equal(t('toolbar.retry', { message: '超时' }), '重试：超时');
  // 少传参数时不要把 {x} 变成 undefined
  assert.equal(t('toolbar.retry'), '重试：{message}');
});

test('界面语言：auto 跟随浏览器，非中文一律回退英文', () => {
  assert.equal(resolveLocale('zh'), 'zh');
  assert.equal(resolveLocale('en'), 'en');
  assert.equal(resolveLocale('auto', ['zh-CN', 'en']), 'zh');
  assert.equal(resolveLocale('auto', ['zh-Hant']), 'zh');
  // 日文等未支持语言回退英文，避免出现半截中文
  assert.equal(resolveLocale('auto', ['ja-JP']), 'en');
  assert.equal(resolveLocale('auto', []), 'en');
});

test('setLocale 会通知订阅者，重复设置同一语言不重复通知', () => {
  setLocale('zh');
  const seen: string[] = [];
  const stop = onLocaleChange((locale) => seen.push(locale));
  setLocale('en');
  // 同一个语言重复设置不应再次通知，否则会引发多余重绘
  setLocale('en');
  setLocale('zh');
  stop();
  // 取消订阅后不再收到通知
  setLocale('en');
  assert.deepEqual(seen, ['en', 'zh'], `应只在真正变化时通知: ${seen.join(',')}`);
  setLocale('zh');
  assert.equal(getLocale(), 'zh');
});

test('主题：auto 跟随系统，显式值原样返回', () => {
  assert.equal(resolveTheme('light'), 'light');
  assert.equal(resolveTheme('dark'), 'dark');
  // 测试环境没有 matchMedia 时按浅色处理
  assert.equal(resolveTheme('auto'), 'light');
});
