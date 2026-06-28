"use client";

// Desktop right-click menu for a node. Opened by NodeMesh (via the store's
// contextMenu slice) at the cursor; offers "Link to another node" (enters link
// mode pre-seeded with this node), Duplicate, and Delete. Closes on outside
// pointerdown / Escape / after an action. Editor-token styled, hard shadow.

import * as React from "react";
import { NodeGlyph, type GlyphName } from "../icons/NodeGlyph";
import { useWorkflowStore } from "../state/useWorkflowStore";

export function NodeContextMenu() {
  const menu = useWorkflowStore((s) => s.contextMenu);
  const close = useWorkflowStore((s) => s.closeContextMenu);
  const beginLink = useWorkflowStore((s) => s.beginLink);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  React.useEffect(() => {
    if (!menu) return;
    const onDown = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu, close]);

  if (!menu) return null;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 9,
    width: "100%",
    padding: "8px 12px",
    border: "none",
    background: "transparent",
    color: "var(--editor-text)",
    fontFamily: "var(--font-body, sans-serif)",
    fontSize: "0.82rem",
    textAlign: "left",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const Item = ({ label, glyph, onClick }: { label: string; glyph: GlyphName; onClick: () => void }) => (
    <button
      type="button"
      style={itemStyle}
      onClick={() => {
        onClick();
        close();
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--editor-surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <NodeGlyph name={glyph} size={15} />
      {label}
    </button>
  );

  return (
    <div
      role="menu"
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: menu.x,
        top: menu.y,
        zIndex: 50,
        minWidth: 184,
        padding: "5px 0",
        borderRadius: 10,
        border: "1.5px solid var(--editor-border-soft)",
        background: "var(--editor-surface)",
        boxShadow: "var(--editor-shadow)",
        overflow: "hidden",
      }}
    >
      <Item label="Link to another node" glyph="link" onClick={() => beginLink(menu.nodeId)} />
      <Item label="Duplicate" glyph="plus" onClick={() => duplicateNode(menu.nodeId)} />
      <div style={{ height: 1, background: "var(--editor-border-soft)", margin: "4px 0" }} />
      <Item label="Delete" glyph="trash" onClick={() => deleteNode(menu.nodeId)} />
    </div>
  );
}

export default NodeContextMenu;
