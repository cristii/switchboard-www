"use client";

// Live "Document JSON" panel for the editor: a two-way-bound CodeMirror view of
// the current diagram. Canvas edits stream INTO the JSON while the panel is
// unfocused; typing valid JSON applies OUT to the canvas live (debounced,
// through the schema's deserialize/migrate), with one undo step per editing
// session. Invalid JSON just lints — the scene keeps its last good state.
// CodeMirror is lazy-loaded so it only ships when the panel opens.

import * as React from "react";
import { IconButton } from "../primitives/IconButton";
import { deserialize } from "../state/schema";
import { useWorkflowStore } from "../state/useWorkflowStore";

const JsonEditor = React.lazy(() =>
  import("../json/JsonEditor").then((m) => ({ default: m.JsonEditor })),
);

export interface JsonPanelProps {
  onClose?: () => void;
  /** Copy the FULL { config, diagram } doc (the editor's Copy JSON action). */
  onCopyFullDoc?: () => void;
  style?: React.CSSProperties;
}

const currentJson = () => JSON.stringify(useWorkflowStore.getState().exportDiagram(), null, 2);

export function JsonPanel({ onClose, onCopyFullDoc, style }: JsonPanelProps) {
  const [text, setText] = React.useState(currentJson);
  const [valid, setValid] = React.useState(true);
  const validRef = React.useRef(true);
  validRef.current = valid;
  const focusedRef = React.useRef(false);
  const applyingRef = React.useRef(false);
  const sessionDirtyRef = React.useRef(false);
  const applyTimer = React.useRef<number | undefined>(undefined);

  // Canvas → JSON: refresh whenever the document changes, unless the user is
  // typing here (or the change came from this panel's own apply).
  React.useEffect(() => {
    const unsub = useWorkflowStore.subscribe((s, prev) => {
      if (s.nodes === prev.nodes && s.edges === prev.edges) return;
      if (focusedRef.current || applyingRef.current) return;
      setText(currentJson());
      setValid(true);
    });
    return unsub;
  }, []);

  React.useEffect(() => () => window.clearTimeout(applyTimer.current), []);

  // JSON → canvas: debounce, deserialize (schema-migrating), apply without
  // resetting history — the first apply of a session snapshots once, so the
  // whole JSON-editing session is a single undo step.
  const handleChange = (value: string) => {
    setText(value);
    window.clearTimeout(applyTimer.current);
    applyTimer.current = window.setTimeout(() => {
      try {
        const diagram = deserialize(value);
        const st = useWorkflowStore.getState();
        if (!sessionDirtyRef.current) {
          st.beginInteraction();
          sessionDirtyRef.current = true;
        }
        applyingRef.current = true;
        st.loadDiagram(diagram, { resetHistory: false });
        applyingRef.current = false;
        setValid(true);
      } catch {
        setValid(false);
      }
    }, 350);
  };

  const handleFocusChange = (focused: boolean) => {
    focusedRef.current = focused;
    if (focused) {
      sessionDirtyRef.current = false; // a fresh session = a fresh undo step
    } else if (validRef.current) {
      // Resync (and re-pretty) once typing ends — but never clobber an
      // in-progress INVALID edit; the user may come back to finish it.
      setText(currentJson());
    }
  };

  const headerText: React.CSSProperties = {
    fontFamily: "var(--font-display, sans-serif)",
    fontWeight: 700,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--editor-text-muted)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--editor-surface)",
        color: "var(--editor-text)",
        minHeight: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: "none",
          padding: "8px 10px",
          borderBottom: "1.5px solid var(--editor-border-soft)",
        }}
      >
        <span style={headerText}>Document JSON</span>
        <span
          aria-label={valid ? "JSON valid" : "JSON invalid"}
          title={valid ? "Applied live to the canvas" : "Invalid — the canvas keeps its last good state"}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: valid ? "var(--node-green)" : "var(--editor-accent)",
            flex: "none",
          }}
        />
        <div style={{ flex: 1 }} />
        <IconButton
          label="Format (Mod+Shift+F)"
          glyph="layout"
          onClick={() => {
            try {
              setText(JSON.stringify(JSON.parse(text), null, 2));
            } catch {
              /* invalid — leave as-is */
            }
          }}
        />
        <IconButton
          label="Copy diagram JSON"
          glyph="copy"
          onClick={() => void navigator.clipboard.writeText(text).catch(() => {})}
        />
        {onCopyFullDoc ? (
          <IconButton label="Copy full doc (config + diagram)" glyph="download" onClick={onCopyFullDoc} />
        ) : null}
        {onClose ? <IconButton label="Close" glyph="close" onClick={onClose} /> : null}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <React.Suspense
          fallback={
            <div
              style={{
                display: "grid",
                placeItems: "center",
                height: "100%",
                color: "var(--editor-text-muted)",
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Loading editor…
            </div>
          }
        >
          <JsonEditor
            value={text}
            onChange={handleChange}
            onFocusChange={handleFocusChange}
            validate={(t) => {
              try {
                deserialize(t);
                return null;
              } catch (e) {
                return e instanceof Error ? e.message : String(e);
              }
            }}
          />
        </React.Suspense>
      </div>

      <div
        style={{
          flex: "none",
          padding: "6px 10px",
          borderTop: "1.5px solid var(--editor-border-soft)",
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "0.68rem",
          color: "var(--editor-text-muted)",
        }}
      >
        Valid edits apply live · one undo step per typing session
      </div>
    </div>
  );
}

export default JsonPanel;
