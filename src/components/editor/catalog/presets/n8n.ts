// A representative n8n-style workflow: webhook trigger → set fields → IF, with
// a true branch (HTTP → Slack) and a false branch (no-op). Demonstrates the
// quick linear+branching shape n8n flows usually take.

import type { Diagram } from "../../state/types";

export const n8nSampleDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "t", kind: "trigger", label: "Webhook", sublabel: "POST /lead", x: 0, y: -6 },
    { id: "s", kind: "action", label: "Edit Fields", sublabel: "normalise", x: 0, y: -3 },
    { id: "f", kind: "logic", label: "IF", sublabel: "qualified?", x: 0, y: 0 },
    { id: "h", kind: "action", label: "HTTP Request", x: -3.5, y: 3 },
    { id: "sl", kind: "integration", label: "Slack", sublabel: "#leads", x: -3.5, y: 6 },
    { id: "n", kind: "output", label: "No-op", x: 3.5, y: 3 },
  ],
  edges: [
    { id: "e1", source: "t", target: "s", flow: "normal" },
    { id: "e2", source: "s", target: "f", flow: "normal" },
    { id: "e3", source: "f", target: "h", label: "true", flow: "normal" },
    { id: "e4", source: "f", target: "n", label: "false", style: "dashed" },
    { id: "e5", source: "h", target: "sl" },
  ],
};
