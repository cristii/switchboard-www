// Built-in "signal" theme — the layered "premium-but-playful" look from the
// capabilities reference rendering, in Switchboard's palette (brightened, no blue).
// A 3-layer system: a double-layer rounded-square SLAB platform (solid colour base
// + floating white top plate), a 3D step-icon seated on the plate, and white
// "bubble" pill labels. Soft warm-grey ground (grid off) with a top-left key light
// + gentle drop shadow so the layers read as stacked/floating, and a thin arrowless
// flow line (arrowSize 0). Drives the /services capability pillars (PillarIsoPreview).
// See docs/themes + IMPLEMENTATION_PLAN.md.

import type { ThemeSpec } from "../themeSpec";

export const signalTheme: ThemeSpec = {
  id: "signal",
  name: "Switchboard Signal",
  builtIn: true,
  chromeBase: "light",
  // Soft warm-grey ground: pure-white pill labels separate against it (flat 3D
  // label plates cast no shadow, so white-on-white would wash out).
  background: { type: "flat", color: "#efeee8", colorHi: "#efeee8" },
  grid: { show: false, color: "#dfe2d9", sectionColor: "#cbd2c5", opacity: 0.4 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#fbf9f2", ground: "#ded9cb", intensity: 0.62 },
    { id: "ambient", type: "ambient", color: "#f3f1ea", intensity: 0.5 },
    // Key from the top-LEFT for gentle side-modelling (the ground shadow is a separate
    // top-down ContactShadows blob, so this light does NOT cast).
    { id: "key", type: "directional", color: "#fffaf2", intensity: 1.15, position: [-14, 26, 12] },
    { id: "fill", type: "directional", color: "#e6e7dc", intensity: 0.3, position: [12, 12, -12] },
    { id: "warm", type: "point", color: "#f7b955", intensity: 0.18, position: [-8, 10, 10], distance: 44 },
  ],
  // Top-down soft, diffused ground shadow (drei ContactShadows) like the reference.
  shadow: { enabled: true, opacity: 0.32, radius: 18, bias: -0.0004, contact: true },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 46 },
  nodes: {
    opacity: 1,
    roughness: 0.7,
    metalness: 0,
    emissive: 0.03,
    selectionEmissive: 0.42,
    colors: {
      // Vibrant on-brand stage hues (no blue): input / processing / output.
      orange: "#f5821a",
      green: "#2bac61",
      violet: "#7a4ad4",
      amber: "#fbbf24",
      // Light paper-grey for incidental nodes.
      ink: "#e9e8e1",
    },
    selection: "#f5821a",
    paper: "#ffffff",
  },
  edges: {
    color: "#aab0a6",
    width: 2,
    widthSelected: 3.5,
    flow: "#e8801f",
    // Arrowless: the reference flow is a quiet continuous line, no arrowheads.
    arrowSize: 0,
    routing: "direct",
    connector: "line",
  },
  text: {
    color: "#1b2a26",
    opacity: 1,
    size: 0.5,
    orientation: "billboard",
    // White "bubble" pill by default (the description + tag labels).
    style: "bubble",
    scale: 1,
    offset: [0, 0.5, 0],
    sublabel: { color: "#46524d", size: 0.4 },
  },
};
