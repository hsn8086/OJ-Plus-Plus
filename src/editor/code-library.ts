import type { CodeLanguage } from './language-detection.ts';

export interface CodeSnippet {
  id: string;
  name: string;
  prefix: string;
  language: CodeLanguage | 'all';
  code: string;
}

export const DEFAULT_TEMPLATES: Record<CodeLanguage, string> = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main(void) {\n\n    return 0;\n}\n',
  python: 'import sys\n\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n',
  java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n\n    }\n}\n',
  javascript: 'function solve() {\n\n}\n\nsolve();\n',
  rust: 'use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n\n}\n',
  go: 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    in := bufio.NewReader(os.Stdin)\n    out := bufio.NewWriter(os.Stdout)\n    defer out.Flush()\n    _, _ = in, fmt.Fprint\n\n}\n',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n\n    }\n}\n',
  kotlin: 'fun main() {\n\n}\n',
  pascal: 'program Main;\nbegin\n\nend.\n',
  ruby: 'input = STDIN.read\n\n',
  php: '<?php\n$input = file_get_contents("php://stdin");\n\n',
  haskell: 'main :: IO ()\nmain = do\n    input <- getContents\n    putStr input\n',
  lua: 'local input = io.read("*a")\n\n',
  ocaml: 'let () =\n  ()\n',
  julia: 'function solve()\n\nend\n\nsolve()\n',
  scala: 'object Main {\n  def main(args: Array[String]): Unit = {\n\n  }\n}\n',
  perl: 'use strict;\nuse warnings;\n\n',
  text: '',
};

export function codeTemplate(templates: Partial<Record<CodeLanguage, string>>, language: CodeLanguage): string {
  return templates[language] ?? DEFAULT_TEMPLATES[language];
}
