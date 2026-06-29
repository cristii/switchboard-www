# Isometric Workflow Editor — Implementation Plan (Themes, Text, Paths, Models, Linking)

A staged plan to evolve the editor/preview into a deeply themeable, model-aware, delightful tool —
and to reproduce the look of the **AWS Reference Architecture** isometric reference as a swappable
theme. Built in **4 ordered steps**; each step keeps `npm run typecheck` + `build-storybook` +
`next build` green, three.js code-split off non-editor routes, and follows `AGENTS.md` brand rules
(tokens in DOM chrome, no emoji, hard-shadow chrome; the **3D viewport** is where soft lighting /
shading lives).

North star: **professional but playful** — clean isometric SaaS visuals you enjoy toying with
(multiple coloured lights, soft shadows, animated flow, live theming).

---

## Reference image → the `aws` theme

The target image (AWS "Web Application Hosting") defines a built-in theme:

| Aspect | Value |
|---|---|
| Background | flat near-white (`#FCFCFB`), **grid off** |
| Nodes | light-grey matte (`~#E9EAEC`), crisp isometric face shading, **adjustable transparency** |
| Shadows | soft, light-grey, low opacity (~0.18) |
| Primary connectors | **thick orange isometric arrow ribbons** (gradient orange `#F59E0B`→`#EA7600`) |
| Secondary links | thin grey lines (`#9AA0A6`) |
| Group platforms | translucent orange rounded slabs ("availability zones") |
| Accents | orange primary; occasional blue (`#3B82F6`) for data stores |
| Labels | small 3D text, some lying flat, some upright; grey/orange/black |
| Camera | clean orthographic isometric (system also supports perspective/FOV for other themes) |
| Lights | key (warm white, casts shadow) + soft hemisphere fill; tunable, multi-light capable |

---

## Architecture additions (designed once, used across steps)

### `ThemeSpec` (the unit of "a theme")
A named object describing **all** canvas visuals. Replaces the hardcoded `light`/`dark` palettes in
`theme/sceneTheme.ts`.

```ts
interface ThemeSpec {
  id: string;                 // "light" | "dark" | "aws" | user ids
  name: string;
  chromeBase: "light" | "dark";   // which editor-tokens.css block the DOM chrome uses
  background: { type: "flat" | "radial"; color: string; colorHi?: string };
  grid: { show: boolean; color: string; sectionColor: string; fade: number };
  lights: LightSpec[];        // multiple, coloured
  shadow: { enabled: boolean; opacity: number; radius: number; bias: number };
  camera: {
    kind: "orthographic" | "perspective";
    isoDir?: [number, number, number]; // view direction (default [1,1,1])
    target?: [number, number]; zoom?: number; fov?: number; distance?: number;
  };
  nodes: {
    opacity: number; roughness: number; metalness: number; emissive: number;
    colors: Record<NodeColorRole, string>; selection: string; paper: string;
  };
  edges: {
    color: string; width: number; flow: string; arrowSize: number;
    routing: string;            // routing-algorithm id (Step 3 registry)
    connector: "line" | "tube" | "ribbonArrow";
  };
  text: { font?: string; color: string; opacity: number; size: number;
          orientation: "billboard" | "ground" | "uprightX" | "uprightZ" };
}

type LightSpec =
  | { type: "ambient"; color: string; intensity: number }
  | { type: "hemisphere"; sky: string; ground: string; intensity: number }
  | { type: "directional"; color: string; intensity: number; position: [number,number,number]; castShadow?: boolean }
  | { type: "point"; color: string; intensity: number; position: [number,number,number]; distance?: number };
```

### Theme registry + provider + persistence
- **Built-in themes** are repo modules (`theme/themes/{light,dark,aws}.ts`) → shipped in the build.
- **User themes** live in `localStorage` (key `sb-editor-themes`, a `Record<id, ThemeSpec>`).
- `theme/themeRegistry.ts` merges built-in + user; `theme/ThemeProvider.tsx` (instance-scoped React
  context) exposes the **active resolved spec**; `useThemeSpec()` replaces `getSceneTheme`.
- **Commit a theme to the repo:** export its JSON from the manager → drop into `theme/themes/` (or a
  `theme/themes/*.json` loaded by the registry) → it's available in the deployed instance.

