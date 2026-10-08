import { EditorState, Compartment } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { searchKeymap } from '@codemirror/search';
import {
  bracketMatching,
  indentOnInput,
  LanguageSupport,
  syntaxHighlighting,
  HighlightStyle,
} from '@codemirror/language';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, type CompletionSource } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { keywordCompletionFor } from './keywords.ts';
import { lspCompletion } from './lsp.ts';

export type EditorMode = 'cpp' | 'java' | 'python' | 'text';

export interface EditorHandle {
  readonly view: EditorView;
  getCode(): string;
  setCode(code: string): void;
  setMode(mode: EditorMode): void;
  setDark(dark: boolean): void;
  destroy(): void;
}

const langFor = (mode: EditorMode): LanguageSupport | [] =>
  mode === 'cpp' ? cpp() : mode === 'java' ? java() : mode === 'python' ? python() : [];

/** 跟随应用配色手搓的高亮，保持和面板一致的观感 */
const darkHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.controlKeyword], color: '#f47067' },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: '#96d0ff' },
  { tag: [tags.number, tags.bool, tags.null], color: '#6cafff' },
  { tag: [tags.comment, tags.blockComment], color: '#768390', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#dcbdfb' },
  { tag: [tags.typeName, tags.className, tags.tagName], color: '#8ddb8c' },
  { tag: [tags.propertyName, tags.attributeName], color: '#79b8ff' },
  { tag: tags.operator, color: '#cdd9e5' },
  { tag: [tags.macroName, tags.meta], color: '#f69d50' },
]);

const lightHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.controlKeyword], color: '#cf222e' },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: '#0a3069' },
  { tag: [tags.number, tags.bool, tags.null], color: '#0550ae' },
  { tag: [tags.comment, tags.blockComment], color: '#6e7781', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#8250df' },
  { tag: [tags.typeName, tags.className, tags.tagName], color: '#116329' },
  { tag: [tags.propertyName, tags.attributeName], color: '#0550ae' },
  { tag: tags.operator, color: '#24292f' },
  { tag: [tags.macroName, tags.meta], color: '#bc4c00' },
]);

export interface CreateEditorOptions {
  doc: string;
  mode: EditorMode;
  dark: boolean;
  fontSize: number;
  tabSize: number;
  /** LSP WebSocket 地址；空串关闭 */
  lspUrl: string;
  onChange?: (code: string) => void;
}

export function createEditor(host: HTMLElement, options: CreateEditorOptions): EditorHandle {
  const lang = new Compartment();
  const theme = new Compartment();
  const completion = new Compartment();

  const state = EditorState.create({
    doc: options.doc,
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      drawSelection(),
      indentOnInput(),
      history(),
      bracketMatching(),
      closeBrackets(),
      lang.of(langFor(options.mode)),
      theme.of([editorTheme(options.dark), syntaxHighlighting(options.dark ? darkHighlight : lightHighlight)]),
      completion.of(completionExtensions(options.mode, options.lspUrl)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) options.onChange?.(update.state.doc.toString());
      }),
      EditorState.tabSize.of(options.tabSize),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      EditorView.theme({
        '&': { fontSize: `${options.fontSize}px` },
        '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' },
      }),
    ],
  });

  const view = new EditorView({ state, parent: host });
  return {
    view,
    getCode: () => view.state.doc.toString(),
    setCode(code) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
    },
    setMode(mode) {
      view.dispatch({ effects: lang.reconfigure(langFor(mode)) });
      view.dispatch({ effects: completion.reconfigure(completionExtensions(mode, options.lspUrl)) });
    },
    setDark(dark) {
      view.dispatch({ effects: theme.reconfigure([editorTheme(dark), syntaxHighlighting(dark ? darkHighlight : lightHighlight)]) });
    },
    destroy() {
      view.destroy();
    },
  };
}

function completionExtensions(mode: EditorMode, lspUrl: string) {
  const sources: CompletionSource[] = [keywordCompletionFor(mode)];
  const lsp = lspUrl ? lspCompletion(lspUrl, mode) : null;
  if (lsp) sources.push(lsp);
  return autocompletion({ override: sources });
}

/** 和面板同一个色板，减少割裂感 */
function editorTheme(dark: boolean) {
  return EditorView.theme(
    {
      '&': {
        backgroundColor: dark ? '#161b22' : '#f6f8fa',
        color: dark ? '#cdd9e5' : '#24292f',
        borderRadius: '6px',
      },
      '.cm-content': { padding: '8px 0', caretColor: dark ? '#cdd9e5' : '#24292f' },
      '.cm-cursor': { borderLeftColor: dark ? '#cdd9e5' : '#24292f' },
      '.cm-gutters': {
        backgroundColor: dark ? '#161b22' : '#f6f8fa',
        color: dark ? '#6e7681' : '#8c959f',
        border: 'none',
        borderRight: dark ? '1px solid #30363d' : '1px solid #d0d7de',
      },
      '.cm-activeLine': { backgroundColor: dark ? 'rgba(110,118,129,0.12)' : 'rgba(208,215,222,0.35)' },
      '.cm-activeLineGutter': { backgroundColor: dark ? 'rgba(110,118,129,0.15)' : 'rgba(208,215,222,0.4)' },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
        backgroundColor: dark ? 'rgba(83,155,245,0.3)' : 'rgba(9,105,218,0.2)',
      },
      '.cm-tooltip': {
        backgroundColor: dark ? '#22272e' : '#ffffff',
        border: dark ? '1px solid #373e47' : '1px solid #d0d7de',
        borderRadius: '6px',
        color: dark ? '#cdd9e5' : '#24292f',
      },
      '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
        backgroundColor: dark ? '#1f6feb' : '#0969da',
        color: '#ffffff',
      },
      '.cm-panels': {
        backgroundColor: dark ? '#22272e' : '#f6f8fa',
        color: dark ? '#cdd9e5' : '#24292f',
      },
      '.cm-searchMatch': { backgroundColor: dark ? 'rgba(240,136,62,0.35)' : 'rgba(255,212,121,0.6)' },
      '.cm-searchMatch-selected': { backgroundColor: dark ? 'rgba(240,136,62,0.6)' : 'rgba(255,180,84,0.8)' },
    },
    { dark },
  );
}

export { EditorView, EditorState };
