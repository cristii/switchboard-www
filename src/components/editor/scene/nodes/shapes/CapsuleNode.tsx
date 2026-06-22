// Capsule / pill — the trigger and output shape. A rounded box with a corner
// radius near half its smaller dimension reads as a stadium-shaped pill.

import { RoundedBox } from "@react-three/drei";
import type { ShapeProps } from "./types";

export function CapsuleNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const radius = (Math.min(depth, height) / 2) * 0.98;
  return (
    <RoundedBox
      args={[width, height, depth]}
      radius={radius}
      smoothness={6}
      position={[0, height / 2, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.42}
        metalness={0.06}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </RoundedBox>
  );
}
