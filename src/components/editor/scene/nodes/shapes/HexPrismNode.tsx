// Hexagonal prism — the AI / agent shape. A cylinder with 6 radial segments is
// a clean hex prism; rotated so a flat face reads toward the camera.

import type { ShapeProps } from "./types";

export function HexPrismNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const radius = Math.min(width, depth) / 2;
  return (
    <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI / 6, 0]}>
      <cylinderGeometry args={[radius, radius, height, 6]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.08}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}
