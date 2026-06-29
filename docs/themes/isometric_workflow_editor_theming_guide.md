# Isometric Workflow Editor — Theming, Lighting & Colour Guide

How to adjust the editor/preview's **lighting**, **colours**, **shadows** and **backdrop**, and how
to **create and load new themes**. Everything here applies to both the editor (`/isometric-editor`)
and the read-only preview (`DiagramPreview` / `/diagram-preview`) — they share the same scene.

---

## 0. The `ThemeSpec` system (current model — start here)

As of the theme system (Step 2 of [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md)), a theme is
**one `ThemeSpec` object** describing every canvas visual, edited **live** in the **Theme manager**
pane (toolbar palette button). You rarely hand-edit `sceneTheme.ts` any more — the old `LIGHT`/`DARK`
constants are now *derived* from `ThemeSpec`s. The field-level guidance in §3–§5 below still applies —
those values are now **fields of the spec** instead of loose constants.

- **Author a theme:** [`CREATING_THEMES.md`](./CREATING_THEMES.md) (manager → autosave → export →
  commit). **Generate one with an LLM:** [`THEME_PROMPT.md`](./THEME_PROMPT.md).
- **What a `ThemeSpec` contains:** `chromeBase` (light/dark DOM tokens), `background`, `grid`,
  `lights[]` (multiple coloured ambient/hemisphere/directional/point), `shadow`, `camera`
  (orthographic **or** perspective + FOV/zoom/direction), `nodes` (opacity, roughness, metalness,
  glow, the five role colours, selection, paper), `edges` (colour, width, flow, arrow size, routing,
  connector), `text` (colour/opacity/size/orientation/font). Full type:
  `src/components/editor/theme/themeSpec.ts`.
- **Registry + persistence:** `theme/themeRegistry.ts` merges **built-in** themes
  (`theme/themes/{light,dark,aws,blueprint,signal}.ts`, shipped in the build) with **user** themes from
  `localStorage["sb-editor-themes"]`. `theme/useThemeManager.ts` owns the active theme +
  create/duplicate/rename/delete/import/export; `panels/ThemeManager.tsx` is the pane.
- **Resolution:** `resolveSceneTheme(spec)` (in `sceneTheme.ts`) flattens a `ThemeSpec` into the
  `SceneTheme` the meshes/edges consume; `DiagramCanvas` reads `lights`/`camera`/`shadow`/`grid`/
  `background` straight off the spec (data-driven `<Lights>` + spec-driven `<CameraControls>`).
- **Built-in `aws` theme:** reproduces the AWS isometric look (white bg, matte-grey transparent
  nodes, soft shadows, thick orange flow, translucent orange platforms). Try it: Storybook
  `Editor/Theming → AWS`, or `<IsometricWorkflowEditor defaultThemeId="aws" />`, or the
  `aws` preset / `config.theme: "aws"`.
- **Built-in `signal` theme:** the layered "premium-but-playful" capability look — double-layer
  rounded-square **slab** platforms (`meta.platform: "slab"`) floating over a white ground (grid on),
  with a soft top-down floor shadow, white pill labels, pastel `meta.plateColor` tags, and a thin
  **arrowless** flow line (`arrowSize: 0`). Drives the `/services` capability pillars via
  `buildPillarDiagram` + `PillarIsoPreview`.

> The rest of this guide (the original two-layer explanation + per-field tuning) remains accurate as a
> **reference for what each field does**; just remember the manager/spec is the entry point now, and
> "edit the `LIGHT` constant" means "edit the `lightTheme` spec (or use the manager)".

---

## 1. The two theming layers (read this first)

A theme has **two halves** that must stay in sync, because the DOM and WebGL can't share values:

| Layer | What it styles | Source of truth | Form |
|---|---|---|---|
| **Chrome tokens** | Toolbar, palette, inspector, labels, panels (HTML/CSS) | `src/components/editor/theme/editor-tokens.css` | CSS variables scoped to `[data-editor-theme="…"]` |
| **Scene (ThemeSpec)** | The 3D canvas: camera, lights, materials, grid, shadows, backdrop, edges, flow, text (WebGL) | `theme/themeSpec.ts` + `theme/themes/*` (resolved by `resolveSceneTheme` in `sceneTheme.ts`) | A **`ThemeSpec`** object — **hex strings** + numbers |

