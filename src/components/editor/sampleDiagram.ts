// A tiny seed diagram for the Scene MVP and Storybook. The full preset library
// (n8n + the Scouts/Leads architecture) arrives in P10; this is just enough to
// exercise the scene with a few node kinds and edges.

import { CATALOG_LIST } from "./catalog/nodeCatalog";
import type { Diagram } from "./state/types";

export const mvpSampleDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "n1", kind: "trigger", label: "Webhook", sublabel: "POST /lead", x: -3.5, y: 0 },
    { id: "n2", kind: "action", label: "Enrich Lead", x: -0.5, y: -0.5 },
    { id: "n3", kind: "ai", label: "AI Triage", sublabel: "classify + score", x: 2.5, y: -1.5 },
    { id: "n4", kind: "database", label: "Supabase", x: 1, y: 2.5 },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2", routing: "orthogonal" },
    { id: "e2", source: "n2", target: "n3", routing: "orthogonal" },
    { id: "e3", source: "n2", target: "n4", routing: "orthogonal" },
  ],
};

/** A fan-out / fan-in flow exercising branching, merging, edge labels and a
 *  dashed (async) edge — a mini Scouts/Leads-style architecture slice. */
export const branchingSampleDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "t1", kind: "trigger", label: "Chat Trigger", sublabel: "Slack / Telegram", x: 0, y: -8 },
    { id: "p1", kind: "action", label: "Command Parser", x: 0, y: -5 },
    { id: "b1", kind: "logic", label: "Command Flows", x: -4.5, y: -2 },
    { id: "b2", kind: "ai", label: "AI Router", x: 0, y: -2 },
    { id: "b3", kind: "action", label: "Free Chat", x: 4.5, y: -2 },
    { id: "m1", kind: "merge", label: "Action Router", x: 0, y: 1 },
    { id: "e1", kind: "action", label: "Lead Engine", x: 0, y: 4 },
    { id: "d1", kind: "database", label: "Supabase", x: 0, y: 7 },
    { id: "o1", kind: "output", label: "Stage Automation", x: -4.5, y: 10 },
    { id: "o2", kind: "output", label: "Email", x: 0, y: 10 },
    { id: "o3", kind: "output", label: "Alerts", x: 4.5, y: 10 },
  ],
  edges: [
    { id: "x1", source: "t1", target: "p1" },
    { id: "x2", source: "p1", target: "b1" },
    { id: "x3", source: "p1", target: "b2", label: "intent" },
    { id: "x4", source: "p1", target: "b3" },
    { id: "x5", source: "b1", target: "m1" },
    { id: "x6", source: "b2", target: "m1" },
    { id: "x7", source: "b3", target: "m1" },
    { id: "x8", source: "m1", target: "e1" },
    { id: "x9", source: "e1", target: "d1" },
    { id: "x10", source: "d1", target: "o1" },
    { id: "x11", source: "d1", target: "o2" },
    { id: "x12", source: "d1", target: "o3", style: "dashed", label: "async" },
  ],
};

/** A group/container ("AI Processing Layer") holding three children, with a
 *  trigger feeding in and a database below — proves grouping + cascade-move. */
export const groupedSampleDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "t1", kind: "trigger", label: "New Lead", x: 0, y: -4 },
    { id: "g1", kind: "group", label: "AI Processing Layer", x: 0, y: 0, width: 6.4, depth: 2.6 },
    { id: "a1", kind: "ai", label: "Scam Detection", x: -2, y: 0, parentId: "g1" },
    { id: "a2", kind: "ai", label: "Lead Scoring", x: 0, y: 0, parentId: "g1" },
    { id: "a3", kind: "action", label: "Structuring", x: 2, y: 0, parentId: "g1" },
    { id: "d1", kind: "database", label: "Supabase", x: 0, y: 4.5 },
  ],
  edges: [
    { id: "g-x1", source: "t1", target: "a1" },
    { id: "g-x2", source: "t1", target: "a2" },
    { id: "g-x3", source: "t1", target: "a3" },
    { id: "g-x4", source: "a1", target: "d1" },
    { id: "g-x5", source: "a2", target: "d1" },
    { id: "g-x6", source: "a3", target: "d1" },
  ],
};

/** One node of every catalog kind, laid out in a grid — a shape gallery. */
export const allKindsDiagram: Diagram = {
  version: 1,
  nodes: CATALOG_LIST.map((entry, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    return {
      id: `k${i}`,
      kind: entry.kind,
      label: entry.label,
      x: (col - 1.5) * 3.4,
      y: (row - 1) * 3.4,
    };
  }),
  edges: [],
};
