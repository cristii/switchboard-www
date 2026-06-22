// Built-in "aws" theme — reproduces the AWS Reference Architecture isometric look:
// flat near-white background (grid off), light-grey matte nodes with adjustable
// transparency, soft low-opacity grey shadows, thick orange connectors as the
// primary flow (thin grey for secondary, set per-edge), translucent orange group
// platforms, and a subtle warm point light for that premium SaaS warmth. Camera
// stays clean orthographic isometric. Edges default to the `ribbonArrow` connector
// — until Step 3 ships the ribbon renderer they draw as thick orange lines.
// See docs/IMPLEMENTATION_PLAN.md (reference-image table).

import type { ThemeSpec } from "../themeSpec";

export const awsTheme: ThemeSpec = {
  id: "aws",
  name: "AWS Architecture",
  builtIn: true,
  chromeBase: "light",
  background: { type: "flat", color: "#fcfcfb", colorHi: "#ffffff" },
  grid: { show: false, color: "#d8dade", sectionColor: "#c4c7cc", opacity: 0.45 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#ffffff", ground: "#e8e9ec", intensity: 0.65 },
    { id: "ambient", type: "ambient", color: "#f4f4f6", intensity: 0.5 },
    { id: "key", type: "directional", color: "#ffffff", intensity: 1.2, position: [14, 26, 10], castShadow: true },
    { id: "fill", type: "directional", color: "#eef0f4", intensity: 0.35, position: [-12, 12, -14] },
    // Soft warm accent — multiple coloured lights for a playful, premium feel.
    { id: "warm", type: "point", color: "#f7b955", intensity: 0.35, position: [-10, 9, 11], distance: 46 },
  ],
  shadow: { enabled: true, opacity: 0.18, radius: 8, bias: -0.0004 },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 40 },
  nodes: {
    opacity: 0.92,
    roughness: 0.7,
    metalness: 0,
    emissive: 0.03,
    selectionEmissive: 0.45,
    colors: {
      // Most nodes read as light-grey matte (the catalog's `ink` role covers
      // action/service/group); accent roles carry the orange / data tones.
      orange: "#ea7600",
      green: "#3f7a4e",
      violet: "#6a4a8a",
      amber: "#f59e0b",
      ink: "#e9eaec",
    },
    selection: "#f59e0b",
    paper: "#f2f3f5",
  },
  edges: {
    color: "#ea7600",
    width: 5,
    widthSelected: 7,
    flow: "#ea7600",
    arrowSize: 2.1,
    routing: "orthogonal",
    connector: "ribbonArrow",
  },
  text: { color: "#3b3f46", opacity: 1, size: 0.55, orientation: "billboard" },
};
