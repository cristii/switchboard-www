// Corner-connect connector — the reference "corner connect": a dashed line with
// small squared L-bracket terminals at each end (and no arrowhead). The signature
// quiet connector of the architecture-diagram look. Pairs with orthogonal routing.

import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const UP = new THREE.Vector3(0, 1, 0);

/** An "L" bracket at `corner`: a short tick along the path + a short perpendicular. */
function bracket(corner: THREE.Vector3, along: THREE.Vector3, perp: THREE.Vector3, b: number) {
  return [
    corner.clone().addScaledVector(perp, b),
    corner.clone(),
    corner.clone().addScaledVector(along, b),
  ];
}

export function CornerConnect({ points, color, width, onSelect }: ConnectorProps) {
  if (points.length < 2) return null;
  const b = 0.5;
  const lw = Math.max(1.5, width * 0.6);
  const start = points[0];
  const next = points[1];
  const end = points[points.length - 1];
  const prev = points[points.length - 2];
  const aStart = new THREE.Vector3().subVectors(next, start).normalize();
  const aEnd = new THREE.Vector3().subVectors(prev, end).normalize();
  const pStart = new THREE.Vector3().crossVectors(aStart, UP).normalize();
  const pEnd = new THREE.Vector3().crossVectors(aEnd, UP).normalize();

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={lw}
        dashed
        dashSize={0.34}
        gapSize={0.22}
        onClick={onSelect}
      />
      <Line points={bracket(start, aStart, pStart, b)} color={color} lineWidth={lw} />
      <Line points={bracket(end, aEnd, pEnd, b)} color={color} lineWidth={lw} />
    </group>
  );
}
