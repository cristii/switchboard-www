# Adding a Node Type

A node **kind** is wired through three registries: the **catalog** (behaviour + defaults + which shape
and glyph), the **shape registry** (the 3D geometry), and the **glyph set** (the 2D palette/inspector
icon). Add a kind by touching those three spots; the palette, inspector, scene, schema and presets
pick it up automatically.

> Files: `catalog/nodeCatalog.ts`, `scene/nodes/shapes/*` (+ `shapes/index.ts`), `icons/NodeGlyph.tsx`,
> and the kind union in `state/types.ts`.

---

## 1. Add the kind to the union

`src/components/editor/state/types.ts`:

```ts
export type NodeKind =
  | "trigger" | "action" | "ai" | "logic" | "merge" | "database" | "queue"
  | "service" | "integration" | "output" | "group" | "note" | "text"
  | "cache"; // ← new
```

`NODE_CATALOG` is typed `Record<NodeKind, NodeCatalogEntry>`, so TypeScript now **requires** a catalog
entry for `cache` — that's your checklist.

## 2. Add a catalog entry

`catalog/nodeCatalog.ts` — each kind maps to a category, default label/description, a **shape id**, a
**colour role**, a **glyph**, default ports, and a default footprint:

```ts
cache: {
  kind: "cache",
  category: "Data",
  label: "Cache",
  description: "In-memory cache (Redis / Memcached).",
  shape: "cylinder",       // an existing ShapeId, or a new one (step 3)
  colorRole: "green",      // orange | green | violet | amber | ink (resolved per theme)
  glyph: "database",       // an existing GlyphName, or a new one (step 4)
  defaultPorts: [{ id: "in", side: "in" }, { id: "out", side: "out" }],
  defaultSize: { width: 1.25, depth: 1.25, height: 0.8 },
},
```

That's the minimum: reusing an existing shape + glyph, you're **done** — the kind appears in the
palette under its category, renders in the scene, and serialises.

## 3. (Optional) Add a new shape

If no existing shape fits, add one under `scene/nodes/shapes/`:

```tsx
// scene/nodes/shapes/RingNode.tsx
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import type { ShapeProps } from "./types";

export function RingNode({ width, height, color, emissive, emissiveIntensity, opacity, roughness, metalness }: ShapeProps) {
  return (
    <mesh position={[0, height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <torusGeometry args={[width / 2, height / 2, 16, 48]} />
      <NodeStandardMaterial
        color={color} emissive={emissive} emissiveIntensity={emissiveIntensity}
        opacity={opacity} roughness={roughness} metalness={metalness}
      />
    </mesh>
  );
}
```

Then register it + extend the `ShapeId` union:

```ts
// scene/nodes/shapes/types.ts
export type ShapeId = "box" | "cylinder" | /* … */ | "ring";
// scene/nodes/shapes/index.ts
export const SHAPES = { /* … */, ring: RingNode };
```

**Always** thread `opacity / roughness / metalness` through `NodeStandardMaterial` (don't hand-write
`<meshStandardMaterial>`) so theme transparency + material overrides keep working. The shape sits on
the ground (y grows up from 0); centre it on X/Z and rest its base at y = 0.

## 4. (Optional) Add a new glyph

`icons/NodeGlyph.tsx` — add to the `GlyphName` union and the `PATHS` map. Keep the brand line style
(24×24 box, 1.8 stroke, round caps, single colour via `currentColor`):

```tsx
| "ring"
// …
ring: <circle cx="12" cy="12" r="7" />,
```

---

## 5. Special node kinds (no new shape needed)

- **`text`** — a free 3D label (drei `Text`). Rendered by `TextNode` (not the shape registry); its
  catalog `shape` is a placeholder. Orientation/size/font come from `node.meta`/theme. See
  [`../labels/LABELS.md`](../labels/LABELS.md).
- **Model nodes** — *any* node renders a GLB instead of its procedural shape when
  `node.meta.model` is a URL. No new kind required. See [`BLENDER_MODELING.md`](./BLENDER_MODELING.md).
- **Device shapes** — built-in procedural devices (`monitor`, `laptop`, `phone`, `browser`,
  `serverStack`) live under the **Devices** palette category; their shapes are primitives in
  `scene/nodes/shapes/*` (theme-aware screens via `deviceTones.ts`). Add more the same way, or supply a
  GLB via `meta.model`.
- **Platform shapes** — a `group` node's `meta.platform` switches the container look: `"disc"` (soft
  round zone), `"hex"` (**double-layer hexagon** — solid bottom + lighter inset top), `"slab"`
  (**double-layer rounded square** — solid colour base + a floating near-white top plate; the layered
  "signal"-theme capability look), or `"base"` (a single solid-colour rounded **tray**, resizable via
  width/depth, that **groups several `nodeCard`s** sitting on top via `meta.elevation`). Omit for the
  default translucent rounded slab.
- **n8n-style `nodeCard`** — a white rounded slab with a FLAT 2D **icon texture** on its top face
  (`meta.icon` picks it; tinted to `node.color`). Rendered via `NodeCardNode`; icons come from
  `scene/nodes/shapes/iconTextures.ts` — a string map of inline Lucide SVGs rasterised to canvas
  textures (white-on-transparent so they tint). Add an icon by dropping its SVG markup in that map.
  Sit cards on a `base` group with `meta.elevation` = base height (see `catalog/presets/scoutFlow.ts`).
- **Step icons** — the `icon` kind renders a simple procedural 3D icon chosen by `meta.icon`
  (`bars` / `gear` / `check` / `mail` / `send` / `calendar` / `refresh` / `spark`); see `StepIcon`.
  Set `meta.elevation` (a +Y lift in world units) to seat an icon on a raised platform (e.g. the
  `slab` top plate). Build pillar scenes with `buildPillarDiagram(stages)`
  (`catalog/presets/pillarFlow.ts`).
- **Tinted label plate** — any label (a `text` node or an edge label) can override its pill fill with
  `meta.plateColor` (hex) while the text keeps its own colour — e.g. a pale tint of the stage colour
  for a "tag" pill. See `docs/labels/LABELS.md`.

---

## 6. Verify

- New kind shows in the palette (correct category/glyph) and adds to the canvas.
- It renders with the right shape + theme colour, casts a shadow, respects opacity, and exports/imports
  cleanly (round-trips through `schema.ts` — node-level fields are whitelisted there; add yours if you
  introduce a new top-level field).
- `npm run typecheck && npm run build && npm run build-storybook` green. Eyeball in Storybook
  `Editor/Nodes/Shapes` (the gallery maps every catalog kind) and `/isometric-editor`.
