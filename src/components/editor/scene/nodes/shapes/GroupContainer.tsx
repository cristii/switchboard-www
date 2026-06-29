// Group / container node: a low translucent platform that child nodes sit on,
// representing a tier/layer (e.g. an "AI Processing Layer" or an availability
// zone). A translucent rounded slab by default; `meta.platform` switches the look:
//   "disc" — a soft round platform; "hex" — a double-layer rounded hexagon;
//   "slab" — a double-layer rounded SQUARE (solid colour base + floating white top
//   plate; the "signal" theme's capability-pillar look). depthWrite is off on the
// translucent default so children render cleanly over it. Label = standard overlay.
// See description.md §7; membership + cascade-move live in the store / NodeMesh.

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { getNodeCatalogEntry } from "../../../catalog/nodeCatalog";
import { roundedHexGeometry } from "./hexGeometry";
import { lighten } from "./deviceTones";
import type { SceneTheme } from "../../../theme/sceneTheme";
import type { WorkflowNode } from "../../../state/types";

export interface GroupContainerProps {
  node: WorkflowNode;
  theme: SceneTheme;
  selected: boolean;
}

export function GroupContainer({ node, theme, selected }: GroupContainerProps) {
  const entry = getNodeCatalogEntry("group");
  const width = node.width ?? entry.defaultSize.width;
  const depth = node.depth ?? entry.defaultSize.depth;
  const height = node.height ?? entry.defaultSize.height;
  const color = node.color ?? theme.nodeColors.ink;
  const platform = (node.meta as { platform?: string } | undefined)?.platform;
  const disc = platform === "disc";
  const hex = platform === "hex";
  const slab = platform === "slab";

  // Double-layer hex platform: solid bottom + lighter inset top, soft corners.
  const radius = Math.max(width, depth) / 2;
  const bottomH = Math.max(0.16, height);
  const topH = bottomH * 0.55;
  const bottomGeo = useMemo(
    () => (hex ? roundedHexGeometry(radius, Math.min(0.5, radius * 0.28), bottomH) : null),
    [hex, radius, bottomH],
  );
  const topGeo = useMemo(
    () => (hex ? roundedHexGeometry(radius * 0.88, Math.min(0.45, radius * 0.25), topH) : null),
    [hex, radius, topH],
  );
  useEffect(() => () => {
    bottomGeo?.dispose();
    topGeo?.dispose();
  }, [bottomGeo, topGeo]);

  if (hex && bottomGeo && topGeo) {
    return (
      <group>
        <mesh geometry={bottomGeo} position={[0, 0, 0]} receiveShadow castShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.78}
            metalness={0}
            emissive={selected ? theme.selection : color}
            emissiveIntensity={selected ? 0.25 : 0.04}
          />
        </mesh>
        <mesh geometry={topGeo} position={[0, bottomH * 0.92, 0]} receiveShadow>
          <meshStandardMaterial color={lighten(color, 0.62)} roughness={0.85} metalness={0} />
        </mesh>
      </group>
    );
  }

  // Double-layer rounded-square "slab": a solid coloured base with a floating,
  // near-white top plate the centred icon sits on (the icon's meta.elevation must
  // match the plate-top = bH·(1 + 0.12 + 0.5); keep these ratios in sync).
  if (slab) {
    const bH = Math.max(0.4, height);
    const gap = bH * 0.12;
    const tH = bH * 0.5;
    const rad = Math.min(0.22, Math.min(width, depth) * 0.12);
    return (
      <group>
        <RoundedBox args={[width, bH, depth]} radius={rad} smoothness={4} position={[0, bH / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.68}
            metalness={0}
            emissive={selected ? theme.selection : color}
            emissiveIntensity={selected ? 0.3 : 0.05}
          />
        </RoundedBox>
        <RoundedBox
          args={[width * 0.8, tH, depth * 0.8]}
          radius={rad * 0.9}
          smoothness={4}
          position={[0, bH + gap + tH / 2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={lighten(color, 0.9)} roughness={0.82} metalness={0} />
        </RoundedBox>
      </group>
    );
  }

  const material = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={selected ? 0.3 : 0.16}
      depthWrite={false}
      roughness={0.85}
      metalness={0}
      emissive={selected ? theme.selection : color}
      emissiveIntensity={selected ? 0.28 : 0.05}
    />
  );

  if (disc) {
    const radius = Math.max(width, depth) / 2;
    return (
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 56]} />
        {material}
      </mesh>
    );
  }

  return (
    <RoundedBox args={[width, height, depth]} radius={0.1} smoothness={3} position={[0, height / 2, 0]}>
      {material}
    </RoundedBox>
  );
}
