// Core, renderer-agnostic data model for the Isometric Workflow Editor.
// See isometric_workflow_editor_description.md §6. These types are the single
// source of truth shared by the zustand store, the schema (serialize/migrate),
// the scene (R3F), and the 2D chrome. Keep them free of any three.js / DOM types.

/** The kind of a workflow node. Drives appearance + behaviour via the catalog. */
export type NodeKind =
  | "trigger"
  | "action"
  | "ai"
  | "logic"
  | "merge"
  | "database"
  | "queue"
  | "service"
  | "integration"
  | "output"
  | "group"
  | "note"
  | "text"
  // device nodes (Phase 6)
  | "monitor"
  | "laptop"
  | "phone"
  | "browser"
  | "serverStack"
  // a procedural 3D step-icon (meta.icon picks which)
  | "icon"
  // an n8n-style white slab with a flat 2D icon texture on top (meta.icon picks which)
  | "nodeCard";

/** Brand colour role a node maps onto (resolved to real colours per theme). */
export type NodeColorRole = "orange" | "green" | "violet" | "amber" | "ink";

/** How a piece of 3D canvas text is oriented in the scene:
 *  - `billboard` — always faces the camera (legible from any angle);
 *  - `ground`    — lies flat on the ground plane, read from above ("facing the sky");
 *  - `uprightX`  — stands upright facing the +X plane;
 *  - `uprightZ`  — stands upright facing the +Z plane.
 *  See docs/themes/…theming_guide.md and the `text` node kind. */
export type TextOrientation = "billboard" | "ground" | "uprightX" | "uprightZ";

/** Container style for a 3D label ("tag"). `plain` is bare text; the others draw
 *  a backing plate so labels stay legible in dense diagrams:
 *  `bubble` (pill), `tips` (dark callout w/ pointer), `info` (card w/ title+body),
 *  `note` (paper tile). Combine with TextOrientation for the reference "tags". */
export type LabelStyle = "plain" | "bubble" | "tips" | "info" | "note";

/** A connection point on a node. */
export interface Port {
  id: string;
  side: "in" | "out";
  label?: string;
}

/** A node placed on the ground plane. `x`/`y` are ground coordinates
 *  (`y` maps to world Z in 3D — the scene keeps the "2.5D" plane flat). */
export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  /** Footprint + extrusion overrides; the catalog supplies defaults. */
  width?: number;
  depth?: number;
  height?: number;
  /** Explicit colour override; otherwise derived from the catalog colour role. */
  color?: string;
  /** Per-node material opacity (0–1); falls back to the theme's node opacity. */
  opacity?: number;
  /** Icon key into the editor icon set. */
  icon?: string;
  /** Membership in a `group` container node. */
  parentId?: string;
  /** Orientation of this node's 3D hovering label; falls back to the theme. */
  labelOrientation?: TextOrientation;
  /** Explicit ports; otherwise default in/out are assumed. */
  ports?: Port[];
  /** Per-node extras: 3D model URL (`model`), `labelColor`, `labelSize`,
   *  and (for `text` nodes) `orientation` / `size` / `font`. */
  meta?: Record<string, unknown>;
}

export type EdgeRouting = "iso" | "orthogonal" | "smooth" | "direct";
export type EdgeStyle = "solid" | "dashed";
/** How a connector is rendered between two nodes.
 *  `line` (thin/dashed via `style`), `tube`, `ribbonArrow` (flat painted arrow),
 *  `boldArrow` (thick line + large head), `cornerConnect` (dashed + L-bracket ends). */
export type ConnectorStyle = "line" | "tube" | "ribbonArrow" | "boldArrow" | "cornerConnect";
/** Animated "data flow" pulse travelling along an edge. */
export type EdgeFlow = "off" | "slow" | "normal" | "fast";

/** A directed connection between two nodes (optionally between named ports). */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
  label?: string;
  /** Routing-algorithm id; defaults to the theme's routing. Built-ins:
   *  "orthogonal" | "smooth" | "direct" (+ any registered algorithm). */
  routing?: EdgeRouting | string;
  /** @default "solid" — `dashed` reads as conditional/async. */
  style?: EdgeStyle;
  /** Connector render style; defaults to the theme's connector. */
  connector?: ConnectorStyle;
  /** Animated data-flow pulse. @default "off" */
  flow?: EdgeFlow;
  color?: string;
  /** When set, the edge's `label` is rendered as 3D in-canvas text with this
   *  orientation (instead of the flat DOM chip). See TextOrientation. */
  labelOrientation?: TextOrientation;
  /** Per-edge overrides (e.g. labelColor / labelSize). */
  meta?: Record<string, unknown>;
}

/** Camera/viewport state (ground-plane target + orthographic zoom). */
export interface Viewport {
  zoom: number;
  target: [number, number];
}

export type EditorTheme = "light" | "dark";

/** What is currently selected in the editor. Node selection is a SET (shift-click
 *  / marquee): `ids` holds every selected node and `id` is the primary one (last
 *  clicked — drives the Inspector). Single selection is `ids: [id]`. */
export type Selection =
  | { type: "node"; id: string; ids: string[] }
  | { type: "edge"; id: string }
  | null;

/** The serialisable document. `version` enables forward migrations. */
export interface Diagram {
  version: 1;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: Viewport;
  theme?: EditorTheme;
}
