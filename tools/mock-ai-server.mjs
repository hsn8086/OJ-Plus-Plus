/**
 * 本地 mock AI 服务，用于端到端验证脚本的请求/解析链路。
 *   node tools/mock-ai-server.mjs [port]
 * 支持 openai-chat / openai-responses / anthropic 三种协议。
 */
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 8787);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
  });
}

function fakeTranslate(text) {
  return `【译文】${text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\n{2,}/g, '\n\n')
    .slice(0, 2000)}`;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);
  const raw = await readBody(req);
  let payload = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    /* ignore */
  }

  console.log(`[mock] ${req.method} ${url.pathname} model=${payload.model ?? '-'}`);

  const reply = (body) => {
    res.writeHead(200, { ...CORS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  const source =
    payload.messages?.at(-1)?.content ??
    payload.input?.at(-1)?.content ??
    '';

  if (url.pathname.endsWith('/chat/completions')) {
    reply({
      id: 'mock',
      choices: [
        { index: 0, message: { role: 'assistant', content: fakeTranslate(source) } },
      ],
    });
    return;
  }

  if (url.pathname.endsWith('/responses')) {
    reply({
      id: 'mock',
      output_text: fakeTranslate(source),
      output: [
        {
          type: 'message',
          content: [{ type: 'output_text', text: fakeTranslate(source) }],
        },
      ],
    });
    return;
  }

  if (url.pathname.endsWith('/messages')) {
    reply({
      id: 'mock',
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: fakeTranslate(source) }],
    });
    return;
  }

  res.writeHead(404, { ...CORS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: { message: `no route for ${url.pathname}` } }));
});

server.listen(port, () => {
  console.log(`mock AI server on http://127.0.0.1:${port}`);
});
