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
  | "note";

/** Brand colour role a node maps onto (resolved to real colours per theme). */
export type NodeColorRole = "orange" | "green" | "violet" | "amber" | "ink";

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
  /** Icon key into the editor icon set. */
  icon?: string;
  /** Membership in a `group` container node. */
  parentId?: string;
  /** Explicit ports; otherwise default in/out are assumed. */
  ports?: Port[];
  meta?: Record<string, unknown>;
}

export type EdgeRouting = "orthogonal" | "smooth" | "direct";
export type EdgeStyle = "solid" | "dashed";
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
  /** @default "orthogonal" */
  routing?: EdgeRouting;
  /** @default "solid" — `dashed` reads as conditional/async. */
  style?: EdgeStyle;
  /** Animated data-flow pulse. @default "off" */
  flow?: EdgeFlow;
  color?: string;
}

/** Camera/viewport state (ground-plane target + orthographic zoom). */
export interface Viewport {
  zoom: number;
  target: [number, number];
}

export type EditorTheme = "light" | "dark";

/** What is currently selected in the editor (a node or an edge). */
export type Selection = { type: "node"; id: string } | { type: "edge"; id: string } | null;

/** The serialisable document. `version` enables forward migrations. */
export interface Diagram {
  version: 1;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: Viewport;
  theme?: EditorTheme;
}
