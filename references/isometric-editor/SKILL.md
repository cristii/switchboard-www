---
name: isometric-editor
description: Use this skill to understand, navigate, or modify the Isometric Workflow Editor — the R3F/Three.js 2.5D workflow-diagram authoring feature under src/components/editor. Covers architecture, data model, scene/rendering, camera & isometric math, state/undo, theming, edges/routing, the node catalog, and extension points.
user-invocable: true
---

Read this file end-to-end to get an expert mental model of the **Isometric
Workflow Editor**, then jump to the source files referenced inline. This skill
is a navigation map, not a reimplementation — it tells you *where* each
subsystem lives and *how the pieces fit*, so you can answer questions or make
changes without re-exploring the module.

If you only need deep design intent or roadmap status, the two canonical specs
are `docs/editor/isometric_workflow_editor_description.md` (538-line full spec)
and `docs/editor/isometric_workflow_editor_progress.md` (phased checklist
P0–P14). This skill summarizes and indexes both.

## Orientation

The editor lets a user author **2.5D isometric workflow diagrams** (think n8n /
architecture diagrams rendered as little extruded shapes on an isometric ground
plane). It is data-driven: node kinds, shapes, routing algorithms, connectors,
and themes are all **registry-based**, not hardcoded conditionals.

- **Lives in:** `src/components/editor/` (~106 `.tsx`/`.ts` files).
- **Route:** `/isometric-editor` — `src/app/isometric-editor/page.tsx` sets
  metadata (noindex, "WIP") and renders `EditorMount.tsx`, which dynamically
  imports the editor with `next/dynamic(..., { ssr: false })` so Three.js is
  **code-split off every other route** (critical for bundle size).
- **Run it:** Storybook (`npm run storybook`) — editor stories are under the
  `Editor/*` namespace (e.g. `Editor/Full Editor`, `Editor/Nodes/Shapes`). There
  are no unit tests yet; stories are the de-facto functional tests.
- **Public surface:** `src/components/editor/index.ts` barrel-exports
  `IsometricWorkflowEditor` and friends.

## Architecture & data flow

Strict layering, renderer-agnostic at the core:

```
data model (state/ + schema)        ← source of truth, no Three.js
        │
   Zustand store (useWorkflowStore) ← single store; editor + preview consume it
        │  props down (controlled)
        ▼
IsometricWorkflowEditor.tsx         ← top-level: owns theme + responsive layout
   ├─ Chrome (DOM): Toolbar, NodePalette, Inspector, ThemeManager,
   │                NodeContextMenu, MobileDrawer
   └─ DiagramCanvas.tsx (R3F <Canvas>, WebGL)
        ├─ Backdrop, Lights, Grid, shadow plane
        ├─ Edges (OrthogonalEdge)  ├─ Nodes (NodeMesh | PreviewNode)
        ├─ Labels (3D NodeLabels3D  OR  DOM LabelsLayer via projection)
        └─ CameraControls (exposes a CameraApi ref to the Toolbar)
```

Key principles: the scene is **fully controlled** (nodes/edges/selection passed
as props); the data model never imports Three.js; both the live editor and the
read-only preview reuse the same scene components.

`IsometricWorkflowEditor.tsx` (props: `initialDiagram`, `defaultThemeId`,
`chrome`, …) resolves the theme via `useThemeManager`, detects mobile via
`useResponsiveLayout`, and renders chrome + canvas. Global keydown handling
(Delete/Backspace to delete selection, Escape to cancel link/connect/selection)
lives here.

## Data model — `state/types.ts`

- `WorkflowNode`: `{ id, kind, label, sublabel?, x, y, width?, depth?, height?,
  color?, opacity?, icon?, parentId?, labelOrientation?, ports?, meta? }`.
  **Convention:** nodes sit on the ground plane — node `(x, y)` maps to world
  `(x, 0, z)` (i.e. node-y becomes world-Z). Missing sizes fall back to catalog
  defaults.
- `WorkflowEdge`: `{ id, source, target, sourcePort?, targetPort?, label?,
  routing?, style?, connector?, flow?, color?, labelOrientation?, meta? }`.
  `routing` ∈ orthogonal|smooth|direct; `style` ∈ solid|dashed (dashed =
  conditional/async); `flow` ∈ off|slow|normal|fast (animated pulses).
- `Port`: `{ id, side: "in"|"out", label? }`.
- `Viewport`: `{ zoom, target: [x, y] }` (default zoom 38).
- `Diagram`: `{ version: 1, nodes, edges, viewport?, theme? }` — the
  serializable document.
