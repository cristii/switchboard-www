// Stacked slabs — the queue / message-bus shape. Three thin rounded plates with
// small gaps, reading as a stack of buffered items.

import { RoundedBox } from "@react-three/drei";
import type { ShapeProps } from "./types";

export function SlabNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const slabH = height * 0.24;
  const gap = height * 0.14;
  const radius = Math.min(0.05, slabH / 2 - 0.001);
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[width, slabH, depth]}
          radius={radius}
          smoothness={3}
          position={[0, slabH / 2 + i * (slabH + gap), 0]}
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
      ))}
    </group>
  );
}
