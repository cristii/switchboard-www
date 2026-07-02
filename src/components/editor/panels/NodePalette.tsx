"use client";

// The node palette: categories + kinds generated from the catalog (never a
// hardcoded list). Click a kind to add it at the viewport centre, or DRAG it
// onto the canvas to place it exactly (pointer events → mouse + touch; a small
// ghost chip follows the pointer). Editor-primitive styling (inline + editor
// CSS variables, Tailwind-free) so it renders in Storybook and on-brand.
// See description.md §7.

import * as React from "react";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { catalogByCategory } from "../catalog/nodeCatalog";
import { NodeGlyph, type GlyphName } from "../icons/NodeGlyph";
import type { NodeColorRole, NodeKind, WorkflowNode } from "../state/types";

const roleVar = (role: NodeColorRole) => `var(--node-${role})`;

export interface NodePaletteProps {
  /** Called when a kind is chosen. Defaults to the store's addNode. The optional
   *  partial seeds node fields (used by Annotate quick-adds, e.g. a styled Tag). */
  onAdd?: (kind: NodeKind, partial?: Partial<WorkflowNode>) => void;
  /** Called when a kind is DRAGGED onto the canvas (client coords of the drop).
   *  When omitted, dragging is disabled and items are click-only. */
  onDropNode?: (kind: NodeKind, partial: Partial<WorkflowNode> | undefined, clientX: number, clientY: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const heading: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: "0 0 10px",
};

const categoryLabel: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.6rem",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "var(--editor-text-muted)",
  margin: "0 0 5px",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  width: "100%",
  padding: "7px 9px",
  borderRadius: 8,
  border: "1.5px solid transparent",
  background: "transparent",
  color: "var(--editor-text)",
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.8rem",
  cursor: "grab",
  textAlign: "left",
  touchAction: "none", // pointer-drag works on touch too
  userSelect: "none",
  WebkitUserSelect: "none",
};

interface Ghost {
  label: string;
  glyph: GlyphName;
  color: string;
  x: number;
  y: number;
}

const DRAG_THRESHOLD = 7;

export function NodePalette({ onAdd, onDropNode, className, style }: NodePaletteProps) {
  const addNode = useWorkflowStore((s) => s.addNode);
  const handleAdd =
    onAdd ?? ((k: NodeKind, partial?: Partial<WorkflowNode>) => void addNode(k, partial));
  const groups = catalogByCategory();
  const [ghost, setGhost] = React.useState<Ghost | null>(null);

  const itemHandlers = (
    kind: NodeKind,
    label: string,
    glyph: GlyphName,
    color: string,
    partial?: Partial<WorkflowNode>,
  ) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      const startX = e.clientX;
      const startY = e.clientY;
      let dragging = false;
      const onMove = (ev: PointerEvent) => {
        if (!dragging && Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD) {
          dragging = true;
        }
        if (dragging && onDropNode) setGhost({ label, glyph, color, x: ev.clientX, y: ev.clientY });
      };
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        setGhost(null);
        if (dragging && onDropNode) onDropNode(kind, partial, ev.clientX, ev.clientY);
        else if (!dragging) handleAdd(kind, partial);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = "var(--editor-surface-2)";
      e.currentTarget.style.borderColor = "var(--editor-border-soft)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = "transparent";
    },
  });

  return (
    <div
      className={className}
      style={{
        background: "var(--editor-surface)",
        color: "var(--editor-text)",
        overflowY: "auto",
        padding: "14px 12px",
        ...style,
      }}
    >
      <div style={heading}>Add node</div>
      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 12 }}>
          <div style={categoryLabel}>{group.category}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {group.entries.map((entry) => (
              <button
                key={entry.kind}
                type="button"
                style={itemStyle}
                title={`${entry.description}${onDropNode ? " Drag onto the canvas to place." : ""}`}
                {...itemHandlers(entry.kind, entry.label, entry.glyph, roleVar(entry.colorRole))}
              >
                <NodeGlyph name={entry.glyph} size={17} color={roleVar(entry.colorRole)} />
                <span>{entry.label}</span>
              </button>
            ))}
            {group.category === "Annotate" ? (
              <button
                type="button"
                style={itemStyle}
                title="A styled label chip (bubble tag). Pick the style in the Inspector."
                {...itemHandlers("text", "Tag", "type", roleVar("orange"), {
                  label: "Tag",
                  meta: { labelStyle: "bubble" },
                })}
              >
                <NodeGlyph name="type" size={17} color={roleVar("orange")} />
                <span>Tag</span>
              </button>
            ) : null}
          </div>
        </div>
      ))}

      {ghost ? (
        <div
          aria-hidden
          style={{
            position: "fixed",
            left: ghost.x,
            top: ghost.y,
            transform: "translate(-50%, -120%)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 11px",
            borderRadius: 999,
            border: "1.5px solid var(--editor-border-soft)",
            background: "var(--editor-surface)",
            color: "var(--editor-text)",
            boxShadow: "var(--editor-shadow)",
            fontFamily: "var(--font-display, sans-serif)",
            fontWeight: 700,
            fontSize: "0.74rem",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <NodeGlyph name={ghost.glyph} size={14} color={ghost.color} />
          {ghost.label}
        </div>
      ) : null}
    </div>
  );
}

export default NodePalette;
