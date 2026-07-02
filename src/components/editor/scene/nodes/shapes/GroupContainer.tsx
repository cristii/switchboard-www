// Group / container node: a low translucent platform that child nodes sit on,
// representing a tier/layer (e.g. an "AI Processing Layer" or an availability
// zone). A translucent rounded slab by default; `meta.platform` switches the look:
//   "disc" — a soft round platform; "hex" — a double-layer rounded hexagon;
//   "slab" — two equal stacked rounded-square cuboids (solid colour base + near-white
//   top; rounded VERTICAL edges, sharp horizontal edges — the "signal" theme's
//   capability look); "base" — a single solid colour rounded slab (a resizable tray
//   that groups n8n-style `nodeCard`s sitting on top via meta.elevation). depthWrite
// is off on the translucent default so children render cleanly over it.
// See description.md §7; membership + cascade-move live in the store / NodeMesh.

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { getNodeCatalogEntry } from "../../../catalog/nodeCatalog";
import { roundedHexGeometry } from "./hexGeometry";
import { roundedRectPrismGeometry } from "./slabGeometry";
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
  const base = platform === "base";

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

  // Slab: a flat solid-colour base + an identical near-white cuboid, both FLOATING
  // with one layer-height of air below the base and between the layers. `height` is
  // ONE layer's height, so the layers sit at y=[1,2]·h and [3,4]·h and the top
  // surface (plate-top) is at y = 4·height — the icon's meta.elevation.
  const layerH = Math.max(0.16, height);
  const slabRad = Math.min(0.6, Math.min(width, depth) * 0.16);
  const slabGeo = useMemo(
    () => (slab ? roundedRectPrismGeometry(width, depth, layerH, slabRad) : null),
    [slab, width, depth, layerH, slabRad],
  );
  // A single colored rounded slab "base" — a resizable tray that holds nodeCards.
  const baseH = Math.max(0.16, height);
  const baseGeo = useMemo(
    () => (base ? roundedRectPrismGeometry(width, depth, baseH, Math.min(0.5, Math.min(width, depth) * 0.1)) : null),
    [base, width, depth, baseH],
  );
  useEffect(() => () => {
    bottomGeo?.dispose();
    topGeo?.dispose();
    slabGeo?.dispose();
    baseGeo?.dispose();
  }, [bottomGeo, topGeo, slabGeo, baseGeo]);

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

  // Slab: solid colour base + an identical near-white cuboid, both floating (one
  // layer of air below the base, one between the layers; rounded vertical edges).
  if (slab && slabGeo) {
    return (
      <group>
        <mesh geometry={slabGeo} position={[0, layerH, 0]} castShadow receiveShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.66}
            metalness={0}
            emissive={selected ? theme.selection : color}
            emissiveIntensity={selected ? 0.3 : 0.05}
          />
        </mesh>
        <mesh geometry={slabGeo} position={[0, layerH * 3, 0]} castShadow receiveShadow>
          {/* toneMapped off so the white renders as true white (matching the DOM card)
              instead of ACES-compressed grey; a little emissive lifts the shaded sides. */}
          <meshStandardMaterial
            color={lighten(color, 0.99)}
            roughness={0.78}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.12}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  }

  // Colored "base" tray: one solid rounded slab, resizable to group nodeCards.
  // FLOATS one base-height off the ground (gap below) so it casts a soft shadow on
  // the floor, like the /services slabs. nodeCards sit on top via meta.elevation =
  // 2·baseH (the floated top). A slightly lighter inset top plate gives the tray a
  // designed two-tone surface (the premium "deck" read) without touching geometry.
  if (base && baseGeo) {
    return (
      <group>
        <mesh geometry={baseGeo} position={[0, baseH, 0]} castShadow receiveShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0}
            emissive={selected ? theme.selection : color}
            emissiveIntensity={selected ? 0.3 : 0.05}
          />
        </mesh>
        <mesh position={[0, baseH * 2 + 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[Math.max(0.1, width - 0.36), Math.max(0.1, depth - 0.36)]} />
          <meshStandardMaterial
            color={lighten(color, 0.14)}
            roughness={0.78}
            metalness={0}
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </mesh>
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
