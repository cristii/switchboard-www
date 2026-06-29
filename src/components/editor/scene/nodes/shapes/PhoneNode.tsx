// Phone — a tall thin rounded slab standing upright, with a lighter screen face
// (+Z) and a small camera dot.

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { bodyProps, lighten } from "./deviceTones";
import type { ShapeProps } from "./types";

export function PhoneNode(props: ShapeProps) {
  const { width: w, depth: d, height: h, color } = props;
  const bw = w * 0.64;
  const screen = lighten(color, 0.55);
  return (
    <group>
      <RoundedBox args={[bw, h, d * 0.18]} radius={bw * 0.16} smoothness={4} position={[0, h / 2, 0]} castShadow receiveShadow>
        <NodeStandardMaterial {...bodyProps(props)} />
      </RoundedBox>
      <mesh position={[0, h / 2, d * 0.1]}>
        <boxGeometry args={[bw * 0.82, h * 0.84, 0.02]} />
        <meshStandardMaterial color={screen} roughness={0.22} metalness={0.05} />
      </mesh>
      <mesh position={[0, h * 0.92, d * 0.105]}>
        <circleGeometry args={[bw * 0.05, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}
