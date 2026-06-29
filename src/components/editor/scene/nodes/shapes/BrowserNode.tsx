// Browser window — a standing card with a title bar + three "traffic-light" dots
// and a lighter content face (+Z). Reads as a web app / browser.

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { bodyProps, darken, lighten } from "./deviceTones";
import type { ShapeProps } from "./types";

export function BrowserNode(props: ShapeProps) {
  const { width: w, depth: d, height: h, color } = props;
  const barH = h * 0.16;
  const content = lighten(color, 0.58);
  const bar = darken(color, 0.05);
  const dotColors = ["#e0683c", "#e8b339", "#5ba06b"]; // playful traffic lights
  return (
    <group>
      <RoundedBox args={[w, h, d * 0.14]} radius={0.05} smoothness={3} position={[0, h / 2, 0]} castShadow receiveShadow>
        <NodeStandardMaterial {...bodyProps(props)} />
      </RoundedBox>
      {/* content face */}
      <mesh position={[0, h * 0.42, d * 0.075]}>
        <boxGeometry args={[w * 0.9, h * 0.66, 0.02]} />
        <meshStandardMaterial color={content} roughness={0.3} metalness={0.04} />
      </mesh>
      {/* title bar */}
      <mesh position={[0, h - barH / 2 - h * 0.04, d * 0.076]}>
        <boxGeometry args={[w * 0.9, barH, 0.025]} />
        <meshStandardMaterial color={bar} roughness={0.6} metalness={0} />
      </mesh>
      {dotColors.map((c, i) => (
        <mesh key={c} position={[-w * 0.38 + i * w * 0.08, h - barH / 2 - h * 0.04, d * 0.092]}>
          <circleGeometry args={[w * 0.022, 14]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
