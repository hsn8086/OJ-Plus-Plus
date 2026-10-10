import type { LocalRunRequest } from './types.ts';

export function validateLocalRequest(value: unknown): Omit<LocalRunRequest, 'signal'> {
  const req = value as Partial<LocalRunRequest>;
  if (!req || !['c', 'cpp', 'python'].includes(req.language ?? '') || typeof req.code !== 'string' || typeof req.input !== 'string') throw new Error('Invalid local execution request');
  if (new TextEncoder().encode(req.code).length > 512 * 1024 || new TextEncoder().encode(req.input).length > 1024 * 1024) throw new Error('Source or input exceeds the local runner limit');
  return { code: req.code, input: req.input, language: req.language!, timeoutMs: Math.min(30000, Math.max(100, Number(req.timeoutMs) || 3000)) };
}