- `NodeKind` (union, data-driven via catalog): trigger, action, ai, logic,
  merge, database, queue, service, integration, output, group, note, text, icon,
  monitor, laptop, phone, browser, serverStack.
- `NodeColorRole`: orange|green|violet|amber|ink (resolved to hex per theme).
- `ConnectorStyle`: line|tube|ribbonArrow|boldArrow|cornerConnect.
- `TextOrientation`: billboard|ground|uprightX|uprightZ.

## State & history

- **Store:** `state/useWorkflowStore.ts` (Zustand v5). Action groups: nodes
  (`addNode`, `updateNode`, `moveNode`, `setParent`, `deleteNode`,
  `duplicateNode`), edges (`addEdge`, `updateEdge`, `deleteEdge`), selection
  (`selectNode`/`selectEdge`/`clearSelection`), connecting (`startConnect`/
  `endConnect`), linking (`beginLink`/`linkClick`/`cancelLink`), context menu,
  viewport (`setViewport`), document (`arrange`, `loadDiagram`, `exportDiagram`,
  `importDiagram`, `clear`).
  - `addNode(kind, partial)` pulls defaults from the catalog.
  - `moveNode` cascades the delta to group children and **does not** push
    history (history is captured once per gesture).
  - `addEdge` rejects self-loops and duplicates.
- **History:** `state/history.ts` — snapshot-based undo/redo (full document per
  step, not granular ops). Call `beginInteraction()` at the *start* of a gesture
  (drag, arrange). `MAX_HISTORY = 50`. Any new edit clears the redo stack.
- **Serialization:** `state/schema.ts` — `serialize(state) → Diagram`,
  `toJSON`, `deserialize(json)` (validates, coerces, prunes dangling edges),
  `migrate()` keyed on `version` for forward compat.

## Scene & rendering

`scene/DiagramCanvas.tsx` orchestrates the R3F `<Canvas>` (WebGL, `antialias`,
`dpr: [1,2]`, `preserveDrawingBuffer: true` for PNG export). Render order:
backdrop → lights → optional soft shadows → grid → shadow-receiver plane →
edges → nodes (interactive `NodeMesh` or static `PreviewNode`) → connect/link
previews → labels → `CameraControls`.

- `scene/Backdrop.tsx` — radial-gradient `CanvasTexture` background.
- `scene/Lights.tsx` — maps `ThemeSpec.lights[]` to ambient/hemisphere/
  directional/point; first directional casts shadows (2048² map).
- `scene/Grid.tsx` — vertex-colored line segments with radial alpha falloff;
  major lines every 5 units.
- Materials: `scene/nodes/shapes/NodeStandardMaterial.tsx` — `meshStandardMaterial`,
  matte (`roughness≈0.42`, `metalness≈0.06`), emissive lift on selection.
- Animation uses `useFrame` + react-spring: node scale-in/pop, edge flow dots,
  camera tween — all disabled under `prefers-reduced-motion`
  (`hooks/usePrefersReducedMotion.ts`).

## Isometric & camera math — `scene/CameraControls.tsx`, `scene/LabelProjector.tsx`

This is the trickiest part to re-derive, so the formulas are spelled out:

- **Camera setup** (`DiagramCanvas.tsx` `initialCamera`): orthographic by
  default — fixed iso direction `isoDir = [1,1,1]` (normalized), `ORTHO_DISTANCE
  = 40`, zoom clamped **8–120** (default 38). Optional perspective: fov 35,
  distance 12–200. `camera.up = (0,1,0)`, always `lookAt(target)` where target
  rides the ground plane.
- **World → screen** (`LabelProjector.tsx`): set a `THREE.Vector3` at the node
  world pos, call `vec.project(camera)` (→ NDC −1..1), then to pixels:
  `x = (v.x*0.5 + 0.5) * width`, `y = (-v.y*0.5 + 0.5) * height`. DOM label
  transforms are written directly to refs each frame (no React re-render).
- **Screen → world** (`groundAt` in `CameraControls.tsx`; node drag in
  `NodeMesh.tsx`): build NDC from the pointer, `raycaster.setFromCamera(ndc,
  camera)`, intersect against `new THREE.Plane(new THREE.Vector3(0,1,0), 0)`
  (the Y=0 ground). The hit's `(x, z)` are the world ground coords.
