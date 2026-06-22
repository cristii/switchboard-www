# Isometric Workflow Editor — Theming, Lighting & Colour Guide

How to adjust the editor/preview's **lighting**, **colours**, **shadows** and **backdrop**, and how
to **create and load new themes**. Everything here applies to both the editor (`/isometric-editor`)
and the read-only preview (`DiagramPreview` / `/diagram-preview`) — they share the same scene.

---

## 1. The two theming layers (read this first)

A theme has **two halves** that must stay in sync, because the DOM and WebGL can't share values:

| Layer | What it styles | Source of truth | Form |
|---|---|---|---|
| **Chrome tokens** | Toolbar, palette, inspector, labels, panels (HTML/CSS) | `src/components/editor/theme/editor-tokens.css` | CSS variables scoped to `[data-editor-theme="…"]` |
| **Scene palette** | The 3D canvas: lights, materials, grid, shadows, backdrop, edges, flow (WebGL) | `src/components/editor/theme/sceneTheme.ts` | TypeScript constants (`LIGHT` / `DARK`) — **hex strings** |

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
    editor-tokens.css     # chrome CSS vars (--editor-*, --node-*) per theme
    sceneTheme.ts         # WebGL palette: SceneTheme interface + LIGHT/DARK + getSceneTheme()
    useEditorTheme.ts     # theme state: localStorage ("sb-editor-theme") + prefers-color-scheme
  scene/
    DiagramCanvas.tsx     # the lights live here (hemisphere + ambient + key/fill directional)
    Backdrop.tsx          # radial gradient background (uses scene.backgroundHi → scene.background)
    Grid.tsx              # grid colours come from scene.grid / scene.gridStrong
    nodes/shapes/*.tsx    # material roughness/metalness (sheen) per shape
  preview/previewConfig.ts # PreviewConfig.theme for embeds
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

The system ships `light` + `dark`. Adding a theme is a small, well-defined change in 4–5 spots:

1. **Widen the type** — `state/types.ts`:
   ```ts
   export type EditorTheme = "light" | "dark" | "midnight";
   ```
2. **Add the chrome block** — `theme/editor-tokens.css`: copy the `[data-editor-theme="dark"]` block,
   rename to `[data-editor-theme="midnight"]`, and set every `--editor-*` / `--node-*` value.
3. **Add the scene palette** — `theme/sceneTheme.ts`: copy `DARK` into a new `MIDNIGHT: SceneTheme`,
   tune the hex/intensities, then map it:
   ```ts
   export function getSceneTheme(theme: EditorTheme): SceneTheme {
     if (theme === "dark") return DARK;
     if (theme === "midnight") return MIDNIGHT;
     return LIGHT;
   }
   ```
4. **Decide how it's selected:**
   - The sun/moon **toggle** only flips light↔dark. For 3+ themes, drive it with `setTheme("midnight")`
     (e.g. a small theme dropdown), or change `useEditorTheme.toggle` to **cycle** an ordered list.
   - **Preview config** currently coerces unknown themes to light/dark in `mergePreviewConfig`
     (`previewConfig.ts`: `p.theme === "dark" ? "dark" : "light"`). To allow `"midnight"` in preview
     JSON, accept it there too (e.g. validate against the set of known themes).
5. **Test in the new theme:** Storybook `Editor/Theming` (force `defaultTheme="midnight"`) and the
   `/diagram-preview` playground (`"config": { "theme": "midnight" }`).

> Keep the **chrome block** and the **scene palette** for the new theme consistent (same accent,
> same surface family) — they're two views of the same theme.

### Optional: make themes fully data-driven (future refactor)
Adding themes touches several files because chrome tokens (CSS) and scene palette (TS) are separate.
If you'll have many themes, consider a single registry: a `themes.ts` exporting
`Record<string, { scene: SceneTheme; tokens: Record<string,string> }>`, apply `tokens` to the editor
root via inline CSS custom properties (instead of static CSS blocks), and look up `scene` by name.
Then a new theme = one object, and `EditorTheme` becomes `string`. Not required for light/dark — only
worth it past ~3 themes.

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