### Routing registry (Step 3)
`scene/edges/routing/index.ts`: `Record<string, RouteAlgorithm>` where
`RouteAlgorithm = (source, target, allNodes, opts) => RoutePoint[]`. Current `orthogonal`/`smooth`/
`direct` move in as entries; edges/themes select by id; new algorithms = register a function.

### 3D text + models + linking
- **Text:** drei `Text`/`Billboard` (troika, bundled with drei). A `text` node kind + optional 3D
  edge labels; orientation billboard | ground | uprightX | uprightZ; font/color/opacity/size.
- **Models:** a `model` shape lazy-loading GLB via drei `useGLTF` behind the `SHAPES` registry
  (Suspense + procedural fallback), runtime-tinted `Body` material, footprint = catalog `defaultSize`.
- **Linking:** a store `linkMode`/`linkSource` slice + `addEdge`, entered from the Inspector button,
  the Toolbar button, or the right-click context menu; live preview line reuses `ConnectPreview`.

---

## Step 1 — Documents (do first)
**Goal:** write the contracts + tutorials before building, and finish the `docs/` reorg.

- `docs/` tree with a subdir per feature; **move existing editor docs in** (done: `editor/`,
  `themes/`, `nodes/`, `preview/`). Add `docs/README.md` index + this plan.
- New docs:
  - `themes/CREATING_THEMES.md` — short tutorial: open the Theme manager → tweak → save (localStorage)
    → export JSON → commit to `theme/themes/` for the deploy. Plus the preview JSON `theme` field.
  - `themes/THEME_PROMPT.md` — copy-paste prompt that emits a valid `ThemeSpec` JSON (with the AWS
    look as a worked example) for generating themes in another chat.
  - `nodes/ADDING_NODE_TYPES.md` — add a kind: catalog entry (`nodeCatalog.ts`) + shape (`SHAPES`
    registry) + glyph (`NodeGlyph`); worked example end-to-end.
  - `nodes/BLENDER_MODELING.md` — model a node in Blender, simple textures/materials, scale + base-
    centred origin, export GLB, drop-in via the `model` shape.
  - `paths/PATH_ALGORITHMS.md` — switch the active routing algorithm; author a new one against the
    routing registry (worked example).
  - Expand `themes/…theming_guide.md` for `ThemeSpec` (currently lighting/colour focused).
- Update `AGENTS.md` to point at `docs/`.

**Acceptance:** docs render; links resolve; `git` history preserved on moved files; build unaffected.

## Step 2 — Theme system + theme creation workflow + text in canvas
**Goal:** any visual is theme-driven and editable live; the AWS theme exists; text lives in the canvas.

- Implement `ThemeSpec`, `themeRegistry`, `ThemeProvider`/`useThemeSpec`; migrate `light`/`dark` into
  built-in specs (no visual regression); add the **`aws`** built-in theme (table above).
- Refactor `DiagramCanvas`/`Grid`/`Backdrop` to read the spec; render **`lights[]`** data-driven
  (multiple coloured lights + shadow config); add `scene/SceneCamera.tsx` to build an orthographic
  **or perspective** camera (position/zoom/fov/isoDir) feeding `CameraControls`.
- **Theme manager pane** `panels/ThemeManager.tsx`: live controls (colour pickers, sliders, number
  inputs, a light list with add/remove, camera fields, node transparency, line width, text defaults);
  create/duplicate/rename/delete; save → localStorage; import/export JSON. Editor-primitive styled.
- **In-canvas text:** `text` node kind (`catalog` + `scene/nodes/shapes/TextNode.tsx` via drei
  `Text`), orientation modes, font/color/opacity/size from node `meta`/theme; optional 3D edge labels
  with the same orientation. Wire node **transparency** (theme default + per-node `opacity`).
- **Preview theme via JSON:** extend `preview/previewConfig.ts` so `config.theme` accepts a theme
  **id** or an inline `ThemeSpec`; playground (`app/diagram-preview/`) gets a theme dropdown.

