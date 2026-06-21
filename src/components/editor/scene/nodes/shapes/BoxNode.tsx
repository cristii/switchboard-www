// The first isometric node shape: a soft rounded box (a "card" extruded off the
// ground). Matte brand-coloured material with a restrained emissive lift — see
// description.md §3. The remaining shapes (cylinder, hex prism, …) arrive in P3.

import { RoundedBox } from "@react-three/drei";

export interface BoxNodeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
}

export function BoxNode({ width, depth, height, color, emissive, emissiveIntensity }: BoxNodeProps) {
  const radius = Math.min(0.1, height / 2 - 0.001);
  return (
    <RoundedBox
      args={[width, height, depth]}
      radius={radius}
      smoothness={4}
      position={[0, height / 2, 0]}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.08}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </RoundedBox>
  );
}
