"use client";

// Right-hand inspector for the selected node or edge. Node: kind, label,
// sublabel, colour swatches, position, group size, connected edges, delete.
// Edge: source → target, routing, style, label, delete. Empty state otherwise.
// Editor-token styled, Tailwind-free. Mirrors the prototype inspector, on-brand.

import * as React from "react";
import { animated, useSpring } from "@react-spring/web";
import { Field } from "../primitives/Field";
import { Select } from "../primitives/Select";
import { IconButton } from "../primitives/IconButton";
import { NodeGlyph } from "../icons/NodeGlyph";
import { getNodeCatalogEntry } from "../catalog/nodeCatalog";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { NodeColorRole } from "../state/types";

const SWATCHES: { role: NodeColorRole; hex: string }[] = [
  { role: "orange", hex: "#b45309" },
  { role: "green", hex: "#3f7a4e" },
  { role: "violet", hex: "#6a4a8a" },
  { role: "amber", hex: "#fbbf24" },
  { role: "ink", hex: "#15211f" },
];

const heading: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: "0 0 12px",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.58rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: "0 0 5px",
};

const value: React.CSSProperties = {
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.84rem",
  color: "var(--editor-text)",
};

const deleteBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  width: "100%",
  marginTop: 6,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border-soft)",
  background: "transparent",
  color: "var(--editor-text-muted)",
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.74rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  cursor: "pointer",
};

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 12 }}>{children}</div>;
}

