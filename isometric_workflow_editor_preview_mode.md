# Isometric Workflow Editor — Preview / Embed Mode (Phase 1 done; Phase 2 = scroll/keyframes)

A **read-only, embeddable, scroll-driven** version of the editor to place across the marketing site
(`/`, `/work`, `/work/[slug]`, `/about`) to explain system architectures, n8n automations and AI
chatbot flows. Typical layout: the **diagram is pinned on one side**, **explanatory copy scrolls on
the other**, and as the reader scrolls, the diagram **moves / rotates / zooms and highlights** the
nodes being explained, toggling labels and isolating sub-flows.

This is a design note. It records the constraints the styling pass respected, and is split into
phases.

---

## Status
- **Phase 1 — static preview: DONE.** `DiagramPreview` (`src/components/editor/preview/DiagramPreview.tsx`)
  is a read-only view reusing the shared `DiagramCanvas` in `interactive={false}` mode (renders the
  static `PreviewNode`, no editing, no store). `PreviewConfig` (`preview/previewConfig.ts`) controls
  appearance (grid / ground-shadows / labels / theme) and camera (movable, zoom, target, or
  fit-on-mount). A playground route **`/diagram-preview`** (footer → Resources) pairs a JSON editor
  with a live preview (desktop: two cards; mobile: two tabs); the JSON is `{ config, diagram }` and
  quick toggles write back into it. Consumers mount it via `next/dynamic({ ssr:false })`; the host
  page imports `editor/theme/editor-tokens.css`.
  - To embed elsewhere (Work/About/home): `const DiagramPreview = dynamic(() =>
    import("@/components/editor/preview/DiagramPreview").then(m => m.DiagramPreview), { ssr:false })`,
    then `<DiagramPreview diagram={...} config={{ cameraMovable:false, theme:"light" }} />` in a sized
    box. (Note the multi-instance caveat below — fine today because previews are store-free for
    rendering, but the full store refactor is still needed before previews that need their own
    *editing/selection* state.)
- **Phase 2 — scroll-driven choreography + keyframe editor: LATER** (below).

## Phase 2 — scroll choreography & the keyframe editor (later)
On top of the static preview, add scroll-driven control and an authoring tool:
- **Scroll controller** (`ScrollDiagram` + `useDiagramController`): map scroll progress to a sequence
  of steps that drive the preview's camera + highlights + label visibility. Diagram pinned one side,
  captions scrolling the other. Reuses the camera tween (P8) + react-spring; reduced-motion aware.
- **Keyframe editor** (an enhanced playground): a timeline/keyframe UI to author, per scroll step,
  the **camera movement** (target / zoom / optional yaw-orbit) and **active-node/group highlights**
  (focus, dim others, isolate, show/hide labels) — i.e. "as the user scrolls to here, move the camera
  there and light up these nodes while I describe them." Output is serialised into the diagram doc as
  a `steps[]` block alongside `config`/`diagram`, so a page just provides the doc. The `PreviewStep`
  shape + highlight mechanics are specified below.

---

## Goals
- Drop a diagram into any page: `<DiagramPreview diagram={...} />` — no toolbar/palette/inspector,
  no editing, pointer interactions off by default (optional light orbit/hover).
- **Multiple independent instances on one page** (e.g. three diagrams down the home page).
- **Scroll choreography:** a sequence of steps tied to scroll progress that drive the camera +
  per-node/edge highlight + label visibility.
- Fully on-brand, reuses the existing scene + theming + animation; honours `prefers-reduced-motion`.
- Lightweight: three.js stays in the editor's lazy chunk; previews mount via `next/dynamic`
  (`ssr:false`) like the route does.

## Blockers / required refactors (do these first)
1. **Instance-scoped store (hard blocker).** `state/useWorkflowStore.ts` is a **module singleton**, so
   multiple editors/previews on one page would share nodes/edges/selection. Preview mode needs a
   **store factory** (`createWorkflowStore()`) + a **React context provider** (`<WorkflowStoreProvider>`)
   and hooks that read the nearest store. The full editor wraps itself in one provider; each preview
   gets its own. Migrate `useWorkflowStore((s)=>…)` call sites to the context hook. (zustand supports
   `createStore` + a `useStore(ctx)` pattern.)
2. **View settings already instance-local.** `showGrid`/`showGround` (and theme via `useEditorTheme`)
   are local component state in `IsometricWorkflowEditor` — keep that pattern; preview adds
   `showLabels`, `highlight`, `dimmed` as instance state/context too (do **not** push to a singleton).
