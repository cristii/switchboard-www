// Builds a capabilities "pillar" as an isometric scene — the layered reference
// rendering: stacked stages, each a double-layer rounded-square SLAB (solid colour
// base + floating white top plate) with a 3D step-icon seated on the plate, a white
// "bubble" description pill below, and a pastel stage-tag on the left joined by a
// dashed link. Stages are joined by a thin colour flow line down the column. Data-
// driven from PillarStage[], so each /services pillar is one call. Pair with the
// `signal` theme (white plates, arrowless lines). See docs/IMPLEMENTATION_PLAN.md.
//
// NOTE: keep this module three-free — it is reachable from the /services Server
// Component, and importing three (e.g. via deviceTones.lighten) breaks the build.

import type { Diagram, WorkflowEdge, WorkflowNode } from "../../state/types";

export interface PillarStage {
  /** Left stage tag, e.g. "INPUT". */
  tag: string;
  /** StepIcon key (bars / gear / check / mail / send / calendar / refresh / spark). */
  icon: string;
  /** Stage colour (hex) — slab base, icon tint, tag text + flow line. */
  color: string;
  /** Description shown in the white pill below the icon. */
  label: string;
  /** Reserved for the right-hand info-card (deferred — not rendered yet). */
  cardTitle?: string;
  cardItems?: string[];
}

// In the (1,1,1) iso view: screen-down ∝ (x+y), screen-right ∝ (x−y). So stages
// stacked along the diagonal (t, t) read as a VERTICAL on-screen line, the tag sits
// LEFT at (c−TAG, c+TAG) (same screen row), and the description pill sits straight
// BELOW at (c+UB, c+UB).
const STEP = 6.0; // along (t,t) → vertical screen spacing between stages
const TAG = 3.6; // left stage-tag offset
const UB = 2.8; // description-pill drop below the icon
const SLAB_W = 4.4; // slab footprint
const SLAB_H = 0.55; // ONE layer height (flat); the slab = base + gap + top = 3 layers
const ICON_W = 2.2;
const ICON_H = 1.5;
// The slab's top surface (plate-top) sits at y = 4·layer (floor-gap + base + gap + top); seats the icon.
const ELEV = SLAB_H * 4;

/** Lerp a #rrggbb colour toward white by `amt` (0–1). Pure JS (no three) so this
 *  module stays importable from a Server Component. */
function paleTint(hex: string, amt = 0.82): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amt);
  const out = (mix((n >> 16) & 255) << 16) | (mix((n >> 8) & 255) << 8) | mix(n & 255);
  return "#" + out.toString(16).padStart(6, "0");
}

export function buildPillarDiagram(stages: PillarStage[]): Diagram {
  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];
  const n = stages.length;

  stages.forEach((s, i) => {
    const c = (i - (n - 1) / 2) * STEP;
    const g = `g${i}`;
    const ic = `ic${i}`;
    const tg = `tg${i}`;
    nodes.push(
      // double-layer rounded-square slab (solid base + white top plate)
      { id: g, kind: "group", label: "", x: c, y: c, width: SLAB_W, depth: SLAB_W, height: SLAB_H, color: s.color, meta: { platform: "slab" } },
      // 3D step-icon seated on the white plate (meta.elevation = plate-top)
      { id: ic, kind: "icon", label: "", x: c, y: c, width: ICON_W, depth: ICON_W, height: ICON_H, color: s.color, parentId: g, meta: { icon: s.icon, elevation: ELEV } },
      // white description pill straight below the icon
      { id: `lb${i}`, kind: "text", label: s.label, x: c + UB, y: c + UB, meta: { labelStyle: "bubble", orientation: "billboard" } },
      // pastel stage tag on the left — saturated colour text on a pale tinted plate
      { id: tg, kind: "text", label: s.tag, x: c - TAG, y: c + TAG, color: s.color, meta: { labelStyle: "bubble", orientation: "billboard", plateColor: paleTint(s.color), size: 0.46 } },
    );

    // dashed link from the tag to the slab
    edges.push({ id: `e-tag-${i}`, source: tg, target: ic, connector: "line", routing: "direct", style: "dashed", color: paleTint(s.color, 0.4), flow: "off" });
    // thin colour flow line down to the next stage (arrowless — theme arrowSize 0)
    if (i < n - 1) {
      edges.push({ id: `e-flow-${i}`, source: ic, target: `ic${i + 1}`, connector: "line", routing: "direct", color: s.color, flow: "off" });
    }
  });

  return { version: 1, nodes, edges };
}

/** The reference pillar — "Operations Assurance & Infrastructure" (Switchboard colours). */
export const opsPillarDiagram: Diagram = buildPillarDiagram([
  {
    tag: "INPUT",
    icon: "bars",
    color: "#7a4ad4",
    label: "Traffic surge hits",
    cardTitle: "Monitoring & Resilience",
    cardItems: ["Uptime monitoring", "Failover & retry", "High-volume queues"],
  },
  {
    tag: "PROCESSING",
    icon: "gear",
    color: "#f5821a",
    label: "Queued, monitored, retried",
    cardTitle: "Pipeline",
    cardItems: ["Queue management", "Retry logic", "Backoff strategy"],
  },
  {
    tag: "OUTPUT",
    icon: "check",
    color: "#2bac61",
    label: "Processed, nothing dropped",
    cardTitle: "Visibility & Insights",
    cardItems: ["Custom dashboards", "Reporting", "Real-time metrics"],
  },
]);

// The other three /services capability pillars. All use the same input → processing
// → output colour semantics (violet → orange → green), like the reference.

/** Pillar 01 — Intelligent Lead Routing & Sales. */
export const leadRoutingPillarDiagram: Diagram = buildPillarDiagram([
  { tag: "INPUT", icon: "mail", color: "#7a4ad4", label: "New enquiry arrives" },
  { tag: "PROCESSING", icon: "send", color: "#f5821a", label: "Alert sent & lead routed" },
  { tag: "OUTPUT", icon: "calendar", color: "#2bac61", label: "Job booked on calendar" },
]);

/** Pillar 02 — Back-Office & Operations. */
export const backOfficePillarDiagram: Diagram = buildPillarDiagram([
  { tag: "INPUT", icon: "check", color: "#7a4ad4", label: "Job marked complete" },
  { tag: "PROCESSING", icon: "refresh", color: "#f5821a", label: "Invoice + review fire" },
  { tag: "OUTPUT", icon: "bars", color: "#2bac61", label: "Paid & 5-star rated" },
]);

/** Pillar 03 — AI-Powered Customer Experience. */
export const customerExpPillarDiagram: Diagram = buildPillarDiagram([
  { tag: "INPUT", icon: "mail", color: "#7a4ad4", label: "Customer message arrives" },
  { tag: "PROCESSING", icon: "spark", color: "#f5821a", label: "AI reads & classifies it" },
  { tag: "OUTPUT", icon: "check", color: "#2bac61", label: "Answered or escalated" },
]);