WebGL materials/lights **cannot** read CSS variables, so the scene palette duplicates the brand
colours as concrete hex. **Rule of thumb:** when you change a colour, update it in **both** places
if it appears in both (e.g. a node colour shows in the palette icon via `--node-*` *and* on the 3D
mesh via `sceneTheme.nodeColors`).

A single string — the **theme value** (`"light"` or `"dark"`, type `EditorTheme` in
`state/types.ts`) — selects both halves:
- DOM: written to `data-editor-theme` on the editor/preview root → activates the matching CSS block.
- WebGL: passed to `getSceneTheme(theme)` → returns the matching palette constant.

---

## 2. File map

```
src/components/editor/
  theme/
    themeSpec.ts          # ThemeSpec + LightSpec types, defaults, normalizeThemeSpec (import)
    themes/{light,dark,aws,blueprint,signal}.ts  # built-in ThemeSpecs (shipped in the build)
    themeRegistry.ts      # built-in + localStorage user themes; getThemeSpec / resolveThemeFromConfig
    useThemeManager.ts    # active theme + CRUD/import/export (localStorage "sb-editor-theme(s)")
    sceneTheme.ts         # SceneTheme (resolved view) + resolveSceneTheme(spec) + getSceneTheme()
    editor-tokens.css     # chrome CSS vars (--editor-*, --node-*) per chromeBase
    useEditorTheme.ts     # legacy light/dark chrome toggle (kept; editor now uses useThemeManager)
  panels/ThemeManager.tsx # the live theme-editor pane (toolbar palette button)
  scene/
    DiagramCanvas.tsx     # reads spec.camera/lights/shadow/grid/background; passes resolved scene down
    Lights.tsx            # data-driven lights from spec.lights[] (ambient/hemisphere/directional/point)
    CameraControls.tsx    # orthographic OR perspective (CameraSpec: kind/isoDir/distance/fov)
    Backdrop.tsx          # gradient background (spec.background.colorHi → color)
    Grid.tsx              # grid colours/opacity from the resolved scene
    nodes/shapes/*.tsx    # NodeStandardMaterial: opacity + roughness/metalness overrides
    nodes/shapes/TextNode.tsx # 3D in-canvas text (billboard/ground/upright) + edge labels
  preview/previewConfig.ts # PreviewConfig.theme = theme id OR inline ThemeSpec
```

The light-theme chrome tokens are derived from the site brand tokens in `src/styles/colors.css`
(`--orange`, `--ink`, `--paper`, …). The scene `LIGHT` palette hardcodes the same hex values.

---

## 3. The scene palette (`sceneTheme.ts`)

This is the main dial for **lighting and colour in the 3D view**. The `SceneTheme` interface:

```ts
export interface SceneTheme {
  background: string;        // backdrop gradient edge colour
  backgroundHi: string;      // backdrop gradient centre (brighter)
  grid: string;              // minor grid line
  gridStrong: string;        // section grid line
  ambient: string;           // ambient light colour
  ambientIntensity: number;  // 0–1ish — flat base fill
  key: string;               // key (sun) light colour
  keyIntensity: number;      // main light strength + the caster of shadows
  fill: string;              // fill light colour (opposite the key)
  fillIntensity: number;     // softens the shadow side
  hemiSky: string;           // hemisphere light: colour from above
  hemiGround: string;        // hemisphere light: bounce colour from below
  hemiIntensity: number;     // soft, pro ambient gradient
  shadowOpacity: number;     // darkness of the cast-shadow ground (0–1)
  selection: string;         // selected node ring / edge highlight
  edge: string;              // default edge line colour
  flow: string;              // animated data-flow pulse dots
  paper: string;             // "note" tile colour
  nodeColors: Record<NodeColorRole, string>; // orange/green/violet/amber/ink
  nodeEmissiveIntensity: number;     // subtle glow on every node
  selectionEmissiveIntensity: number;// glow on the selected node
}
```

