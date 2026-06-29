// Desktop monitor — a bezel screen on a neck + base. The screen face is a lighter
// tone derived from the body colour. Screen faces +Z (a visible iso plane).

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { bodyProps, lighten } from "./deviceTones";
import type { ShapeProps } from "./types";

export function MonitorNode(props: ShapeProps) {
  const { width: w, depth: d, height: h, color } = props;
  const screenH = h * 0.6;
  const screenY = h * 0.36 + screenH / 2;
  const screen = lighten(color, 0.55);
  return (
    <group>
      <RoundedBox args={[w * 0.5, h * 0.05, d * 0.55]} radius={0.02} smoothness={2} position={[0, h * 0.025, 0]} castShadow receiveShadow>
        <NodeStandardMaterial {...bodyProps(props)} />
      </RoundedBox>
      <mesh position={[0, h * 0.2, 0]} castShadow>
        <boxGeometry args={[w * 0.1, h * 0.34, d * 0.1]} />
        <NodeStandardMaterial {...bodyProps(props)} />
      </mesh>
      <RoundedBox args={[w, screenH, d * 0.16]} radius={0.05} smoothness={3} position={[0, screenY, 0]} castShadow receiveShadow>
        <NodeStandardMaterial {...bodyProps(props)} />
      </RoundedBox>
      <mesh position={[0, screenY, d * 0.085]}>
        <boxGeometry args={[w * 0.86, screenH * 0.82, 0.02]} />
        <meshStandardMaterial color={screen} roughness={0.25} metalness={0.05} />
      </mesh>
    </group>
  );
}