3. **Imperative camera already lifted.** `CameraApi` (reset/fit/zoomIn/zoomOut/capturePng) is exposed
   via a ref and the camera tween (P8) lerps smoothly — the scroll controller drives this. Extend it
   with `focusNodes(ids[])` / `focusGroup(id)` / `frameBounds(box)` and an optional yaw/orbit.

## Components to add
- **`DiagramPreview`** (`src/components/editor/preview/DiagramPreview.tsx`): wraps a per-instance store
  provider + `DiagramCanvas` (reuse as-is) with `interactive={false}` (disable node drag, connect
  handles, ground click→clear; keep optional hover highlight). No chrome. Accepts `diagram`,
  `theme?`, `showGrid?`, `showGround?`, `showLabels?`, and a `controllerRef`/`progress` input.
- **`ScrollDiagram`** (`src/components/editor/preview/ScrollDiagram.tsx`): the split-layout wrapper —
  sticky `DiagramPreview` on one side, scrolling `steps` content on the other; maps scroll progress →
  active step → drives the preview. IntersectionObserver / scroll-position based; no heavy scroll lib
  required (a small `useScrollProgress` hook), but `framer-motion` or a scroll lib is an option.
- **`useDiagramController`**: applies a `PreviewStep` to a `DiagramPreview` (camera move + highlight +
  labels), tweened (reuse P8 camera lerp + `@react-spring/*`), reduced-motion aware.

## Step model (data the page author writes)
```ts
interface PreviewStep {
  id: string;
  camera?: { target?: [number, number]; zoom?: number; yaw?: number; fit?: boolean };
  focusNodes?: string[];        // emphasise these (others dim)
  focusGroup?: string;          // emphasise a group + its children
  isolate?: boolean;            // hide everything not focused
  showLabels?: "all" | "focused" | "none";
  caption?: ReactNode;          // the scrolling explanation paired with this step
}
```
The page provides a `diagram` + `steps[]`; `ScrollDiagram` renders captions on one side and advances
the active step as they scroll into view.

## Highlight mechanics (small additions to existing scene pieces)
- **`NodeMesh`**: accept `highlight?: "on" | "dim" | "normal"`. `dim` → lower material opacity +
  drop emissive; `on` → slight emissive/scale bump (reuse the P8 select spring path). Drive from a
  `highlightedIds` set in preview state.
- **`OrthogonalEdge`**: same `dim`/`on`; dim edges fade (lower opacity), focused edges keep colour
  and may force `flow` on to show data moving along the explained path.
- **`LabelsLayer` / `EdgeLabelsLayer`**: accept a visibility predicate (`all`/`focused`/`none`) so
  labels show only for focused nodes during a step.
- All of the above are **prop/context-driven and read-only** — no store mutations — so previews never
  fight the editor's history.

## How this pass (styling) already supports preview
- The **gradient backdrop + faded grid + soft grounded shadows + hemisphere shading** make a small
  embedded canvas look intentional and premium at any size, and **blend** into page sections.
- **Edge data-flow pulses** are exactly the "watch the data move" device the scroll story needs;
  the controller can switch `flow` per step.
- **Theme is per-instance** (`useEditorTheme`) and **view settings are local**, so each embedded
  preview can match its section (e.g. light on `/about`, dark hero on `/`).
- **Camera tween + reduced-motion** are already centralised, so scroll-driven moves reuse them.

## Phasing (later)
1. Store factory + provider refactor (blocker) — keep the full editor working on it.
2. `DiagramPreview` (read-only `DiagramCanvas`, no chrome, `interactive` flag).
3. Highlight/label props through `NodeMesh` / `OrthogonalEdge` / label layers.
4. `useScrollProgress` + `useDiagramController` + `ScrollDiagram` split layout.
5. Author real diagrams + step scripts for `/`, `/work/[slug]`, `/about`; mount via `next/dynamic`.
6. Performance: cap DPR, pause `useFrame`/`frameloop="demand"` when a preview is off-screen
   (IntersectionObserver), lazy-load three only when a preview nears the viewport.

## Verification (later)
- Two+ `DiagramPreview` instances on one page show **independent** diagrams/highlights (proves the
  store refactor).
- Scrolling advances steps; camera + highlights + labels update smoothly; reduced-motion jumps.
- three.js stays in the lazy chunk; non-editor routes unaffected; `next build` route sizes unchanged
  except pages that embed a preview.
