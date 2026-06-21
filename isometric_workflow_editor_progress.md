# Isometric Workflow Editor — Progress & Task Breakdown

> Execution checklist for the **Isometric Workflow Editor (WIP)**. Pair with
> `isometric_workflow_editor_description.md` (the spec). **Build ONE unit at a time.** After each
> unit is green (`npm run build` + `npm run typecheck` + `npm run build-storybook`), commit and push,
> then tick it here. Keep this file honest — update it as you go.
>
> Conventions: `AGENTS.md`. Brand guardrails (no emoji, hard no-blur shadows, tokens-only chrome,
> bespoke icons, Tailwind-free editor) apply to every task — see spec §2, §16.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done.

---

## Phase P0 — Setup & scaffolding ✅
Goal: dependencies, theme tokens, folder skeleton, Storybook wiring. No features yet.

- [x] P0.1 Added deps (React-18 compatible, spec §4): `three@0.169.0`,
      `@react-three/fiber@8.17.10`, `@react-three/drei@9.114.3`, `@react-spring/three@9.7.5`,
      `@react-spring/web@9.7.5`, `zustand@5.0.3` (+ dev `@types/three@0.169.0`). React not bumped.
- [x] P0.2 Editor module tree under `src/components/editor/**` + `index.ts` barrel. (Files are
      created as each phase implements them — real modules, not empty stubs.)
- [x] P0.3 `theme/editor-tokens.css` — light (brand-derived) + dark `--editor-*` sets (spec §9).
- [x] P0.4 Editor tokens imported in `.storybook/preview.tsx`; added an `editorTheme`
      (`data-editor-theme`) toolbar + decorator for light/dark; `Editor` added to the story sort.
- [x] P0.5 `Editor/Introduction` story (TSX) — the `Editor/*` namespace landing page.
- [x] **Green** — `typecheck`, `build-storybook`, `next build` all pass (route lands in P11).

---

## Phase P1 — Data core (renderer-agnostic) ✅
Goal: types, store, history, schema — the foundation everything else builds on.

- [x] P1.1 `state/types.ts` — `NodeKind`, `NodeColorRole`, `Port`, `WorkflowNode`, `WorkflowEdge`,
      `Selection`, `Viewport`, `Diagram` (spec §6).
- [x] P1.2 `state/useWorkflowStore.ts` (zustand v5) — nodes, edges, selection, viewport; actions:
      add/update/move/delete node, add/update/delete edge, select/clear, setViewport,
      load/export/import diagram, clear.
- [x] P1.3 `state/history.ts` — snapshot helpers (`cloneSnapshot`/`pushPast`/`MAX_HISTORY`);
      `beginInteraction`/`undo`/`redo` wired into the store (a drag snapshots once, at gesture start).
- [x] P1.4 `state/schema.ts` — `serialize`/`toJSON`/`validate`/`migrate`/`deserialize` (coerces +
      prunes dangling edges; versioned). Seed: `sampleDiagram.ts` (full presets → P10).
- [x] P1.5 `Editor/State Sandbox` story — add/delete, undo/redo, serialize → deserialize round-trip.
- [x] **Green** — `typecheck` + `build-storybook` pass.

---

## Phase P2 — Scene MVP ✅
Goal: a draggable node on an isometric grid with a label. Proves the R3F port.

- [x] P2.1 `scene/DiagramCanvas.tsx` — orthographic `<Canvas>` (`preserveDrawingBuffer` on for PNG
      export later), ambient + key/fill lights, invisible ground (click = clear, dbl-click = reset),
      restrained drei `ContactShadows`. Scene colours from `theme/sceneTheme.ts` (light + dark
      palettes ready; the live toggle wires up in P7).
- [x] P2.2 `scene/Grid.tsx` — theme-tinted ground grid (per-vertex section colouring).
- [x] P2.3 `scene/nodes/NodeMesh.tsx` + `shapes/BoxNode.tsx` (drei RoundedBox) — select + drag on
      the y=0 plane (window-listener drag, robust off-mesh) + selection ring. Catalog dispatch → P3.
- [x] P2.4 `scene/LabelsLayer.tsx` + `scene/LabelProjector.tsx` — DOM overlay positioned each frame
      by direct ref writes (no per-frame React renders); hard shadow, ink outline, no blur.
- [x] P2.5 `scene/CameraControls.tsx` — raycast-based pan (ctrl/middle/right-drag), wheel zoom
      (clamped), `reset`/`fit` exposed via an api ref (toolbar wiring → P6).
