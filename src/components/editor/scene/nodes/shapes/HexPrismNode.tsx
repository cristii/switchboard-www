// Hexagonal prism — the AI / agent shape. A cylinder with 6 radial segments is
// a clean hex prism; rotated so a flat face reads toward the camera.

import { NodeStandardMaterial } from "./NodeStandardMaterial";
import type { ShapeProps } from "./types";

export function HexPrismNode({ width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness }: ShapeProps) {
  const radius = Math.min(width, depth) / 2;
  return (
    <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 6]} />
      <NodeStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}
