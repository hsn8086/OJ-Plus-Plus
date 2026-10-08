import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { EditorMode } from './cm.ts';

/**
 * 简单关键字补全：只覆盖语言关键字 + 少量竞赛常用符号/宏，
 * 不做语义分析——那是留给 LSP 的位置。
 */

const CPP_KEYWORDS = [
  // 语言关键字
  'alignas', 'alignof', 'asm', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class',
  'const', 'constexpr', 'continue', 'decltype', 'default', 'delete', 'do', 'double', 'else',
  'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
  'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'nullptr', 'operator',
  'private', 'protected', 'public', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
  'static_assert', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef',
  'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while',
  // 竞赛常用类型/容器/函数
  'vector', 'string', 'pair', 'map', 'set', 'unordered_map', 'unordered_set', 'queue',
  'priority_queue', 'stack', 'deque', 'array', 'tuple', 'bitset', 'list', 'sort', 'lower_bound',
  'upper_bound', 'binary_search', 'reverse', 'max', 'min', 'abs', 'swap', 'fill', 'memset',
  'memcpy', 'push_back', 'emplace_back', 'pop_back', 'front', 'back', 'begin', 'end', 'size',
  'empty', 'count', 'find', 'insert', 'erase', 'make_pair', 'make_tuple', 'tie', 'get',
  'next_permutation', 'prev_permutation', 'accumulate', 'iota', 'gcd', 'lcm', 'pow', 'sqrt',
  'ceil', 'floor', 'log', 'exp', 'sin', 'cos', 'tan', 'cout', 'cin', 'endl', 'printf', 'scanf',
  'puts', 'getline', 'cerr', 'ios', 'sync_with_stdio', 'INT_MAX', 'INT_MIN', 'LLONG_MAX',
  'LLONG_MIN', 'll', 'long long',
];

const JAVA_KEYWORDS = [
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
  'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
  'finally', 'float', 'for', 'if', 'implements', 'import', 'instanceof', 'int', 'interface',
  'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short',
  'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
  'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null',
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'Character', 'Math', 'System', 'Object',
  'ArrayList', 'HashMap', 'HashSet', 'TreeMap', 'TreeSet', 'PriorityQueue', 'LinkedList',
  'ArrayDeque', 'Arrays', 'Collections', 'StringBuilder', 'Scanner', 'BufferedReader',
  'InputStreamReader', 'PrintWriter', 'println', 'print', 'main', 'length', 'charAt',
  'substring', 'equals', 'compareTo', 'toString', 'parseInt', 'parseLong', 'valueOf',
  'sort', 'binarySearch', 'max', 'min', 'add', 'remove', 'contains', 'size', 'isEmpty',
  'put', 'get', 'containsKey', 'keySet', 'entrySet', 'values', 'poll', 'offer', 'peek',
];

const PYTHON_KEYWORDS = [
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del',
  'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
  'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
  'with', 'yield', 'True', 'False', 'None',
  'print', 'input', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple',
  'range', 'len', 'sorted', 'reversed', 'enumerate', 'zip', 'map', 'filter', 'sum',
  'max', 'min', 'abs', 'round', 'pow', 'divmod', 'ord', 'chr', 'bin', 'hex', 'oct',
  'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort',
  'join', 'split', 'strip', 'replace', 'find', 'startswith', 'endswith', 'upper', 'lower',
  'keys', 'values', 'items', 'get', 'update', 'setdefault', 'defaultdict', 'deque',
  'Counter', 'heapq', 'bisect_left', 'bisect_right', 'math', 'sys', 'stdin', 'stdout',
  'readline', 'inf', 'ceil', 'floor', 'sqrt', 'gcd', 'factorial', 'combinations',
  'permutations', 'accumulate', 'itertools', 'functools', 'lru_cache', 'cache', 'reduce',
];

const LIST: Record<EditorMode, string[]> = {
  cpp: CPP_KEYWORDS,
  java: JAVA_KEYWORDS,
  python: PYTHON_KEYWORDS,
  text: [],
};

export function keywordCompletionFor(mode: EditorMode) {
  const words = LIST[mode] ?? [];
  const options = words.map((label) => ({ label, type: 'keyword' }));
  return (ctx: CompletionContext): CompletionResult | null => {
    const word = ctx.matchBefore(/[\w]+/);
    if (!word || (word.from === word.to && !ctx.explicit)) return null;
    return { from: word.from, options, validFor: /^[\w]*$/ };
  };
}
