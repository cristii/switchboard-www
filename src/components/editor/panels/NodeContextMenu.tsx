"use client";

// Right-click menu for nodes, edges and the empty canvas (via the store's
// contextMenu slice), opened at the cursor. Nodes: rename / link / duplicate /
// copy / delete (+ align & distribute when several are selected). Edges: dashed
// + flow toggles / delete. Canvas: paste / select all / fit view. Closes on
// outside pointerdown / Escape / after an action. Editor-token styled.

import * as React from "react";
import { NodeGlyph, type GlyphName } from "../icons/NodeGlyph";
import { useWorkflowStore } from "../state/useWorkflowStore";

export interface NodeContextMenuProps {
  /** Fit the camera to the content (canvas menu action). */
  onFitView?: () => void;
}

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

const miniStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 4px",
  border: "1.5px solid var(--editor-border-soft)",
  borderRadius: 7,
  background: "transparent",
  color: "var(--editor-text)",
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.62rem",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const sectionLabel: React.CSSProperties = {
  padding: "6px 12px 3px",
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.58rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--editor-text-muted)",
};

export function NodeContextMenu({ onFitView }: NodeContextMenuProps) {
  const menu = useWorkflowStore((s) => s.contextMenu);
  const close = useWorkflowStore((s) => s.closeContextMenu);

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

  const st = useWorkflowStore.getState();

  const Item = ({
    label,
    glyph,
    disabled,
    onClick,
  }: {
    label: string;
    glyph: GlyphName;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      style={{ ...itemStyle, opacity: disabled ? 0.45 : 1, cursor: disabled ? "default" : "pointer" }}
      disabled={disabled}
      onClick={() => {
        onClick();
        close();
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--editor-surface-2)";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <NodeGlyph name={glyph} size={15} />
      {label}
    </button>
  );

  const Mini = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      style={miniStyle}
      onClick={() => {
        onClick();
        close();
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--editor-surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );

  const Divider = () => (
    <div style={{ height: 1, background: "var(--editor-border-soft)", margin: "4px 0" }} />
  );

  const multi = st.selection?.type === "node" && st.selection.ids.length > 1;
  const edge = menu.kind === "edge" && menu.id ? st.edges.find((e) => e.id === menu.id) : undefined;

  return (
    <div
      role="menu"
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: menu.x,
        top: menu.y,
        zIndex: 50,
        minWidth: 196,
        padding: "5px 0",
        borderRadius: 10,
        border: "1.5px solid var(--editor-border-soft)",
        background: "var(--editor-surface)",
        boxShadow: "var(--editor-shadow)",
        overflow: "hidden",
      }}
    >
      {menu.kind === "node" && menu.id ? (
        <>
          <Item label="Rename" glyph="edit" onClick={() => st.openLabelEditor(menu.id as string, menu.x, menu.y)} />
          <Item label="Link to another node" glyph="link" onClick={() => st.beginLink(menu.id)} />
          <Item
            label={multi ? "Duplicate selection" : "Duplicate"}
            glyph="plus"
            onClick={() => (multi ? void st.duplicateSelection() : void st.duplicateNode(menu.id as string))}
          />
          <Item label={multi ? "Copy selection" : "Copy"} glyph="copy" onClick={() => st.copySelection()} />
          {multi ? (
            <>
              <Divider />
              <div style={sectionLabel}>Align · distribute</div>
              <div style={{ display: "flex", gap: 4, padding: "2px 10px 4px" }}>
                <Mini label="Left" onClick={() => st.alignSelection("left")} />
                <Mini label="Mid" onClick={() => st.alignSelection("centerX")} />
                <Mini label="Right" onClick={() => st.alignSelection("right")} />
              </div>
              <div style={{ display: "flex", gap: 4, padding: "0 10px 4px" }}>
                <Mini label="Top" onClick={() => st.alignSelection("top")} />
                <Mini label="Mid" onClick={() => st.alignSelection("centerY")} />
                <Mini label="Bottom" onClick={() => st.alignSelection("bottom")} />
              </div>
              <div style={{ display: "flex", gap: 4, padding: "0 10px 6px" }}>
                <Mini label="Spread X" onClick={() => st.distributeSelection("x")} />
                <Mini label="Spread Y" onClick={() => st.distributeSelection("y")} />
              </div>
            </>
          ) : null}
          <Divider />
          <Item
            label={multi ? "Delete selection" : "Delete"}
            glyph="trash"
            onClick={() => (multi ? st.deleteSelection() : st.deleteNode(menu.id as string))}
          />
        </>
      ) : null}

      {menu.kind === "edge" && edge ? (
        <>
          <Item
            label={edge.style === "dashed" ? "Make solid" : "Make dashed"}
            glyph="layers"
            onClick={() => st.updateEdge(edge.id, { style: edge.style === "dashed" ? "solid" : "dashed" })}
          />
          <Item
            label={(edge.flow ?? "off") === "off" ? "Flow pulse on" : "Flow pulse off"}
            glyph="play"
            onClick={() =>
              st.updateEdge(edge.id, { flow: (edge.flow ?? "off") === "off" ? "slow" : "off" })
            }
          />
          <Divider />
          <Item label="Delete edge" glyph="trash" onClick={() => st.deleteEdge(edge.id)} />
        </>
      ) : null}

      {menu.kind === "canvas" ? (
        <>
          <Item
            label="Paste"
            glyph="copy"
            disabled={!st.clipboard || st.clipboard.nodes.length === 0}
            onClick={() => st.pasteClipboard()}
          />
          <Item label="Select all" glyph="frame" onClick={() => st.selectAll()} />
          {onFitView ? <Item label="Fit view" glyph="fit" onClick={onFitView} /> : null}
        </>
      ) : null}
    </div>
  );
}

export default NodeContextMenu;
