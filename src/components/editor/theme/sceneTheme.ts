// The flat, resolved palette the 3D scene consumers (nodes, edges, shapes, text)
// read. It is now DERIVED from a ThemeSpec via resolveSceneTheme — the spec is the
// authoring/serialisation unit (theme/themeSpec.ts + theme/themes/*), this is the
// runtime view. Lights / camera / background / grid / shadow are read straight off
// the spec by DiagramCanvas; everything node/edge/text related lives here.
// See description.md §9 (theming) and §3 (3D-vs-brand reconciliation).

import type { LabelStyle, NodeColorRole, TextOrientation } from "../state/types";
import type { ConnectorStyle, ThemeSpec } from "./themeSpec";
import { lightTheme } from "./themes/light";
import { darkTheme } from "./themes/dark";

export interface SceneTheme {
  /** Minor grid line colour. */
  grid: string;
  /** Major ("section") grid line colour. */
  gridStrong: string;
  /** Grid opacity multiplier. */
  gridOpacity: number;
  selection: string;
  edge: string;
  /** Data-flow pulse colour. */
  flow: string;
  /** Tile colour for `note` nodes (paper tone). */
  paper: string;
  nodeColors: Record<NodeColorRole, string>;
  /** Default node material opacity (per-node `opacity` overrides this). */
  nodeOpacity: number;
  /** Optional global node material overrides; shapes keep their own when undefined. */
  nodeRoughness?: number;
  nodeMetalness?: number;
  nodeEmissiveIntensity: number;
  selectionEmissiveIntensity: number;
  /** Connector line width + selected width, and arrowhead size multiplier. */
  edgeWidth: number;
  edgeWidthSelected: number;
  arrowSize: number;
  connector: ConnectorStyle;
  routing: string;
  /** Where node/edge labels render: 3D in-canvas hovering text, or DOM chips. */
  labelMode: "3d" | "dom";
  /** 3D in-canvas text defaults. */
  text: {
    font?: string;
    color: string;
    opacity: number;
    size: number;
    orientation: TextOrientation;
    /** Default label container style ("tag"). */
    style: LabelStyle;
    /** Global size multiplier. */
    scale: number;
    /** Global [x,y,z] offset applied to every label. */
    offset: [number, number, number];
    /** Sublabel (second line) styling. */
    sublabel: { color: string; size: number; font?: string };
  };
}

/** Resolve a ThemeSpec into the flat palette the scene consumers read. */
export function resolveSceneTheme(spec: ThemeSpec): SceneTheme {
  return {
    grid: spec.grid.color,
    gridStrong: spec.grid.sectionColor,
    gridOpacity: spec.grid.opacity ?? 0.6,
    selection: spec.nodes.selection,
    edge: spec.edges.color,
    flow: spec.edges.flow,
    paper: spec.nodes.paper,
    nodeColors: spec.nodes.colors,
    nodeOpacity: spec.nodes.opacity,
    nodeRoughness: spec.nodes.roughness,
    nodeMetalness: spec.nodes.metalness,
    nodeEmissiveIntensity: spec.nodes.emissive,
    selectionEmissiveIntensity: spec.nodes.selectionEmissive,
    edgeWidth: spec.edges.width,
    edgeWidthSelected: spec.edges.widthSelected,
    arrowSize: spec.edges.arrowSize,
    connector: spec.edges.connector,
    routing: spec.edges.routing,
    labelMode: spec.text.mode ?? "3d",
    text: {
      font: spec.text.font,
      color: spec.text.color,
      opacity: spec.text.opacity,
      size: spec.text.size,
      orientation: spec.text.orientation,
      style: spec.text.style ?? "plain",
      scale: spec.text.scale ?? 1,
      offset: spec.text.offset ?? [0, 0.3, 0],
      sublabel: {
        color: spec.text.sublabel?.color ?? spec.text.color,
        size: spec.text.sublabel?.size ?? spec.text.size * 0.72,
        font: spec.text.sublabel?.font,
      },
    },
  };
}

/** Back-compat helper: resolve the built-in light/dark palette by name. */
export function getSceneTheme(theme: "light" | "dark"): SceneTheme {
  return resolveSceneTheme(theme === "dark" ? darkTheme : lightTheme);
}
