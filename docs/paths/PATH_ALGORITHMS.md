# Path / Connection Algorithms

How edges decide the route between two nodes, how to **switch** the active algorithm, how to **author
a new one**, and how connectors are **rendered** (line / tube / ribbon-arrow). Applies to the editor
and the read-only preview (they share the scene).

---

## 1. Two independent choices

An edge's look is two separate decisions:

| Choice | What it controls | Set per-edge | Set per-theme (default) |
|---|---|---|---|
| **Routing** (`edge.routing`) | the *path* points between the nodes | `edge.routing` (id string) | `spec.edges.routing` |
| **Connector** (`edge.connector`) | how the path is *drawn* | `edge.connector` | `spec.edges.connector` |

Resolution order is **edge → theme**: `edge.routing ?? theme.routing`, `edge.connector ?? theme.connector`.

---

## 2. Routing registry

Algorithms live in `src/components/editor/scene/edges/routing/`:

```
routing/
  types.ts      RoutePoint, RouteOptions, RouteAlgorithm
  builtins.ts   orthogonalRoute · smoothRoute · directRoute
  index.ts      ROUTING_ALGORITHMS map + register/get/list helpers
```

The contract:

```ts
interface RoutePoint { x: number; y: number }   // ground plane; y → world Z
interface RouteOptions { laneIndex?: number }     // hints; ignore what you don't use
type RouteAlgorithm = (
  source: WorkflowNode,
  target: WorkflowNode,
  allNodes: WorkflowNode[],
  opts?: RouteOptions,
) => RoutePoint[];
```

Built-ins:
- **`orthogonal`** — A* over a coarse grid where node footprints are blocked → right-angled paths
  that avoid other nodes (straight fallback if no route).
- **`smooth`** — the orthogonal path resampled through a Catmull-Rom curve.
- **`direct`** — a straight line between node centres.

`OrthogonalEdge` resolves the path with `getRoutingAlgorithm(edge.routing ?? theme.routing)(source, target, nodes, { laneIndex })`.

### Switch the active algorithm
- **One edge:** set `edge.routing` (Inspector → *Routing*, or JSON `"routing": "smooth"`).
- **A whole theme/scene:** set `spec.edges.routing` (Theme manager, or the theme module).
- Any id not in the registry falls back to `orthogonal`.

---

## 3. Author a new routing algorithm

A routing algorithm is a pure function. Example — a single-bend "elbow" (horizontal then vertical):

```ts
// src/components/editor/scene/edges/routing/elbow.ts
import type { RouteAlgorithm } from "./types";

export const elbowRoute: RouteAlgorithm = (source, target) => [
  { x: source.x, y: source.y },
  { x: target.x, y: source.y }, // travel in X first…
  { x: target.x, y: target.y }, // …then in Z
];
```

Register it (id → function). Two options:

```ts
// A) add it to the built-in map (routing/index.ts):
import { elbowRoute } from "./elbow";
export const ROUTING_ALGORITHMS = { orthogonal, smooth, direct, elbow: elbowRoute };

// B) or register at app startup (e.g. in the editor entry), without editing the map:
import { registerRoutingAlgorithm } from "@/components/editor";
registerRoutingAlgorithm("elbow", elbowRoute);
```

Use it: `edge.routing = "elbow"`, or set it as the theme default. To surface it in the Inspector
dropdown, add an option there (the dropdown lists the three built-ins by default; `listRoutingIds()`
returns everything registered).

**Tips**
- Return **at least two points**; the first/last should sit at or near the node centres/edges.
- Keep it pure and fast — it runs in a `useMemo` keyed on endpoint positions; heavy work (e.g. A*)
  is fine but avoid per-frame allocation.
- `allNodes` is there for obstacle avoidance; ignore it for simple geometric routes.
- Coordinates are ground-plane `{x, y}` (y maps to world Z). The connector lifts them to the edge's
  working height.

---

## 4. Connector render styles

Renderers live in `scene/edges/connectors/` and are keyed by `ConnectorStyle`:

| `connector` | Renderer | Look |
|---|---|---|
| `line` | `LineConnector` | thin drei `<Line>` + cone arrowhead (supports dashed) |
| `tube` | `TubeConnector` | swept `TubeGeometry`, radius from line width, lit + cone arrow |
| `ribbonArrow` | `RibbonArrowConnector` | flat orange **isometric arrow ribbon** (the AWS look) |

All take the same `ConnectorProps` (`points`, `color`, `width`, `arrowSize`, `dashed?`, `onSelect?`).
Width + arrow size come from the theme (`spec.edges.width` / `widthSelected` / `arrowSize`) or a
per-edge override. Pick per edge in the Inspector → *Connector*, or per theme via `spec.edges.connector`.

### Author a new connector
Add a component implementing `ConnectorProps`, then register it:

```ts
// scene/edges/connectors/index.ts
export const CONNECTORS = { line: LineConnector, tube: TubeConnector, ribbonArrow: RibbonArrowConnector, dotted: DottedConnector };
```

…and extend the `ConnectorStyle` union in `state/types.ts`. `OrthogonalEdge` picks
`CONNECTORS[edge.connector ?? theme.connector]` and renders it, then overlays the flow pulse + label.

> The **ribbon-arrow** builds a custom flat `BufferGeometry` (two rails along the trimmed path + a
> triangular head) laid just above the ground, double-sided + unlit, so it reads as a crisp painted
> arrow in the isometric view. It's the reference for writing geometry-based connectors.

---

## 5. Verify

- An edge switches routing **and** connector live (Inspector) — orthogonal/smooth/direct × line/tube/ribbon.
- `ribbonArrow` reproduces the AWS flow arrows (try the **AWS web hosting** preset / `aws` theme).
- Many edges stay performant (routing is memoised per endpoint move).
- `npm run typecheck && npm run build && npm run build-storybook` stay green.
