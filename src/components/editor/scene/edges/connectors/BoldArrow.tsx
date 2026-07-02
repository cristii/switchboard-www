// Bold-arrow connector — the reference "basic arrows": a thick line + a large
// filled cone head. Reads as a confident primary-flow arrow.

import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const UP = new THREE.Vector3(0, 1, 0);

export function BoldArrow({ points, color, width, arrowSize, dashed, onSelect, onContextMenu }: ConnectorProps) {
  const end = points[points.length - 1];
  const prev = points[points.length - 2] ?? points[0];
  const dir = new THREE.Vector3().subVectors(end, prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
  const lw = Math.max(3, width * 1.6);
  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={lw}
        dashed={dashed}
        dashSize={0.3}
        gapSize={0.18}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      />
      {onSelect || onContextMenu ? (
        <Line
          points={points}
          color={color}
          lineWidth={Math.max(14, lw * 3)}
          transparent
          opacity={0}
          depthWrite={false}
          onClick={onSelect}
          onContextMenu={onContextMenu}
        />
      ) : null}
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.18 * arrowSize, 0.44 * arrowSize, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
