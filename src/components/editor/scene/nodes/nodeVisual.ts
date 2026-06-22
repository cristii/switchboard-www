// Shared resolver for a node's visual properties (shape, size, colours) from the
// catalog + theme. Used by both the interactive NodeMesh (editor) and the static
// PreviewNode (preview) so they always look identical.

import type { ComponentType } from "react";
import { SHAPES } from "./shapes";
import type { ShapeProps } from "./shapes/types";
import { getNodeCatalogEntry, type NodeCatalogEntry } from "../../catalog/nodeCatalog";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowNode } from "../../state/types";

export interface NodeVisual {
  entry: NodeCatalogEntry;
  isGroup: boolean;
  isNote: boolean;
  Shape: ComponentType<ShapeProps>;
  width: number;
  depth: number;
  height: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
}

export function resolveNodeVisual(
  node: WorkflowNode,
  theme: SceneTheme,
  selected: boolean,
): NodeVisual {
  const entry = getNodeCatalogEntry(node.kind);
  const isGroup = node.kind === "group";
  const isNote = entry.shape === "paperTile";
  const Shape = SHAPES[entry.shape];
  const width = node.width ?? entry.defaultSize.width;
  const depth = node.depth ?? entry.defaultSize.depth;
  const height = node.height ?? entry.defaultSize.height;
  const color = node.color ?? (isNote ? theme.paper : theme.nodeColors[entry.colorRole]);
  const emissive = selected ? theme.selection : color;
  const emissiveIntensity = selected
    ? theme.selectionEmissiveIntensity
    : isNote
      ? 0
      : theme.nodeEmissiveIntensity;
  return { entry, isGroup, isNote, Shape, width, depth, height, color, emissive, emissiveIntensity };
}
