// /process page scenes (signal theme): dual-stacked-slab nodes with a floating
// billboard "bubble tag" in the Switchboard orange (#b45309). `processFlowDiagram`
// is the hero — a simple HORIZONTAL workflow (slabs laid out along the screen-x
// axis); `processStepDiagrams` are single-node scenes, one per step section.
// Three-free (reachable from the /process Server Component).

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

const ORANGE = "#b45309"; // slab + bubble-tag colour (the theme orange)
const SLAB_W = 4.0; // slab footprint
const SLAB_H = 0.5; // one layer height (slab = 4 layers tall incl. gaps)
const TAG_LIFT = 2.7; // bubble-tag float height (above the slab top at ~4·SLAB_H)

// In the (1,1,1) iso view a HORIZONTAL on-screen row lies along (t, −t): x+y is
// constant (same screen-y) while x−y varies (screen-x). So step i sits at (c, −c).
const STEP = 5.5;

function slab(id: string, x: number, y: number): WorkflowNode {
  return { id, kind: "group", label: "", x, y, width: SLAB_W, depth: SLAB_W, height: SLAB_H, color: ORANGE, meta: { platform: "slab" } };
}
function tag(id: string, x: number, y: number, label: string): WorkflowNode {
  return {
    id,
    kind: "text",
    label,
    x,
    y,
    color: "#ffffff",
    meta: { labelStyle: "bubble", orientation: "billboard", plateColor: ORANGE, elevation: TAG_LIFT, size: 0.5 },
  };
}

/** A single dual-slab node with one floating bubble tag — for a step section. */
export function buildProcessNode(label: string): Diagram {
  return { version: 1, nodes: [slab("g", 0, 0), tag("t", 0, 0, label)], edges: [] };
}

/** A horizontal workflow of dual-slab nodes, each with a floating bubble tag. */
export function buildProcessFlow(labels: string[]): Diagram {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const n = labels.length;
  labels.forEach((label, i) => {
    const c = (i - (n - 1) / 2) * STEP;
    const g = `g${i}`;
    nodes.push(slab(g, c, -c), tag(`t${i}`, c, -c, label));
    if (i < n - 1) {
      edges.push({ id: `e${i}`, source: g, target: `g${i + 1}`, connector: "line", routing: "direct", color: ORANGE, flow: "off" });
    }
  });
  return { version: 1, nodes, edges };
}

/** Hero overview: Discovery → Build → QA → Handoff → Retainer. */
export const processFlowDiagram: Diagram = buildProcessFlow([
  "Discovery",
  "Build & feedback",
  "QA & testing",
  "Handoff",
  "Retainer",
]);

/** Per-step single-node scenes (keyed by step number). */
export const processStepDiagrams: Record<string, Diagram> = {
  "01": buildProcessNode("Webhook"),
  "02": buildProcessNode("Switch"),
  "03": buildProcessNode("Error Trigger"),
  "04": buildProcessNode("Set & Push"),
  "05": buildProcessNode("Schedule"),
};
