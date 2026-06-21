// DOM overlay of node labels, positioned each frame by LabelProjector via the
// shared registry ref. Styled with editor CSS variables (Tailwind-free, hard
// shadow, no blur) so it stays on-brand and renders correctly in Storybook.

import * as React from "react";
import type { Selection, WorkflowNode } from "../state/types";

/** id → label wrapper element (or null while unmounted). */
export type LabelsRegistry = Map<string, HTMLDivElement | null>;

export interface LabelsLayerProps {
  nodes: WorkflowNode[];
  selection: Selection;
  labelsRef: React.MutableRefObject<LabelsRegistry>;
}

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 10,
};

const wrapperStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  pointerEvents: "none",
  willChange: "transform",
};

export function LabelsLayer({ nodes, selection, labelsRef }: LabelsLayerProps) {
  return (
    <div style={overlayStyle} aria-hidden>
      {nodes.map((node) => {
        const isSelected = selection?.type === "node" && selection.id === node.id;
        const labelStyle: React.CSSProperties = {
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          padding: "4px 9px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          background: "var(--editor-surface)",
          color: "var(--editor-text)",
          border: `1.5px solid ${isSelected ? "var(--editor-selection)" : "var(--editor-border-soft)"}`,
          boxShadow: "var(--editor-shadow)",
        };
        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) labelsRef.current.set(node.id, el);
              else labelsRef.current.delete(node.id);
            }}
            style={wrapperStyle}
          >
            <div style={labelStyle}>
              <span
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.01em",
                }}
              >
                {node.label}
              </span>
              {node.sublabel ? (
                <span
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: "0.62rem",
                    color: "var(--editor-text-muted)",
                  }}
                >
                  {node.sublabel}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
