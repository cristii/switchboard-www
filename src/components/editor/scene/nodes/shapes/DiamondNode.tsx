// Diamond — the logic / switch / merge shape. An octahedron, scaled in Y to the
// node height and lifted so its lower point rests on the ground.

import { NodeStandardMaterial } from "./NodeStandardMaterial";
import type { ShapeProps } from "./types";

export function DiamondNode({ width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness }: ShapeProps) {
  const radius = Math.min(width, depth) / 2;
  const scaleY = height / (2 * radius);
  return (
    <mesh
      position={[0, height / 2, 0]}
      scale={[1, scaleY, 1]}
      rotation={[0, Math.PI / 4, 0]}
      castShadow
      receiveShadow
    >
      <octahedronGeometry args={[radius, 0]} />
      <NodeStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        roughness={roughness}
        metalness={metalness}
        defaultRoughness={0.45}
        defaultMetalness={0.1}
        flatShading
      />
    </mesh>
  );
}
