"use client";

// CodeMirror 6 JSON editor, themed with the editor tokens so it follows the
// surrounding [data-editor-theme] (light/dark) automatically. Ships the full
// professional feature set: syntax highlighting (brand hues), line numbers,
// code folding, bracket match + auto-close, active-line + selection-match
// highlights, search (Ctrl/Cmd-F), undo history, inline JSON lint (squiggles +
// gutter markers at the exact error position) plus an optional doc-shape
// `validate` pass, and Mod-Shift-F to re-format. External `value` changes sync
// in only while the editor is unfocused, so typing is never clobbered.

import * as React from "react";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export interface JsonEditorProps {
  value: string;
  onChange?: (text: string) => void;
  /** Extra validation once the JSON parses (e.g. document shape). Return an
   *  error message to lint the document, or null when it's fine. */
  validate?: (text: string) => string | null;
  readOnly?: boolean;
  /** Reported when the editor gains/loses focus (hosts use it to pause
   *  external syncing while the user types). */
  onFocusChange?: (focused: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Chrome theme from the editor tokens (resolves inside [data-editor-theme]).
const chrome = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "12.5px",
    backgroundColor: "var(--editor-surface)",
    color: "var(--editor-text)",
  },
  ".cm-scroller": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    lineHeight: "1.55",
    overflow: "auto",
  },
  ".cm-content": { caretColor: "var(--editor-accent)" },
  ".cm-cursor, .cm-dropCursor": { borderLeft: "2px solid var(--editor-accent)" },
  "&.cm-focused": { outline: "none" },
  ".cm-gutters": {
    backgroundColor: "var(--editor-surface-2)",
    color: "var(--editor-text-muted)",
    border: "none",
    borderRight: "1px solid var(--editor-border-soft)",
  },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--editor-accent) 6%, transparent)" },
  ".cm-activeLineGutter": {
    backgroundColor: "color-mix(in srgb, var(--editor-accent) 12%, transparent)",
    color: "var(--editor-text)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--editor-accent) 24%, transparent) !important",
  },
  ".cm-selectionMatch": { backgroundColor: "color-mix(in srgb, var(--editor-selection) 30%, transparent)" },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "color-mix(in srgb, var(--editor-accent) 18%, transparent)",
    outline: "1px solid var(--editor-accent)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "var(--editor-surface-2)",
    border: "1px solid var(--editor-border-soft)",
    color: "var(--editor-text-muted)",
  },
  ".cm-panels": {
    backgroundColor: "var(--editor-surface-2)",
    color: "var(--editor-text)",
    borderTop: "1px solid var(--editor-border-soft)",
  },
  ".cm-panels input, .cm-panels button": { fontFamily: "inherit" },
  ".cm-searchMatch": { backgroundColor: "color-mix(in srgb, var(--editor-selection) 35%, transparent)" },
  ".cm-searchMatch-selected": { backgroundColor: "color-mix(in srgb, var(--editor-accent) 40%, transparent)" },
  ".cm-tooltip": {
    backgroundColor: "var(--editor-surface)",
    border: "1.5px solid var(--editor-border-soft)",
    color: "var(--editor-text)",
    borderRadius: "8px",
    boxShadow: "var(--editor-shadow)",
  },
  ".cm-tooltip.cm-tooltip-lint": { padding: "2px 4px", fontSize: "12px" },
  ".cm-lintRange-error": {
    backgroundImage: "none",
    textDecoration: "underline wavy var(--editor-accent) 1px",
    textUnderlineOffset: "3px",
  },
  ".cm-lint-marker-error": { content: "none" },
});

// Syntax colours from the theme's node palette — the JSON reads in the same
// hues as the diagram it describes (and flips with the editor theme).
const highlight = HighlightStyle.define([
  { tag: tags.propertyName, color: "var(--editor-accent-deep, var(--editor-accent))", fontWeight: "600" },
  { tag: tags.string, color: "var(--node-green)" },
  { tag: tags.number, color: "var(--node-violet)" },
  { tag: [tags.bool, tags.null], color: "var(--node-amber)", fontWeight: "600" },
  { tag: [tags.punctuation, tags.separator, tags.bracket], color: "var(--editor-text-muted)" },
  { tag: tags.invalid, color: "var(--editor-accent)" },
]);

const formatKeymap = keymap.of([
  {
    key: "Mod-Shift-f",
    run: (view) => {
      try {
        const pretty = JSON.stringify(JSON.parse(view.state.doc.toString()), null, 2);
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: pretty } });
      } catch {
        /* invalid JSON — nothing to format */
      }
      return true;
    },
  },
]);

export function JsonEditor({
  value,
  onChange,
  validate,
  readOnly = false,
  onFocusChange,
  className,
  style,
}: JsonEditorProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const validateRef = React.useRef(validate);
  validateRef.current = validate;
  const onFocusChangeRef = React.useRef(onFocusChange);
  onFocusChangeRef.current = onFocusChange;
  const initialValueRef = React.useRef(value);

  React.useEffect(() => {
    if (!hostRef.current) return;
    const jsonLint = jsonParseLinter();
    const docLinter = linter((view): Diagnostic[] => {
      const parseDiags = jsonLint(view);
      if (parseDiags.length > 0) return parseDiags;
      const message = validateRef.current?.(view.state.doc.toString());
      if (!message) return [];
      return [{ from: 0, to: view.state.doc.line(1).to, severity: "error", message }];
    });

    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          json(),
          lintGutter(),
          docLinter,
          chrome,
          syntaxHighlighting(highlight),
          indentUnit.of("  "),
          formatKeymap,
          EditorState.readOnly.of(readOnly),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
            if (u.focusChanged) onFocusChangeRef.current?.(u.view.hasFocus);
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      viewRef.current = null;
      view.destroy();
    };
  }, [readOnly]);

  // External value sync — only while unfocused (typing always wins).
  React.useEffect(() => {
    initialValueRef.current = value;
    const view = viewRef.current;
    if (!view || view.hasFocus) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ height: "100%", minHeight: 0, overflow: "hidden", ...style }}
    />
  );
}

export default JsonEditor;
