// 3D in-canvas text — the `text` node kind, 3D edge labels, and the hovering node
// "tooltips". Renders drei <Text> (troika) with four orientations:
//   billboard — always faces the camera;   ground — lies flat, read from above;
//   uprightX  — stands facing the +X plane; uprightZ — stands facing the +Z plane.
// and five container STYLES ("tags") drawn behind the text so labels stay legible
// in dense diagrams: plain (bare), bubble (pill), tips (dark callout + pointer),
// info (card + pointer), note (paper tile). Font/size/colour/opacity/style/facing
// come from the node `meta` (overrides) or the theme. See docs/labels/LABELS.md.

import { Billboard, RoundedBox, Text } from "@react-three/drei";
import type { SceneTheme } from "../../../theme/sceneTheme";
import type { LabelStyle, TextOrientation, WorkflowNode } from "../../../state/types";

const ORIENTATIONS: TextOrientation[] = ["billboard", "ground", "uprightX", "uprightZ"];
export function isOrientation(v: unknown): v is TextOrientation {
  return typeof v === "string" && ORIENTATIONS.includes(v as TextOrientation);
}

const LABEL_STYLES: LabelStyle[] = ["plain", "bubble", "tips", "info", "note"];
export function isLabelStyle(v: unknown): v is LabelStyle {
  return typeof v === "string" && LABEL_STYLES.includes(v as LabelStyle);
}

/** Plate fill + text colour for a label style, kept theme-safe (high contrast in
 *  both light and dark themes). `plain` has no plate. */
export function labelPalette(style: LabelStyle, theme: SceneTheme): { plate?: string; text: string } {
  switch (style) {
    case "tips":
      return { plate: theme.nodeColors.ink, text: theme.paper };
    case "bubble":
    case "info":
    case "note":
      return { plate: theme.paper, text: theme.nodeColors.ink };
    default:
      return { text: theme.text.color };
  }
}

function plateDims(text: string, size: number, isInfo: boolean) {
  const lines = text.split("\n");
  const maxChars = Math.max(1, ...lines.map((l) => l.length));
  const charW = isInfo ? 0.5 : 0.56;
  const w = maxChars * size * charW + size * 0.95;
  const h = lines.length * size * 1.35 + size * 0.6;
  return { w, h };
}

/** The label content in its local XY plane (facing +Z): optional plate + pointer
 *  + the text. Orientation transforms wrap this. */
function LabelBody({
  text,
  color,
  opacity,
  size,
  style,
  plate,
  selected,
  selectionColor,
  font,
}: {
  text: string;
  color: string;
  opacity: number;
  size: number;
  style: LabelStyle;
  plate?: string;
  selected: boolean;
  selectionColor: string;
  font?: string;
}) {
  const isInfo = style === "info";
  const hasPlate = style !== "plain" && !!plate;
  const { w, h } = plateDims(text, size, isInfo);
  const common = {
    fontSize: size,
    color,
    anchorY: "middle" as const,
    fillOpacity: opacity,
    outlineWidth: selected ? size * 0.05 : 0,
    outlineColor: selectionColor,
    ...(font ? { font } : {}),
  };

  return (
    <group>
      {hasPlate ? (
        <RoundedBox
          args={[w, h, 0.02]}
          radius={Math.min(h * 0.3, style === "info" || style === "note" ? 0.08 : 0.16)}
          smoothness={3}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial color={plate} toneMapped={false} transparent opacity={0.97} />
        </RoundedBox>
      ) : null}
      {hasPlate && (style === "tips" || style === "info") ? (
        <mesh position={[0, -h / 2 - size * 0.16, -0.012]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[size * 0.32, size * 0.5, 3]} />
          <meshBasicMaterial color={plate} toneMapped={false} />
        </mesh>
      ) : null}
      {isInfo ? (
        <Text {...common} anchorX="left" position={[-w / 2 + size * 0.47, 0, 0.001]} maxWidth={w - size * 0.95}>
          {text}
        </Text>
      ) : (
        <Text {...common} anchorX="center" position={[0, 0, 0.001]}>
          {text}
        </Text>
      )}
    </group>
  );
}

export interface TextLabelProps {
  text: string;
  color: string;
  opacity: number;
  size: number;
  orientation: TextOrientation;
  /** Container style ("tag"). @default "plain" */
  style?: LabelStyle;
  /** Plate fill (from labelPalette); omit for `plain`. */
  plate?: string;
  font?: string;
  selected?: boolean;
  selectionColor?: string;
  /** World-space lift for non-ground orientations. */
  y?: number;
}

/** Low-level 3D label primitive (shared by text nodes, edge labels, node tooltips). */
export function TextLabel({
  text,
  color,
  opacity,
  size,
  orientation,
  style = "plain",
  plate,
  font,
  selected = false,
  selectionColor = "#fbbf24",
  y,
}: TextLabelProps) {
  const lift = y ?? Math.max(size * 0.7, 0.4);
  const body = (
    <LabelBody
      text={text}
      color={color}
      opacity={opacity}
      size={size}
      style={style}
      plate={plate}
      selected={selected}
      selectionColor={selectionColor}
      font={font}
    />
  );

  if (orientation === "billboard") {
    return <Billboard position={[0, lift, 0]}>{body}</Billboard>;
  }
  if (orientation === "ground") {
    return (
      <group position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {body}
      </group>
    );
  }
  if (orientation === "uprightX") {
    return (
      <group position={[0, lift, 0]} rotation={[0, Math.PI / 2, 0]}>
        {body}
      </group>
    );
  }
  // uprightZ
  return <group position={[0, lift, 0]}>{body}</group>;
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
  const style = isLabelStyle(meta.labelStyle) ? meta.labelStyle : theme.text.style;
  const size = typeof meta.size === "number" ? meta.size : theme.text.size;
  const font = typeof meta.font === "string" ? meta.font : theme.text.font;
  const pal = labelPalette(style, theme);
  const color = node.color ?? (typeof meta.labelColor === "string" ? meta.labelColor : pal.text);
  const opacity = node.opacity ?? theme.text.opacity;
  const text = node.sublabel ? `${node.label}\n${node.sublabel}` : node.label;

  return (
    <TextLabel
      text={text}
      color={color}
      opacity={opacity}
      size={size}
      orientation={orientation}
      style={style}
      plate={pal.plate}
      font={font}
      selected={selected}
      selectionColor={theme.selection}
    />
  );
}
