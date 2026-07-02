// 3D in-canvas text — the `text` node kind, 3D edge labels, and the hovering node
// "tooltips". Renders drei <Text> (troika) with four orientations (billboard /
// ground / uprightX / uprightZ) and five container STYLES ("tags": plain / bubble /
// tips / info / note) drawn behind the text so labels stay legible. Label and
// sublabel are separate lines with independent colour/size/font; a global
// offset + scale (theme.text) positions and sizes every label. Per-object values
// come from node/edge `meta` (overrides) or the theme. See docs/labels/LABELS.md.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, RoundedBox, Text } from "@react-three/drei";
import type * as THREE from "three";
import type { SceneTheme } from "../../../theme/sceneTheme";
import type { LabelStyle, TextOrientation, WorkflowNode } from "../../../state/types";

// Screen-fit: labels are authored in world units at this reference orthographic
// zoom; a clamped counter-scale keeps them a consistent on-screen size as the
// camera zooms (so tags never shrink to illegible at fit-zoom-out, and never
// balloon when zoomed close). Clamps keep them loosely anchored to the scene.
const REF_ZOOM = 38;
const FIT_MIN = 0.8;
const FIT_MAX = 1.75;

function ScreenFit({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (!enabled || !ref.current) return;
    const ortho = camera as THREE.OrthographicCamera;
    if (!ortho.isOrthographicCamera) return;
    const s = Math.min(FIT_MAX, Math.max(FIT_MIN, REF_ZOOM / ortho.zoom));
    if (Math.abs(ref.current.scale.x - s) > 1e-3) ref.current.scale.setScalar(s);
  });
  return <group ref={ref}>{children}</group>;
}

const ORIENTATIONS: TextOrientation[] = ["billboard", "ground", "uprightX", "uprightZ"];
export function isOrientation(v: unknown): v is TextOrientation {
  return typeof v === "string" && ORIENTATIONS.includes(v as TextOrientation);
}

const LABEL_STYLES: LabelStyle[] = ["plain", "bubble", "tips", "info", "note"];
export function isLabelStyle(v: unknown): v is LabelStyle {
  return typeof v === "string" && LABEL_STYLES.includes(v as LabelStyle);
}

/** Plate fill + label colour for a style, kept theme-safe. `plain` has no plate. */
export function labelPalette(style: LabelStyle, theme: SceneTheme): { plate?: string; text: string } {
  // Use the theme's text colour (the intended ink) — NOT nodeColors.ink, which a
  // theme may repurpose as a light node tone (e.g. blueprint/aws) and would make
  // plated labels low-contrast.
  switch (style) {
    case "tips":
      return { plate: theme.text.color, text: theme.paper };
    case "bubble":
    case "info":
    case "note":
      return { plate: theme.paper, text: theme.text.color };
    default:
      return { text: theme.text.color };
  }
}

function plateDims(lblLines: string[], subLines: string[], size: number, subSize: number, isInfo: boolean) {
  const charW = isInfo ? 0.5 : 0.56;
  const labelChars = Math.max(1, ...lblLines.map((l) => l.length));
  const subChars = subLines.length ? Math.max(1, ...subLines.map((l) => l.length)) * (subSize / size) : 0;
  const maxChars = Math.max(labelChars, subChars);
  const w = maxChars * size * charW + size * 0.95;
  const h = lblLines.length * size * 1.3 + subLines.length * subSize * 1.35 + size * 0.7;
  return { w, h };
}