- [x] P2.6 `IsometricWorkflowEditor.tsx` (theme root + store seed + canvas/overlay stack);
      `Editor/Scene MVP` story (Default / Dark / Empty).
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; three.js stays out of all
      route bundles (isolated Storybook chunk).

---

## Phase P3 — Node catalog & shapes ✅
Goal: data-driven kinds; all isometric shapes; palette generated from the catalog.

- [x] P3.1 `catalog/nodeCatalog.ts` — entry per kind (category, shape, colorRole, glyph, default
      ports + size); `getNodeCatalogEntry`, `catalogByCategory`, `CATEGORIES`, `CATALOG_LIST`.
- [x] P3.2 `scene/nodes/shapes/*` — Box, Cylinder, HexPrism, Diamond, Slab, Capsule, PaperTile +
      a `SHAPES` registry; `NodeMesh` dispatches kind → catalog entry → shape, resolves
      colour/size/`note` paper tone from the catalog + theme.
- [x] P3.3 `icons/NodeGlyph.tsx` — bespoke single-colour line glyphs (zap/play/diamond/merge/
      sparkles/database/layers/server/hub/send/frame/note), tinted via `color`/currentColor. No
      third-party lib, no emoji. (Inline SVG rather than mask-tinted files — equivalent, cleaner
      across both bundlers. Toolbar-action glyphs land with the toolbar in P6.)
- [x] P3.4 `panels/NodePalette.tsx` — categories generated from the catalog; click-to-add (optional
      `onAdd`); editor-primitive styling. Wired into the editor as a left sidebar (`hidePalette`
      opts out for read-only embeds).
