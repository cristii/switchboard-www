# Isometric Workflow Editor — Technical & Design Guidance

> Authoritative spec for building the **Isometric Workflow Editor (WIP)** inside `switchboard-www`.
> A later implementation session follows this document together with
> `isometric_workflow_editor_progress.md` (the phased checklist). Read both before writing code.
>
> Source prototype: a single-file R3F/Three.js sketch (`7cc007b1-index.html`). This document
> describes how to refactor it into modular, composable, on-brand components.

---

## 1. Purpose & goals

The editor lets Cristi author **2.5D isometric diagrams** of automation systems and embed the
rendered results in the portfolio (`/work`) to show clients the architectures being built.

It must comfortably express two ends of a spectrum:

1. **n8n-style workflows** — linear/branching node graphs: trigger → action → action, with the
   occasional switch/merge. Quick to assemble from a palette.
2. **Advanced architecture diagrams** — multi-tier systems with grouped layers, fan-out/fan-in,
   databases, AI layers, queues and microservices. The reference target is the multi-tier
   "Scouts/Leads" graph from the brief (Slack/Telegram triggers → command parser → router →
   lead engine → AI processing layer → database → automations → commission engine → dashboard).

**North star:** the diagrams should read like **premium SaaS architecture visuals** while staying
inside the Switchboard **"paper & ink"** design system. Premium comes from clean isometric
geometry, restrained lighting, crisp typography and subtle motion — **not** from neon glows,
gradients-as-identity, or stock icons.

### Success criteria
- Build a clean n8n workflow in under a minute from the palette.
- Reproduce the Scouts/Leads architecture (tiers, fan-out/in, grouped layers) without hacks.
- Export a presentation-quality PNG and a re-openable JSON.
- `next build`, `npm run typecheck`, and `npm run build-storybook` all pass.
- Dark/light toggle affects only the editor surface; the rest of the site is untouched.
- Works on mobile (touch pan/zoom/drag, collapsible panels).

---

## 2. Non-negotiable brand rules (and how the prototype is brought into compliance)

These come from `AGENTS.md` → "Brand & design rules (do not break)". The prototype violates
several; the refactor must fix them. **Treat this section as a lint checklist.**

| Brand rule | Prototype today | Required in the editor |
|---|---|---|
| **No emoji, ever** | Toolbar/sidebar use 🖥 🗄 🔍 ⟳ ⬇ 🖼 ↩ ↪ | Replace **every** emoji with a bespoke mask-tinted SVG icon (see `Icon.tsx` pattern, §7/§9). |
| **HARD zero-blur offset shadows; never blur** | Uses `box-shadow` glows + `backdrop-filter: blur` | All **DOM chrome** uses hard offset shadows (`--shadow-card`, `--shadow-btn`, …). No `blur()`, no glow. (3D viewport lighting is separate — see §3.) |
| **Bespoke icons; no third-party icon lib** | Emoji glyphs | New line-style SVGs in the brand set, rendered via the existing `Icon` component. No Lucide/Heroicons. |
| **Tokens, not raw hex** | Indigo `#6366f1`, emerald `#10b981`, slate `#0f172a`… | Remap to brand tokens: indigo → **orange**, emerald → **green**, slate surfaces → **ink/paper**, accents → **violet/amber**. No raw hex in chrome. |
| **No gradients as identity** | Radial canvas gradients, glow gradients | Flat brand fills. The 3D scene may have natural light falloff (§3) but no decorative gradient skins. |
| **Restrained motion; respect `prefers-reduced-motion`** | n/a | react-spring animations must be subtle and fully disabled under reduced-motion (§8). |
| **Build from the design system** | Standalone | Chrome is built from `src/components/ui` where a primitive exists; new primitives are added to the editor library **with stories** (§14). |

**Palette remap reference** (use the CSS variables, never the hex directly in chrome):

| Prototype color | Role | Switchboard token |
|---|---|---|
| `#6366f1` indigo (server) | primary / structural node | `--orange` (or `--ink` for plain services) |
| `#10b981` emerald (database) | data node | `--green` |
| `#0f172a / #1e293b` slate | panel surfaces | `--white` / `--paper` / `--paper-2` (light), dark editor tokens (dark) |
| `#facc15` yellow (selection) | selection highlight | `--amber` |
| AI / advanced accents | AI / advanced node | `--violet` |

