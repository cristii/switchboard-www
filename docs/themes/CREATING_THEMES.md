# Creating Themes — short tutorial

A **theme** is one `ThemeSpec` object describing *every* canvas visual: background, grid, the
(multiple, coloured) lights, shadows, the camera (orthographic **or** perspective + FOV), node
materials and transparency, connector width/colour, and 3D-text defaults. You edit themes **live** in
the **Theme manager** pane, they **autosave to your browser**, and you can **export the JSON to commit
a theme to the repo** so everyone gets it in the deployed instance.

> Full field reference: [`isometric_workflow_editor_theming_guide.md`](./isometric_workflow_editor_theming_guide.md).
> Generate one with an LLM: [`THEME_PROMPT.md`](./THEME_PROMPT.md).

---

## 1. Edit a theme live (Theme manager)

1. Open the editor (`/isometric-editor`) and click the **palette** button in the toolbar (next to the
   light/dark toggle). On mobile it opens as a bottom drawer.
2. Pick a theme in **Active theme** (`light`, `dark`, `aws`, or any you've made).
3. Drag the sliders / pick colours. **The canvas updates as you edit.** You can change:
   - **Background** (flat or radial + colours), **Grid** (on/off, colours, opacity).
   - **Camera** — orthographic *zoom* or perspective *FOV* + *distance*, and the *view direction*.
   - **Shadows** — on/off, opacity, softness.
   - **Lights** — add/remove ambient · hemisphere · directional · point lights; set colour(s),
     intensity, position, and which directional casts shadows. **Multiple coloured lights are the
     point** — try a warm point light off to one side.
   - **Nodes** — opacity (transparency), roughness, metalness, glow, the five colour roles, selection
     + paper colours.
   - **Connectors** — colour, data-flow colour, line width (+ selected width), arrow size, style.
   - **3D text** — colour, opacity, size, default orientation, optional font URL.
4. Every edit **autosaves to `localStorage["sb-editor-themes"]`** in this browser. Editing a built-in
   (`light`/`dark`/`aws`) transparently forks an **override** of it — use **Reset** to drop the
   override and restore the shipped values.

**New / Duplicate / Rename / Delete** are in the same pane. *New* and *Duplicate* fork the current
spec into a fresh user theme and switch to it.

---

## 2. Per-node / per-edge overrides (no theme needed)

Some looks are per-object, not per-theme — set them on the node/edge (Inspector or JSON):

- **Node transparency:** Inspector → *Opacity* (overrides the theme's node opacity for that node).
- **Node colour:** Inspector swatches, or `node.color` (hex) in JSON — e.g. a **blue** RDS in the AWS
  look is just `"color": "#3b82f6"`.
- **Translucent orange platform:** a `group` node with `"color": "#ea7600"`.
- **3D text node:** add a **Text** node (palette → Layout → Text); Inspector sets its *orientation*
  (billboard / ground / upright) and *size*. `node.label` is the text.
- **3D edge label:** set `edge.labelOrientation` (`billboard|ground|uprightX|uprightZ`) — the edge's
  `label` then renders as in-scene 3D text instead of a flat chip.

---

## 3. Use a theme in a preview / embed

The read-only preview (`DiagramPreview` / `/diagram-preview`) takes a theme through its config JSON —
either a **registered id** or a **full inline `ThemeSpec`**:

```jsonc
{
  "config": { "theme": "aws", "showGround": true, "cameraMovable": true },
  "diagram": { "version": 1, "nodes": [ … ], "edges": [ … ] }
}
```

```jsonc
{ "config": { "theme": { "id": "my-look", "name": "My look", "chromeBase": "light", /* …full ThemeSpec… */ } },
  "diagram": { … } }
```

The playground has a **Theme** dropdown (built-ins) above the JSON editor. Previews don't read
localStorage — they show exactly the id/spec you pass, so embeds are deterministic.

---

## 4. Commit a theme to the repo (ship it to everyone)

localStorage themes live only in your browser. To make a theme a **built-in** shipped in the deploy:

1. In the Theme manager → **Export JSON** (also copies to your clipboard).
2. Create a module under `src/components/editor/theme/themes/`, e.g. `midnight.ts`:
   ```ts
   import type { ThemeSpec } from "../themeSpec";
   export const midnightTheme: ThemeSpec = { /* paste the exported JSON, as a typed object */ };
   ```
3. Register it in `src/components/editor/theme/themeRegistry.ts`:
   ```ts
   import { midnightTheme } from "./themes/midnight";
   export const BUILT_IN_THEMES: ThemeSpec[] = [lightTheme, darkTheme, awsTheme, midnightTheme];
   ```
4. `npm run typecheck && npm run build` → the theme now appears in the manager dropdown, the preview
   `theme` field, and the playground for **everyone**.

> Prefer JSON over a `.ts` module? You can also keep the exported `.json` next to the modules and
> import it (`import midnight from "./themes/midnight.json"`) — `tsconfig` has `resolveJsonModule`.
> A typed `.ts` module is the recommended path (it's checked at build time).

---

## 5. Make a theme the default

- **Editor:** `<IsometricWorkflowEditor defaultThemeId="aws" />` (or `defaultTheme="dark"` for the
  built-in light/dark). Otherwise the editor restores the last-used theme from localStorage.
- **A page/embed:** pass `config.theme` to `DiagramPreview` as shown above.

---

## 6. Checklist

- [ ] Looks right in the editor **and** a preview (`/diagram-preview`).
- [ ] If it's a built-in: registered in `themeRegistry.ts`, `typecheck` + `build` green.
- [ ] Chrome base (`chromeBase: "light" | "dark"`) matches the background (light bg → `"light"`).
- [ ] Shadows enclose the diagram (widen light/shadow if a big diagram clips).
- [ ] Verify with `prefers-reduced-motion` (flow/tweens already respect it).
