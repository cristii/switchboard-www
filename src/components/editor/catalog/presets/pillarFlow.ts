// Builds a capabilities "pillar" as an isometric scene (the architecture-reference
// layout): 3 stacked stages, each a double-layer hex platform with a centered 3D
// step-icon, a billboard description below, a left bubble stage-tag, and a right
// upright info-card — joined by bold arrows + dashed corner-connect links. Data-
// driven from PillarStage[], so each /services pillar is one call. Pair with the
// `blueprint` theme. See docs/IMPLEMENTATION_PLAN.md Phase 7.

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

export interface PillarStage {
  /** Left bubble tag, e.g. "INPUT". */
  tag: string;
  /** StepIcon key (bars / gear / check / mail / send / calendar / refresh / spark). */
  icon: string;
  /** Stage colour (hex) — bottom hex layer + icon tint. */
  color: string;
  /** Description shown below the icon. */
  label: string;
  /** Right info-card heading + bullet items. */
  cardTitle: string;
  cardItems: string[];
}

/** Vertical spacing between stacked stages. */
const STEP = 7;
/** Side offset (along the screen-horizontal-keeping axis) for tag / card. */
const SIDE = 3.4;

export function buildPillarDiagram(stages: PillarStage[]): Diagram {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const n = stages.length;

  stages.forEach((s, i) => {
    const sy = (i - (n - 1) / 2) * STEP;
    const g = `g${i}`;
    const ic = `ic${i}`;
    nodes.push(
      { id: g, kind: "group", label: "", x: 0, y: sy, width: 4.8, depth: 4.8, color: s.color, meta: { platform: "hex" } },
      { id: ic, kind: "icon", label: "", x: 0, y: sy, color: s.color, parentId: g, meta: { icon: s.icon } },
      // description below the icon (plain billboard text)
      { id: `lb${i}`, kind: "text", label: s.label, x: 0, y: sy + 2.8, meta: { labelStyle: "plain", orientation: "billboard" } },
      // left bubble stage tag
      { id: `tg${i}`, kind: "text", label: s.tag, x: SIDE, y: sy - SIDE, color: s.color, meta: { labelStyle: "bubble", orientation: "billboard" } },
      // right upright info card
      { id: `cd${i}`, kind: "text", label: s.cardTitle, sublabel: s.cardItems.join("\n"), x: -SIDE, y: sy + SIDE, meta: { labelStyle: "info", orientation: "uprightZ" } },
    );
    // dashed corner-connect from the stage to its info card
    edges.push({ id: `e-card-${i}`, source: ic, target: `cd${i}`, connector: "cornerConnect", routing: "orthogonal", style: "dashed" });
    // bold arrow to the next stage
    if (i < n - 1) {
      edges.push({ id: `e-flow-${i}`, source: ic, target: `ic${i + 1}`, connector: "boldArrow", routing: "direct", flow: "normal" });
    }
  });

  return { version: 1, nodes, edges };
}

/** The reference pillar — "Operations Assurance & Infrastructure" (Switchboard colours). */
export const opsPillarDiagram: Diagram = buildPillarDiagram([
  {
    tag: "INPUT",
    icon: "bars",
    color: "#54605c",
    label: "Traffic surge hits",
    cardTitle: "Monitoring & Resilience",
    cardItems: ["Uptime monitoring", "Failover & retry", "High-volume queues"],
  },
  {
    tag: "PROCESSING",
    icon: "gear",
    color: "#b45309",
    label: "Queued, monitored, retried",
    cardTitle: "Pipeline",
    cardItems: ["Queue management", "Retry logic", "Alerting"],
  },
  {
    tag: "OUTPUT",
    icon: "check",
    color: "#3f7a4e",
    label: "Processed, nothing dropped",
    cardTitle: "Visibility & Insights",
    cardItems: ["Custom dashboards", "Reporting"],
  },
]);
