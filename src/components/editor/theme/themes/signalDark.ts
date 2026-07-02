// Built-in "signal dark" theme — the signal look re-lit for the site's dark mode
// (deep pine-ink ground matching the dark --paper token family). Same layered
// slab/tray/card system; the rig swaps to a brighter key + cool fill + warm
// camera rim so faces keep tonal separation on dark, node hues brighten to clear
// the dark ground, and edges flip to a light sage that reads over #0E1A18.
// Embedded marketing diagrams pick signal/signalDark from the site theme
// (lib/useSiteColorScheme). See docs/themes.

import type { ThemeSpec } from "../themeSpec";

export const signalDarkTheme: ThemeSpec = {
  id: "signalDark",
  name: "Switchboard Signal Dark",
  builtIn: true,
  chromeBase: "dark",
  // Deep ink ground (the dark-mode --paper family); a hair of lift at the centre.
  background: { type: "flat", color: "#0e1a18", colorHi: "#132220" },
  grid: { show: true, color: "#1c2b28", sectionColor: "#243530", opacity: 0.55 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#2a3a36", ground: "#0a1311", intensity: 0.55 },
    { id: "ambient", type: "ambient", color: "#22312d", intensity: 0.5 },
    // Brighter top-down key than light mode: dark scenes need more tonal range.
    { id: "key", type: "directional", color: "#e8f0e8", intensity: 1.5, position: [0, 34, 2], castShadow: true },
    { id: "fill", type: "directional", color: "#31443f", intensity: 0.4, position: [10, 14, -10] },
    // Warm camera-direction rim — the Switchboard warmth against the cool ink.
    { id: "cam", type: "directional", color: "#f2b371", intensity: 0.34, position: [22, 22, 22] },
  ],
  // Soft shadow pool under the floating slabs (darker floor patch on dark).
  shadow: { enabled: true, opacity: 0.42, radius: 12, bias: -0.0004, soft: true },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 46 },
  nodes: {
    opacity: 1,
    roughness: 0.7,
    metalness: 0,
    emissive: 0.05,
    selectionEmissive: 0.45,
    colors: {
      // Brightened stage hues so trays pop on the deep ink ground.
      orange: "#ff9532",
      green: "#3ecf7a",
      violet: "#9d6bff",
      amber: "#ffd34d",
      // Raised dark surface for incidental nodes (the dark-mode "card" tone).
      ink: "#22322f",
    },
    selection: "#ff9532",
    paper: "#1c2a27",
  },
  edges: {
    // Light sage: clear contrast on the ink ground without glowing.
    color: "#93a89e",
    width: 2.5,
    widthSelected: 4,
    flow: "#ffa24d",
    arrowSize: 0.9,
    routing: "iso",
    connector: "line",
  },
  text: {
    font: "/fonts/bricolage-grotesque-600.ttf",
    color: "#e9e8df",
    opacity: 1,
    size: 0.5,
    orientation: "billboard",
    // Dark raised-card pills (labelPalette: bubble plate = nodes.paper).
    style: "bubble",
    scale: 1,
    offset: [0, 0.5, 0],
    sublabel: { color: "#9aa49d", size: 0.4, font: "/fonts/bricolage-grotesque-600.ttf" },
  },
};