`getSceneTheme(theme)` returns `DARK` when `theme === "dark"`, else `LIGHT`.

### 3a. Adjust lighting (brightness / warmth / mood)

Edit the `LIGHT` / `DARK` constants in `sceneTheme.ts`:

- **Brighter / darker overall:** raise/lower `keyIntensity` (main) and `hemiIntensity` (ambient
  gradient). `ambientIntensity` is a flat floor — keep it low (~0.3–0.5) or shading goes flat.
- **Warmer / cooler:** tint `key` (e.g. `#fffaf2` warm vs `#eaf2ff` cool), and the hemisphere
  `hemiSky` / `hemiGround`.
- **Softer shadow side:** raise `fillIntensity` (fills the dark side); lower it for more contrast.
- **Light direction / angle:** the directional light positions are in `DiagramCanvas.tsx`
  (`position={[16,24,12]}` key, `[-14,10,-10]` fill). Move the key light to change where shadows
  fall. (The isometric camera direction itself is `ISO_DIR` in `CameraControls.tsx`.)

### 3b. Adjust shadows

- **Strength:** `shadowOpacity` (the cast-shadow ground plane's darkness).
- **Softness:** `shadow-radius` on the key `directionalLight` in `DiagramCanvas.tsx` (higher = softer).
- **Crispness / acne:** `shadow-bias` (`-0.0004`) and `shadow-normalBias` (`0.02`) in the same place.
- **Coverage:** `shadow-camera-left/right/top/bottom` (±24) must enclose the whole diagram or
  shadows clip at the edges; widen for big diagrams.
- Shadows only render when the **ground** is on (toolbar "shadow" toggle / `showGround` /
  `config.showGround`). `castShadow` on the key light is tied to that.

### 3c. Adjust the backdrop

`Backdrop.tsx` builds a radial gradient from `backgroundHi` (centre) to `background` (edge). Make the
two colours closer for a flatter look, or further apart for more depth. Keep them in the same family
as the chrome so the canvas blends with the panels.

### 3d. Adjust node / edge / accent colours

- **A node kind's colour:** change its **role** in `catalog/nodeCatalog.ts` (`colorRole:
  "orange" | "green" | "violet" | "amber" | "ink"`), or change what a role *means* in
  `sceneTheme.nodeColors` (affects every node using that role). For the palette icon to match, the
  role maps to `var(--node-<role>)` in `editor-tokens.css`.
- **One specific node:** set `node.color` (hex) in the diagram JSON — overrides the role.
- **Selection highlight:** `selection`. **Edges:** `edge` (+ per-edge `edge.color`). **Data-flow
  pulse:** `flow`. **Grid:** `grid` / `gridStrong`. **Notes:** `paper`.

### 3e. Adjust material sheen

Each shape in `scene/nodes/shapes/*.tsx` sets `roughness` (~0.42) and `metalness` (~0.06) on its
`meshStandardMaterial`. Lower `roughness` = glossier; raise = more matte. Keep `metalness` low (these
are matte SaaS toys, not metal).

---

## 4. Chrome tokens (`editor-tokens.css`)

Controls the HTML UI (toolbar, palette, inspector, labels). Each theme is a scoped block:

```css
[data-editor-theme="light"] {
  --editor-bg: var(--paper);
  --editor-surface: var(--white);
  --editor-text: var(--ink);
  --editor-accent: var(--orange);
  --editor-selection: var(--amber);
  --editor-shadow: var(--shadow-card);   /* HARD offset, no blur — brand rule */
  --node-orange: var(--orange);  /* … green/violet/amber/ink */
  /* …full list in the file… */
}
[data-editor-theme="dark"] { /* deep-ink surfaces + brightened accents */ }
```

Brand rules for chrome (keep them): use these tokens (never raw hex), **no blurred shadows** (hard
offset only), no emoji. The light theme derives from `src/styles/colors.css`; if you change a brand
colour there, reflect it in the scene `LIGHT` palette too.

---

## 5. How a theme is loaded at runtime

- **Editor:** `useEditorTheme(defaultTheme?)` resolves the value (explicit `defaultTheme` →
  stored `localStorage["sb-editor-theme"]` → OS `prefers-color-scheme` → `light`), writes
  `data-editor-theme` on the root, and the toolbar sun/moon toggles + persists it. Force one with
  `<IsometricWorkflowEditor defaultTheme="dark" />`.
- **Preview / embeds:** pass `config={{ theme: "dark" }}` to `DiagramPreview` (or in the playground
  JSON, `"config": { "theme": "dark" }`). Previews don't persist — they show exactly what you pass.
- **Programmatic:** `const { theme, setTheme, toggle } = useEditorTheme(); setTheme("dark")`.

---

## 6. Create a NEW theme (e.g. "midnight" or "blueprint")

> **This is now data-driven** — no type-widening, no scene-palette constant. The scene reads a
> `ThemeSpec`, so a new theme is **one object**. The step-by-step is in
> [`CREATING_THEMES.md`](./CREATING_THEMES.md); the short version:

1. **Author the spec** in the Theme manager (palette button) — *New* forks the current theme; tune
   everything live; it autosaves to `localStorage`. (Or generate one via
   [`THEME_PROMPT.md`](./THEME_PROMPT.md) and **Import** the JSON.)
2. **Pick `chromeBase`** — `"light"` or `"dark"`. This selects which `editor-tokens.css` block styles
   the **HTML chrome** (toolbar/palette/inspector). Most themes reuse one of the two existing chrome
   palettes; the **scene** is fully recoloured by the spec regardless.
3. **Ship it (optional)** — Export JSON → add `theme/themes/<id>.ts` → register in
   `theme/themeRegistry.ts`'s `BUILT_IN_THEMES`. Now it's available to everyone (manager dropdown,
   preview `theme` field, playground). `npm run typecheck && npm run build`.
4. **Use it** — `<IsometricWorkflowEditor defaultThemeId="<id>" />`, or preview
   `"config": { "theme": "<id>" }` (an inline full `ThemeSpec` works too).

**Custom chrome palette (advanced):** if `chromeBase: "light" | "dark"` isn't enough and you want a
bespoke toolbar/panel colourway, add a new `[data-editor-theme="<id>"]` block in `editor-tokens.css`
and set `chromeBase` to that id's base — but `data-editor-theme` currently only renders `light`/`dark`
strings (from `spec.chromeBase`); wiring a third chrome id is a small follow-up (set
`data-editor-theme={spec.id}` when a matching CSS block exists). The **preview** already accepts any
theme id / inline spec — `mergePreviewConfig` no longer coerces to light/dark.

---

## 7. Quick recipes

- **"Make it warmer/cosier":** raise `hemiSky` warmth + `key` to `#fff5e8`, nudge `backgroundHi`
  warmer, lower `keyIntensity` slightly.
- **"Stronger, crisper shadows":** raise `shadowOpacity` to ~0.4, lower `shadow-radius` to ~3.
- **"Flatter / printed look":** bring `backgroundHi` and `background` closer, raise material
  `roughness` to ~0.6, lower `nodeEmissiveIntensity` toward 0.
- **"Recolour all AI nodes":** change `sceneTheme.nodeColors.violet` (3D) **and** `--node-violet`
  (palette icon) — or reassign `ai` to a different `colorRole` in `nodeCatalog.ts`.
- **"Brand-accent pulse":** set `flow` to your accent in both `LIGHT`/`DARK`.

## 8. Guardrails
- Edit **both** layers when a colour appears in both (chrome var + scene hex).
- Chrome stays flat + hard-shadowed + token-based (`AGENTS.md`); the **3D viewport** is where soft
  shadows / subtle gradients live (see `isometric_workflow_editor_description.md` §3).
- Verify light **and** dark after any change; respect `prefers-reduced-motion` (already handled).
- After edits: `npm run typecheck` + `npm run build-storybook`; eyeball in `npm run dev`
  (`/isometric-editor`, `/diagram-preview`) or `npm run storybook` (`Editor/Theming`).
