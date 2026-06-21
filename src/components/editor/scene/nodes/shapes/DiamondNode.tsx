// Diamond — the logic / switch / merge shape. An octahedron, scaled in Y to the
// node height and lifted so its lower point rests on the ground.

import type { ShapeProps } from "./types";

export function DiamondNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const radius = Math.min(width, depth) / 2;
  const scaleY = height / (2 * radius);
  return (
    <mesh position={[0, height / 2, 0]} scale={[1, scaleY, 1]} rotation={[0, Math.PI / 4, 0]}>
      <octahedronGeometry args={[radius, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.45}
        metalness={0.1}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        flatShading
      />
    </mesh>
  );
}
