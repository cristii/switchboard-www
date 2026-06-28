// Thick tube connector: a TubeGeometry swept along the routed path (radius scaled
// from the theme line width) with a lit standard material + a cone arrowhead.

import { useMemo } from "react";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const UP = new THREE.Vector3(0, 1, 0);

export function TubeConnector({ points, color, width, arrowSize, onSelect }: ConnectorProps) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const radius = Math.max(0.03, width * 0.03);
  const end = points[points.length - 1];
  const prev = points[points.length - 2] ?? points[0];
  const dir = new THREE.Vector3().subVectors(end, prev).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
  const segments = Math.max(12, points.length * 6);

  return (
    <group>
      <mesh onClick={onSelect} castShadow>
        <tubeGeometry args={[curve, segments, radius, 8, false]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[radius * 2.6 * arrowSize, radius * 6 * arrowSize, 14]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
      </mesh>
    </group>
  );
}
