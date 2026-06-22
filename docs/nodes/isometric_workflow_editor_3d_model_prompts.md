# Isometric Workflow Editor — 3D Model Generation Prompts

Copy-paste prompts to generate the node 3D models (one per node **kind**) in a separate
text-to-3D / modeller chat, then drop the resulting `.glb` files into the editor. Written as a
brief from a senior 3D modeller: premium, minimalist, "SaaS diagram" toys — clean, friendly,
tactile, not photoreal.

The procedural shapes that ship today (`src/components/editor/scene/nodes/shapes/*`) are the
**fallback**; these models are drop-in upgrades. Keep the silhouettes close to the current shapes so
layout/labels/edges still line up.

---

## Shared art direction (applies to EVERY model)

- **Vibe:** premium minimalist SaaS, lightly playful. Rounded edges, soft bevels, confident simple
  forms. Think Linear / Vercel / Apple-keynote diagram props — clean and matte, never busy.
- **Topology:** low-poly, clean quads, smooth-shaded with **small chamfers/bevels** on all hard
  edges (no razor edges). Target **1k–6k triangles** per model. No n-gons, no interior geometry.
- **Orientation & origin:** **Y-up**. Model sits **on the ground plane**: origin at the **centre of
  the base**, geometry built in **+Y** (base at y=0, top at y=height). Front face toward **+Z**.
- **Scale (world units = metres in the app):** match the catalog footprint so it drops in without
  rescaling. Build to the **width (X) × depth (Z) × height (Y)** given per model below. Keep a tiny
  margin (~5%) inside that box.
- **Materials (IMPORTANT for theming):** use **flat matte PBR** (roughness ≈ 0.45, metalness ≈ 0.05,
  no clearcoat, no textures/UV art). Use **at most two materials**, named exactly:
  - **`Body`** — the main surface. Ship it a neutral mid tone; the app recolours it per node
    (brand role colour, light/dark aware), so keep it a single flat colour, no baked AO/gradients.
  - **`Accent`** — a small emissive detail (a slot, ring, lens, indicator). Single flat colour; the
    app may set emissive on it. Keep it ≤ ~10% of the surface.
- **Palette (reference only — the app tints `Body`):** orange `#B45309`, green `#3F7A4E`, violet
  `#6A4A8A`, amber `#FBBF24`, ink `#15211F`, paper `#E9E8DF`.
- **Forbidden:** photoreal textures, logos/text, gradients baked into albedo, glass/mirror,
  high-frequency detail, scene props, ground planes, lights, or cameras in the export.
- **Export:** **glTF 2.0 binary (`.glb`)**, Y-up, metres, transforms applied, normals included,
  centred per the origin rule above. One mesh (or a small named group). Name the file
  `node-<kind>.glb` (e.g. `node-trigger.glb`).
- **Lighting note:** the app lights the scene (hemisphere + key/fill + soft shadows). Do **not**
  bake lighting; ship clean matte materials.

---

## Per-kind prompts

### trigger — `node-trigger.glb`  (footprint ≈ 1.6 × 1.0 × 0.6, accent: orange)
> Model a minimalist **launch/trigger pad**: a horizontal **stadium-capsule** (pill) slab with
> softly rounded ends, low and wide. On the top face, a single small **play/▶ wedge or circular
> "go" lens** as the `Accent`. Matte `Body`, one emissive `Accent` lens. Reads as "the start." Base
> centred on the ground, ~1.6 wide × 1.0 deep × 0.6 tall. Soft bevels, ~1.5–3k tris, two materials
> (`Body`, `Accent`), export `.glb`.

### action — `node-action.glb`  (≈ 1.3 × 1.3 × 0.7, accent: ink)
> Model a clean **rounded-cube "card" block** — the generic action/step. Gently rounded corners and
> top bevel, like a soft physical button/tile. A subtle inset seam or a tiny `Accent` corner dot for
> a "processing" cue. Matte, calm, neutral. ~1.3 cubed × 0.7 tall, base-centred, ~1–2k tris, two
> materials, `.glb`.

