// Built-in "light" theme — the editor's default paper-and-ink look. Values are
// ported 1:1 from the original sceneTheme LIGHT palette so migrating to ThemeSpec
// is a no-op visually. Mirrors editor-tokens.css (light block). See themeSpec.ts.

import type { ThemeSpec } from "../themeSpec";

export const lightTheme: ThemeSpec = {
  id: "light",
  name: "Light (paper)",
  builtIn: true,
  chromeBase: "light",
  background: { type: "radial", color: "#e6e5db", colorHi: "#f3f2ea" },
  grid: { show: true, color: "#b9c2b6", sectionColor: "#cbd2c5", opacity: 0.6 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#fff6e9", ground: "#c9d0c6", intensity: 0.55 },
    { id: "ambient", type: "ambient", color: "#efeee6", intensity: 0.45 },
    { id: "key", type: "directional", color: "#fffaf2", intensity: 1.45, position: [16, 24, 12], castShadow: true },
    { id: "fill", type: "directional", color: "#d6dcd2", intensity: 0.3, position: [-14, 10, -10] },
  ],
  shadow: { enabled: true, opacity: 0.26, radius: 6, bias: -0.0004 },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 38 },
  nodes: {
    opacity: 1,
    emissive: 0.1,
    selectionEmissive: 0.5,
    colors: {
      orange: "#b45309",
      green: "#3f7a4e",
      violet: "#6a4a8a",
      amber: "#fbbf24",
      ink: "#15211f",
    },
    selection: "#fbbf24",
    paper: "#f5f4ec",
  },
  edges: {
    color: "#54605c",
    width: 2,
    widthSelected: 3.6,
    flow: "#c2410c",
    arrowSize: 1,
    routing: "orthogonal",
    connector: "line",
  },
  text: { color: "#15211f", opacity: 1, size: 0.6, orientation: "billboard" },
};
