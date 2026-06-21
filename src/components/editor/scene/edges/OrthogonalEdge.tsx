// Renders one edge: a routed drei <Line> (pickable, supports width + dashed) plus
// a cone arrowhead at the target. Clicking selects the edge. A small per-edge
// height stagger (laneIndex) keeps parallel runs from perfectly overlapping.

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { getRoutePoints } from "./edgeRouting";
import { useWorkflowStore } from "../../state/useWorkflowStore";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowEdge, WorkflowNode } from "../../state/types";

export interface OrthogonalEdgeProps {
  edge: WorkflowEdge;
  nodes: WorkflowNode[];
  theme: SceneTheme;
  selected: boolean;
  laneIndex?: number;
}

const UP = new THREE.Vector3(0, 1, 0);

export function OrthogonalEdge({ edge, nodes, theme, selected, laneIndex = 0 }: OrthogonalEdgeProps) {
  const selectEdge = useWorkflowStore((s) => s.selectEdge);
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);

  const nodesKey = nodes.map((n) => `${n.id}:${n.x.toFixed(3)},${n.y.toFixed(3)}`).join("|");
  const points = useMemo(() => {
    if (!source || !target) return [] as { x: number; y: number }[];
    return getRoutePoints(edge.routing, source, target, nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edge.routing, source?.x, source?.y, target?.x, target?.y, nodesKey]);

  const y = 0.5 + laneIndex * 0.04;
  const vecs = useMemo(() => points.map((p) => new THREE.Vector3(p.x, y, p.y)), [points, y]);

  if (!source || !target || vecs.length < 2) return null;

  const color = selected ? theme.selection : (edge.color ?? theme.edge);
  const end = vecs[vecs.length - 1];
  const prev = vecs[vecs.length - 2];
  const dir = new THREE.Vector3().subVectors(end, prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);

  return (
    <group>
      <Line
        points={vecs}
        color={color}
        lineWidth={selected ? 3.6 : 2}
        dashed={edge.style === "dashed"}
        dashSize={0.3}
        gapSize={0.18}
        onClick={(e) => {
          e.stopPropagation();
          selectEdge(edge.id);
        }}
      />
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.11, 0.26, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
