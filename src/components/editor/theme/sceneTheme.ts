// WebGL colour palette for the 3D scene. Materials/lights can't read CSS
// variables, so these constants mirror editor-tokens.css. P7 wires the live
// theme value through; the palettes themselves already cover light + dark.
// See description.md §9 (theming) and §3 (3D-vs-brand reconciliation).

import type { EditorTheme, NodeColorRole } from "../state/types";

export interface SceneTheme {
  background: string;
  /** Brighter centre of the radial backdrop gradient (Backdrop). */
  backgroundHi: string;
  grid: string;
  gridStrong: string;
  ambient: string;
  ambientIntensity: number;
  key: string;
  keyIntensity: number;
  fill: string;
  fillIntensity: number;
  /** Hemisphere light sky / ground tones + intensity (soft pro shading). */
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  /** Opacity of the soft cast-shadow ground plane. */
  shadowOpacity: number;
  selection: string;
  edge: string;
  /** Data-flow pulse colour. */
  flow: string;
  /** Tile colour for `note` nodes (paper tone). */
  paper: string;
  nodeColors: Record<NodeColorRole, string>;
  nodeEmissiveIntensity: number;
  selectionEmissiveIntensity: number;
}

const LIGHT: SceneTheme = {
  background: "#e6e5db", // --paper, a touch deeper for gradient contrast
  backgroundHi: "#f3f2ea", // brighter centre
  grid: "#b9c2b6", // --line
  gridStrong: "#cbd2c5", // --line-soft
  ambient: "#efeee6",
  ambientIntensity: 0.45,
  key: "#fffaf2",
  keyIntensity: 1.45,
  fill: "#d6dcd2",
  fillIntensity: 0.3,
  hemiSky: "#fff6e9",
  hemiGround: "#c9d0c6",
  hemiIntensity: 0.55,
  shadowOpacity: 0.26,
  selection: "#fbbf24", // --amber
  edge: "#54605c", // --ink-soft
  flow: "#c2410c", // bright burnt orange
  paper: "#f5f4ec",
  nodeColors: {
    orange: "#b45309",
    green: "#3f7a4e",
    violet: "#6a4a8a",
    amber: "#fbbf24",
    ink: "#15211f",
  },
  nodeEmissiveIntensity: 0.1,
  selectionEmissiveIntensity: 0.5,
};

const DARK: SceneTheme = {
  background: "#0c1716",
  backgroundHi: "#14221f",
  grid: "#243330",
  gridStrong: "#2e403c",
  ambient: "#1d2b28",
  ambientIntensity: 0.35,
  key: "#eaf2ff",
  keyIntensity: 1.25,
  fill: "#1c2a27",
  fillIntensity: 0.28,
  hemiSky: "#33474a",
  hemiGround: "#0c1716",
  hemiIntensity: 0.5,
  shadowOpacity: 0.5,
  selection: "#fbbf24",
  edge: "#9aa49d", // --on-dark-muted
  flow: "#f0935a",
  paper: "#26332f",
  nodeColors: {
    orange: "#e08742",
    green: "#5ba06b",
    violet: "#9a78c0",
    amber: "#fbbf24",
    ink: "#c8cec6",
  },
  nodeEmissiveIntensity: 0.16,
  selectionEmissiveIntensity: 0.6,
};

export function getSceneTheme(theme: EditorTheme): SceneTheme {
  return theme === "dark" ? DARK : LIGHT;
}
