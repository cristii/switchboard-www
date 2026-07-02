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
    // Brighter key + lifted fill than the original port: dark scenes flatten
    // fast, so the rig needs more tonal range (see also signalDark).
    { id: "hemi", type: "hemisphere", sky: "#33474a", ground: "#0c1716", intensity: 0.55 },
    { id: "ambient", type: "ambient", color: "#1d2b28", intensity: 0.4 },
    { id: "key", type: "directional", color: "#eaf2ff", intensity: 1.5, position: [16, 24, 12], castShadow: true },
    { id: "fill", type: "directional", color: "#2c3d38", intensity: 0.38, position: [-14, 10, -10] },
    { id: "cam", type: "directional", color: "#f2b371", intensity: 0.22, position: [22, 22, 22] },
  ],
  shadow: { enabled: true, opacity: 0.45, radius: 8, bias: -0.0004, soft: true },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 38 },
  nodes: {
    opacity: 1,
    // Low emissive so the light rig (not self-glow) models the faces.
    emissive: 0.06,
    selectionEmissive: 0.6,
    colors: {
      orange: "#ef8f42",
      green: "#5fb374",
      violet: "#a884d1",
      amber: "#fbbf24",
      ink: "#c8cec6",
    },
    selection: "#fbbf24",
    paper: "#26332f",
  },
  edges: {
    color: "#a7b3ab",
    width: 2.5,
    widthSelected: 4,
    flow: "#f0935a",
    arrowSize: 1,
    routing: "iso",
    connector: "line",
  },
  text: { color: "#c8cec6", opacity: 1, size: 0.6, orientation: "billboard" },
};
