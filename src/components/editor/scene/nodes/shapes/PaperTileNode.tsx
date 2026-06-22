// Flat paper tile — the annotation / note shape. A thin, low-sheen rounded tile
// rendered in a paper tone (NodeMesh passes the theme paper colour for notes).

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import type { ShapeProps } from "./types";

export function PaperTileNode({ width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness }: ShapeProps) {
  const h = Math.max(0.12, height);
  return (
    <RoundedBox
      args={[width, h, depth]}
      radius={Math.min(0.04, h / 2 - 0.001)}
      smoothness={3}
      position={[0, h / 2, 0]}
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
        defaultRoughness={0.85}
        defaultMetalness={0}
      />
    </RoundedBox>
  );
}