function LabelBody({
  label,
  sublabel,
  color,
  size,
  font,
  subColor,
  subSize,
  subFont,
  opacity,
  style,
  plate,
  border,
  bold,
  selected,
  selectionColor,
}: {
  label: string;
  sublabel?: string;
  color: string;
  size: number;
  font?: string;
  subColor: string;
  subSize: number;
  subFont?: string;
  opacity: number;
  style: LabelStyle;
  plate?: string;
  border?: string;
  bold?: boolean;
  selected: boolean;
  selectionColor: string;
}) {
  const isInfo = style === "info";
  const hasPlate = style !== "plain" && !!plate;
  const bw = size * 0.08; // border thickness (when `border` is set)
  const lblLines = label.split("\n");
  const subLines = sublabel ? sublabel.split("\n") : [];
  const { w, h } = plateDims(lblLines, subLines, size, subSize, isInfo);

  // Stack label above sublabel, vertically centred in the plate.
  const pad = size * 0.3;
  const labelH = lblLines.length * size * 1.3;
  const subH = subLines.length * subSize * 1.35;
  const labelCenterY = h / 2 - pad - labelH / 2;
  const subCenterY = labelCenterY - labelH / 2 - size * 0.12 - subH / 2;
  const anchorX = isInfo ? ("left" as const) : ("center" as const);
  // Info cards grow to the RIGHT of their anchor (node = card's left edge) so they
  // don't overlap the node they annotate; others stay centred on the anchor.
  const gx = isInfo ? w / 2 + size * 0.35 : 0;
  const tx = (isInfo ? -w / 2 + size * 0.47 : 0) + gx;

  const plateRadius = Math.min(h * 0.3, style === "info" || style === "note" ? 0.08 : 0.16);

  return (
    <group>
      {hasPlate && border ? (
        <RoundedBox
          args={[w + bw * 2, h + bw * 2, 0.02]}
          radius={plateRadius + bw}
          smoothness={3}
          position={[gx, 0, -0.03]}
        >
          <meshBasicMaterial color={border} toneMapped={false} transparent opacity={0.97} />
        </RoundedBox>
      ) : null}
      {hasPlate ? (
        <RoundedBox
          args={[w, h, 0.02]}
          radius={plateRadius}
          smoothness={3}
          position={[gx, 0, -0.02]}
        >
          <meshBasicMaterial color={plate} toneMapped={false} transparent opacity={0.97} />
        </RoundedBox>
      ) : null}
      {hasPlate && style === "tips" ? (
        <mesh position={[0, -h / 2 - size * 0.16, -0.012]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[size * 0.32, size * 0.5, 3]} />
          <meshBasicMaterial color={plate} toneMapped={false} />
        </mesh>
      ) : null}
      <Text
        fontSize={size}
        color={color}
        anchorX={anchorX}
        anchorY="middle"
        position={[tx, subLines.length ? labelCenterY : 0, 0.001]}
        fillOpacity={opacity}
        outlineWidth={selected ? size * 0.06 : bold ? size * 0.04 : 0}
        outlineColor={selected ? selectionColor : color}
        maxWidth={isInfo ? w - size * 0.95 : undefined}
        {...(font ? { font } : {})}
      >
        {label}
      </Text>
      {subLines.length ? (
        <Text
          fontSize={subSize}
          color={subColor}
          anchorX={anchorX}
          anchorY="middle"
          position={[tx, subCenterY, 0.001]}
          fillOpacity={opacity}
          maxWidth={isInfo ? w - size * 0.95 : undefined}
          {...(subFont ? { font: subFont } : {})}
        >
          {sublabel}
        </Text>
      ) : null}
    </group>
  );
}

export interface TextLabelProps {
  label: string;
  sublabel?: string;
  color: string;
  size: number;
  font?: string;
  sublabelColor?: string;
  sublabelSize?: number;
  sublabelFont?: string;
  opacity: number;
  orientation: TextOrientation;
  style?: LabelStyle;
  plate?: string;
  /** Plate border colour (drawn just behind the plate). */
  border?: string;
  /** Faux-bold the label (a thin same-colour outline thickens the glyphs). */
  bold?: boolean;
  /** Global size multiplier (theme.text.scale). @default 1 */
  scale?: number;
  /** Global [x,y,z] offset (theme.text.offset). */
  offset?: [number, number, number];
  /** Counter-scale against camera zoom for a consistent on-screen size
   *  (billboard/upright only; theme.text.screenFit). @default true */
  screenFit?: boolean;
  selected?: boolean;
  selectionColor?: string;
  /** Base world-space lift for non-ground orientations. */
  y?: number;
}

