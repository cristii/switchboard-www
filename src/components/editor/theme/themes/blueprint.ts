// Built-in "blueprint" theme — the clean isometric architecture-diagram look
// (cf. the reference renderings) translated into Switchboard's paper-&-ink palette
// (no blue). Soft paper backdrop, grid off, gentle warm lighting + low shadow,
// light matte nodes with brand accent roles, quiet dashed `cornerConnect` default
// (bold arrows set per-edge for primary flow), and bubble-tag labels. Used by the
// /services "systematic approach" preview. See docs/themes + IMPLEMENTATION_PLAN.

import type { ThemeSpec } from "../themeSpec";

export const blueprintTheme: ThemeSpec = {
  id: "blueprint",
  name: "Switchboard Blueprint",
  builtIn: true,
  chromeBase: "light",
  background: { type: "radial", color: "#e6e5dc", colorHi: "#f3f2ea" },
  grid: { show: false, color: "#b9c2b6", sectionColor: "#cbd2c5", opacity: 0.4 },
  lights: [
    { id: "hemi", type: "hemisphere", sky: "#fbf7ee", ground: "#d7d9cb", intensity: 0.6 },
    { id: "ambient", type: "ambient", color: "#efeee6", intensity: 0.5 },
    { id: "key", type: "directional", color: "#fffaf2", intensity: 1.25, position: [14, 26, 10], castShadow: true },
    { id: "fill", type: "directional", color: "#e1e2d7", intensity: 0.32, position: [-12, 12, -14] },
    { id: "warm", type: "point", color: "#f7b955", intensity: 0.26, position: [-10, 9, 11], distance: 46 },
  ],
  shadow: { enabled: true, opacity: 0.16, radius: 8, bias: -0.0004 },
  camera: { kind: "orthographic", isoDir: [1, 1, 1], zoom: 42 },
  nodes: {
    opacity: 1,
    roughness: 0.72,
    metalness: 0,
    emissive: 0.03,
    selectionEmissive: 0.45,
    colors: {
      // Most nodes read as light matte paper-grey (the `ink` role covers
      // action/service/group); accent roles carry the brand hues.
      orange: "#b45309",
      green: "#3f7a4e",
      violet: "#6a4a8a",
      amber: "#fbbf24",
      ink: "#e7e6dd",
    },
    selection: "#b45309",
    paper: "#f3f2ea",
  },
  edges: {
    color: "#54605c",
    width: 2.5,
    widthSelected: 4,
    flow: "#b45309",
    arrowSize: 1.4,
    routing: "orthogonal",
    connector: "cornerConnect",
  },
  text: { color: "#15211f", opacity: 1, size: 0.5, orientation: "billboard", style: "bubble" },
};
