// The node catalog: the authoritative registry that drives node rendering (via
// shape + colour role), the palette (via category + glyph + label), and node
// defaults (ports + size). Add a kind here — plus a shape (scene/nodes/shapes)
// and a glyph (icons/NodeGlyph) if new — and the rest of the editor picks it up.
// See description.md §7.

import type { GlyphName } from "../icons/NodeGlyph";
import type { ShapeId } from "../scene/nodes/shapes/types";
import type { NodeColorRole, NodeKind, Port } from "../state/types";

export type NodeCategory =
  | "Triggers"
  | "Logic"
  | "AI"
  | "Data"
  | "Services"
  | "Output"
  | "Layout";

export interface NodeCatalogEntry {
  kind: NodeKind;
  category: NodeCategory;
  /** Default label for new nodes of this kind. */
  label: string;
  description: string;
  shape: ShapeId;
  colorRole: NodeColorRole;
  glyph: GlyphName;
  defaultPorts: Port[];
  defaultSize: { width: number; depth: number; height: number };
}

const IN: Port = { id: "in", side: "in" };
const OUT: Port = { id: "out", side: "out" };
const IN_OUT: Port[] = [IN, OUT];

/** Ordered so the palette reads top-to-bottom in a sensible flow. */
export const NODE_CATALOG: Record<NodeKind, NodeCatalogEntry> = {
  trigger: {
    kind: "trigger",
    category: "Triggers",
    label: "Trigger",
    description: "Entry point — webhook, schedule or chat message.",
    shape: "capsule",
    colorRole: "orange",
    glyph: "zap",
    defaultPorts: [OUT],
    defaultSize: { width: 1.6, depth: 1.0, height: 0.6 },
  },
  action: {
    kind: "action",
    category: "Logic",
    label: "Action",
    description: "A generic app/HTTP step that does work.",
    shape: "box",
    colorRole: "ink",
    glyph: "play",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.3, depth: 1.3, height: 0.7 },
  },
  logic: {
    kind: "logic",
    category: "Logic",
    label: "Logic / Switch",
    description: "If / switch / filter — branches the flow (fan-out).",
    shape: "diamond",
    colorRole: "amber",
    glyph: "diamond",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.2, depth: 1.2, height: 1.0 },
  },
  merge: {
    kind: "merge",
    category: "Logic",
    label: "Merge",
    description: "Joins multiple branches back together (fan-in).",
    shape: "diamond",
    colorRole: "amber",
    glyph: "merge",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.2, depth: 1.2, height: 1.0 },
  },
  ai: {
    kind: "ai",
    category: "AI",
    label: "AI / Agent",
    description: "LLM, agent or intent router.",
    shape: "hexPrism",
    colorRole: "violet",
    glyph: "sparkles",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.35, depth: 1.35, height: 0.8 },
  },
  database: {
    kind: "database",
    category: "Data",
    label: "Database",
    description: "Datastore — Supabase, Airtable, Postgres…",
    shape: "cylinder",
    colorRole: "green",
    glyph: "database",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.25, depth: 1.25, height: 0.95 },
  },
  queue: {
    kind: "queue",
    category: "Data",
    label: "Queue",
    description: "Queue or message bus buffering work.",
    shape: "slab",
    colorRole: "green",
    glyph: "layers",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.5, depth: 1.1, height: 0.85 },
  },
  service: {
    kind: "service",
    category: "Services",
    label: "Service",
    description: "A microservice or server.",
    shape: "box",
    colorRole: "ink",
    glyph: "server",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.4, depth: 1.4, height: 0.8 },
  },
  integration: {
    kind: "integration",
    category: "Services",
    label: "Integration",
    description: "Third-party app — Slack, Telegram, Stripe…",
    shape: "box",
    colorRole: "orange",
    glyph: "hub",
    defaultPorts: IN_OUT,
    defaultSize: { width: 1.3, depth: 1.3, height: 0.7 },
  },
  output: {
    kind: "output",
    category: "Output",
    label: "Output",
    description: "Notification, email or dashboard.",
    shape: "capsule",
    colorRole: "orange",
    glyph: "send",
    defaultPorts: [IN],
    defaultSize: { width: 1.6, depth: 1.0, height: 0.6 },
  },
  group: {
    kind: "group",
    category: "Layout",
    label: "Group",
    description: "A container / layer. Becomes a translucent platform in P5.",
    shape: "box",
    colorRole: "ink",
    glyph: "frame",
    defaultPorts: [],
    defaultSize: { width: 1.9, depth: 1.3, height: 0.3 },
  },
  note: {
    kind: "note",
    category: "Layout",
    label: "Note",
    description: "An annotation tile.",
    shape: "paperTile",
    colorRole: "ink",
    glyph: "note",
    defaultPorts: [],
    defaultSize: { width: 1.5, depth: 1.05, height: 0.18 },
  },
};

export const CATALOG_LIST: NodeCatalogEntry[] = Object.values(NODE_CATALOG);

export const CATEGORIES: NodeCategory[] = [
  "Triggers",
  "Logic",
  "AI",
  "Data",
  "Services",
  "Output",
  "Layout",
];

export function getNodeCatalogEntry(kind: NodeKind): NodeCatalogEntry {
  return NODE_CATALOG[kind] ?? NODE_CATALOG.action;
}

/** Catalog entries grouped by category (in CATEGORIES order, empties dropped). */
export function catalogByCategory(): { category: NodeCategory; entries: NodeCatalogEntry[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    entries: CATALOG_LIST.filter((e) => e.category === category),
  })).filter((g) => g.entries.length > 0);
}