/** Low-level 3D label primitive (shared by text nodes, edge labels, tooltips). */
export function TextLabel({
  label,
  sublabel,
  color,
  size,
  font,
  sublabelColor,
  sublabelSize,
  sublabelFont,
  opacity,
  orientation,
  style = "plain",
  plate,
  border,
  bold,
  scale = 1,
  offset = [0, 0, 0],
  screenFit = true,
  selected = false,
  selectionColor = "#fbbf24",
  y,
}: TextLabelProps) {
  const s = size * scale;
  const subS = (sublabelSize ?? size * 0.72) * scale;
  const lift = (y ?? Math.max(size * 0.7, 0.4)) + offset[1];
  const [ox, , oz] = offset;
  const body = (
    <ScreenFit enabled={screenFit && orientation !== "ground"}>
      <LabelBody
        label={label}
        sublabel={sublabel}
        color={color}
        size={s}
        font={font}
        subColor={sublabelColor ?? color}
        subSize={subS}
        subFont={sublabelFont}
        opacity={opacity}
        style={style}
        plate={plate}
        border={border}
        bold={bold}
        selected={selected}
        selectionColor={selectionColor}
      />
    </ScreenFit>
  );

  if (orientation === "billboard") {
    return <Billboard position={[ox, lift, oz]}>{body}</Billboard>;
  }
  if (orientation === "ground") {
    return (
      <group position={[ox, 0.06 + offset[1], oz]} rotation={[-Math.PI / 2, 0, 0]}>
        {body}
      </group>
    );
  }
  if (orientation === "uprightX") {
    return (
      <group position={[ox, lift, oz]} rotation={[0, Math.PI / 2, 0]}>
        {body}
      </group>
    );
  }
  // uprightZ
  return (
    <group position={[ox, lift, oz]}>{body}</group>
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
  const style = isLabelStyle(meta.labelStyle) ? meta.labelStyle : theme.text.style;
  const size = typeof meta.size === "number" ? meta.size : theme.text.size;
  const font = typeof meta.font === "string" ? meta.font : theme.text.font;
  const pal = labelPalette(style, theme);
  const color = node.color ?? (typeof meta.labelColor === "string" ? meta.labelColor : pal.text);
  // Optional custom plate fill (e.g. a pale tint of the node colour for a tinted
  // "tag" pill); otherwise the style's default plate.
  const plate = typeof meta.plateColor === "string" ? meta.plateColor : pal.plate;
  const border = typeof meta.borderColor === "string" ? meta.borderColor : undefined;
  // Optional float height (world units) — lets a tag hover above a platform.
  const lift = typeof meta.elevation === "number" ? meta.elevation : undefined;
  const bold = meta.bold === true;
  const opacity = node.opacity ?? theme.text.opacity;
  const subColor = typeof meta.sublabelColor === "string" ? meta.sublabelColor : theme.text.sublabel.color;
  const subSize = typeof meta.sublabelSize === "number" ? meta.sublabelSize : theme.text.sublabel.size;

  return (
    <TextLabel
      label={node.label}
      sublabel={node.sublabel}
      color={color}
      size={size}
      font={font}
      sublabelColor={subColor}
      sublabelSize={subSize}
      sublabelFont={theme.text.sublabel.font}
      opacity={opacity}
      orientation={orientation}
      style={style}
      plate={plate}
      border={border}
      bold={bold}
      scale={theme.text.scale}
      offset={theme.text.offset}
      screenFit={theme.text.screenFit}
      y={lift}
      selected={selected}
      selectionColor={theme.selection}
    />
  );
}
