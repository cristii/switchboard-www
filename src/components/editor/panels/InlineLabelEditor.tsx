"use client";

// Inline label editor: double-click a node (or "Rename" in its context menu)
// opens a small floating input at the cursor. Enter / blur commits, Escape
// cancels. Positioned in client coordinates (like the context menu), so no 3D
// projection is needed. Editor-token styled.

import * as React from "react";
import { useWorkflowStore } from "../state/useWorkflowStore";

export function InlineLabelEditor() {
  const editor = useWorkflowStore((s) => s.labelEditor);
  const close = useWorkflowStore((s) => s.closeLabelEditor);
  const updateNode = useWorkflowStore((s) => s.updateNode);
  const node = useWorkflowStore((s) =>
    s.labelEditor ? s.nodes.find((n) => n.id === s.labelEditor?.nodeId) : undefined,
  );
  const [value, setValue] = React.useState("");
  const committed = React.useRef(false);

  React.useEffect(() => {
    if (editor && node) {
      setValue(node.label);
      committed.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.nodeId]);

  if (!editor || !node) return null;

  const commit = () => {
    if (committed.current) return;
    committed.current = true;
    const next = value.trim();
    if (next !== node.label) updateNode(node.id, { label: next });
    close();
  };

  return (
    <div
      style={{
        position: "fixed",
        left: editor.x,
        top: editor.y,
        transform: "translate(-50%, -130%)",
        zIndex: 60,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            committed.current = true;
            close();
          }
        }}
        onBlur={commit}
        aria-label="Node label"
        style={{
          width: 180,
          height: 34,
          padding: "0 10px",
          borderRadius: 9,
          border: "1.5px solid var(--editor-accent)",
          background: "var(--editor-surface)",
          color: "var(--editor-text)",
          boxShadow: "var(--editor-shadow)",
          fontFamily: "var(--font-display, sans-serif)",
          fontWeight: 700,
          fontSize: "0.82rem",
          outline: "none",
        }}
      />
    </div>
  );
}

export default InlineLabelEditor;
