# Audit + Improvement Plan — Isometric editor, diagrams, /diagram-preview, /diagram-library

## Context
The isometric diagram system works end-to-end but doesn't yet *feel* premium. The user wants: (1) rendered
diagrams that read like **premium SaaS isometric architecture art** — professional but playful, on-brand
"paper & ink"; (2) an editor that feels **complete and professional** (n8n/Figma-class interactions) while
staying simple; (3) upgraded `/diagram-preview` and `/diagram-library`; (4) first-class **mobile + dark mode**.
Three audits (editor UX, 3D rendering, pages/design-system) produced the findings below.

**User decisions:** default edges = **iso-orthogonal elbows**; motion = **subtle full set** (hover lift, flow
dots, springy editor feedback; reduced-motion + snapshots always static); order = **Diagrams → Editor → Pages**;
this plan **owns dark-mode-aware embedded diagrams**.

**New on origin/main (parallel session — must merge first):** site-wide dark mode via `data-theme` on `<html>`
(`src/lib/useTheme.ts`, `ui/ThemeToggle`, dark token block in `src/styles/colors.css` — **all** tokens flip,
incl. `--white`→`#1C2A27`); editor default theme already follows the site (`useThemeManager.ts` `siteThemeId()`).

## Audit findings (condensed, verified file:line)

**A. Rendered diagrams**
- Flagship + signal theme use `routing:"direct"` = **center-to-center lines** (`routing/builtins.ts:158`,
  `scoutFlow.ts:150`, `signal.ts:60`): no ports, no obstacle avoidance, fan edges overlap; `laneIndex` only
  bumps Y (`OrthogonalEdge.tsx:79`), never spreads lanes.
