// Cylinder — the classic database/datastore shape.

import type { ShapeProps } from "./types";

export function CylinderNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const radius = Math.min(width, depth) / 2;
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 48]} />
      <meshStandardMaterial
        color={color}
        roughness={0.42}
        metalness={0.06}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}
