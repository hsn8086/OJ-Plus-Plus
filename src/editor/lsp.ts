import type { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { EditorMode } from './cm.ts';

/**
 * 极简 LSP-over-WebSocket 客户端。
 *
 * 现在的用途：编辑器补全的第二个来源。设置里填 ws:// 地址才启用，
 * 比如本机跑 `typescript-language-server` 经 lsp-ws-proxy 桥接，
 * 或 clangd 经 WebSocket 代理。
 *
 * 只做最小闭环：initialize → didOpen → textDocument/completion。
 * didChange/didClose/诊断都还没接——之后接 WASM 本地判题那轮再补。
 */

const LANGUAGE_IDS: Record<EditorMode, string | null> = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  text: null,
};

interface JsonRpcResponse {
  id?: number;
  result?: unknown;
  error?: { code: number; message: string };
  method?: string;
  params?: unknown;
}

class LspWsClient {
  private ws: WebSocket | null = null;
  private nextId = 1;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private ready: Promise<void> | null = null;
  private docVersion = 0;
  private opened = false;

  constructor(
    private url: string,
    private languageId: string,
    private uri: string,
  ) {}

  /** 连接 + initialize，只进行一次；失败后续重试 */
  private ensureReady(): Promise<void> {
    if (!this.ready) {
      this.ready = this.connect().catch((e) => {
        this.ready = null;
        throw e;
      });
    }
    return this.ready;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      this.ws = ws;
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('LSP 连接超时'));
      }, 8000);
      ws.onopen = async () => {
        try {
          await this.request('initialize', {
            processId: null,
            rootUri: null,
            capabilities: {
              textDocument: { completion: { completionItem: { snippetSupport: false } } },
            },
            clientInfo: { name: 'oj-plus-plus' },
          });
          this.notify('initialized', {});
          clearTimeout(timeout);
          resolve();
        } catch (e) {
          clearTimeout(timeout);
          reject(e instanceof Error ? e : new Error(String(e)));
        }
      };
      ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('LSP WebSocket 连接失败'));
      };
      ws.onclose = () => {
        this.ws = null;
        this.ready = null;
        this.opened = false;
        for (const [, p] of this.pending) p.reject(new Error('LSP 连接已断开'));
        this.pending.clear();
      };
      ws.onmessage = (ev) => {
        let msg: JsonRpcResponse;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (msg.id !== undefined && this.pending.has(msg.id)) {
          const p = this.pending.get(msg.id)!;
          this.pending.delete(msg.id);
          if (msg.error) p.reject(new Error(msg.error.message));
          else p.resolve(msg.result);
        }
        // server→client 通知（diagnostics 等）暂时不处理
      };
    });
  }

  private request(method: string, params: unknown): Promise<unknown> {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return Promise.reject(new Error('LSP 未连接'));
    const id = this.nextId++;
    ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error('LSP 请求超时'));
      }, 10000);
    });
  }

  private notify(method: string, params: unknown): void {
    const ws = this.ws;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ jsonrpc: '2.0', method, params }));
    }
  }

  async ensureOpen(text: string): Promise<void> {
    await this.ensureReady();
    if (this.opened) return;
    this.opened = true;
    this.docVersion = 1;
    this.notify('textDocument/didOpen', {
      textDocument: { uri: this.uri, languageId: this.languageId, version: this.docVersion, text },
    });
  }

  /** 供外部同步文档（didChange 全量覆盖） */
  syncDoc(text: string): void {
    if (!this.opened || this.ws?.readyState !== WebSocket.OPEN) return;
    this.docVersion += 1;
    this.notify('textDocument/didChange', {
      textDocument: { uri: this.uri, version: this.docVersion },
      contentChanges: [{ text }],
    });
  }

  async completion(text: string, line: number, character: number): Promise<Completion[]> {
    await this.ensureOpen(text);
    const result = await this.request('textDocument/completion', {
      textDocument: { uri: this.uri },
      position: { line, character },
    });
    const items = Array.isArray(result)
      ? result
      : ((result as { items?: unknown[] } | null)?.items ?? []);
    const out: Completion[] = [];
    for (const item of items) {
      const it = item as { label?: string; detail?: string; kind?: number; insertText?: string };
      if (!it?.label) continue;
      out.push({
        label: it.label,
        detail: it.detail,
        type: lspKindToCm(it.kind),
        apply: it.insertText ?? it.label,
        boost: -1, // 排在本站关键字补全之后
      });
      if (out.length >= 200) break;
    }
    return out;
  }
}

function lspKindToCm(kind?: number): string {
  // LSP CompletionItemKind → CM 类型名
  switch (kind) {
    case 1: return 'text';
    case 2: case 3: return 'function';
    case 4: return 'function'; // constructor
    case 5: case 10: return 'property';
    case 6: case 8: return 'variable';
    case 7: return 'class';
    case 9: return 'namespace';
    case 11: return 'type';
    case 12: case 13: return 'variable';
    case 14: return 'keyword';
    case 15: return 'text';
    case 16: case 17: return 'constant';
    case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 25: return 'keyword';
    default: return 'text';
  }
}

/** 按 url+mode+uri 复用客户端，避免每次补全重连 */
const clients = new Map<string, LspWsClient>();

/**
 * 返回一个补全源：连不上 LSP 时静默返回 null（不影响关键字补全）。
 * doc 同步策略：每次补全请求时 ensureOpen + 全量 didChange——简单可靠。
 */
export function lspCompletion(url: string, mode: EditorMode) {
  const languageId = LANGUAGE_IDS[mode];
  if (!languageId) return null;
  const uri = `inmemory://ojpp/${mode}/main`;
  const key = `${url}|${uri}`;
  return (ctx: CompletionContext): Promise<CompletionResult | null> => {
    const word = ctx.matchBefore(/[\w:.>]+/);
    if (!word || (word.from === word.to && !ctx.explicit)) return Promise.resolve(null);
    let client = clients.get(key);
    if (!client) {
      client = new LspWsClient(url, languageId, uri);
      clients.set(key, client);
    }
    const doc = ctx.state.doc.toString();
    const line = ctx.state.doc.lineAt(ctx.pos);
    return client
      .completion(doc, line.number - 1, ctx.pos - line.from)
      .then((options) => {
        client!.syncDoc(doc);
        return options.length ? { from: word.from, options } : null;
      })
      .catch(() => null);
  };
}
