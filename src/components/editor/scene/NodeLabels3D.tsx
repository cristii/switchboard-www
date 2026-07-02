// 3D in-canvas node labels — the default "tooltip" presentation. Renders each
// node's name (+ sublabel) as hovering 3D text above the node, replacing the DOM
// label chips (which clutter the screen). Orientation is per-node
// (node.labelOrientation) falling back to the theme; colour/size can be overridden
// per node via meta.labelColor / meta.labelSize, else the theme text defaults.
// `text` nodes are skipped (they are their own label). See docs/labels/LABELS.md.

import { getNodeCatalogEntry } from "../catalog/nodeCatalog";
import { TextLabel, isLabelStyle, labelPalette } from "./nodes/shapes/TextNode";
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
        const meta = (node.meta ?? {}) as Record<string, unknown>;
        // Hover above the node's REAL top — include meta.elevation so labels on
        // platform-seated nodes (cards on trays) don't sink into the geometry.
        const elevation = typeof meta.elevation === "number" ? meta.elevation : 0;
        const hoverY = elevation + height + 0.55;
        const orientation = node.labelOrientation ?? theme.text.orientation;
        const style = isLabelStyle(meta.labelStyle) ? meta.labelStyle : theme.text.style;
        const pal = labelPalette(style, theme);
        const color = typeof meta.labelColor === "string" ? meta.labelColor : pal.text;
        const size = typeof meta.labelSize === "number" ? meta.labelSize : theme.text.size;
        const selected = selection?.type === "node" && selection.id === node.id;
        return (
          <group key={node.id} position={[node.x, hoverY, node.y]}>
            <TextLabel
              label={node.label}
              sublabel={node.sublabel}
              color={color}
              size={size}
              font={theme.text.font}
              sublabelColor={theme.text.sublabel.color}
              sublabelSize={theme.text.sublabel.size}
              sublabelFont={theme.text.sublabel.font}
              opacity={theme.text.opacity}
              orientation={orientation}
              style={style}
              plate={pal.plate}
              scale={theme.text.scale}
              offset={theme.text.offset}
              screenFit={theme.text.screenFit}
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