**Files:** new `theme/{themeSpec,themeRegistry,ThemeProvider}.ts(x)`, `theme/themes/{light,dark,aws}.ts`,
`panels/ThemeManager.tsx`, `scene/SceneCamera.tsx`, `scene/nodes/shapes/TextNode.tsx`; edit
`scene/{DiagramCanvas,Grid,Backdrop,CameraControls}.tsx`, `catalog/nodeCatalog.ts`, `state/types.ts`
(text/opacity), `IsometricWorkflowEditor.tsx`, `preview/previewConfig.ts`, `PreviewPlayground.tsx`,
`index.ts`.
**Acceptance:** switching theme restyles the canvas live (lights/shadows/camera/colours/line width/
text); AWS theme matches the reference; themes persist + a committed theme ships in `next build`;
preview JSON selects/edits a theme; 3D text renders legibly in every orientation.

## Step 3 — Path / connection algorithm
**Goal:** routing is pluggable; connectors can be thick/arrowed (the AWS orange arrow).

- Create `scene/edges/routing/` registry; move A*/smooth/direct in; resolve per `edge.routing` /
  theme default; expose `opts` (lane offset, padding).
- Connector renderers `scene/edges/connectors/{Line,Tube,RibbonArrow}.tsx`; theme/edge pick the
  style; **line width** + arrow size from theme/edge; Inspector edge controls for routing + connector.
- Doc `paths/PATH_ALGORITHMS.md` finalised with a worked custom algorithm.

**Files:** new `scene/edges/routing/*`, `scene/edges/connectors/*`; edit `scene/edges/{OrthogonalEdge,
edgeRouting}.tsx`, `panels/Inspector.tsx`, `state/types.ts` (connector style), `theme` edge fields.
**Acceptance:** an edge can switch algorithm + connector style live; ribbon-arrow reproduces the AWS
flow arrows; perf acceptable with many edges.

## Step 4 — Nodes & model support + node linking
**Goal:** textured models load as nodes; linking has 3 ergonomic entry points.

- **Models:** `scene/nodes/shapes/ModelNode.tsx` (drei `useGLTF`, Suspense + fallback, runtime tint
  of `Body` material, footprint scaling); register a `model` shape; document the drop-in path for
  future phone/laptop/browser GLBs. Textured GLB verified.
- **Linking (3 entries):** store `linkMode`/`linkSource` slice + reuse `addEdge`:
  1. Inspector "Link to…" on the selected node.
  2. Toolbar "Link" → click node A then node B.
  3. Desktop **right-click** node → `panels/NodeContextMenu.tsx` ("Link to another node", duplicate,
     delete). Live preview line follows the cursor.

**Files:** new `scene/nodes/shapes/ModelNode.tsx`, `panels/NodeContextMenu.tsx`; edit
`state/useWorkflowStore.ts` (linkMode), `scene/nodes/NodeMesh.tsx`, `panels/{Toolbar,Inspector}.tsx`,
`IsometricWorkflowEditor.tsx`, `catalog/nodeCatalog.ts`.
**Acceptance:** a textured GLB renders as a node (tinted, correctly scaled); all three linking entry
points create an edge with a live preview; right-click menu works on desktop.

---

## docs/ structure
```
docs/
  README.md                       IMPLEMENTATION_PLAN.md
  editor/   isometric_workflow_editor_description.md   isometric_workflow_editor_progress.md
  themes/   isometric_workflow_editor_theming_guide.md  CREATING_THEMES.md  THEME_PROMPT.md
  nodes/    isometric_workflow_editor_3d_model_prompts.md  ADDING_NODE_TYPES.md  BLENDER_MODELING.md
  paths/    PATH_ALGORITHMS.md
  labels/   LABELS.md
  preview/  isometric_workflow_editor_preview_mode.md
```
(Moved docs keep their filenames so existing in-code references stay valid; new docs use short names.)

## Theme persistence & repo workflow (summary)
- Edit in the Theme manager → autosaves to `localStorage["sb-editor-themes"]` (per browser).
- "Export JSON" → paste into `src/components/editor/theme/themes/<id>.ts` (or `.json`) and commit →
  the theme is a built-in, available to everyone in the deployed instance.
- Preview/embeds: pass `config.theme = "<id>"` or an inline `ThemeSpec` (also editable in the
  playground JSON field).

## Status
- [x] Step 0 — `docs/` reorg + this plan.
- [x] Step 1 — docs: `themes/CREATING_THEMES.md`, `themes/THEME_PROMPT.md`, theming guide for
  `ThemeSpec`, `paths/PATH_ALGORITHMS.md`, `nodes/ADDING_NODE_TYPES.md`, `nodes/BLENDER_MODELING.md`,
  `labels/LABELS.md` (the node/path/Blender/label docs landed alongside Steps 3–5 so they describe
  shipped APIs).
