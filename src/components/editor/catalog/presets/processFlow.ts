// /process page scenes (signal theme): dual-stacked-slab nodes, each with a seated
// 3D step-icon and a floating billboard "bubble tag" in the Switchboard orange
// (#b45309). `processFlowDiagram` is the hero — a simple HORIZONTAL workflow (slabs
// laid out along the screen-x axis); `processStepDiagrams` are single-node scenes,
// one per step section. Three-free (reachable from the /process Server Component).

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

const ORANGE = "#b45309"; // slab + icon + bubble-tag colour (the theme orange)
const SLAB_W = 4.0; // slab footprint
const SLAB_H = 0.5; // one layer height (slab top is at ~4·SLAB_H)
const PLATE_TOP = SLAB_H * 4; // where the icon sits
const ICON_W = 1.8;
const ICON_H = 0.9;
const TAG_LIFT = 3.0; // bubble-tag float height (clears the icon on top)

// In the (1,1,1) iso view a HORIZONTAL on-screen row lies along (t, −t): x+y is
// constant (same screen-y) while x−y varies (screen-x). So step i sits at (c, −c).
const STEP = 5.5;

export interface ProcessStep {
  label: string;
  /** StepIcon key (spark / gear / alert / send / calendar / …). */
  icon: string;
}

function nodesFor(prefix: string, x: number, y: number, step: ProcessStep): WorkflowNode[] {
  const g = `${prefix}g`;
  return [
    { id: g, kind: "group", label: "", x, y, width: SLAB_W, depth: SLAB_W, height: SLAB_H, color: ORANGE, meta: { platform: "slab" } },
    { id: `${prefix}i`, kind: "icon", label: "", x, y, width: ICON_W, depth: ICON_W, height: ICON_H, color: ORANGE, parentId: g, meta: { icon: step.icon, elevation: PLATE_TOP } },
    { id: `${prefix}t`, kind: "text", label: step.label, x, y, color: "#ffffff", meta: { labelStyle: "bubble", orientation: "billboard", plateColor: ORANGE, elevation: TAG_LIFT, size: 0.5 } },
  ];
}

/** A single dual-slab node (icon + floating bubble tag) — for a step section. */
export function buildProcessNode(step: ProcessStep): Diagram {
  return { version: 1, nodes: nodesFor("", 0, 0, step), edges: [] };
}

/** A horizontal workflow of dual-slab nodes, each with an icon + floating bubble tag. */
export function buildProcessFlow(steps: ProcessStep[]): Diagram {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const n = steps.length;
  steps.forEach((step, i) => {
    const c = (i - (n - 1) / 2) * STEP;
    nodes.push(...nodesFor(`${i}`, c, -c, step));
    if (i < n - 1) {
      edges.push({ id: `e${i}`, source: `${i}g`, target: `${i + 1}g`, connector: "line", routing: "direct", color: ORANGE, flow: "off" });
    }
  });
  return { version: 1, nodes, edges };
}

// Shared step icons (hero + sections use the same fit per stage).
const STEP_ICONS = ["spark", "gear", "alert", "send", "calendar"] as const;

/** Hero overview: Discovery → Build → QA → Handoff → Retainer. */
export const processFlowDiagram: Diagram = buildProcessFlow([
  { label: "Discovery", icon: STEP_ICONS[0] },
  { label: "Build & feedback", icon: STEP_ICONS[1] },
  { label: "QA & testing", icon: STEP_ICONS[2] },
  { label: "Handoff", icon: STEP_ICONS[3] },
  { label: "Retainer", icon: STEP_ICONS[4] },
]);

/** Per-step single-node scenes (keyed by step number), n8n node names. */
export const processStepDiagrams: Record<string, Diagram> = {
  "01": buildProcessNode({ label: "Webhook", icon: STEP_ICONS[0] }),
  "02": buildProcessNode({ label: "Switch", icon: STEP_ICONS[1] }),
  "03": buildProcessNode({ label: "Error Trigger", icon: STEP_ICONS[2] }),
  "04": buildProcessNode({ label: "Set & Push", icon: STEP_ICONS[3] }),
  "05": buildProcessNode({ label: "Schedule", icon: STEP_ICONS[4] }),
};
