# Labels & Tooltips (3D in-canvas)

Node names and edge labels render as **3D text hovering in the scene** by default — not DOM chips —
so the canvas stays uncluttered and labels live in the same isometric space as the diagram. A flat
**DOM mode** is kept as an option for later use. Applies to the editor and the read-only preview.

---

## 1. The model

| Layer | Renders | Where |
|---|---|---|
| **3D labels (default)** | `NodeLabels3D` (node names) + `OrthogonalEdge`'s 3D label (edge labels) | inside the Canvas (drei `Text` / `Billboard`) |
| **DOM chips (opt-in)** | `LabelsLayer` / `EdgeLabelsLayer`, positioned by the projectors | DOM overlay over the Canvas |

The active mode is **`spec.text.mode`** (`"3d"` default | `"dom"`). It's a per-theme (per-scene)
setting, so switching theme or toggling it in the **Theme manager → Labels & text → Label
presentation** flips every label at once. `text` nodes are always their own 3D text regardless of mode.

---

## 2. The four orientations

3D labels (node labels, edge labels, and `text` nodes) support four facings:

| Orientation | Faces | Reads as |
|---|---|---|
| `billboard` | always toward the camera | a floating tag (most legible) |
| `ground` | up (+Y) | painted flat on the ground ("facing the sky") |
| `uprightX` | the +X iso plane | a standing sign, left face in iso view |
| `uprightZ` | the +Z iso plane | a standing sign, right face in iso view |

Set the default per scene in the theme (`spec.text.orientation`); override per object:
- **Node:** Inspector → *Label facing* (writes `node.labelOrientation`).
- **Edge:** Inspector → *Label facing* (writes `edge.labelOrientation`).
- **Text node:** Inspector → *Text → Orientation* (writes `node.meta.orientation`).

---

## 3. Tag styles (label containers)

A label can wear a **container style** so it stays legible in dense diagrams (a bare text label on a
busy canvas overlaps illegibly — the plate fixes that):

| `labelStyle` | Looks like | Reference name |
|---|---|---|
| `plain` | bare text, no plate | Basic tag |
| `bubble` | rounded pill plate (paper) + ink text | Bubble tag |
| `tips` | dark (ink) callout plate + light text + pointer | Tips tag |
| `info` | light card + left-aligned title/body + pointer | Info tag |
| `note` | flat paper-tile card | Notes |

The 7 reference "tags" = **style × orientation** (e.g. *bubble tag isometric* = `bubble` + `ground`;
*notes* = `note` + `billboard`). Plates are theme-safe (high contrast in light and dark). Set the
default per scene (`spec.text.style`) or override per object (`node.meta.labelStyle` /
`edge.meta.labelStyle`); the **Inspector → Label style** select drives it.

## 4. Style scopes: global / per-scene / per-individual

| Scope | Style | Font | Colour | Size | Orientation |
|---|---|---|---|---|---|
| **Global / per-scene** (theme) | `spec.text.style` | `spec.text.font` | `spec.text.color` | `spec.text.size` | `spec.text.orientation` |
| **Per node** | `node.meta.labelStyle` | (theme) | `node.meta.labelColor` | `node.meta.labelSize` | `node.labelOrientation` |
| **Per edge** | `edge.meta.labelStyle` | (theme) | `edge.meta.labelColor` | `edge.meta.labelSize` | `edge.labelOrientation` |
| **Per `text` node** | `node.meta.labelStyle` | `node.meta.font` | `node.color` | `node.meta.size` | `node.meta.orientation` |

"Globally / per scene" = edit the theme (Theme manager → *Labels & text*, or the theme module). Each
theme is a scene, so this is the per-scene layer; committing a theme makes it the shared global default
(see [`../themes/CREATING_THEMES.md`](../themes/CREATING_THEMES.md)). Per-individual overrides win over
the theme.

**Global label controls** (theme `text`, applied to *every* label): `offset` `[x,y,z]` (lift text
higher / nudge it), `scale` (size multiplier), separate **label** vs **sublabel** colour / size / font
(`text.color`/`text.font`/`text.size` for the title; `text.sublabel.{color,size,font}` for the second
line), plus `style`, `orientation` and `mode`. All editable live in Theme manager → *Labels & text*.

### Component IA (Hybrid)
- **Things you place** (nodes, incl. **Text / Note / Tag** under the palette's **Annotate** group)
  live in **"Add node"**. The *Tag* quick-add seeds a `text` node with `bubble` style.
- **How a label or connector looks** (its render *style*) lives in the **Inspector** — *Label style*
  for any node's tooltip / text, and *Connection* for any edge (see
  [`../paths/PATH_ALGORITHMS.md`](../paths/PATH_ALGORITHMS.md)). This avoids a combinatorial palette
  and matches how edges are already edited.

> Font is an optional **font-file URL** (troika); omit it for the default sans. Set it once on the
> theme for a consistent look.

---

## 4. JSON examples

```jsonc
// A node whose label lies flat on the ground, in a custom grey, larger:
{ "id": "vpc", "kind": "group", "label": "VPC", "x": 0, "y": 0,
  "labelOrientation": "ground", "meta": { "labelColor": "#9aa0a6", "labelSize": 0.7 } }

// An edge label standing upright facing +Z:
{ "id": "e1", "source": "app", "target": "s3", "label": "store", "labelOrientation": "uprightZ" }

// Force the whole scene back to flat DOM chips (in the theme):
{ "config": { "theme": { "id": "x", "name": "X", "chromeBase": "light", "text": { "mode": "dom", "color": "#15211f", "opacity": 1, "size": 0.6, "orientation": "billboard" } /* …rest… */ } } }
```

---

## 5. Notes & verification

- **Visibility:** the `showLabels` master (preview `config.showLabels`) hides all labels (3D and DOM).
  In `dom` mode the host renders the chip overlays; in `3d` mode they're suppressed and the in-canvas
  text is used instead — no double labels.
- **Legibility:** `billboard` is the safest default; `ground`/`upright` are great for titles and zone
  labels but can foreshorten at grazing camera angles.
- **DOM mode** remains available for future needs (HTML interactivity, accessibility experiments) via
  `spec.text.mode = "dom"`.
- Verify in Storybook `Editor/Theming → AWS` (3D labels + an upright edge label) and the
  `/diagram-preview` playground; check `prefers-reduced-motion` (billboard tracking is per-frame but
  cheap). `typecheck` + `build` + `build-storybook` stay green.
