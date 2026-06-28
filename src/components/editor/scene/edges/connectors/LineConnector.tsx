// Thin line connector (the default): a drei <Line> (pickable, width + dashed) and
// a cone arrowhead at the target end.

import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const UP = new THREE.Vector3(0, 1, 0);

export function LineConnector({ points, color, width, arrowSize, dashed, onSelect }: ConnectorProps) {
  const end = points[points.length - 1];
  const prev = points[points.length - 2] ?? points[0];
  const dir = new THREE.Vector3().subVectors(end, prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
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
      />
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.11 * arrowSize, 0.26 * arrowSize, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
