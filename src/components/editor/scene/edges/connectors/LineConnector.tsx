// Thin line connector (the default): a drei <Line> (pickable, width + dashed) and
// a cone arrowhead at the target end.

import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const UP = new THREE.Vector3(0, 1, 0);

export function LineConnector({ points, color, width, arrowSize, dashed, onSelect, onContextMenu }: ConnectorProps) {
  const end = points[points.length - 1];
  const prev = points[points.length - 2] ?? points[0];
  const dir = new THREE.Vector3().subVectors(end, prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
  const arrowLen = 0.3 * arrowSize;
  // Seat the cone so its TIP lands exactly on the endpoint (instead of poking past
  // it into the node side).
  const arrowPos = new THREE.Vector3().copy(end).addScaledVector(dir, -arrowLen / 2);
  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={width}
        dashed={dashed}
        dashSize={0.3}
        gapSize={0.18}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      />
      {onSelect || onContextMenu ? (
        // Invisible fat twin: a comfortable click/tap target (editor only).
        <Line
          points={points}
          color={color}
          lineWidth={Math.max(14, width * 4)}
          transparent
          opacity={0}
          depthWrite={false}
          onClick={onSelect}
          onContextMenu={onContextMenu}
        />
      ) : null}
      {arrowSize > 0 ? (
        <mesh position={arrowPos} quaternion={quat}>
          <coneGeometry args={[0.1 * arrowSize, arrowLen, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}