- [x] Step 2 — theme system (`ThemeSpec` + registry + `useThemeManager`), data-driven multi-light
  scene (`Lights.tsx`), spec-driven camera (orthographic **+** perspective/FOV), node transparency,
  3D in-canvas text (`TextNode`), **Theme manager pane**, built-in **`aws`** theme + showcase preset,
  preview/playground theme selection (id or inline spec).
- [x] Step 3 — pluggable **routing registry** (`scene/edges/routing/`, A*/smooth/direct as entries,
  `registerRoutingAlgorithm`) + **connector styles** (`line` / `tube` / `ribbonArrow`); edge `routing`
  + `connector` fields, Inspector controls. The AWS flow arrows now render as real ribbon arrows.
- [x] Step 4 — **textured model nodes** (`ModelNode` via `useGLTF`, Suspense + procedural fallback,
  `Body` tint, footprint fit; opt-in via `node.meta.model`) + **node linking** with 3 entry points
  (Inspector "Link to…", Toolbar "Link", right-click `NodeContextMenu`) sharing a store `linkMode`
  slice + a cursor-following `LinkPreview`.
- [x] Step 5 — **3D hovering labels/tooltips**: node/edge labels render as in-canvas 3D text (4
  orientations) by default; DOM chips kept as an opt-in `spec.text.mode = "dom"`; global / per-scene /
  per-object label styling. (`NodeLabels3D`, `text.mode`, Inspector + Theme-manager controls.)
- [x] Step 6a — **declutter + tags/arrows + site embed**: plate-backed **tag styles**
  (`plain/bubble/tips/info/note` via `text.style` + `node/edge.meta.labelStyle`) so labels stop
  overlapping; new connectors **`boldArrow`** + **`cornerConnect`** and the 5-name Inspector
  **Connection** preset; **Hybrid IA** (palette *Annotate* group + Inspector style pickers); the
  Switchboard **`blueprint`** theme; templates relabelled **"(old)"** + a clean **Service flow**
  example; and the `/services` "systematic approach" section now embeds a horizontal isometric
  **`SystematicApproachPreview`** (`servicesFlowDiagram`).

### Phase 6 — Architecture-diagram renderings (roadmap, not yet built)
Goal: reproduce the supplied case-1 / case-2 references in Switchboard colors. Remaining pieces:
1. **Procedural device-node shapes** — monitor / laptop / phone / browser-window / server-hex-stack
   built from primitives (no binary assets needed), registered in `SHAPES`; GLB drop-in already works
   via `node.meta.model`.
2. **Round/elliptical group platform** — a soft disc variant of `GroupContainer` (the platform under
   the server stack).
3. **Bubble-tag arrows** — a `bubble`/`info` label riding a connector midpoint (reuse the edge-label
   midpoint + a `boldArrow`), e.g. "Memory" / "Transfer" / "AI MODEL".
4. **Title-bar embed chrome** — an optional header/footer frame around `DiagramPreview` for the
   "Architecture Diagram" framing.
5. **Theme polish** — tune `blueprint` against the references once devices land.

### Implementation notes / deviations
- **`SceneCamera` folded into `CameraControls`** (a single `CameraSpec`-driven controller handles both
  orthographic and perspective) rather than a separate component.
- **`SceneTheme` kept as the resolved runtime view**: `resolveSceneTheme(spec)` flattens a `ThemeSpec`
  so the existing meshes/edges/shapes consume it unchanged; the spec is the authoring/serialisation unit.
- **Chrome** still uses the `light`/`dark` `editor-tokens.css` blocks via `spec.chromeBase`; a fully
  custom chrome palette per theme is a small follow-up (noted in the theming guide §6).
- **Model assets**: no binary `.glb` is committed; model support is verified by construction (loader +
  Suspense fallback to the procedural shape). Drop a `.glb` in `public/models/` and set
  `node.meta.model` to see it — see `nodes/BLENDER_MODELING.md`.
- **Right-click vs pan**: the camera uses right-drag to pan; a right-click (no drag) on a node opens
  the context menu. A tiny pan can occur before the menu — acceptable.