export interface InspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Inspector({ className, style }: InspectorProps) {
  const selection = useWorkflowStore((s) => s.selection);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNode = useWorkflowStore((s) => s.updateNode);
  const updateEdge = useWorkflowStore((s) => s.updateEdge);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);

  const node = selection?.type === "node" ? nodes.find((n) => n.id === selection.id) : undefined;
  const edge = selection?.type === "edge" ? edges.find((e) => e.id === selection.id) : undefined;

  const reduced = usePrefersReducedMotion();
  const selKey = selection ? `${selection.type}:${selection.id}` : "none";
  const [styles, api] = useSpring(() => ({ opacity: 1, transform: "translateX(0px)" }));
  React.useEffect(() => {
    if (reduced) {
      api.set({ opacity: 1, transform: "translateX(0px)" });
      return;
    }
    api.start({
      from: { opacity: 0, transform: "translateX(10px)" },
      to: { opacity: 1, transform: "translateX(0px)" },
      config: { tension: 300, friction: 28 },
    });
  }, [selKey, reduced, api]);

  const container: React.CSSProperties = {
    background: "var(--editor-surface)",
    color: "var(--editor-text)",
    overflowY: "auto",
    padding: "14px 14px 20px",
    ...style,
  };

  const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <div className={className} style={container}>
      <div style={heading}>Inspector</div>

      <animated.div style={styles}>
      {node ? (
        <>
          <Row>
            <div style={sectionLabel}>Type</div>
            <div style={{ ...value, display: "flex", alignItems: "center", gap: 8, textTransform: "capitalize" }}>
              <NodeGlyph name={getNodeCatalogEntry(node.kind).glyph} size={16} color={`var(--node-${getNodeCatalogEntry(node.kind).colorRole})`} />
              {getNodeCatalogEntry(node.kind).label}
            </div>
          </Row>

          <Row>
            <Field key={`label-${node.id}`} label="Label" defaultValue={node.label} onCommit={(v) => v.trim() && updateNode(node.id, { label: v.trim() })} />
          </Row>
          <Row>
            <Field key={`sub-${node.id}`} label="Sublabel" defaultValue={node.sublabel ?? ""} placeholder="optional" onCommit={(v) => updateNode(node.id, { sublabel: v.trim() || undefined })} />
          </Row>

          <Row>
            <div style={sectionLabel}>Colour</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SWATCHES.map((s) => (
                <button
                  key={s.role}
                  type="button"
                  title={s.role}
                  aria-label={`Colour ${s.role}`}
                  onClick={() => updateNode(node.id, { color: s.hex })}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: node.color === s.hex ? "2px solid var(--editor-text)" : "1.5px solid var(--editor-border-soft)",
                    background: `var(--node-${s.role})`,
                    cursor: "pointer",
                    flex: "none",
                  }}
                />
              ))}
              <button
                type="button"
                title="Default colour"
                onClick={() => updateNode(node.id, { color: undefined })}
                style={{
                  height: 22,
                  padding: "0 8px",
                  borderRadius: 6,
                  border: !node.color ? "2px solid var(--editor-text)" : "1.5px solid var(--editor-border-soft)",
                  background: "var(--editor-surface-2)",
                  color: "var(--editor-text-muted)",
                  fontSize: "0.66rem",
                  cursor: "pointer",
                }}
              >
                Default
              </button>
            </div>
          </Row>

          {node.kind === "group" ? (
            <Row>
              <div style={sectionLabel}>Size</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Field key={`w-${node.id}`} label="Width" type="number" defaultValue={node.width ?? getNodeCatalogEntry("group").defaultSize.width} onCommit={(v) => Number(v) > 0 && updateNode(node.id, { width: Number(v) })} />
                <Field key={`d-${node.id}`} label="Depth" type="number" defaultValue={node.depth ?? getNodeCatalogEntry("group").defaultSize.depth} onCommit={(v) => Number(v) > 0 && updateNode(node.id, { depth: Number(v) })} />
              </div>
            </Row>
          ) : null}

          <Row>
            <div style={sectionLabel}>Position</div>
            <div style={{ ...value, fontFamily: "var(--font-mono, monospace)", fontSize: "0.74rem", color: "var(--editor-text-muted)" }}>
              x {node.x.toFixed(2)} · y {node.y.toFixed(2)}
            </div>
          </Row>

          {(() => {
            const connected = edges.filter((e) => e.source === node.id || e.target === node.id);
            if (connected.length === 0) return null;
            return (
              <Row>
                <div style={sectionLabel}>Connections</div>
                {connected.map((e) => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                    <button
                      type="button"
                      onClick={() => selectEdge(e.id)}
                      style={{ background: "transparent", border: "none", color: "var(--editor-text-muted)", fontSize: "0.74rem", cursor: "pointer", padding: 0, textAlign: "left", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {labelOf(e.source)} → {labelOf(e.target)}
                    </button>
                    <IconButton label="Delete connection" glyph="trash" size={24} onClick={() => deleteEdge(e.id)} />
                  </div>
                ))}
              </Row>
            );
          })()}

          <button
            type="button"
            style={deleteBtn}
            onClick={() => deleteNode(node.id)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--editor-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--editor-border-soft)")}
          >
            <NodeGlyph name="trash" size={15} /> Delete node
          </button>
        </>
      ) : edge ? (
        <>
          <Row>
            <div style={sectionLabel}>Connection</div>
            <div style={value}>
              {labelOf(edge.source)} → {labelOf(edge.target)}
            </div>
          </Row>
          <Row>
            <Select
              label="Routing"
              value={edge.routing ?? "orthogonal"}
              options={[
                { value: "orthogonal", label: "Orthogonal" },
                { value: "smooth", label: "Smooth" },
                { value: "direct", label: "Direct" },
              ]}
              onChange={(v) => updateEdge(edge.id, { routing: v as "orthogonal" | "smooth" | "direct" })}
            />
          </Row>
          <Row>
            <Select
              label="Style"
              value={edge.style ?? "solid"}
              options={[
                { value: "solid", label: "Solid" },
                { value: "dashed", label: "Dashed (async)" },
              ]}
              onChange={(v) => updateEdge(edge.id, { style: v as "solid" | "dashed" })}
            />
          </Row>
          <Row>
            <Field key={`elabel-${edge.id}`} label="Label" defaultValue={edge.label ?? ""} placeholder="optional" onCommit={(v) => updateEdge(edge.id, { label: v.trim() || undefined })} />
          </Row>
          <button
            type="button"
            style={deleteBtn}
            onClick={() => deleteEdge(edge.id)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--editor-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--editor-border-soft)")}
          >
            <NodeGlyph name="trash" size={15} /> Delete connection
          </button>
        </>
      ) : (
        <p style={{ ...value, color: "var(--editor-text-muted)", fontStyle: "italic", fontSize: "0.8rem" }}>
          Select a node or connection to inspect it. Drag from a node&apos;s orange handle to connect.
        </p>
      )}
      </animated.div>
    </div>
  );
}

export default Inspector;
