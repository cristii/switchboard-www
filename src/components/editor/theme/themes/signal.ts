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
  // White ground to match the /services capability card; grid on.
  background: { type: "flat", color: "#ffffff", colorHi: "#ffffff" },
  grid: { show: true, color: "#e4e6df", sectionColor: "#d3d8cd", opacity: 0.55 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#fbf9f2", ground: "#ded9cb", intensity: 0.62 },
    { id: "ambient", type: "ambient", color: "#f3f1ea", intensity: 0.55 },
    // Directional key centred at the top → a TOP-DOWN, parallel ("direct", non-radial)
    // shadow straight under each slab. (A hair of offset avoids a degenerate
    // perfectly-vertical shadow camera.)
    { id: "key", type: "directional", color: "#fffaf2", intensity: 1.25, position: [0, 34, 2], castShadow: true },
    // Soft directional fill (also direct, no radial falloff) for side variation.
    { id: "fill", type: "directional", color: "#e6e7dc", intensity: 0.34, position: [10, 14, -10] },
    // Warm front fill from the camera's direction (iso [1,1,1]) so the faces toward
    // the viewer pick up a little Switchboard warmth. Low, and doesn't cast shadows.
    { id: "cam", type: "directional", color: "#ffe7c4", intensity: 0.38, position: [22, 22, 22] },
  ],
  // Soft, diffused top-down floor shadow via PCSS (drei SoftShadows); only slabs cast.
  shadow: { enabled: true, opacity: 0.24, radius: 12, bias: -0.0004, soft: true },
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
    // Mid sage-ink: clearly visible on the white ground without shouting.
    color: "#66736b",
    width: 2.5,
    widthSelected: 4,
    flow: "#e8801f",
    arrowSize: 0.9,
    // Premium iso elbows: side ports, ground rail under the floating slabs,
    // rounded corners, lane spread (scene/edges/routing/iso.ts).
    routing: "iso",
    connector: "line",
  },
  text: {
    // Brand display font (self-hosted TTF; troika can't read woff2). Served from
    // public/ — see src/styles/fonts.css for the DOM-side face.
    font: "/fonts/bricolage-grotesque-600.ttf",
    color: "#1b2a26",
    opacity: 1,
    size: 0.5,
    orientation: "billboard",
    // White "bubble" pill by default (the description + tag labels).
    style: "bubble",
    scale: 1,
    offset: [0, 0.5, 0],
    sublabel: { color: "#46524d", size: 0.4, font: "/fonts/bricolage-grotesque-600.ttf" },
  },
};