### logic — `node-logic.glb`  (≈ 1.2 × 1.2 × 1.0, accent: amber)
> Model a **rounded diamond / octahedral gem** standing on its lower point (resting stably on the
> ground, slightly truncated base so it doesn't tip). Faceted but soft-bevelled — a decision/switch
> "crystal." `Accent` = the top facet or an inset glyph slot. ~1.2 × 1.2 footprint × 1.0 tall,
> base-centred, ~1–3k tris, two materials, `.glb`.

### merge — `node-merge.glb`  (≈ 1.2 × 1.2 × 1.0, accent: amber)
> Model a **downward-converging diamond/funnel gem** — visually a sibling of `logic` but reading as
> "join/merge": three subtle channels grooved into the upper faces converging to one on top, or an
> inverted-diamond emphasis. Same size/material rules as logic. `.glb`.

### ai — `node-ai.glb`  (≈ 1.35 × 1.35 × 0.8, accent: violet)
> Model a **hexagonal prism puck** with soft bevels — an AI/agent node. On the top hex face, a small
> **4-point sparkle / spark** as the emissive `Accent`. Smart, modern, minimal. ~1.35 across × 0.8
> tall, base-centred, ~1.5–3k tris, two materials, `.glb`.

### database — `node-database.glb`  (≈ 1.25 × 1.25 × 0.95, accent: green)
> Model the **classic database cylinder**: a vertical cylinder with two subtle disc seams near the
> top (the stacked-platters cue), soft top/bottom edge bevels. `Accent` = the top rim or a thin band.
> ~1.25 diameter × 0.95 tall, base-centred, ~1.5–3k tris, two materials, `.glb`.

### queue — `node-queue.glb`  (≈ 1.5 × 1.1 × 0.85, accent: green)
> Model a **stack of 3 thin rounded slabs/cards** with small even gaps — a queue / message buffer.
> Slight offset or a leading `Accent` edge on the top slab to imply motion/order. ~1.5 wide × 1.1
> deep × 0.85 tall overall, base-centred, ~1.5–3k tris, two materials, `.glb`.

### service — `node-service.glb`  (≈ 1.4 × 1.4 × 0.8, accent: ink)
> Model a **server/microservice block**: a rounded cube with two or three shallow horizontal **rack
> grooves** on the front face and a small `Accent` status dot/LED. Sturdy, tidy, minimal. ~1.4 cubed
> × 0.8 tall, base-centred, ~2–4k tris, two materials, `.glb`.

### integration — `node-integration.glb`  (≈ 1.3 × 1.3 × 0.7, accent: orange)
> Model a **connector/hub block**: a rounded tile/cube with a recessed circular **socket or
> plug/puzzle-notch** on the top face as the `Accent` — reads as "third-party app / integration."
> Clean and friendly. ~1.3 cubed × 0.7 tall, base-centred, ~1.5–3k tris, two materials, `.glb`.

### output — `node-output.glb`  (≈ 1.6 × 1.0 × 0.6, accent: orange)
> Model an **output/notification pill**: a horizontal stadium-capsule (sibling of `trigger`) with a
> small **paper-plane / send chevron** or a soft **bell** as the emissive `Accent` on top. Reads as
> "result leaves the system." ~1.6 wide × 1.0 deep × 0.6 tall, base-centred, ~1.5–3k tris, two
> materials, `.glb`.

### group — `node-group.glb`  (resizable; build at ≈ 4 × 0.3 × 2.6, accent: ink)
> Model a **low translucent container platform / tier tray**: a very flat rounded slab that child
> nodes sit on, with a thin raised lip/border and one small **label-tab** notch on a long edge as the
> `Accent`. `Body` must be a **single translucent material** (the app sets opacity ~0.16–0.3). Built
> wide and shallow; the app rescales X/Z to fit children, so model a clean unit slab (≈ 4 wide × 2.6
> deep × 0.3 tall) that scales gracefully. ~0.5–1.5k tris, `.glb`.

### note — `node-note.glb`  (≈ 1.5 × 1.05 × 0.18, accent: paper)
> Model a **flat paper note tile / sticky**: a thin rounded rectangle with a subtle **folded corner**
> and two faint debossed text lines as the `Accent` relief (no actual text). Matte paper feel. Very
> thin: ~1.5 wide × 1.05 deep × 0.18 tall, base-centred, ~0.5–1.5k tris, two materials, `.glb`.

---

## Integration notes (for the implementing AI, later)

- Drop `.glb` files in `src/components/editor/assets/models/` (new) — or `public/` if loaded by URL.
- Load lazily with drei `useGLTF` inside a new shape component per kind (e.g. `GltfNode`), wrapped in
  `<Suspense>`; keep the procedural shape as the fallback while loading / if the file is missing.
- Register the model-backed shapes behind the existing **`SHAPES` registry**
  (`scene/nodes/shapes/index.ts`) so they're drop-in: `NodeMesh` already dispatches by
  `catalog[kind].shape`. Add a parallel "model" map keyed by kind and prefer it when present.
- **Runtime tinting:** on load, clone the materials and set the `Body` material `color` to
  `theme.nodeColors[role]` (and `note` → `theme.paper`), set selected emissive on `Accent`. This is
  why models ship with flat, named `Body`/`Accent` materials and no baked colour/AO.
- Keep `castShadow`/`receiveShadow` on the loaded meshes (the scene now uses real soft shadows).
- `useGLTF.preload('/models/node-*.glb')` for the kinds used by the current diagram.
- Verify each model's footprint matches the catalog `defaultSize`; if a model differs, scale it to
  fit the node's `width/depth/height` in `GltfNode` so labels/edges keep aligning.
