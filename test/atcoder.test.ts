import assert from 'node:assert/strict';
import { test } from 'node:test';
import { atcoderContest, atcoderLanguageMode, parseAtcoderResult } from '../src/sites/atcoder-editor.ts';

test('AtCoder contest identity and language modes do not depend on changing language IDs', () => {
  assert.equal(atcoderContest('/contests/abc350/tasks/abc350_a'), 'abc350');
  assert.equal(atcoderContest('/contests/'), null);
  assert.equal(atcoderLanguageMode('C++23 (GCC 15.2.0)'), 'cpp');
  assert.equal(atcoderLanguageMode('Python (PyPy 3.11)'), 'python');
  assert.equal(atcoderLanguageMode('Java 24 (OpenJDK 24)'), 'java');
  assert.equal(atcoderLanguageMode('JavaScript (Node.js)'), 'text');
});

test('AtCoder result parser distinguishes idle, pending, success, and runtime failure', () => {
  const result = { Id: 78106832, Status: 3, ExitCode: 0, TimeConsumption: '10 ms', MemoryConsumption: '8964 KiB' };
  assert.equal(parseAtcoderResult({}), null);
  assert.equal(parseAtcoderResult({ Result: { ...result, Id: 0 } }), null);
  assert.equal(parseAtcoderResult({ Result: { ...result, Status: 2 } }), null);
  assert.equal(parseAtcoderResult({ Result: result, Interval: 1000 }), null);
  assert.deepEqual(parseAtcoderResult({ Result: result, Stdout: 'Yes\r\n' }), {
    output: 'Yes\n', verdict: 'OK', used: '10 ms, 8964 KiB',
  });
  assert.equal(parseAtcoderResult({ Result: { ...result, ExitCode: 1 }, Stderr: 'Traceback' })?.error, 'Traceback');
  assert.equal(parseAtcoderResult({ Result: { ...result, Status: 4 }, Stderr: 'compile error' })?.verdict, 'ERROR');
});
