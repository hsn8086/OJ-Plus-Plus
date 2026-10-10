import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateLocalRequest } from '../src/execution/validate.ts';
import { migrate } from '../src/core/config.ts';
import { localLanguageFor } from '../src/execution/languages.ts';

test('site language labels map to explicit local runtime families', () => {
  assert.equal(localLanguageFor({ id: '50', name: 'GNU C11', mode: 'cpp' }), 'c');
  assert.equal(localLanguageFor({ id: '54', name: 'GNU G++17', mode: 'cpp' }), 'cpp');
  assert.equal(localLanguageFor({ id: '1', name: 'Python (PyPy)', mode: 'python' }), 'python');
  assert.equal(localLanguageFor({ id: '2', name: 'Java', mode: 'java' }), undefined);
});

test('local runtime accepts only supported languages and bounds time/source/input', () => {
  const request = { language: 'cpp', code: 'int main(){}', input: '', timeoutMs: 5000 };
  assert.deepEqual(validateLocalRequest(request), request);
  assert.equal(validateLocalRequest({ ...request, timeoutMs: 999999 }).timeoutMs, 30000);
  assert.equal(validateLocalRequest({ ...request, timeoutMs: 1 }).timeoutMs, 100);
  assert.throws(() => validateLocalRequest(null));
  assert.throws(() => validateLocalRequest({ ...request, language: 'javascript' }));
  assert.throws(() => validateLocalRequest({ ...request, code: '界'.repeat(180000) }));
  assert.throws(() => validateLocalRequest({ ...request, input: 'x'.repeat(1024 * 1024 + 1) }));
});

test('local runtime settings migrate without affecting userscript site execution', () => {
  const settings = migrate({ editorBackend: { atcoder: 'local', codeforces: 'site', other: 'remote' }, localTimeoutMs: -1 });
  assert.deepEqual(settings.editorBackend, { atcoder: 'local', codeforces: 'site' });
  assert.equal(settings.localTimeoutMs, 100);
  assert.equal(migrate({ localTimeoutMs: NaN }).localTimeoutMs, 3000);
  assert.deepEqual(migrate(null).editorBackend, {});
});
