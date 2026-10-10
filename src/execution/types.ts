export type LocalLanguage = 'c' | 'cpp' | 'python';

export interface LocalRunRequest {
  code: string;
  language: LocalLanguage;
  input: string;
  timeoutMs: number;
  signal?: AbortSignal;
}

export interface LocalRunResult {
  output: string;
  stderr?: string;
  error?: string;
  verdict: string;
  used?: string;
}

export interface LocalRunner {
  run(request: LocalRunRequest): Promise<LocalRunResult>;
}