- Edges pinned at `y=0.5` cut **through** floating trays (cards sit at 0.8; trays occupy 0.4–0.8,
  `GroupContainer.tsx:128-139`). Colors are low-contrast greys (`signal.ts:55` #aab0a6; `dark.ts:36`), 2px.
- Labels are fixed **world-size** troika text (`TextNode.tsx:133`) → shrink to illegible when zoomed out;
  sizes inconsistent (node 0.5/0.6 vs edge ×0.85 vs hardcoded 0.36 tags); default troika font, brand font unused.
- Icon textures 256px, stroke-width 2, anisotropy 4 (`iconTextures.ts:41-48`) → thin/aliased at iso grazing angle.
- Dark theme is flat: emissive 0.16, near-black fill, hard shadows, muted palette (`dark.ts`).
- `fit()` frames ground footprints only (`CameraControls.tsx:196-214`) — ignores node height + billboard labels
  → off-center compositions.
- **No site-dark adaptation for embeds**: `WorkIsoPreview.tsx:45-52` etc. hardcode light `signalTheme` + opaque
  white → white glare cards in dark mode. Snapshot cards bake the light bg.
- Motion infra exists and is reduced-motion-gated (`NodeMesh.tsx:101-106`, `OrthogonalEdge.tsx:39-42`) but flow
  is `"off"` in presets and there's no hover state at all.

**B. Editor**
- **Single selection only** (`state/types.ts:129`); no marquee, no multi-move, no align/distribute.
- No copy/paste; duplicate only via context menu (`useWorkflowStore.ts:282`); no alt-drag clone.
- Click-to-add drops nodes at **random** positions (`useWorkflowStore.ts:171`); mobile: drawer closes, node may
  land off-screen. No palette search, no drag-and-drop, no shape previews (`NodePalette.tsx:83-100`).
- Shortcuts: only Delete/Backspace + Escape (`IsometricWorkflowEditor.tsx:114-131`). No undo/redo keys, no
  select-all, no nudge, no cheat-sheet.
- No snapping, no alignment guides (`moveNode` writes raw coords). No inline label edit (Inspector only).
  Edge hit target = thin line (`LineConnector.tsx:24`) — near-untappable on touch. Context menu is node-only.
- **Diagram doesn't persist** — reload loses work (only themes autosave). `importDiagram` exists with **no UI**.
- No zoom % readout / zoom-to-100; no empty-canvas onboarding; no hover cursor/feedback on nodes.
- A11y/chrome: `outline:"none"` with no `:focus-visible` anywhere (`Field.tsx:38`, `Select.tsx:41`); Inspector
  swatches hardcode raw light hexes (`Inspector.tsx:19-25`); `⚠`/`·` text glyphs (`ThemeManager.tsx:451,225`);
  toolbar icons 32px, swatches 22px (< 44px touch); PNG export is 1×, canvas-only (`useExportPng.ts`).
- Mobile: one-finger drag on empty canvas does nothing (pan needs 2 fingers); drawers lack drag-handle/swipe.

**C. /diagram-preview** — bare `<textarea>` (no gutter/format/copy/reset); raw `JSON.parse` error text with no
line/col; no examples picker (one hardcoded doc); no share permalink; no fullscreen; camera zoom/target/fit not
editable via UI; mobile "tabs" are chips with no tab semantics; local `Chip` duplicates `ui/Pill`.

**D. /diagram-library** — no search/filter or section nav; ~21 cards snapshot **serially** (1100ms settle each)
with no skeleton/queue feedback; context menu discoverable only via prose + small low-contrast `⋯`; menu lacks
icons/focus management/keyboard nav and can overflow bottom (Y not clamped); keyboard-opened menu appears at
(0,0); toast has no `aria-live`; long-press lacks `touch-action`/callout guards + press feedback; `LibraryCard`
re-implements `ui/Card`; PNG copy fails silently until that card's snapshot exists.

**E. Cross-cutting** — dark tokens flip `bg-white` correctly after merge, but hard shadows (`--shadow-*`) need a
dark-value check; no shared Menu/Tabs/Toast/TextInput primitives (each page hand-rolls them).

---

## Implementation plan

### Phase 0 — Sync + audit doc
1. Merge `origin/main` into `claude/dreamy-johnson-ikxp6p` (dark mode + motifs). Expect a trivial
   `PreviewPlayground.tsx` conflict (keep main's Chip change; Phase 5 rewrites it anyway).
2. Commit this audit+plan as `docs/editor/audit_improvement_plan.md` (their docs culture).

### Phase 1 — Diagram visual quality (premium look)
1. **Iso-elbow edge system** (new default `routing:"iso"` in `scene/edges/routing/builtins.ts`):
   - **Ports**: anchor on the node footprint *edge* facing the peer (sides chosen from delta), spreading
     multiple edges along that side; consume catalog IN/OUT port sides where defined (`nodeCatalog.ts`).
   - **Rail height**: add a per-kind `visualHeight()` next to the footprint registry; edges rise with a short
     vertical stub, run at `max(srcTop,dstTop)+clearance`, descend at target — never through trays.
   - **Orthogonal XZ runs** with rounded (arc-sampled) corners; obstacle avoidance reusing the existing A*
     footprint grid; **lane spreading** finally consumes `opts.laneIndex` (parallel corridor offset ~0.18).
   - **Visibility**: per-theme high-contrast edge color (signal → mid-ink; dark → light sage), width 2.5–3px,
     crisper arrowhead, hover/selected state (accent + width bump) in `LineConnector.tsx`/`OrthogonalEdge.tsx`.
   - Presets (`scoutFlow`, `pillarFlow`, `processFlow`, `aboutFlow`, library demos) + `signal.ts` move to `iso`.
2. **Label legibility** (`shapes/TextNode.tsx` + new `useScreenScale` hook): ortho screen px = world × zoom, so
   scale billboard groups by `clamp(targetPx/zoom, min, max)` — constant on-screen size with min/max bounds;
   one size scale (title/sub/edge/tag) from theme; wire the brand display font into `theme.text.font` for all
   built-ins (vendor woff under `public/fonts/`, check `app/layout.tsx` font setup); real bold, not outline.
3. **Node/material richness**: icon textures → 512px, stroke 2.25, anisotropy 16 + mipmaps
   (`iconTextures.ts`); subtle top-face lightening on slabs/cards/trays (material tint, **not** geometry — the
   sharp-horizontal/rounded-vertical slab profile is an explicit prior user decision); minor `StepIcon` polish.
4. **`signalDark` theme** (`theme/themes/signalDark.ts`, registered): deep-ink bg matching site dark
   (`#0E1A18` family), brighter key + warm rim + cool fill, low emissive, **vibrant** node palette, soft
   shadows on, light grid rgba, high-contrast edges. Also retune built-in `dark.ts` with the same recipe.
5. **Site-theme-aware embeds**: new `src/lib/useSiteColorScheme.ts` (reads `html[data-theme]`, subscribes via
   MutationObserver). `WorkIsoPreview`, `PillarIsoPreview`, `ProcessIsoPreview`, `AboutIsoPreview`, library
   cards pick `signal`/`signalDark` + wrapper bg from it; `IsoSnapshotPreview` re-snapshots on scheme change
   (key by scheme).
6. **Camera fit**: project footprint corners at y=0 **and** y=top + label offsets into screen space; symmetric
   padding; recheck preset `cameraFit` values (`CameraControls.tsx`).
7. **Motion**: hover lift on nodes (existing springs; +y rise, pointer cursor); flow dots ON by default for
   live embeds/editor in signal/signalDark (slow, small); staggered mount rise for live embeds only. All gated
   by `usePrefersReducedMotion`; snapshots stay `animate=false`.

### Phase 2 — Editor core UX
1. **Multi-select**: `Selection` → `{ nodeIds: string[]; edgeId?: string }` (store + all consumers); shift-click
   toggles; **marquee** on desktop ground-drag (DOM rect overlay → project node centers); Cmd/Ctrl+A;
   multi-drag moves the set; align/distribute (L/C/R, T/M/B, spread) in toolbar/context menu.
2. **Clipboard**: Cmd/Ctrl+C/V/D with id-remap + offset; alt-drag clone (`NodeMesh` drag start).
3. **Placement**: click-to-add → viewport-center snapped to grid + brief select/pulse (kill the random drop);
   **palette drag-and-drop** via pointer events (mouse + touch) dropping at the raycast ground point.
4. **Snapping + guides**: grid-snap toggle (0.5 step, persisted) + smart alignment guides (x/z match with
   neighbors within threshold → guide line + magnet), rendered in-scene.
5. **Direct manipulation**: double-click node → inline DOM label editor at projected position; fat invisible
   edge hit-tube for easy click/tap; edge + empty-canvas context menus (style/flow/delete; add-here/paste/
   select-all/fit).
6. **History + persistence**: Cmd/Ctrl+Z / Shift+Z / Y; **autosave** diagram (debounced store subscribe →
   `localStorage["sb-editor-doc"]`) + "Restore last session?" toast on mount (handoff wins); dirty dot.
7. **Feedback**: node/edge hover states + cursors; port hover glow; toolbar zoom % readout + zoom-to-100
   (`getCamera()` exists); arrow-key nudge (grid step, Shift=×4); `?` shortcut cheat-sheet overlay.

### Phase 3 — Editor chrome, mobile, a11y
1. **Palette**: search field, collapsible groups, richer item rows (kind glyph + color chip), drag affordance.
2. **Toolbar**: grouped clusters + labels, overflow menu when compact, tooltips show shortcuts, styled template
   menu (shared Menu primitive from Phase 4 can be pulled earlier if trivial).
3. **Inspector**: selection header (kind glyph + inline rename), collapsible sections, swatches from the
   **active theme palette** (fixes raw-hex violation `Inspector.tsx:19`), multi-select panel (shared props +
   align tools), **Import JSON** UI (file input → existing `importDiagram`).
4. **Mobile**: ≥44px targets (IconButton, swatches, per-connection delete); drawer drag-handle + swipe-dismiss;
   one-finger **pan on empty ground for touch** (marquee stays desktop); add-node feedback (auto-center+pulse).
5. **A11y/dark chrome**: global `:focus-visible` ring token in `editor-tokens.css`; `color-scheme` on editor
   root for native controls; replace `⚠`/`·` with `NodeGlyph`s; contrast pass on 0.58rem muted labels; PNG
   export at 2× dpr.

### Phase 4 — Shared primitives + /diagram-library
1. **New `ui/` primitives (with stories)**: `Menu` (anchored popover: focus trap, arrow keys, Y/X clamp,
   icons+dividers), `Tabs` (real tablist), `Toast` (aria-live), `TextInput`/`TextArea`. Brand-token styled.
2. **Library**: sticky section sub-nav (Templates / Node components) + search filter + count badges; cards use
   `ui/Card` hover-lift pattern + theme `Badge`; **skeleton shimmer + queue feedback** while serial snapshots
   run; visible "Actions" button (36px, labeled) + shared `Menu` with per-action glyphs (keyboard opens at
   button, not (0,0)); long-press hardening (`touch-action`, no-callout, press feedback); PNG action disabled
   until snapshot ready; dark QA (shadow tokens on dark).

### Phase 5 — /diagram-preview
Toolbar row: **Examples picker** (all library items), Format, Copy, Reset, **Share permalink** (doc → base64
`#hash`, parsed on load), Fullscreen preview. Numbered gutter on the textarea (overlay, scroll-synced) +
error strip with **line:col** (computed from parse position) using a glyph, not `⚠`. Camera section: numeric
zoom/target/fit fields + "Grab current camera" (expose optional `apiRef` on `DiagramPreview`). Replace local
Chip with `ui/Pill`; real `Tabs` on mobile; shared `Toast` for copies.

### Phase 6 — Docs + final verify
Update `docs/editor/*` (iso routing, screen-space labels, signalDark, autosave, new primitives) + README
editor section touch-up. Full verification matrix.

## Verification
- Per phase: `npm run typecheck && npm run build && npm run build-storybook` green; commit + push
  `claude/dreamy-johnson-ikxp6p` (merge to main only on user go).
- Browser matrix (needs user eyeball for WebGL): light/dark × desktop/mobile ×
  {/work live scene, /services–/process–/about snapshots, /isometric-editor, /diagram-preview, /diagram-library}.
- Key acceptance: edges never intersect slabs and read clearly in both modes; labels stay legible at min zoom;
  dark embeds match site dark; editor: marquee→align→copy/paste→undo→reload-restore loop works; library cards
  show skeletons then re-snapshot on theme toggle; playground round-trips a shared permalink.

## Deferred (explicitly out)
Minimap; CodeMirror-grade JSON editor; user-saved library items; Simple-Icons brand textures; card quick-view
lightbox; PNG re-render-at-2× for library copy (uses existing snapshot).
