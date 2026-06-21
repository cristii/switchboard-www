"use client";

// The node palette: categories + kinds generated from the catalog (never a
// hardcoded list). Click a kind to add it. Editor-primitive styling (inline +
// editor CSS variables, Tailwind-free) so it renders in Storybook and on-brand.
// See description.md §7.

import * as React from "react";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { catalogByCategory } from "../catalog/nodeCatalog";
import { NodeGlyph } from "../icons/NodeGlyph";
import type { NodeColorRole, NodeKind } from "../state/types";

const roleVar = (role: NodeColorRole) => `var(--node-${role})`;

export interface NodePaletteProps {
  /** Called when a kind is chosen. Defaults to the store's addNode. */
  onAdd?: (kind: NodeKind) => void;
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

const item: React.CSSProperties = {
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
  cursor: "pointer",
  textAlign: "left",
};

export function NodePalette({ onAdd, className, style }: NodePaletteProps) {
  const addNode = useWorkflowStore((s) => s.addNode);
  const handleAdd = onAdd ?? ((k: NodeKind) => void addNode(k));
  const groups = catalogByCategory();

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
                style={item}
                title={entry.description}
                onClick={() => handleAdd(entry.kind)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--editor-surface-2)";
                  e.currentTarget.style.borderColor = "var(--editor-border-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <NodeGlyph name={entry.glyph} size={17} color={roleVar(entry.colorRole)} />
                <span>{entry.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NodePalette;
