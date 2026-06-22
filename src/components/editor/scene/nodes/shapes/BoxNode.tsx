// A soft rounded box (a "card" extruded off the ground) — the default shape for
// action / service / integration nodes. Matte brand-coloured material with a
// restrained emissive lift — see description.md §3.

import { RoundedBox } from "@react-three/drei";
import type { ShapeProps } from "./types";

export function BoxNode({ width, depth, height, color, emissive, emissiveIntensity }: ShapeProps) {
  const radius = Math.min(0.1, height / 2 - 0.001);
  return (
    <RoundedBox
      args={[width, height, depth]}
      radius={radius}
      smoothness={4}
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