- **Fit-to-bounds** (`fit()`): transform world to isometric screen space
  `u = x - y`, `v = x + y`, find the (u,v) bounds (expanded by each node's
  footprint), compute zoom from `spanU/spanV` with margin, then invert the
  centroid: `x = (u+v)/2`, `y = (v-u)/2`. This makes diagonal layouts fill tall
  frames and horizontal layouts fill wide ones.
- **Pan** = Ctrl/middle/right-drag or 2-finger; move target opposite the
  ground-delta between two `groundAt` samples. **Zoom** = wheel/pinch,
  exponential (`Math.exp(-deltaY*0.0015)`). Animated moves lerp target/zoom by
  0.18/frame in `useFrame`.
- **CameraApi** (ref handed to the Toolbar): `reset`, `fit`, `zoomIn`,
  `zoomOut`, `capturePng`.

## Interaction model

- **Node select/drag** (`scene/nodes/NodeMesh.tsx`): left-press selects +
  `beginInteraction()`; window `pointermove` raycasts to ground and
  `moveNode`s (no history mid-drag); on `pointerup`, `assignMembership()`
  auto-parents into a group whose footprint it overlaps. Ctrl-press is reserved
  for camera pan.
- **Connect (port-drag):** press the orange out-handle → `startConnect`, show
  `ConnectPreview`; on release, raycast `intersectObjects` to find the target
  node and `addEdge`.
- **Click-to-link mode:** click node A then node B (`beginLink`/`linkClick`),
  `LinkPreview` shows the rubber-band; Escape cancels.
- **Right-click:** `openContextMenu` (`panels/NodeContextMenu.tsx`).
- **Touch:** 1-finger = node drag/select (R3F pointer events); 2-finger =
  pan/pinch (`CameraControls`). Canvas uses `touch-action: none`.

## Node catalog & shapes

- **Catalog:** `catalog/nodeCatalog.ts` — each `NodeKind` maps to
  `{ category, label, description, shape, colorRole, glyph, defaultPorts,
  defaultSize }`. This is the single place to define a node's defaults.
- **Shape registry:** `scene/nodes/shapes/index.ts` maps a `ShapeId` to a
  component. Shapes: `BoxNode` (rounded box), `CapsuleNode` (pill),
  `CylinderNode` (database), `DiamondNode` (logic/merge), `HexPrismNode` (AI;
  `hexGeometry.ts`), `SlabNode` (queue; `slabGeometry.ts`), `PaperTileNode`,
  `GroupContainer` (translucent layer slab, depthWrite off), `TextNode` (3D
  text), `ModelNode` (GLB loader), `StepIcon`, and device models
  (`MonitorNode`, `LaptopNode`, `PhoneNode`, `BrowserNode`, `ServerStackNode`;
  tones in `deviceTones.ts`).
- **GLB models:** `scene/nodes/shapes/ModelNode.tsx` uses drei `useGLTF`, clones
  the scene, tints any material named `/body/i` to the node color, and
  auto-scales/centers to the node footprint. Wrap in `<Suspense>` with a
  procedural shape fallback.
- **Glyphs:** bespoke SVGs in `icons/NodeGlyph.tsx` — **no icon library**.
- **Shared visual resolution:** `scene/nodes/nodeVisual.ts`
  (`resolveNodeVisual(node, theme, selected)`) is used by both `NodeMesh` and
  `PreviewNode` so editable and static nodes look identical.

## Edges, routing & connectors

- **Routing registry:** `scene/edges/routing/` — `index.ts`
  (`getRoutingAlgorithm`, `registerRoutingAlgorithm`), `builtins.ts`:
  - `orthogonal` — A* over a 48×48 grid spanning world [-24, 24], blocks cells
    under node footprints, right-angled waypoints, lane offset for parallel
    edges; falls back to a straight line.
  - `smooth` — resamples the orthogonal path via Catmull-Rom.
  - `direct` — straight center-to-center.
  (`scene/edges/edgeRouting.ts` is the deprecated path — use `routing/`.)
- **Connector registry:** `scene/edges/connectors/` — `LineConnector`,
  `TubeConnector`, `RibbonArrowConnector`, `BoldArrow`, `CornerConnect`; each
  implements `ConnectorProps`.
- `scene/edges/OrthogonalEdge.tsx` ties it together: gets route points, picks a
  connector, animates flow dots, renders the optional label.

## Theming

