// 3D in-canvas text — the `text` node kind, and (via TextLabel) 3D edge labels.
// Renders drei <Text> (troika, bundled with drei) with four orientations:
//   billboard — always faces the camera;   ground — lies flat, read from above;
//   uprightX  — stands facing the +X plane; uprightZ — stands facing the +Z plane.
// Font / size / colour / opacity come from the node `meta` (overrides) or the
// theme text defaults. See state/types.ts TextOrientation + docs/themes.

import { Billboard, Text } from "@react-three/drei";
import type { SceneTheme } from "../../../theme/sceneTheme";
import type { TextOrientation, WorkflowNode } from "../../../state/types";

const ORIENTATIONS: TextOrientation[] = ["billboard", "ground", "uprightX", "uprightZ"];
function isOrientation(v: unknown): v is TextOrientation {
  return typeof v === "string" && ORIENTATIONS.includes(v as TextOrientation);
}

export interface TextLabelProps {
  text: string;
  color: string;
  opacity: number;
  size: number;
  orientation: TextOrientation;
  font?: string;
  selected?: boolean;
  selectionColor?: string;
  /** World-space lift for non-ground orientations. */
  y?: number;
}

/** Low-level 3D text primitive (shared by text nodes + 3D edge labels). */
export function TextLabel({
  text,
  color,
  opacity,
  size,
  orientation,
  font,
  selected = false,
  selectionColor = "#fbbf24",
  y,
}: TextLabelProps) {
  const lift = y ?? Math.max(size * 0.7, 0.4);
  const common = {
    fontSize: size,
    color,
    anchorX: "center" as const,
    anchorY: "middle" as const,
    fillOpacity: opacity,
    outlineWidth: selected ? size * 0.06 : 0,
    outlineColor: selectionColor,
    ...(font ? { font } : {}),
  };

  if (orientation === "billboard") {
    return (
      <Billboard position={[0, lift, 0]}>
        <Text {...common}>{text}</Text>
      </Billboard>
    );
  }
  if (orientation === "ground") {
    return (
      <Text position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} {...common}>
        {text}
      </Text>
    );
  }
  if (orientation === "uprightX") {
    return (
      <Text position={[0, lift, 0]} rotation={[0, Math.PI / 2, 0]} {...common}>
        {text}
      </Text>
    );
  }
  // uprightZ
  return (
    <Text position={[0, lift, 0]} {...common}>
      {text}
    </Text>
  );
}

export interface TextNodeProps {
  node: WorkflowNode;
  theme: SceneTheme;
  selected: boolean;
}

/** Renders a `text` node from its label + meta, falling back to theme defaults. */
export function TextNode({ node, theme, selected }: TextNodeProps) {
  const meta = (node.meta ?? {}) as Record<string, unknown>;
  const orientation = isOrientation(meta.orientation) ? meta.orientation : theme.text.orientation;
  const size = typeof meta.size === "number" ? meta.size : theme.text.size;
  const font = typeof meta.font === "string" ? meta.font : theme.text.font;
  const color = node.color ?? theme.text.color;
  const opacity = node.opacity ?? theme.text.opacity;
  const text = node.sublabel ? `${node.label}\n${node.sublabel}` : node.label;

  return (
    <TextLabel
      text={text}
      color={color}
      opacity={opacity}
      size={size}
      orientation={orientation}
      font={font}
      selected={selected}
      selectionColor={theme.selection}
    />
  );
}
