// Group / container node: a low translucent slab that child nodes sit on,
// representing a tier/layer (e.g. an "AI Processing Layer"). Sized to the node's
// width/depth (resizable via the P6 inspector). depthWrite is off so children
// render cleanly over it. Its label comes from the standard label overlay.
// See description.md §7; membership + cascade-move live in the store / NodeMesh.

import { RoundedBox } from "@react-three/drei";
import { getNodeCatalogEntry } from "../../../catalog/nodeCatalog";
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

  return (
    <RoundedBox
      args={[width, height, depth]}
      radius={0.1}
      smoothness={3}
      position={[0, height / 2, 0]}
    >
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
    </RoundedBox>
  );
}