- **Type:** `theme/themeSpec.ts` (`ThemeSpec`: background, grid, lights, shadow,
  camera, nodes{colors per role, selection emissive}, edges, text).
- **DOM tokens:** `theme/editor-tokens.css` — ~25 CSS vars scoped to
  `[data-editor-theme="light"|"dark"]` on the editor root. Hard offset shadows,
  no blur.
- **WebGL mapping:** `theme/sceneTheme.ts` — concrete hex `SceneTheme` constants
  (WebGL can't read CSS vars). **Gotcha:** these are kept in sync with
  `editor-tokens.css` *manually*.
- **Registry & persistence:** `theme/themeRegistry.ts` (built-ins
  light/dark/aws/blueprint in `theme/themes/`, user themes in localStorage via
  `saveUserTheme`/`deleteUserTheme`), `theme/useThemeManager.ts` (`{ spec,
  chromeBase, patch, setTheme, toggleChrome }`), `theme/useEditorTheme.ts`
  (persists to `sb-editor-theme`). The editor theme is **scoped** and does not
  affect the rest of the site.

## Panels / chrome & responsive

`panels/`: `Toolbar.tsx` (undo/redo, zoom, fit, auto-arrange, export, presets
select, theme toggle), `NodePalette.tsx` (category → add node),
`Inspector.tsx` (edit selected node/edge — largest panel), `ThemeManager.tsx`
(live `ThemeSpec` editing), `NodeContextMenu.tsx`, `MobileDrawer.tsx`.
`hooks/useResponsiveLayout.ts` flips to mobile under **720px**: full-bleed
canvas + a bottom segmented bar opening Add/Inspect bottom-sheet drawers.

## Export / import / preview / presets

- **Export:** `hooks/useExportJson.ts` (downloads a versioned `Diagram`),
  `hooks/useExportPng.ts` (`renderer.domElement.toDataURL` — relies on
  `preserveDrawingBuffer: true`).
- **Import:** `useWorkflowStore.importDiagram(input)` → `deserialize` →
  validate/prune.
- **Preview:** `preview/DiagramPreview.tsx` (fully controlled, `interactive:
  false` swaps in `PreviewNode`), `preview/DiagramFrame.tsx`,
  `preview/previewConfig.ts`; embedded at the `/diagram-preview` route.
- **Presets & layout:** `catalog/presets/` (n8n, architecture, aws, process/
  services/about/pillar flows) selectable from the Toolbar;
  `catalog/layout/autoLayout.ts` is a layered longest-path auto-arrange (Kahn's
  algorithm) that respects group membership and lands in one undo step.

## Extension points

- **New node kind:** add a `nodeCatalog.ts` entry → add/choose a shape in
  `scene/nodes/shapes/index.ts` → add a glyph in `icons/NodeGlyph.tsx`; extend
  the `NodeKind` union in `state/types.ts`.
- **New routing algorithm:** `registerRoutingAlgorithm(id, fn)` implementing the
  `RouteAlgorithm` contract (`scene/edges/routing/types.ts`).
- **New connector:** implement `ConnectorProps` and register in
  `scene/edges/connectors/index.ts`.
- **New theme:** author a `ThemeSpec` (add a `theme/themes/*.ts` built-in or
  `saveUserTheme(spec)`), and add matching hex values to `sceneTheme.ts`.

## Conventions & gotchas

- No emoji; bespoke SVG glyphs only; hard (blur-free) offset shadows in chrome;
  token-driven colors (no raw hex in DOM chrome).
- Editor theme is **scoped** to `[data-editor-theme]` — never leaks to the site.
- `sceneTheme.ts` hex values must be updated **by hand** when
  `editor-tokens.css` changes.
- Node `y` is world **Z**; nodes sit on the Y=0 ground plane.
- History is per-gesture: call `beginInteraction()` before mutating, not on
  every incremental `moveNode`.
- Stack: React 18.3 / `@react-three/fiber@8.17` (NOT v9, which needs React 19) /
  `@react-three/drei@9.114` / `three@0.169` / `@react-spring/*@9.7` /
  `zustand@5`. R3F 9 / React 19 upgrade is deferred (roadmap P14).
- No unit tests; verify changes via Storybook `Editor/*` stories.

## Where to look next

- Full design spec & rationale: `docs/editor/isometric_workflow_editor_description.md`.
- Roadmap / current phase status (P0–P14): `docs/editor/isometric_workflow_editor_progress.md`.
- Format template for this skill: `references/design-system/SKILL.md`.
