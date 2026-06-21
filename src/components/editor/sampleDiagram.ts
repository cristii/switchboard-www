// A tiny seed diagram for the Scene MVP and Storybook. The full preset library
// (n8n + the Scouts/Leads architecture) arrives in P10; this is just enough to
// exercise the scene with a few node kinds and edges.

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
