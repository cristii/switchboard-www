// Renders one edge: a routed connector (line / tube / ribbon-arrow, picked by
// edge.connector ?? theme) following the path from the routing registry, plus —
// when edge.flow is set — an animated "data flow" pulse, and an optional 3D
// label. Clicking the connector selects the edge.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getRoutingAlgorithm } from "./routing";
import { CONNECTORS } from "./connectors";
import { TextLabel, isLabelStyle, labelPalette } from "../nodes/shapes/TextNode";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { EdgeFlow as EdgeFlowMode, WorkflowEdge, WorkflowNode } from "../../state/types";

export interface OrthogonalEdgeProps {
  edge: WorkflowEdge;
  nodes: WorkflowNode[];
  theme: SceneTheme;
  selected: boolean;
  laneIndex?: number;
  /** Total edges sharing this edge's source (for symmetric lane spread). */
  laneCount?: number;
  /** Index/count among edges sharing this edge's TARGET (fan-in spread). */
  laneInIndex?: number;
  laneInCount?: number;
  /** Master label toggle from the host/preview. @default true */
  showLabel?: boolean;
  /** Called on click when set (editor). Omit for read-only previews. */
  onSelect?: (id: string) => void;
  /** Right-click (editor: opens the edge context menu at client coords). */
  onContextMenu?: (id: string, x: number, y: number) => void;
}

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

export function OrthogonalEdge({
  edge,
  nodes,
  theme,
  selected,
  laneIndex = 0,
  laneCount = 1,
  laneInIndex = 0,
  laneInCount = 1,
  showLabel = true,
  onSelect,
  onContextMenu,
}: OrthogonalEdgeProps) {
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);
  const routing = edge.routing ?? theme.routing;

  const nodesKey = nodes.map((n) => `${n.id}:${n.x.toFixed(3)},${n.y.toFixed(3)}`).join("|");
  const points = useMemo(() => {
    if (!source || !target) return [] as { x: number; y: number; h?: number }[];
    return getRoutingAlgorithm(routing)(source, target, nodes, {
      laneIndex,
      laneCount,
      laneInIndex,
      laneInCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routing, source?.x, source?.y, target?.x, target?.y, nodesKey, laneIndex, laneCount, laneInIndex, laneInCount]);

  // Algorithms that emit per-point heights (iso stubs/rails) win; others get the
  // legacy mid-air lift with a tiny per-lane stagger.
  const y = 0.5 + laneIndex * 0.04;
  const vecs = useMemo(() => points.map((p) => new THREE.Vector3(p.x, p.h ?? y, p.y)), [points, y]);

  if (!source || !target || vecs.length < 2) return null;

  const color = selected ? theme.selection : (edge.color ?? theme.edge);
  const width = selected ? theme.edgeWidthSelected : theme.edgeWidth;
  const flow = edge.flow ?? "off";
  const Connector = CONNECTORS[edge.connector ?? theme.connector] ?? CONNECTORS.line;
  const labelMode = theme.labelMode;
  const labelOrientation = edge.labelOrientation ?? theme.text.orientation;
  const show3dLabel = showLabel && !!edge.label && (labelMode === "3d" || !!edge.labelOrientation);
  const midVec = vecs[Math.floor((vecs.length - 1) / 2)] ?? vecs[vecs.length - 1];
  const meta = (edge.meta ?? {}) as Record<string, unknown>;
  const labelStyle = isLabelStyle(meta.labelStyle) ? meta.labelStyle : theme.text.style;
  const labelPal = labelPalette(labelStyle, theme);
  const labelColor = typeof meta.labelColor === "string" ? meta.labelColor : labelPal.text;
  const labelSize = typeof meta.labelSize === "number" ? meta.labelSize : theme.text.size * 0.85;

  return (
    <group>
      <Connector
        points={vecs}
        color={color}
        width={width}
        arrowSize={theme.arrowSize}
        dashed={edge.style === "dashed"}
        onSelect={
          onSelect
            ? (e) => {
                e.stopPropagation();
                onSelect(edge.id);
              }
            : undefined
        }
        onContextMenu={
          onContextMenu
            ? (e) => {
                e.stopPropagation();
                const ne = e.nativeEvent as MouseEvent;
                ne.preventDefault?.();
                onContextMenu(edge.id, ne.clientX, ne.clientY);
              }
            : undefined
        }
      />
      {flow !== "off" ? <EdgeFlow points={vecs} color={theme.flow} speed={FLOW_SPEED[flow]} /> : null}
      {show3dLabel ? (
        <group position={[midVec.x, 0, midVec.z]}>
          <TextLabel
            label={edge.label as string}
            color={labelColor}
            opacity={theme.text.opacity}
            size={labelSize}
            orientation={labelOrientation}
            style={labelStyle}
            plate={labelPal.plate}
            font={theme.text.font}
            scale={theme.text.scale}
            offset={theme.text.offset}
            screenFit={theme.text.screenFit}
            selected={selected}
            selectionColor={theme.selection}
          />
        </group>
      ) : null}
    </group>
  );
}