- [x] P3.5 Stories: `Editor/Nodes/Shapes` (grid gallery, light/dark) + `Editor/Panels/NodePalette`
      (light/dark). `sampleDiagram.allKindsDiagram` seeds the gallery from the catalog.
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` stays
      1.87 kB / 98 kB (three.js still isolated).

> Notes: `group` renders as a low box placeholder until the real translucent container in P5;
> `merge` shares the diamond shape with `logic` (distinguished by glyph/label) — refinements
> (rack/decal detail, inverted merge) are deferred polish.

---

## Phase P4 — Edge system ✅
Goal: typed, routed edges with labels, styles, branching & merging.

- [x] P4.1 `scene/edges/edgeRouting.ts` — ported + generalised A* router (blocked cells use each
      node's real footprint; source/target excluded; straight fallback). Per-edge **height stagger**
      (laneIndex) reduces overlap of parallel runs (true lateral lanes deferred).
- [x] P4.2 `scene/edges/OrthogonalEdge.tsx` — drei `<Line>` along routed points + cone arrowhead;
      `routing` orthogonal / smooth (Catmull) / direct, `style` solid / dashed; click selects.
- [x] P4.3 `scene/edges/EdgeLabelsLayer.tsx` (+ in-Canvas projector) — DOM chip at the edge midpoint,
      on-brand (editor tokens, hard shadow). (Anchor = source/target centre midpoint; path-accurate
      midpoint is a refinement.)
- [x] P4.4 Branching (1→many) + merging (many→1) via `sampleDiagram.branchingSampleDiagram`
      (Scouts/Leads-style slice with labels + a dashed async edge).
- [x] P4.5 Connect UX = **port handles** (chosen): nodes show in/out handles per catalog ports;
      drag from the orange out-handle to a target node (scene raycast on pointer-up) creates an edge;
      `ConnectPreview` shows a dashed preview line; `addEdge` guards self/duplicate. Implicit
      consecutive-select stays disabled.
- [x] P4.6 Stories `Editor/Edges` — Branching, RoutingStyles, Dark.
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P5 — Group / container nodes ✅
Goal: tiered "layer" boxes for advanced architecture diagrams.

- [x] P5.1 `scene/nodes/shapes/GroupContainer.tsx` — low translucent slab (depthWrite off so children
      read over it), sized to explicit `width/depth`; selected → brighter + emissive. (Label uses the
      standard overlay; auto-grow-to-children + a dedicated label tab are refinements.)
- [x] P5.2 Membership — `parentId`; `moveNode` cascades a group's delta to its children; auto-assign
      on drop (footprint containment) via `setParent` (no extra history step). `NodeMesh` branches
      `kind==="group"` → `GroupContainer`.
- [x] P5.3 Group editing (rename/resize/colour) is delivered in the **P6 inspector** (the Inspector
      doesn't exist until P6). P5 ships the group mechanics + shape.
- [x] P5.4 `sampleDiagram.groupedSampleDiagram` + `Editor/Nodes/Shapes › Grouped` story
      ("AI Processing Layer" over three children, trigger in, database out).
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P6 — Chrome (toolbar / inspector / export) ✅
Goal: the 2D editor frame, built from editor primitives (and `src/components/ui` where it fits).

- [x] P6.1 `primitives/{IconButton,Panel,Field,Select}.tsx` — editor-token styled, Tailwind-free,
      `Editor/Primitives` story (light/dark). (Slider/Tooltip/SegmentedControl deferred to first use.)
- [x] P6.2 `panels/Toolbar.tsx` — undo/redo (store + past/future length), zoom in/out, fit, reset
      (lifted camera api), export JSON, export PNG, and a working light/dark toggle. Bespoke action
      glyphs added to `NodeGlyph` (no emoji).
- [x] P6.3 `panels/Inspector.tsx` — node: type, label, sublabel, colour swatches (+ default),
      position, group width/depth, connected-edges list (select/delete), delete; edge: source→target,
      routing/style selects, label, delete; empty state otherwise.
- [x] P6.4 `hooks/useExportJson.ts` (schema.serialize → download) + `hooks/useExportPng.ts`
      (canvas `toDataURL`; canvas-only this pass — labels/2x deferred per the locked decision).
- [x] P6.5 Stories `Editor/Panels/Toolbar` + `Editor/Panels/Inspector` (node/edge/empty); editor
      gains a `chrome` prop (toolbar+palette+inspector), theme-toggle state, and a minimal
      delete/escape keydown (full shortcuts in P13).
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P7 — Theming (editor-scoped dark/light) ✅
Goal: a real, scoped toggle that drives both DOM chrome and the 3D scene.

- [x] P7.1 `theme/useEditorTheme.ts` — persists to `localStorage` (`sb-editor-theme`), defaults to
      `prefers-color-scheme`; an explicit `defaultTheme` wins (deterministic stories). The editor
      writes the result to `data-editor-theme` on its root.
- [x] P7.2 `theme/sceneTheme.ts` already exposes matched light/dark palettes (bg, grid, lights,
      materials, selection). Kept as constants synced to `editor-tokens.css` rather than reading
      computed vars — reliable and WebGL needs concrete hex anyway. The toggle now drives it.
- [x] P7.3 `panels/ThemeToggle.tsx` — sun/moon IconButton (bespoke glyphs, no emoji); used by the
      Toolbar.
- [x] P7.4 Toggle flips chrome (`data-editor-theme`) + scene (`getSceneTheme`) together; route top
      bar + the rest of the site stay on the light brand surface (unaffected).
- [x] P7.5 Story `Editor/Theming` (side-by-side light/dark).
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P8 — Animation (react-spring) ✅
Goal: subtle, premium motion; fully disabled under reduced motion.

- [x] P8.1 3D springs — `NodeMesh` wraps its visible content in `animated.group` (`@react-spring/three`):
      scale-in on mount + a gentle pop when selected. (Hit volume stays unscaled.)
- [x] P8.2 Camera tweens — `CameraControls` lerps to a desired target+zoom each frame for
      reset / fit / zoom buttons + double-click; pan & wheel stay instant.
- [x] P8.3 DOM springs — `Inspector` content fades/slides in on selection change (`@react-spring/web`,
      imperative `api.start`). (Palette collapse animation arrives with the P9 mobile drawer.)
- [x] P8.4 `hooks/usePrefersReducedMotion.ts` gates everything — springs become `immediate`, camera
      tweens jump.
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P9 — Responsive / mobile ✅
Goal: usable on touch devices; panels collapse into drawers.

- [x] P9.1 `hooks/useResponsiveLayout.ts` — measures the editor root via ResizeObserver →
      "mobile" (< 720px) / "desktop".
- [x] P9.2 `panels/MobileDrawer.tsx` — react-spring bottom sheet (immediate under reduced motion);
      mobile layout = full-bleed stage + an Add / Inspect segmented bar opening palette / inspector
      drawers; toolbar `compact` (packs + horizontal scroll).
- [x] P9.3 Touch — `touch-action: none` on the canvas; single-finger = node drag / select (R3F
      pointer events); two-finger = pinch-zoom + pan in `CameraControls`. (Best-effort; the
      1-finger-empty-pan variant is dropped in favour of 2-finger nav — needs a browser to tune.)
- [x] P9.4 Segmented bar 50px, drawer close 36px; `Editor/Scene MVP › Mobile` story (380px → mobile
      layout). (Finer hit-area/touch polish noted for a real-device pass.)
- [x] **Green** — `typecheck` + `build-storybook` + `next build` pass; `/isometric-editor` 1.87 kB.

---

## Phase P10 — Presets & samples
Goal: prove both target use cases; one-click templates.

- [ ] P10.1 `catalog/presets/n8n.ts` — n8n node presets + a sample n8n workflow.
- [ ] P10.2 `catalog/presets/architecture.ts` — the full **Scouts/Leads** architecture as a preset
      (tiers, fan-out/in, group layers, DB, AI layer, commission engine, dashboard).
- [ ] P10.3 `catalog/layout/autoLayout.ts` — layered/ranked auto-arrange; "Auto-arrange" toolbar
      action.
- [ ] P10.4 Template picker (load a preset into the store).
- [ ] P10.5 Story: `Editor/Full Editor` seeded with both presets.
- [ ] **Green + commit + push.**

---

## Phase P11 — Route & footer integration ✅ (brought forward for live preview)
Goal: the editor is reachable, full-screen, and linked from the footer.

- [x] P11.1 Chromeless full-screen via `components/sections/SiteChrome.tsx`: a nested layout can't
      strip the root layout's header/footer in the App Router, so the root layout now delegates to
      a client `SiteChrome` that drops the chrome on `/isometric-editor` and keeps it everywhere
      else (other routes render byte-identically).
- [x] P11.2 `src/app/isometric-editor/page.tsx` — `metadata` (title "Isometric Workflow Editor
      (WIP)", `robots: noindex`) + imports the editor tokens; `EditorMount` does the
      `next/dynamic` import (`ssr:false`) with a "Loading editor…" fallback.
- [x] P11.3 `EditorMount.tsx` top bar: "← Switchboard" home link + title + WIP badge, editor fills
      the rest (`100dvh` flex column).
- [x] P11.4 `src/lib/nav.ts` — footer link under Resources + `routeNames["/isometric-editor"]`.
- [x] P11.5 Verified via `next build`: `/isometric-editor` is 1.87 kB / 97.9 kB First Load JS —
      three.js is in a lazy client chunk, not in this or any other route bundle.
- [x] **Green** — `typecheck` + `next build` pass (36/36 pages); footer link + chromeless page
      confirmed in the prerendered HTML.

> Note: P11 done ahead of P3–P10 so the editor can be previewed live on the site. The page renders
> the current P2 Scene MVP; later phases enhance it in place.

---

## Phase P12 — Storybook coverage
Goal: the editor UI is documented and reviewable in the existing Storybook.

- [ ] P12.1 Ensure every primitive, shape, edge variant, and panel has a story under `Editor/*`.
- [ ] P12.2 `Editor/Full Editor` interactive story (both presets, theme switch).
- [ ] P12.3 a11y addon passes on chrome stories; Tailwind-free render verified.
- [ ] **Green + commit + push.**

---

## Phase P13 — Polish & a11y
Goal: keyboard, focus, performance, final sweep.

- [ ] P13.1 `hooks/useKeyboardShortcuts.ts` — delete, escape, undo/redo, fit, duplicate; ignore while
      typing in inputs.
- [ ] P13.2 Focus rings (brand orange), ARIA labels on icon buttons, tab order through chrome.
- [ ] P13.3 Performance — memoize routing, throttle label projection, cap DPR; smooth with many nodes.
- [ ] P13.4 Guardrail sweep (spec §16): no emoji, no blurred DOM shadows, no raw hex in chrome,
      Tailwind-free, bundle isolation.
- [ ] **Green + commit + push.**

---

## Phase P14 — Future (documented; not part of initial build)
Track but do not start unless prioritized.

- [ ] P14.1 **SVG/CSS isometric backend** behind a `DiagramRenderer` contract (spec §15); A/B vs R3F.
- [ ] P14.2 **React 19 + R3F 9 + drei 10 + react-spring 10** app-wide upgrade (deliberate, separate).
- [ ] P14.3 **n8n-JSON import** mapper (`mapN8nWorkflow`).
- [ ] P14.4 **SVG / GLTF export** for print-quality and interactive embeds.
- [ ] P14.5 **Embed in `/work`** — read-only editor (`readOnly` prop) or exported assets in
      portfolio pages.

---

## Definition of done (whole feature)
- All of P0–P13 green and pushed; P14 captured as backlog.
- `next build` + `npm run typecheck` + `npm run build-storybook` pass with no env.
- n8n sample **and** the Scouts/Leads architecture render cleanly and export clean PNG + reloadable
  JSON.
- Dark/light toggle scoped to the editor; mobile usable; motion respects `prefers-reduced-motion`.
- Footer shows **Isometric Workflow Editor (WIP)** → `/isometric-editor` (full-screen, chromeless).
- Brand guardrails hold (spec §2, §16).
