// Edge labels, mirroring the node label pattern: an in-Canvas projector writes
// screen positions directly onto DOM chips (no per-frame React renders), and a
// DOM overlay (outside the Canvas) renders the chips. The label anchor is the
// midpoint of the source/target node centres (path-accurate midpoint is a
// future refinement). On-brand styling via editor tokens (hard shadow, no blur).

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { WorkflowEdge, WorkflowNode } from "../../state/types";

export type EdgeLabelsRegistry = Map<string, HTMLDivElement | null>;

function midpoint(edge: WorkflowEdge, nodes: WorkflowNode[]) {
  const s = nodes.find((n) => n.id === edge.source);
  const t = nodes.find((n) => n.id === edge.target);
  if (!s || !t) return null;
  return { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2 };
}

export interface EdgeLabelProjectorProps {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  registry: React.MutableRefObject<EdgeLabelsRegistry>;
}

/** Runs inside the Canvas; positions the DOM chips each frame. */
export function EdgeLabelProjector({ edges, nodes, registry }: EdgeLabelProjectorProps) {
  const { camera, gl } = useThree();
  const vec = React.useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const rect = gl.domElement.getBoundingClientRect();
    for (const edge of edges) {
      if (!edge.label || edge.labelOrientation) continue; // 3D labels render in-scene
      const el = registry.current.get(edge.id);
      if (!el) continue;
      const mid = midpoint(edge, nodes);
      if (!mid) continue;
      vec.set(mid.x, 0.7, mid.y);
      vec.project(camera);
      const x = (vec.x * 0.5 + 0.5) * rect.width;
      const y = (-vec.y * 0.5 + 0.5) * rect.height;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
  });
  return null;
}

export interface EdgeLabelsLayerProps {
  edges: WorkflowEdge[];
  registry: React.MutableRefObject<EdgeLabelsRegistry>;
}

const wrapper: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  pointerEvents: "none",
  willChange: "transform",
};

const chip: React.CSSProperties = {
  padding: "2px 7px",
  borderRadius: 6,
  whiteSpace: "nowrap",
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.62rem",
  fontWeight: 600,
  background: "var(--editor-surface)",
  color: "var(--editor-text-muted)",
  border: "1.5px solid var(--editor-border-soft)",
  boxShadow: "var(--editor-shadow)",
};

/** DOM overlay (outside the Canvas) of edge-label chips. */
export function EdgeLabelsLayer({ edges, registry }: EdgeLabelsLayerProps) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 9 }} aria-hidden>
      {edges
        .filter((e) => e.label && !e.labelOrientation)
        .map((edge) => (
          <div
            key={edge.id}
            ref={(el) => {
              if (el) registry.current.set(edge.id, el);
              else registry.current.delete(edge.id);
            }}
            style={wrapper}
          >
            <div style={chip}>{edge.label}</div>
          </div>
        ))}
    </div>
  );
}
