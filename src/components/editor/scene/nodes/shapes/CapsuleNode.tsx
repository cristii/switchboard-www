// Capsule / pill — the trigger and output shape. A rounded box with a corner
// radius near half its smaller dimension reads as a stadium-shaped pill.

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import type { ShapeProps } from "./types";

export function CapsuleNode({ width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness }: ShapeProps) {
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
      <NodeStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        roughness={roughness}
        metalness={metalness}
      />
    </RoundedBox>
  );
}
