// Minimal LSP smoke test for externally supplied clangd WASM assets.
// Assets are intentionally not vendored; this file is copied into the disposable probe extension.
export async function probeClangd() {
  const { default: createClangd } = await import('./clangd/clangd.js');
  const pending = new Map();
  let input = [];
  let wake;
  let bytes = [];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const send = message => {
    const body = encoder.encode(JSON.stringify(message));
    // The Emscripten stdio bridge needs read boundaries between the header, separator and body.
    input.push(...encoder.encode(`Content-Length: ${body.length}\r\n`), null, 13, 10, null, ...body, null);
    wake?.(); wake = undefined;
  };
  const receive = message => {
    const item = pending.get(message.id);
    if (item) {
      pending.delete(message.id);
      clearTimeout(item.timer);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    } else if (message.id != null && message.method) send({ jsonrpc: '2.0', id: message.id, result: null });
  };
  const stdout = byte => {
    bytes.push(byte);
    for (;;) {
      const raw = new Uint8Array(bytes);
      const text = decoder.decode(raw);
      const end = text.indexOf('\r\n\r\n');
      if (end < 0) return;
      const length = /Content-Length:\s*(\d+)/i.exec(text.slice(0, end));
      if (!length) throw new Error('Invalid LSP header');
      const start = end + 4;
      const size = Number(length[1]);
      if (raw.length < start + size) return;
      receive(JSON.parse(decoder.decode(raw.slice(start, start + size))));
      bytes = bytes.slice(start + size);
      if (!bytes.length) return;
    }
  };
  let nextId = 1;
  const request = (method, params) => new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`clangd timeout: ${method}`)); }, 18000);
    pending.set(id, { resolve, reject, timer });
    send({ jsonrpc: '2.0', id, method, params });
  });
  let stderr = '';
  const start = performance.now();
  const module = await createClangd({
    thisProgram: '/usr/bin/clangd',
    locateFile: path => new URL(`./clangd/${path}`, import.meta.url).href,
    stdin: () => input.length ? input.shift() : null,
    stdinReady: () => input.length ? Promise.resolve() : new Promise(resolve => { wake = resolve; }),
    stdout, stderr: byte => { if (stderr.length < 2000) stderr += String.fromCharCode(byte); },
  });
  try {
    module.FS.mkdirTree('/src');
    module.FS.writeFile('/src/.clangd', JSON.stringify({ CompileFlags: { Add: ['-xc++', '-std=c++17', '--target=wasm32-wasi'] } }));
    module.callMain(['--log=error', '--limit-results=20', '--pch-storage=memory']);
    const init = await request('initialize', {
      processId: null, rootUri: 'file:///src', capabilities: { textDocument: { completion: { completionItem: { snippetSupport: false } } } },
    });
    send({ jsonrpc: '2.0', method: 'initialized', params: {} });
    const text = 'int square(int value) { return value * value; }\nint main() { squ';
    send({ jsonrpc: '2.0', method: 'textDocument/didOpen', params: {
      textDocument: { uri: 'file:///src/main.cpp', languageId: 'cpp', version: 1, text },
    } });
    const result = await request('textDocument/completion', { textDocument: { uri: 'file:///src/main.cpp' }, position: { line: 1, character: 16 }, context: { triggerKind: 1 } });
    const labels = (Array.isArray(result) ? result : result?.items ?? []).map(item => item.label);
    return { serverInfo: init.serverInfo, readyAndCompletionMs: performance.now() - start, labels, hasSquare: labels.some(label => label.includes('square')) };
  } catch (error) {
    return { error: String(error), stderr };
  } finally {
    module.PThread.terminateAllThreads();
    for (const request of pending.values()) clearTimeout(request.timer);
  }
}
