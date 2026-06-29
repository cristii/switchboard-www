// Server stack — three hexagonal prisms stacked with small gaps (the "hex DB
// stack" from the architecture references). A flat hex face reads toward the view.

import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { bodyProps } from "./deviceTones";
import type { ShapeProps } from "./types";

export function ServerStackNode(props: ShapeProps) {
  const { width: w, depth: d, height: h } = props;
  const radius = (Math.min(w, d) / 2) * 0.92;
  const slabH = h * 0.26;
  const gap = h * 0.1;
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, slabH / 2 + i * (slabH + gap), 0]}
          rotation={[0, Math.PI / 6, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[radius, radius, slabH, 6]} />
          <NodeStandardMaterial {...bodyProps(props)} />
        </mesh>
      ))}
    </group>
  );
}
