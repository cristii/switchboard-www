// Renders one edge: a routed drei <Line> (pickable, width + dashed) + a cone
// arrowhead, and — when edge.flow is set — an animated "data flow" pulse of small
// dots travelling source→target along the path. Clicking selects the edge.

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRoutePoints } from "./edgeRouting";
import { TextLabel } from "../nodes/shapes/TextNode";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { EdgeFlow as EdgeFlowMode, WorkflowEdge, WorkflowNode } from "../../state/types";

export interface OrthogonalEdgeProps {
  edge: WorkflowEdge;
  nodes: WorkflowNode[];
  theme: SceneTheme;
  selected: boolean;
  laneIndex?: number;
  /** Called on click when set (editor). Omit for read-only previews. */
  onSelect?: (id: string) => void;
}

const UP = new THREE.Vector3(0, 1, 0);
const FLOW_SPEED: Record<Exclude<EdgeFlowMode, "off">, number> = {
  slow: 0.12,
  normal: 0.25,
  fast: 0.5,
};
const FLOW_DOTS = 3;

function EdgeFlow({ points, color, speed }: { points: THREE.Vector3[]; color: string; speed: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const refs = useRef<(THREE.Object3D | null)[]>([]);
  const phase = useRef(0);
  const reduced = usePrefersReducedMotion();

  useFrame((_, dt) => {
    if (!reduced) phase.current = (phase.current + dt * speed) % 1;
    for (let k = 0; k < FLOW_DOTS; k++) {
      const t = (phase.current + k / FLOW_DOTS) % 1;
      const p = curve.getPointAt(t);
      refs.current[k]?.position.copy(p);
    }
  });

  return (
    <>
      {Array.from({ length: FLOW_DOTS }).map((_, k) => (
        <mesh
          key={k}
          ref={(el) => {
            refs.current[k] = el;
          }}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

export function OrthogonalEdge({ edge, nodes, theme, selected, laneIndex = 0, onSelect }: OrthogonalEdgeProps) {
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
  const flow = edge.flow ?? "off";
  const arrow = theme.arrowSize;
  const midVec = vecs[Math.floor((vecs.length - 1) / 2)] ?? end;

  return (
    <group>
      <Line
        points={vecs}
        color={color}
        lineWidth={selected ? theme.edgeWidthSelected : theme.edgeWidth}
        dashed={edge.style === "dashed"}
        dashSize={0.3}
        gapSize={0.18}
        onClick={
          onSelect
            ? (e) => {
                e.stopPropagation();
                onSelect(edge.id);
              }
            : undefined
        }
      />
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.11 * arrow, 0.26 * arrow, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {flow !== "off" ? <EdgeFlow points={vecs} color={theme.flow} speed={FLOW_SPEED[flow]} /> : null}
      {edge.labelOrientation && edge.label ? (
        <group position={[midVec.x, 0, midVec.z]}>
          <TextLabel
            text={edge.label}
            color={theme.text.color}
            opacity={theme.text.opacity}
            size={theme.text.size * 0.8}
            orientation={edge.labelOrientation}
            font={theme.text.font}
            selected={selected}
            selectionColor={theme.selection}
          />
        </group>
      ) : null}
    </group>
  );
}