---

## 3. 3D-viewport vs. brand reconciliation

The "never blur / no gradients" rule governs the **2D DOM chrome** (toolbar, panels, inspector,
labels, buttons). It is the most easily broken rule — keep it sacred there.

The **WebGL viewport** is a different medium. Real-time lighting, soft contact shadows and the
natural shading falloff of 3D materials are inherent to isometric depth and are **allowed**, with
guardrails so it still feels like Switchboard and not a generic neon SaaS render:

- **Allowed:** one key directional light + soft ambient/hemisphere fill; a single soft
  ground/contact shadow; matte materials (`roughness ≈ 0.4`, low `metalness`); a subtle emissive
  lift on the **selected** node only (tinted with `--amber` or the node's brand color).
- **Avoid:** heavy bloom/post-processing glow, mirror-metal materials, rainbow/gradient skyboxes,
  saturated point-light halos. Keep the background a flat brand surface (paper in light, deep ink
  in dark).
- **Labels/chrome stay 2D and on-brand:** node labels are DOM overlays using `--shadow-card`-style
  hard shadows and ink outlines (no `backdrop-filter: blur`, unlike the prototype).

Net effect: a calm, tactile, "printed-but-dimensional" look that matches paper & ink.

---

## 4. Tech stack & dependencies

Keep the prototype's rendering stack; add animation and real npm packages (no esm.sh import map).

| Package | Version policy | Why |
|---|---|---|
| `three` | latest `0.17x` | WebGL renderer / geometry / materials. |
| `@react-three/fiber` | **latest 8.x** | React renderer for three. v9 needs React 19 — do **not** install it (see compat note). |
| `@react-three/drei` | **latest 9.x** | Helpers: `OrthographicCamera`, `Html` (labels), `Line`, `Bounds`, `RoundedBox`, `ContactShadows`. v10 needs R3F 9. |
| `@react-spring/three` | **latest 9.x** | Spring animation for 3D node transforms + camera tweens. |
| `@react-spring/web` | **latest 9.x** | Spring animation for DOM chrome (drawers, panels). |
| `zustand` | **latest 5.x** | Editor store (nodes/edges/selection/history/viewport). Matches the prototype; tiny; React-18 safe. |

### React-18 / Next-14 compatibility note (important)
The app is on **React 18.3 / Next 14**. The absolute-latest 3D stack majors (**R3F 9 / drei 10 /
react-spring 10**) require **React 19**. Do **not** bump React as part of this work. Install the
**latest versions that are React-18 compatible** (the table above). Capture the
**React 19 + R3F 9 + drei 10 + react-spring 10** migration as an explicit optional follow-up in
`isometric_workflow_editor_progress.md` (Phase P14), to be done deliberately and app-wide, not here.

### Bundle isolation (required)
Three.js + drei are heavy. They must **never** load on other routes:
- The page at `src/app/isometric-editor/page.tsx` imports the editor via
  `next/dynamic(() => import('@/components/editor'), { ssr: false, loading: <EditorSkeleton/> })`.
- `ssr: false` because R3F needs the DOM/WebGL; also avoids SSR hydration cost.
- Keep all `three`/drei imports inside `src/components/editor/**` so tree-shaking/route-level code
  splitting keeps them off the marketing bundles.

### react-spring usage map
- **3D:** spring a node's scale/position on add, on select (gentle lift), and on drag-release
  (settle); tween the camera on "fit"/"reset"/zoom-to-node.
- **DOM:** mobile bottom-sheet drawers, inspector slide-in, palette expand/collapse, toolbar
  overflow.
- **Reduced motion:** read `prefers-reduced-motion`; when set, use `immediate: true` (springs jump
  to target) so there is no animation.

---

## 5. Architecture & directory layout

Composability is a hard requirement. Principles:

- **Data-driven:** node appearance/behavior comes from a **catalog/registry** (`nodeCatalog.ts`),
  not from `if (type === …)` branches. Adding a node kind = adding a catalog entry (+ optional
  shape/icon).
- **Store-injectable:** the top-level editor accepts optional `initialNodes`/`initialEdges` (and
  can accept an external store) so it renders the same in Storybook, the route, and `/work` embeds.
- **Presets-as-data:** sample diagrams (n8n, architecture) are plain data modules, not hardcoded.
- **Tailwind-free editor:** because the stories run in Storybook (no Tailwind), **all** editor
  components style via inline styles + **editor CSS variables** — the same discipline as
  `src/components/ui`. Do not use Tailwind classes inside `src/components/editor/**`.

```
src/components/editor/
  index.ts                      # public surface (exports IsometricWorkflowEditor + types)
  IsometricWorkflowEditor.tsx   # top-level composed client component; owns the data-editor-theme root

  theme/
    editor-tokens.css           # --editor-* CSS vars: light + dark sets (derived from brand tokens)
    useEditorTheme.ts           # theme context/hook: resolve + toggle + persist
    sceneTheme.ts               # maps resolved CSS vars -> R3F material/light/grid/bg values

  state/
    types.ts                    # WorkflowNode, WorkflowEdge, NodeKind, Port, Diagram, Viewport
    useWorkflowStore.ts         # zustand: nodes, edges, selection, viewport, actions
    history.ts                  # undo/redo snapshot helpers (extracted from prototype)
    schema.ts                   # versioned serialize/deserialize + validation + migrations

  scene/
    DiagramCanvas.tsx           # <Canvas> orthographic setup, lights, ContactShadows, ground plane
    CameraControls.tsx          # pan (ctrl/middle-drag, 2-finger) + wheel/pinch zoom + fit/reset
    Grid.tsx                    # brand-tinted ground grid (theme-aware)
    LabelsLayer.tsx             # DOM overlay labels (screen projection), on-brand styling
    nodes/
      NodeMesh.tsx              # dispatches kind -> shape; handles select/drag; spring transforms
      shapes/                   # one file per isometric primitive (see §7)
        BoxNode.tsx  CylinderNode.tsx  HexPrismNode.tsx  DiamondNode.tsx
        SlabNode.tsx  CapsuleNode.tsx  PaperTileNode.tsx  GroupContainer.tsx
    edges/
      OrthogonalEdge.tsx        # renders a routed edge + optional label + arrowhead
      edgeRouting.ts            # A* grid router (createGrid/aStar/getOrthogonalPath) extracted

  panels/                       # 2D chrome (editor primitives, CSS-var styled)
    Toolbar.tsx                 # undo/redo, zoom, fit, export, theme toggle
    NodePalette.tsx             # categories generated from the catalog; click/drag to add
    Inspector.tsx               # selected node/edge props; label, color, ports, delete
    ThemeToggle.tsx
    MobileDrawer.tsx            # bottom-sheet wrapper for palette/inspector on small screens

  primitives/                   # editor-local UI atoms (only if not already in src/components/ui)
    IconButton.tsx  Panel.tsx  Field.tsx  Select.tsx  Slider.tsx  Tooltip.tsx  SegmentedControl.tsx

  catalog/
    nodeCatalog.ts              # NodeKind -> { category, label, shape, colorRole, icon, ports, size }
    presets/
      n8n.ts                    # n8n-style node presets + a sample workflow
      architecture.ts           # advanced presets + the Scouts/Leads sample template
    layout/
      autoLayout.ts             # layered/ranked auto-arrange for tiered graphs

  icons/                        # new mask-tinted brand-line SVGs for node kinds + toolbar actions

  hooks/
    useKeyboardShortcuts.ts     # delete, escape, undo/redo, duplicate, fit
    useResponsiveLayout.ts      # breakpoint -> layout mode (desktop panels vs mobile drawers)
    useExportPng.ts             # canvas.toDataURL (needs preserveDrawingBuffer)
    useExportJson.ts            # schema.serialize -> download

  *.stories.tsx                 # Editor/* Storybook stories (see §14)

src/app/isometric-editor/
  layout.tsx                    # chromeless: returns children only (no SiteHeader/SiteFooter)
  page.tsx                      # metadata + dynamic import of the editor (ssr:false)
```

### Prototype → module refactor map
- **Keep & extract:**
  - A* router (`createGrid`, `heuristic`, `aStar`, `getOrthogonalPath`) → `scene/edges/edgeRouting.ts`.
  - zustand store + `_takeSnapshot`/`undo`/`redo` → `state/useWorkflowStore.ts` + `state/history.ts`.
  - Label screen-projection (`LabelPositionUpdater` + overlay) → `scene/LabelsLayer.tsx` (drei `Html`
    is an option, but a single projected overlay performs better for many nodes).
  - Ground-plane drag math + `CameraControls` (pan/zoom) → `scene/`.
  - Orthographic `<Canvas>` config + lights + shadow catcher → `scene/DiagramCanvas.tsx`.
- **Generalize:**
  - 2 hardcoded types (`server`/`database`) → data-driven `nodeCatalog` with many kinds (§7).
  - Single `direct` edge → typed edge system with labels, dashed/conditional styles, branching &
    merging (§8).
  - "Select two nodes consecutively to connect" → an explicit **connect mode** / port drag, which is
    clearer for complex graphs (keep the consecutive-select as an optional quick-connect).
- **Drop / replace:**
  - Tailwind CDN + `htm` tagged templates → real **TSX**.
  - esm.sh import map → npm dependencies (§4), code-split.
  - All emoji → bespoke SVG icons. All glow/blur shadows → hard offset shadows. Indigo/emerald/slate
    → brand tokens.

---

## 6. Data model & schema

```ts
// state/types.ts
export type NodeKind =
  | "trigger" | "action" | "ai" | "logic" | "merge"
  | "database" | "queue" | "service" | "integration"
  | "output" | "group" | "note";

export interface Port {
  id: string;
  side: "in" | "out";
  label?: string;
}

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;            // e.g. "/help, /update, /status"
  x: number;                    // ground-plane X (maps to world X)
  y: number;                    // ground-plane Y (maps to world Z)
  width?: number;               // footprint; groups size to children if omitted
  depth?: number;
  height?: number;              // extrusion (visual emphasis)
  color?: string;               // override; otherwise derived from catalog color role
  icon?: string;                // icon key into the editor icon set
  parentId?: string;            // membership in a group/container node
  ports?: Port[];               // explicit ports; otherwise default in/out
  meta?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
  label?: string;
  routing?: "orthogonal" | "smooth" | "direct";  // default "orthogonal"
  style?: "solid" | "dashed";                      // dashed = conditional/async
  color?: string;
}

export interface Viewport { zoom: number; target: [number, number]; }

export interface Diagram {
  version: 1;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: Viewport;
  theme?: "light" | "dark";
}
```

- **schema.ts** — `serialize(state): Diagram`, `deserialize(json): Diagram` with validation and a
  `migrate(json)` switch keyed on `version` (future-proofing exports embedded in `/work`).
- **autoLayout.ts** — given nodes+edges, assign tiers (longest-path ranking) and spread within a
  tier; used by the "Auto-arrange" action and to lay out imported graphs. Keep it deterministic.
- **n8n import (future, P14)** — `mapN8nWorkflow(json): Diagram`: n8n `nodes[]`→ nodes (type→kind via
  a lookup), `connections{}` → edges. Document the mapping table; gate behind a flag.

---

## 7. Node catalog (the extensibility core)

`catalog/nodeCatalog.ts` is the single registry that drives palette, rendering and inspector
defaults. Adding a kind here (plus a shape + icon if new) is the **only** step to support a new node.

```ts
interface NodeCatalogEntry {
  kind: NodeKind;
  category: "Triggers" | "Logic" | "AI" | "Data" | "Services" | "Output" | "Layout";
  label: string;                 // default label
  shape: ShapeId;                // which scene/nodes/shapes/* renders it
  colorRole: "orange" | "green" | "violet" | "amber" | "ink";  // brand token role
  icon: string;                  // editor icon key
  defaultPorts: Port[];
  defaultSize: { width: number; depth: number; height: number };
}
```

Starter kinds and their isometric shapes (all derived from brand tokens):

| Kind | Category | Shape | Color role | Notes |
|---|---|---|---|---|
| `trigger` | Triggers | rounded wedge / capsule | orange | entry points (webhook, schedule, chat) |
| `action` | Logic | rounded box (card) | ink | generic app/HTTP action |
| `logic` | Logic | diamond / split prism | amber | if / switch / router / filter (fan-out) |
| `merge` | Logic | inverted diamond | amber | join (fan-in) |
| `ai` | AI | hexagonal prism | violet | LLM / agent / intent router |
| `database` | Data | cylinder | green | DB / store (Airtable/Supabase) |
| `queue` | Data | stacked slabs | green | queue / message bus |
| `service` | Services | box with rack detail | ink | microservice / server |
| `integration` | Services | box w/ icon decal on top | orange | 3rd-party app (Slack, Telegram) |
| `output` | Output | capsule / beveled box | orange | notification / email / dashboard |
| `group` | Layout | translucent raised slab + label tab | ink (low-opacity) | **container/layer** (e.g. "AI Processing Layer", "Database"); children sit on it |
| `note` | Layout | flat paper tile | paper | annotation, on-brand paper texture |

The **palette** (`NodePalette.tsx`) is generated by grouping catalog entries by `category` — never a
hardcoded list. The **inspector** reads the entry for defaults (ports, size, color).

---

## 8. Edge system

- **Routing:** default `orthogonal` via the extracted A* grid router (`edgeRouting.ts`). Provide
  `smooth` (quadratic/Catmull) and `direct` (straight) as alternates selectable per edge.
- **Branching & merging:** a node may have many outgoing edges (fan-out from `logic`/`router`) and
  many incoming (fan-in to `merge`/engines) — the Scouts/Leads graph needs both. Routing must avoid
  node footprints (router already treats nodes as blocked cells) and visually separate parallel
  lanes (lane offset so stacked edges don't overlap).
- **Labels:** optional edge label rendered as a small on-brand DOM chip at the path midpoint
  (e.g. a condition like "won", "lead replied").
- **Styles:** `solid` (default) and `dashed` (conditional/async). Color defaults to a muted
  ink/line token; can be tinted per edge.
- **Arrowheads:** a small cone/triangle at the target anchor, tinted to the edge color.
- **Ports:** default one `in` (top/upstream) and one `out` (downstream); catalog can define more.
  Connecting snaps to the nearest free port; orthogonal anchors derive from port side.

---

## 9. Theming spec (editor-scoped dark/light)

The site has **no global dark mode** and must not gain one here. The editor owns its theme.

- **Root attribute:** `IsometricWorkflowEditor` renders a wrapper with `data-editor-theme="light|dark"`.
  All `--editor-*` variables are defined twice in `editor-tokens.css`, scoped to that attribute:

```css
[data-editor-theme="light"] {
  --editor-bg: var(--paper);
  --editor-surface: var(--white);
  --editor-surface-2: var(--paper-2);
  --editor-border: var(--ink);
  --editor-text: var(--ink);
  --editor-text-muted: var(--ink-soft);
  --editor-grid: var(--line);
  --editor-grid-strong: var(--line-soft);
  --editor-accent: var(--orange);
  --editor-selection: var(--amber);
  --editor-shadow: var(--shadow-card);   /* hard, no blur */
  /* node color roles map straight to brand tokens */
  --node-orange: var(--orange); --node-green: var(--green);
  --node-violet: var(--violet); --node-amber: var(--amber); --node-ink: var(--ink);
}
[data-editor-theme="dark"] {
  --editor-bg: #0E1A18;          /* deep ink-black, derived from --dark */
  --editor-surface: #15211F;     /* = --ink as a surface */
  --editor-surface-2: #1C2A27;
  --editor-border: #2C3A37;
  --editor-text: var(--on-dark);
  --editor-text-muted: var(--on-dark-muted);
  --editor-grid: #243330;
  --editor-grid-strong: #2E403C;
  --editor-accent: #D9772B;      /* brightened orange for contrast on dark */
  --editor-selection: var(--amber);
  --editor-shadow: 4px 4px 0 rgba(0,0,0,0.45);  /* still hard, no blur */
  --node-orange: #E08742; --node-green: #5BA06B;
  --node-violet: #9A78C0; --node-amber: var(--amber); --node-ink: #C8CEC6;
}
```

- **Hook:** `useEditorTheme()` returns `{ theme, setTheme, toggle }`. Initial value = stored
  preference (localStorage key `sb-editor-theme`) else `prefers-color-scheme`. It sets the attribute
  on the editor root.
- **Scene wiring:** `sceneTheme.ts` reads resolved CSS variables (via `getComputedStyle` on the
  editor root, recomputed on theme change) and returns a plain object the R3F scene consumes for
  background, grid colors, material colors, light intensities and selection emissive. This keeps a
  **single source of truth** (the CSS vars) for both DOM and WebGL.
- **Dark scene:** flat deep-ink background, dimmer ambient, slightly cooler key light; node
  materials use the `--node-*` dark values; contact shadow opacity reduced.

---

## 10. Responsive / mobile

- **`useResponsiveLayout`** maps the viewport width to a layout mode using the existing breakpoint
  feel (desktop ≥ ~1024px; tablet; mobile < ~640px).
- **Desktop:** left `NodePalette`, center canvas, right `Inspector`, top `Toolbar` (as today, but
  on-brand).
- **Mobile/tablet:** canvas is full-bleed; palette and inspector become **bottom-sheet drawers**
  (`MobileDrawer`, react-spring); the toolbar condenses to an icon bar + an overflow menu. A
  segmented control toggles "Add" (palette) vs "Inspect".
- **Touch gestures:** one-finger drag = move selected node (or pan when on empty space); two-finger
  drag = pan; pinch = zoom. Use pointer events (the prototype already uses pointer capture) and
  guard against accidental selection during pan.
- **Reduced motion:** all drawer/panel springs become immediate; no camera tween.
- **Targets:** controls ≥ 40px hit area; labels remain legible; the palette is scrollable.

---

## 11. Interactions

- **Select:** click a node (or edge). Escape clears. Multi-select is optional (P13+).
- **Drag:** move a node on the ground plane (ray → plane intersection, as in the prototype);
  snapshot history on drag start; settle with a spring on release.
- **Connect:** explicit connect mode or drag from an out-port to an in-port; show a live preview
  edge; validate (no self-loop, no duplicate). Keep the prototype's quick "select A then B" as an
  optional convenience.
- **Undo/redo:** snapshot-based store (extracted). Wire to toolbar + Ctrl/Cmd+Z / Shift+Z.
- **Keyboard:** Delete/Backspace removes selection (ignored while typing in inputs — keep the
  prototype's input guard), Escape deselects, Ctrl/Cmd+Z/Y undo/redo, F = fit, optional D = duplicate.
- **Camera:** pan, wheel/pinch zoom (clamped), **fit-to-content** and **reset** actions that tween.

---

## 12. Import / Export

- **JSON:** `useExportJson` downloads `schema.serialize(state)` (versioned `Diagram`). Importing a
  JSON validates + migrates then loads into the store.
- **PNG:** `useExportPng` uses `renderer.domElement.toDataURL("image/png")`. This requires the
  `<Canvas>` `gl={{ preserveDrawingBuffer: true }}` (the prototype sets it `false` — change it).
  Offer 1x/2x scale for crisp portfolio exports; optionally render labels into the PNG via an
  html-to-canvas pass or by drawing labels on an overlay canvas (document the chosen approach).
- **Planned (P14):** SVG export (vector, ideal for print/portfolio) and GLTF export (interactive
  embeds); n8n-JSON import.
- **Portfolio embedding:** `/work` pages can either show exported PNGs or mount a read-only editor
  (`interactive={false}`) fed a preset `Diagram` — design the top-level component to accept a
  `readOnly` prop so the same code serves authoring and display.

---

## 13. Integration points

- **Route:** `src/app/isometric-editor/page.tsx` exports `metadata`
  (`title: "Isometric Workflow Editor (WIP)"`, a short description) and renders the dynamically
  imported editor full-screen.
- **Chromeless layout:** `src/app/isometric-editor/layout.tsx` returns just `{children}` (no
  `SiteHeader`/`SiteFooter`), giving the editor the whole viewport. The editor provides its own top
  bar with a small "← Switchboard" link back home.
- **Footer link:** add to `src/lib/nav.ts` `footerColumns`. Put it under **Resources** (or a new
  **Labs** column) as `{ label: "Isometric Workflow Editor (WIP)", href: "/isometric-editor" }`, and
  add `"/isometric-editor": "Isometric Editor"` to `routeNames`. `SiteFooter.tsx` needs no change
  (it maps the data).
- **Dynamic import boundary:** all three/drei stay under `src/components/editor/**`; the page only
  imports the barrel via `next/dynamic`.

---

## 14. Storybook plan (`Editor/*` in the existing Storybook)

- Stories live next to components as `*.stories.tsx`; the existing `.storybook/main.ts` glob picks
  them up automatically. Use a top-level `title` namespace **`Editor/...`** (e.g.
  `Editor/Panels/Toolbar`, `Editor/Nodes/Shapes`, `Editor/Full Editor`).
- **Tailwind-free constraint:** Storybook has no Tailwind, so editor components must be fully
  self-styled (inline styles + `--editor-*` vars). Verify each story renders correctly with **no**
  Tailwind classes.
- **Token import:** add `import "../src/components/editor/theme/editor-tokens.css";` to
  `.storybook/preview.tsx` (alongside the existing token CSS) so `--editor-*` resolves in stories.
- **Theme switching in SB:** provide a story decorator or toolbar control that sets
  `data-editor-theme` so reviewers can flip light/dark.
- **Coverage:** primitives (IconButton, Panel, Field, Select, Slider, Tooltip), each node **shape**,
  the edge variants, each panel, the theme toggle, and a **Full Editor** story seeded with both the
  n8n sample and the Scouts/Leads architecture preset. WebGL stories run under
  `@storybook/react-vite`; keep them client-only and lightweight.
- Update a component's story whenever it changes (`AGENTS.md` working agreement).

---

## 15. Future: SVG/CSS isometric backend (documented, not built now)

The user intends to **evaluate a pure SVG/CSS isometric renderer** later (no WebGL): smaller bundle,
crisp printable vectors, trivial SSR/theming. To make that swap cheap:

- Keep **all** geometry/appearance decisions in the **data model + catalog + theme**, and keep the
  store/schema **renderer-agnostic**.
- Treat `scene/` as one implementation of a `DiagramRenderer` contract
  (`render(nodes, edges, theme, viewport)` + interaction callbacks). A future `scene-svg/` can
  implement the same contract behind a feature flag, enabling an A/B comparison without touching
  state, panels, catalog or schema.
- Document the isometric projection math (2:1 dimetric) so the SVG backend can match the R3F look.

---

## 16. Acceptance criteria & guardrails

A change is done only when:
- `next build`, `npm run typecheck`, and `npm run build-storybook` all pass.
- **Zero emoji** anywhere in editor code/UI (grep for emoji in `src/components/editor`).
- **Zero blurred DOM shadows** and no `backdrop-filter: blur` in chrome (3D lighting is exempt, §3).
- **No raw hex in chrome** — chrome uses `--editor-*` / brand tokens only. (3D material colors come
  from `sceneTheme`, which itself reads tokens.)
- Editor code is **Tailwind-free** and renders correctly in Storybook.
- Reusable chrome uses `src/components/ui` where a primitive exists; genuinely new atoms live in
  `editor/primitives` **with stories**.
- Three/drei do **not** appear in non-editor route bundles.
- Dark/light toggle changes only the editor surface; `prefers-reduced-motion` disables animation.
- The Scouts/Leads architecture preset renders cleanly (tiers, fan-out/in, group layers, DB,
  AI layer, dashboard) and exports a clean PNG + reloadable JSON.

---

## Appendix A — references in this repo
- Conventions: `AGENTS.md`, `PLAN.md`, `PROGRESS.md`.
- Design tokens: `src/styles/{colors,fonts,typography,spacing}.css`; mirror in `tailwind.config.ts`.
- Inline-style + CSS-var component pattern: `src/components/ui/{Button,Card,Icon}.tsx`.
- Icon (mask-tinted SVG) pattern: `src/components/ui/Icon.tsx`.
- Storybook config: `.storybook/main.ts`, `.storybook/preview.tsx`; example: `Button.stories.tsx`.
- Routing/layout: `src/app/layout.tsx`; interactive-page example: `src/app/calculator/page.tsx`
  and `src/components/sections/Calculator.tsx`.
- Footer + nav data: `src/components/sections/SiteFooter.tsx`, `src/lib/nav.ts`.

## Appendix B — prototype inventory (what to port)
From `7cc007b1-index.html` (single file): A* router; zustand store with undo/redo + sample nodes;
`SimpleGrid`; `OrthogonalEdge`; `LabelPositionUpdater` + `LabelsOverlay`; `ArchitectureNode` (drag,
interaction/visible mesh split, selection ring); `ShadowCatcherPlane`; `CameraControls` (pan/zoom);
`DiagramScene`; `TopToolbar` (undo/redo/zoom/reset/export JSON+PNG); `Sidebar` (toolbox +
consecutive-select connect); `Inspector` (label edit, position, connected edges, delete, JSON dump);
`App` (orthographic `<Canvas>` + overlays + loading state). Port the logic, replace the styling and
generalize the type system per §5–§8.
