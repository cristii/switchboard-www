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

// In the (1,1,1) iso view: screen-down ∝ (x+y), screen-right ∝ (x−y). So stages
// stacked along the diagonal (t, t) read as a VERTICAL on-screen line (constant
// screen-x), the tag sits LEFT at (c−SIDE, c+SIDE), the info card RIGHT at
// (c+SIDE, c−SIDE), and the description sits straight BELOW at (c+UB, c+UB).
const STEP = 5.5; // along (t,t) → vertical screen spacing 2·STEP
const SIDE = 3.6; // tag / card horizontal offset (clears the hex + text)
const UB = 3.6; // description drop below the icon (clears the hex)

export function buildPillarDiagram(stages: PillarStage[]): Diagram {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const n = stages.length;

  stages.forEach((s, i) => {
    const c = (i - (n - 1) / 2) * STEP;
    const g = `g${i}`;
    const ic = `ic${i}`;
    nodes.push(
      { id: g, kind: "group", label: "", x: c, y: c, width: 5.4, depth: 5.4, color: s.color, meta: { platform: "hex" } },
      { id: ic, kind: "icon", label: "", x: c, y: c, width: 2.4, depth: 2.4, height: 1.8, color: s.color, parentId: g, meta: { icon: s.icon } },
      // description straight below the icon (plain billboard text)
      { id: `lb${i}`, kind: "text", label: s.label, x: c + UB, y: c + UB, meta: { labelStyle: "plain", orientation: "billboard" } },
      // left bubble stage tag
      { id: `tg${i}`, kind: "text", label: s.tag, x: c - SIDE, y: c + SIDE, color: s.color, meta: { labelStyle: "bubble", orientation: "billboard" } },
      // right info card — billboard (faces camera) so the body text stays legible
      // on small/mobile screens (uprightZ foreshortens it). Sized up for readability.
      { id: `cd${i}`, kind: "text", label: s.cardTitle, sublabel: s.cardItems.join("\n"), x: c + SIDE, y: c - SIDE, meta: { labelStyle: "info", orientation: "billboard", size: 0.72, sublabelSize: 0.5 } },
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
    color: "#6a4a8a",
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
