// Built-in "dark" theme — ported 1:1 from the original sceneTheme DARK palette.
// Mirrors editor-tokens.css (dark block). See themeSpec.ts.

import type { ThemeSpec } from "../themeSpec";

export const darkTheme: ThemeSpec = {
  id: "dark",
  name: "Dark (ink)",
  builtIn: true,
  chromeBase: "dark",
  background: { type: "radial", color: "#0c1716", colorHi: "#14221f" },
  grid: { show: true, color: "#243330", sectionColor: "#2e403c", opacity: 0.6 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#33474a", ground: "#0c1716", intensity: 0.5 },
    { id: "ambient", type: "ambient", color: "#1d2b28", intensity: 0.35 },
    { id: "key", type: "directional", color: "#eaf2ff", intensity: 1.25, position: [16, 24, 12], castShadow: true },
    { id: "fill", type: "directional", color: "#1c2a27", intensity: 0.28, position: [-14, 10, -10] },
  ],
  shadow: { enabled: true, opacity: 0.5, radius: 6, bias: -0.0004 },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 38 },
  nodes: {
    opacity: 1,
    emissive: 0.16,
    selectionEmissive: 0.6,
    colors: {
      orange: "#e08742",
      green: "#5ba06b",
      violet: "#9a78c0",
      amber: "#fbbf24",
      ink: "#c8cec6",
    },
    selection: "#fbbf24",
    paper: "#26332f",
  },
  edges: {
    color: "#9aa49d",
    width: 2,
    widthSelected: 3.6,
    flow: "#f0935a",
    arrowSize: 1,
    routing: "orthogonal",
    connector: "line",
  },
  text: { color: "#c8cec6", opacity: 1, size: 0.6, orientation: "billboard" },
};
