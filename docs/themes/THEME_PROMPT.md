# Theme Prompt — generate a `ThemeSpec` with an LLM

Paste **everything in the code block below** into a fresh chat with any capable LLM, replace the
*GOAL* line with the look you want, and it will return a single `ThemeSpec` JSON. Then in the editor:
**Theme manager → New** (or pick a theme to overwrite) → **paste into the JSON box → Apply**. To ship
it, follow [`CREATING_THEMES.md`](./CREATING_THEMES.md) §4.

---

````text
You are designing a THEME for an isometric 2.5D workflow/architecture editor (React Three Fiber).
Output ONE JSON object matching the ThemeSpec TypeScript type below — and NOTHING else (no prose, no
markdown fences). All colours are 6-digit hex strings (e.g. "#ea7600").

GOAL: <describe the look — e.g. "a calm blueprint theme: dark navy background, cyan grid, glowing
cyan nodes, thin white connectors, perspective camera">

type NodeColorRole = "orange" | "green" | "violet" | "amber" | "ink";
type TextOrientation = "billboard" | "ground" | "uprightX" | "uprightZ";
type ConnectorStyle  = "line" | "tube" | "ribbonArrow";

type LightSpec =
  | { id: string; type: "ambient";    color: string; intensity: number }
  | { id: string; type: "hemisphere"; sky: string; ground: string; intensity: number }
  | { id: string; type: "directional"; color: string; intensity: number; position: [number,number,number]; castShadow?: boolean }
  | { id: string; type: "point";       color: string; intensity: number; position: [number,number,number]; distance?: number };

interface ThemeSpec {
  id: string;                 // kebab-case, unique, e.g. "blueprint"
  name: string;               // human label, e.g. "Blueprint"
  chromeBase: "light" | "dark";   // pick by background brightness (light bg -> "light")
  background: { type: "flat" | "radial"; color: string; colorHi?: string };
  grid: { show: boolean; color: string; sectionColor: string; opacity?: number };  // opacity 0..1
  lights: LightSpec[];        // 2-5 lights; include ONE directional with castShadow:true
  shadow: { enabled: boolean; opacity: number; radius: number; bias: number };     // opacity 0..1, radius 0..20, bias ~ -0.0004
  camera: {
    kind: "orthographic" | "perspective";
    isoDir?: [number,number,number]; // view direction, default [1,1,1]
    target?: [number,number];
    zoom?: number;            // orthographic, 8..120 (≈38 default)
    fov?: number;             // perspective, 15..90 (≈35)
    distance?: number;        // perspective, 20..160 (≈52)
  };
  nodes: {
    opacity: number;          // 0..1 (1 = opaque)
    roughness?: number;       // 0..1 (higher = matte)
    metalness?: number;       // 0..1 (keep low, ≤0.2)
    emissive: number;         // 0..1 subtle glow (≈0.05)
    selectionEmissive: number;// 0..1 (≈0.5)
    colors: Record<NodeColorRole, string>; // ALL FIVE keys required
    selection: string;        // selection highlight colour
    paper: string;            // "note" tile colour
  };
  edges: {
    color: string; width: number;        // width 0.5..12
    widthSelected: number;                // > width
    flow: string;                         // data-flow pulse colour
    arrowSize: number;                    // 0.5..4 (1 = default)
    routing: string;                      // "orthogonal" | "smooth" | "direct"
    connector: ConnectorStyle;            // "line" for now
  };
  text: {
    font?: string;            // optional font-file URL; omit for default sans
    color: string; opacity: number; size: number;  // size ≈0.55, opacity 0..1
    orientation: TextOrientation;         // usually "billboard"
  };
}

RULES:
- Output VALID JSON only (double-quoted keys, no comments, no trailing commas).
- Provide all five nodes.colors keys (orange, green, violet, amber, ink). For a near-monochrome look,
  set "ink" to your dominant node colour and keep accents for the others.
- chromeBase MUST match the background brightness (light background -> "light", dark -> "dark").
- Keep it readable: enough light/shadow contrast that nodes read as 3D, and text legible on the bg.
````

---

## Worked example output — the built-in `aws` theme

This is a valid `ThemeSpec` (the AWS Reference Architecture look). Paste it into the manager's JSON
box and **Apply** to try it, or use it as a template:

```json
{
  "id": "aws",
  "name": "AWS Architecture",
  "chromeBase": "light",
  "background": { "type": "flat", "color": "#fcfcfb", "colorHi": "#ffffff" },
  "grid": { "show": false, "color": "#d8dade", "sectionColor": "#c4c7cc", "opacity": 0.45 },
  "lights": [
    { "id": "hemi", "type": "hemisphere", "sky": "#ffffff", "ground": "#e8e9ec", "intensity": 0.65 },
    { "id": "ambient", "type": "ambient", "color": "#f4f4f6", "intensity": 0.5 },
    { "id": "key", "type": "directional", "color": "#ffffff", "intensity": 1.2, "position": [14, 26, 10], "castShadow": true },
    { "id": "fill", "type": "directional", "color": "#eef0f4", "intensity": 0.35, "position": [-12, 12, -14] },
    { "id": "warm", "type": "point", "color": "#f7b955", "intensity": 0.35, "position": [-10, 9, 11], "distance": 46 }
  ],
  "shadow": { "enabled": true, "opacity": 0.18, "radius": 8, "bias": -0.0004 },
  "camera": { "kind": "orthographic", "isoDir": [1, 1, 1], "zoom": 40 },
  "nodes": {
    "opacity": 0.92, "roughness": 0.7, "metalness": 0, "emissive": 0.03, "selectionEmissive": 0.45,
    "colors": { "orange": "#ea7600", "green": "#3f7a4e", "violet": "#6a4a8a", "amber": "#f59e0b", "ink": "#e9eaec" },
    "selection": "#f59e0b", "paper": "#f2f3f5"
  },
  "edges": { "color": "#ea7600", "width": 5, "widthSelected": 7, "flow": "#ea7600", "arrowSize": 2.1, "routing": "orthogonal", "connector": "ribbonArrow" },
  "text": { "color": "#3b3f46", "opacity": 1, "size": 0.55, "orientation": "billboard" }
}
```

> The importer is tolerant: missing fields fall back to the current theme's values, so a partial JSON
> still applies. `connector: "tube" | "ribbonArrow"` is accepted now but renders as a thick line until
> the Step 3 connector renderers ship.
