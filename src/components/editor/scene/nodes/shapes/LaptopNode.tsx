// Laptop — a keyboard deck + a screen leaning back. Screen face is a lighter tone.

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { bodyProps, darken, lighten } from "./deviceTones";
import type { ShapeProps } from "./types";

export function LaptopNode(props: ShapeProps) {
  const { width: w, depth: d, height: h, color } = props;
  const screen = lighten(color, 0.55);
  const deck = darken(color, 0.06);
  return (
    <group>
      {/* keyboard deck */}
      <RoundedBox args={[w, h * 0.12, d]} radius={0.04} smoothness={3} position={[0, h * 0.06, 0]} castShadow receiveShadow>
        <NodeStandardMaterial {...bodyProps(props)} />
      </RoundedBox>
      <mesh position={[0, h * 0.121, d * 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.82, d * 0.7]} />
        <meshStandardMaterial color={deck} roughness={0.7} metalness={0} />
      </mesh>
      {/* screen, leaning back */}
      <group position={[0, h * 0.12, -d * 0.46]} rotation={[-0.36, 0, 0]}>
        <RoundedBox args={[w * 0.96, h * 0.78, d * 0.07]} radius={0.04} smoothness={3} position={[0, (h * 0.78) / 2, 0]} castShadow receiveShadow>
          <NodeStandardMaterial {...bodyProps(props)} />
        </RoundedBox>
        <mesh position={[0, (h * 0.78) / 2, d * 0.04]}>
          <boxGeometry args={[w * 0.82, h * 0.62, 0.02]} />
          <meshStandardMaterial color={screen} roughness={0.25} metalness={0.05} />
        </mesh>
      </group>
    </group>
  );
}
