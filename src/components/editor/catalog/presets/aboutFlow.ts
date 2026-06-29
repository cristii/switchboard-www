// /about "How I work" scene (signal theme): a HORIZONTAL workflow of dual-stacked
// slabs, each with a seated 3D icon (matching the section's SVG), a floating
// billboard title tag ABOVE (e.g. "01  Workflow audit") in the Switchboard orange,
// and a white description card BELOW. Three-free (reachable from the Server
// Component). Rendered on a transparent canvas so the section bg shows through.

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

const ORANGE = "#b45309";
const SLAB_W = 4.0;
const SLAB_H = 0.5;
const PLATE_TOP = SLAB_H * 4; // icon seat
const ICON_W = 1.8;
const ICON_H = 0.9;
const STEP = 7.5; // horizontal spacing along (t, −t)
const UP = 2.6; // title tag offset ABOVE the node (screen-up, along −(t,t))
const DOWN = 3.4; // description card offset BELOW the node (screen-down, along +(t,t))

export interface AboutStep {
  num: string;
  title: string;
  /** Description, pre-wrapped with \n into balanced lines for the card. */
  body: string;
  /** StepIcon key. */
  icon: string;
}

function nodesFor(prefix: string, x: number, y: number, step: AboutStep): WorkflowNode[] {
  const g = `${prefix}g`;
  return [
    { id: g, kind: "group", label: "", x, y, width: SLAB_W, depth: SLAB_W, height: SLAB_H, color: ORANGE, meta: { platform: "slab" } },
    { id: `${prefix}i`, kind: "icon", label: "", x, y, width: ICON_W, depth: ICON_W, height: ICON_H, color: ORANGE, parentId: g, meta: { icon: step.icon, elevation: PLATE_TOP } },
    // title tag floating above (orange, white bold)
    { id: `${prefix}t`, kind: "text", label: `${step.num}  ${step.title}`, x: x - UP, y: y - UP, color: "#ffffff", meta: { labelStyle: "bubble", orientation: "billboard", plateColor: ORANGE, size: 0.54, bold: true } },
    // white description card below
    { id: `${prefix}d`, kind: "text", label: step.body, x: x + DOWN, y: y + DOWN, meta: { labelStyle: "bubble", orientation: "billboard", size: 0.4 } },
  ];
}

export function buildAboutFlow(steps: AboutStep[]): Diagram {
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

/** "How I work" — audit → design → build/test → handoff. */
export const aboutFlowDiagram: Diagram = buildAboutFlow([
  {
    num: "01",
    title: "Workflow audit",
    body: "We map your current tools and\nfind exactly where time, leads\nand money are leaking out.",
    icon: "target",
  },
  {
    num: "02",
    title: "Architecture & design",
    body: "I design the pipeline before\nwriting a line — nodes, fallbacks\nand integrations, mapped end to end.",
    icon: "bulb",
  },
  {
    num: "03",
    title: "Build & test",
    body: "I build layer by layer, then feed it\nbad data and dropped connections\non purpose, so the live version\ndoesn't flinch.",
    icon: "refresh",
  },
  {
    num: "04",
    title: "Handoff & maintenance",
    body: "I hand you the keys with clear\ndocs, then keep it tuned as your\ntools and volume change.",
    icon: "people",
  },
]);
