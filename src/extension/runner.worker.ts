import { WASI, type WASIFS } from '@runno/wasi';
import type { LocalRunRequest, LocalRunResult } from '../execution/types.ts';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const outputLimit = 1024 * 1024;
const file = (path: string, content: Uint8Array) => ({ path, content, mode: 'binary' as const,
  timestamps: { access: new Date(0), modification: new Date(0), change: new Date(0) } });

async function asset(name: string): Promise<Uint8Array> {
  const response = await fetch(new URL(`runtimes/${name}`, location.href));
  if (!response.ok) throw new Error(`Missing packaged runtime: ${name}`);
  return new Uint8Array(await response.arrayBuffer());
}

async function filesystem(name: string): Promise<WASIFS> {
  const compressed = await asset(name);
  const stream = new Blob([new Uint8Array(compressed)]).stream().pipeThrough(new DecompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  const fs: WASIFS = {};
  const text = (at: number, length: number) => decoder.decode(bytes.subarray(at, at + length)).split('\0')[0];
  for (let at = 0; at + 512 <= bytes.length; ) {
    const name = text(at, 100);
    if (!name) break;
    const prefix = text(at + 345, 155);
    const size = parseInt(text(at + 124, 12).trim() || '0', 8);
    if (!Number.isFinite(size) || size < 0 || at + 512 + size > bytes.length) throw new Error('Invalid runtime archive');
    const type = text(at + 156, 1);
    const path = '/' + (prefix ? `${prefix}/${name}` : name).replace(/^\.\//, '');
    if (path.split('/').includes('..')) throw new Error('Invalid archive path');
    if (type === '0' || !type) fs[path] = file(path, bytes.slice(at + 512, at + 512 + size));
    else if (type !== '5') throw new Error(`Unsupported archive entry: ${type}`);
    at += 512 + Math.ceil(size / 512) * 512;
  }
  return fs;
}

async function execute(binary: Uint8Array, args: string[], fs: WASIFS, input = '') {
  const wasi = new WASI({ args, fs, env: { LANG: 'C.UTF-8', PYTHONHASHSEED: '0' }, isTTY: false });
  const imports = wasi.getImportObject();
  const stdin = encoder.encode(input);
  let inputOffset = 0;
  let count = 0;
  let stdout = '';
  let stderr = '';
  const outDecoder = new TextDecoder();
  const errDecoder = new TextDecoder();
  for (const bindings of Object.values(imports)) {
    const originalRead = bindings.fd_read;
    const originalWrite = bindings.fd_write;
    bindings.fd_read = (fd: number, iovs: number, length: number, read: number) => {
      if (fd !== 0) return originalRead(fd, iovs, length, read);
      const memory = new DataView(wasi.memory.buffer);
      let total = 0;
      for (let i = 0; i < length; i++) {
        const ptr = memory.getUint32(iovs + i * 8, true);
        const size = Math.min(memory.getUint32(iovs + i * 8 + 4, true), stdin.length - inputOffset);
        new Uint8Array(wasi.memory.buffer, ptr, size).set(stdin.subarray(inputOffset, inputOffset + size));
        inputOffset += size; total += size;
      }
      memory.setUint32(read, total, true);
      return 0;
    };
    bindings.fd_write = (fd: number, iovs: number, length: number, written: number) => {
      if (fd !== 1 && fd !== 2) return originalWrite(fd, iovs, length, written);
      const memory = new DataView(wasi.memory.buffer);
      let total = 0;
      for (let i = 0; i < length; i++) {
        const ptr = memory.getUint32(iovs + i * 8, true);
        const size = memory.getUint32(iovs + i * 8 + 4, true);
        count += size;
        if (count > outputLimit) throw new Error('OUTPUT_LIMIT_EXCEEDED');
        const bytes = new Uint8Array(wasi.memory.buffer, ptr, size);
        if (fd === 1) stdout += outDecoder.decode(bytes, { stream: true });
        else stderr += errDecoder.decode(bytes, { stream: true });
        total += size;
      }
      memory.setUint32(written, total, true);
      return 0;
    };
  }
  const module = await WebAssembly.compile(new Uint8Array(binary));
  const instance = await WebAssembly.instantiate(module, imports);
  const start = performance.now();
  const result = wasi.start({ module, instance });
  stdout += outDecoder.decode(); stderr += errDecoder.decode();
  return { ...result, stdout, stderr, elapsed: performance.now() - start };
}

// libc++ does not ship GCC's aggregate header; provide only standard C++17 headers.
const stdHeaders = 'algorithm array bitset cassert cctype cerrno cfloat chrono climits cmath complex cstdio cstdlib cstring deque exception functional iomanip ios iostream iterator limits list map memory numeric queue random ratio regex set sstream stack stdexcept string tuple type_traits unordered_map unordered_set utility valarray vector'.split(' ');

async function run(request: Omit<LocalRunRequest, 'signal'>, artifact?: Uint8Array): Promise<LocalRunResult> {
  let fs: WASIFS = {};
  let binary: Uint8Array;
  let args: string[];
  if (request.language === 'python') {
    fs = await filesystem('python-3.11.3.tar.gz');
    fs['/main.py'] = file('/main.py', encoder.encode(request.code));
    binary = await asset('python-3.11.3.wasm');
    args = ['python', '/main.py'];
  } else {
    if (!artifact) {
      postMessage({ phase: 'compile' });
      fs = await filesystem('clang-fs.tar.gz');
      fs['/main.cpp'] = file('/main.cpp', encoder.encode(request.code));
      fs['/sys/include/c++/v1/bits/stdc++.h'] = file('/sys/include/c++/v1/bits/stdc++.h', encoder.encode(stdHeaders.map(h => `#include <${h}>`).join('\n')));
      const flags = ['clang', '-cc1', '-triple', 'wasm32-unknown-wasi', '-emit-obj', '-isysroot', '/sys',
        '-internal-isystem', '/sys/include/c++/v1', '-internal-isystem', '/sys/include',
        '-internal-isystem', '/sys/lib/clang/8.0.1/include', '-ferror-limit', '8', '-O2',
        '-std=' + (request.language === 'cpp' ? 'c++17' : 'c11'), '-x', request.language === 'cpp' ? 'c++' : 'c', '-o', '/program.o', '/main.cpp'];
      const object = await execute(await asset('clang.wasm'), flags, fs);
      if (object.exitCode) return { output: object.stdout, stderr: object.stderr, verdict: 'COMPILATION_ERROR', error: 'Compilation failed' };
      const linked = await execute(await asset('wasm-ld.wasm'), ['wasm-ld', '--no-threads', '--export-dynamic', '-z', 'stack-size=4194304',
        '--max-memory=268435456', '-L/sys/lib/wasm32-wasi', '/sys/lib/wasm32-wasi/crt1.o', '/program.o', '-lc',
        ...(request.language === 'cpp' ? ['-lc++', '-lc++abi'] : []), '-o', '/program.wasm'], object.fs);
      if (linked.exitCode) return { output: linked.stdout, stderr: linked.stderr, verdict: 'COMPILATION_ERROR', error: 'Linking failed' };
      const compiled = linked.fs['/program.wasm'];
      if (!compiled || compiled.mode !== 'binary') throw new Error('Compiler did not produce WebAssembly');
      artifact = compiled.content;
      postMessage({ artifact });
    }
    binary = artifact;
    fs = {};
    args = ['program'];
  }
  postMessage({ phase: 'run' });
  const result = await execute(binary, args, fs, request.input);
  return { output: result.stdout, stderr: result.stderr, verdict: result.exitCode ? 'RUNTIME_ERROR' : 'OK',
    ...(result.exitCode ? { error: `Exit code: ${result.exitCode}` } : {}), used: `${Math.round(result.elapsed)} ms (wall)` };
}

self.onmessage = (event: MessageEvent<{ request: Omit<LocalRunRequest, 'signal'>; artifact?: Uint8Array }>) => {
  void run(event.data.request, event.data.artifact).then(result => postMessage({ result })).catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    postMessage({ result: { output: '', verdict: message === 'OUTPUT_LIMIT_EXCEEDED' ? message : 'RUNTIME_ERROR', error: message } });
  });
};
