// `nodeCard` kind — an n8n-style node: a white rounded 3D slab with a FLAT 2D icon
// texture on its top face (tinted to the node colour). The icon key comes from
// node.meta.icon (see iconTextures.ts). Rendered via a NodeMesh/PreviewNode branch
// (it needs meta, which the ShapeProps registry doesn't carry). White uses
// toneMapped=false so it reads as true white (matching the DOM cards), like the
// other slabs. Sits on a colored `base` group via meta.elevation.

import { useEffect, useMemo } from "react";
import { roundedRectPrismGeometry } from "./slabGeometry";
import { getIconTexture } from "./iconTextures";

export interface NodeCardNodeProps {
  width: number;
  depth: number;
  height: number;
  /** Icon-texture key (iconTextures.ts); omitted ⇒ a bare white card. */
  icon?: string;
  /** Tint applied to the white-drawn icon texture. */
  iconColor: string;
}

export function NodeCardNode({ width, depth, height, icon, iconColor }: NodeCardNodeProps) {
  const h = Math.max(0.18, height);
  const radius = Math.min(0.4, Math.min(width, depth) * 0.16);
  const geo = useMemo(() => roundedRectPrismGeometry(width, depth, h, radius), [width, depth, h, radius]);
  useEffect(() => () => geo.dispose(), [geo]);

  const tex = icon ? getIconTexture(icon) : null;
  const iconSize = Math.min(width, depth) * 0.66;

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0} toneMapped={false} />
      </mesh>
      {tex ? (
        <mesh position={[0, h + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[iconSize, iconSize]} />
          <meshBasicMaterial map={tex} color={iconColor} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}
