// WebGL colour palette for the 3D scene. Materials/lights can't read CSS
// variables, so these constants mirror editor-tokens.css. P7 wires the live
// theme value through; the palettes themselves already cover light + dark.
// See description.md §9 (theming) and §3 (3D-vs-brand reconciliation).

import type { EditorTheme, NodeColorRole } from "../state/types";

export interface SceneTheme {
  background: string;
  grid: string;
  gridStrong: string;
  ambient: string;
  ambientIntensity: number;
  key: string;
  keyIntensity: number;
  fill: string;
  fillIntensity: number;
  contactShadow: string;
  contactShadowOpacity: number;
  selection: string;
  edge: string;
  /** Tile colour for `note` nodes (paper tone). */
  paper: string;
  nodeColors: Record<NodeColorRole, string>;
  nodeEmissiveIntensity: number;
  selectionEmissiveIntensity: number;
}

const LIGHT: SceneTheme = {
  background: "#e9e8df", // --paper
  grid: "#b9c2b6", // --line
  gridStrong: "#cbd2c5", // --line-soft
  ambient: "#e9e6da",
  ambientIntensity: 0.65,
  key: "#ffffff",
  keyIntensity: 1.7,
  fill: "#cfd6cd",
  fillIntensity: 0.4,
  contactShadow: "#15211f", // --ink
  contactShadowOpacity: 0.22,
  selection: "#fbbf24", // --amber
  edge: "#54605c", // --ink-soft
  paper: "#f5f4ec",
  nodeColors: {
    orange: "#b45309",
    green: "#3f7a4e",
    violet: "#6a4a8a",
    amber: "#fbbf24",
    ink: "#15211f",
  },
  nodeEmissiveIntensity: 0.12,
  selectionEmissiveIntensity: 0.5,
};

const DARK: SceneTheme = {
  background: "#0e1a18",
  grid: "#243330",
  gridStrong: "#2e403c",
  ambient: "#22302d",
  ambientIntensity: 0.45,
  key: "#ffffff",
  keyIntensity: 1.35,
  fill: "#1c2a27",
  fillIntensity: 0.35,
  contactShadow: "#000000",
  contactShadowOpacity: 0.5,
  selection: "#fbbf24",
  edge: "#9aa49d", // --on-dark-muted
  paper: "#26332f",
  nodeColors: {
    orange: "#e08742",
    green: "#5ba06b",
    violet: "#9a78c0",
    amber: "#fbbf24",
    ink: "#c8cec6",
  },
  nodeEmissiveIntensity: 0.18,
  selectionEmissiveIntensity: 0.6,
};

export function getSceneTheme(theme: EditorTheme): SceneTheme {
  return theme === "dark" ? DARK : LIGHT;
}
