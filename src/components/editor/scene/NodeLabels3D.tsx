// 3D in-canvas node labels — the default "tooltip" presentation. Renders each
// node's name (+ sublabel) as hovering 3D text above the node, replacing the DOM
// label chips (which clutter the screen). Orientation is per-node
// (node.labelOrientation) falling back to the theme; colour/size can be overridden
// per node via meta.labelColor / meta.labelSize, else the theme text defaults.
// `text` nodes are skipped (they are their own label). See docs/labels/LABELS.md.

import { getNodeCatalogEntry } from "../catalog/nodeCatalog";
import { TextLabel } from "./nodes/shapes/TextNode";
import type { SceneTheme } from "../theme/sceneTheme";
import type { Selection, WorkflowNode } from "../state/types";

export interface NodeLabels3DProps {
  nodes: WorkflowNode[];
  selection?: Selection;
  theme: SceneTheme;
}

export function NodeLabels3D({ nodes, selection, theme }: NodeLabels3DProps) {
  return (
    <>
      {nodes.map((node) => {
        if (node.kind === "text") return null; // text nodes render their own text
        if (!node.label) return null;
        const entry = getNodeCatalogEntry(node.kind);
        const height = node.height ?? entry.defaultSize.height;
        const hoverY = height + 0.55;
        const meta = (node.meta ?? {}) as Record<string, unknown>;
        const orientation = node.labelOrientation ?? theme.text.orientation;
        const color = typeof meta.labelColor === "string" ? meta.labelColor : theme.text.color;
        const size = typeof meta.labelSize === "number" ? meta.labelSize : theme.text.size;
        const text = node.sublabel ? `${node.label}\n${node.sublabel}` : node.label;
        const selected = selection?.type === "node" && selection.id === node.id;
        return (
          <group key={node.id} position={[node.x, hoverY, node.y]}>
            <TextLabel
              text={text}
              color={color}
              opacity={theme.text.opacity}
              size={size}
              orientation={orientation}
              font={theme.text.font}
              selected={selected}
              selectionColor={theme.selection}
              y={0}
            />
          </group>
        );
      })}
    </>
  );
}
