// /work "Scouts & Referral Workflow" scene — the supplied n8n workflow ("Referral
// Scout Chatbot Core") as an isometric diagram. Each n8n node is a white `nodeCard`
// (a slab with a flat 2D icon texture on top); cards are grouped onto colored `base`
// trays by layer (a base can hold several cards). Connectors follow the JSON
// `connections`. Three-free (reachable from the /work Server Component); pair with
// the `signal` theme on a transparent canvas.

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

// Direct world mapping: col (flow) → world x, row (branch) → world y. In the iso
// view both axes read as diagonals (the classic iso-architecture look), and cards
// grouped in one column lie along world-y so an axis-aligned `base` tray covers
// them neatly.
const SX = 4.6; // column (flow) spacing
const SY = 3.3; // row (branch) spacing
const CARD = 2.0; // card footprint
const CARD_H = 0.5;
const BASE_H = 0.4; // colored tray thickness; cards sit on top via meta.elevation
const TAG_DOWN = 1.4; // node-name tag offset below the card (screen-down)

interface Step {
  id: string;
  col: number;
  row: number;
  icon: string;
  name: string;
  color: string;
}

// Brand colours by layer (trigger=orange, control=violet, switch=amber, AI=violet,
// data=green, output=orange).
const ORANGE = "#b45309";
const VIOLET = "#6a4a8a";
const AMBER = "#b8800c";
const AI = "#7a4ad4";
const GREEN = "#3f7a4e";

const STEPS: Step[] = [
  { id: "webhook", col: 0, row: 0, icon: "webhook", name: "Webhook", color: ORANGE },
  { id: "parse", col: 1, row: 0, icon: "code", name: "Parse", color: VIOLET },
  { id: "router", col: 2, row: 0, icon: "gitBranch", name: "Router", color: AMBER },
  { id: "help", col: 3, row: -1, icon: "message", name: "Help", color: VIOLET },
  { id: "newlead", col: 3, row: 0, icon: "userPlus", name: "New lead", color: VIOLET },
  { id: "update", col: 3, row: 1, icon: "message", name: "Update", color: VIOLET },
  { id: "fallback", col: 3, row: 2, icon: "shuffle", name: "Fallback", color: AMBER },
  { id: "airouter", col: 4, row: 2, icon: "bot", name: "AI router", color: AI },
  { id: "aiextract", col: 5, row: 0, icon: "bot", name: "Extract", color: AI },
  { id: "aianalyze", col: 5, row: 1, icon: "bot", name: "Analyze", color: AI },
  { id: "save", col: 6, row: 0, icon: "database", name: "Save", color: GREEN },
  { id: "updateLead", col: 6, row: 1, icon: "database", name: "Update", color: GREEN },
  { id: "respond", col: 7, row: 0, icon: "reply", name: "Respond", color: ORANGE },
];

// Colored base trays (a base groups co-located cards by layer).
const BASES: { id: string; color: string; ids: string[] }[] = [
  { id: "bTrigger", color: ORANGE, ids: ["webhook"] },
  { id: "bParse", color: VIOLET, ids: ["parse"] },
  { id: "bRouter", color: AMBER, ids: ["router"] },
  { id: "bCommands", color: VIOLET, ids: ["help", "newlead", "update", "fallback"] },
  { id: "bAirouter", color: AI, ids: ["airouter"] },
  { id: "bExtract", color: AI, ids: ["aiextract", "aianalyze"] },
  { id: "bPersist", color: GREEN, ids: ["save", "updateLead"] },
  { id: "bOutput", color: ORANGE, ids: ["respond"] },
];

// Edges, straight from the n8n JSON `connections`.
const EDGES: [string, string][] = [
  ["webhook", "parse"],
  ["parse", "router"],
  ["router", "help"],
  ["router", "newlead"],
  ["router", "update"],
  ["router", "fallback"],
  ["fallback", "airouter"],
  ["airouter", "aiextract"],
  ["aiextract", "save"],
  ["aianalyze", "updateLead"],
  ["help", "respond"],
  ["newlead", "respond"],
  ["update", "respond"],
  ["save", "respond"],
  ["updateLead", "respond"],
];

function buildScoutFlow(): Diagram {
  const byId = new Map(STEPS.map((s) => [s.id, s]));
  // Centre the layout on the origin (cols 0–7 → centre 3.5, rows −1–2 → centre 0.5)
  // so the whole diagram stays inside the directional light's shadow frustum.
  const xy = (s: Step) => ({ x: (s.col - 3.5) * SX, y: (s.row - 0.5) * SY });
  const nodes: WorkflowNode[] = [];

  // Bases first (drawn under the cards).
  for (const b of BASES) {
    const ps = b.ids.map((id) => xy(byId.get(id)!));
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = CARD / 2 + 0.7;
    nodes.push({
      id: b.id,
      kind: "group",
      label: "",
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      width: maxX - minX + pad * 2,
      depth: maxY - minY + pad * 2,
      height: BASE_H,
      color: b.color,
      meta: { platform: "base" },
    });
  }

  // Cards + their name tags.
  for (const b of BASES) {
    for (const id of b.ids) {
      const s = byId.get(id)!;
      const { x, y } = xy(s);
      nodes.push({
        id,
        kind: "nodeCard",
        label: "",
        x,
        y,
        width: CARD,
        depth: CARD,
        height: CARD_H,
        color: s.color,
        parentId: b.id,
        // 2·BASE_H = the floated base's top surface (see GroupContainer "base").
        meta: { icon: s.icon, elevation: BASE_H * 2 },
      });
      nodes.push({
        id: `${id}_t`,
        kind: "text",
        label: s.name,
        x: x + TAG_DOWN,
        y: y + TAG_DOWN,
        meta: { labelStyle: "bubble", orientation: "billboard", size: 0.36, bold: true },
      });
    }
  }

  const edges: WorkflowEdge[] = EDGES.map(([source, target], i) => ({
    id: `e${i}`,
    source,
    target,
    connector: "line",
    routing: "direct",
    color: "#8a958f",
    flow: "off",
  }));

  return { version: 1, nodes, edges };
}

/** The "Referral Scout Chatbot Core" n8n workflow as an isometric scene. */
export const scoutFlowDiagram: Diagram = buildScoutFlow();
