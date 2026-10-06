/**
 * SSE 增量解析。
 *
 * 网络分片不保证落在事件边界上，所以要把上一次没读完的尾巴留到下一次。
 * 返回的每个事件是 data 行的内容（多行 data 用换行拼接），"[DONE]" 也会返回。
 */
export function createSseParser(): (chunk: string) => string[] {
  let buffer = '';
  return (chunk: string) => {
    buffer += chunk;
    const events: string[] = [];
    // 事件之间用空行分隔；\r\n 也要认
    for (;;) {
      const match = /\r?\n\r?\n/.exec(buffer);
      if (!match) break;
      const block = buffer.slice(0, match.index);
      buffer = buffer.slice(match.index + match[0].length);
      const data = block
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).replace(/^ /, ''))
        .join('\n');
      if (data) events.push(data);
    }
    return events;
  };
}

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
