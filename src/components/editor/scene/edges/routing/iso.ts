// "iso" routing — the premium isometric elbow connector. Edges leave a node's
// SIDE (a port on the footprint edge facing the peer) at the body's mid-height,
// step out a short nub, drop to a ground rail, run an axis-aligned path with
// rounded corners (both world axes read as the two iso diagonals on screen),
// then rise and plug into the target's side. Because the rail hugs the ground
// and floating trays/cards leave an air gap, traces pass cleanly UNDER platforms
// and never cut through geometry. Edges sharing a source/target spread along the
// side (lanes) so fan-out/fan-in stays readable. Obstacles that do sit on the
// ground are avoided (fast segment tests, A* fallback). See PATH_ALGORITHMS.md.

import {
  blocksGroundRail,
  nodeAttachY,
  nodeFootprint,
} from "../../nodes/nodeMetrics";
import { aStar, createGrid, toCell, cellCenter } from "./builtins";
import type { WorkflowNode } from "../../../state/types";
import type { RouteAlgorithm, RouteOptions, RoutePoint } from "./types";

const RAIL_Y = 0.05; // ground-rail height
const NUB = 0.32; // horizontal step out of the node side at attach height
const CORNER_R = 0.4; // elbow fillet radius
const LANE_STEP = 0.6; // spread between parallel edges along a node side
const CLEAR = 0.32; // obstacle inflation for the segment tests

type Side = "x+" | "x-" | "y+" | "y-";

const sideOf = (dx: number, dy: number): Side =>
  Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? "x+" : "x-") : dy >= 0 ? "y+" : "y-";

/** Centered lane offset: index i of count c → …, −1, 0, +1, … times LANE_STEP. */
function laneOffset(i: number | undefined, c: number | undefined, span: number): number {
  const count = Math.max(1, c ?? 1);
  const idx = Math.min(count - 1, Math.max(0, i ?? 0));
  const raw = (idx - (count - 1) / 2) * LANE_STEP;
  // Keep anchors on the side face (leave room for the corner radius).
  const lim = Math.max(0, span - CORNER_R - 0.12);
  return Math.max(-lim, Math.min(lim, raw));
}

/** Anchor on the node's `side` face, slid along it by `slide`. */
function anchorOnSide(node: WorkflowNode, side: Side, slide: number): RoutePoint {
  const { hw, hd } = nodeFootprint(node);
  switch (side) {
    case "x+":
      return { x: node.x + hw, y: node.y + slide };
    case "x-":
      return { x: node.x - hw, y: node.y + slide };
    case "y+":
      return { x: node.x + slide, y: node.y + hd };
    default:
      return { x: node.x + slide, y: node.y - hd };
  }
}

const stepOut = (p: RoutePoint, side: Side, by: number): RoutePoint => {
  switch (side) {
    case "x+":
      return { x: p.x + by, y: p.y };
    case "x-":
      return { x: p.x - by, y: p.y };
    case "y+":
      return { x: p.x, y: p.y + by };
    default:
      return { x: p.x, y: p.y - by };
  }
};

/** Nub length that clears the node's parent platform (a card seated on a tray
 *  must step past the tray edge before dropping, or the drop pierces the slab). */
function nubLength(node: WorkflowNode, anchor: RoutePoint, side: Side, all: WorkflowNode[]): number {
  if (!node.parentId) return NUB;
  const parent = all.find((n) => n.id === node.parentId);
  if (!parent) return NUB;
  const { hw, hd } = nodeFootprint(parent);
  let dist: number;
  switch (side) {
    case "x+":
      dist = parent.x + hw - anchor.x;
      break;
    case "x-":
      dist = anchor.x - (parent.x - hw);
      break;
    case "y+":
      dist = parent.y + hd - anchor.y;
      break;
    default:
      dist = anchor.y - (parent.y - hd);
  }
  return Math.max(NUB, dist + 0.3);
}

/** Does the axis-aligned segment a→b cross any blocker's inflated footprint? */
function segBlocked(a: RoutePoint, b: RoutePoint, blockers: WorkflowNode[]): boolean {
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);
  for (const n of blockers) {
    const { hw, hd } = nodeFootprint(n);
    if (
      minX <= n.x + hw + CLEAR &&
      maxX >= n.x - hw - CLEAR &&
      minY <= n.y + hd + CLEAR &&
      maxY >= n.y - hd - CLEAR
    ) {
      return true;
    }
  }
  return false;
}

function pathBlocked(pts: RoutePoint[], blockers: WorkflowNode[]): boolean {
  for (let i = 0; i < pts.length - 1; i++) {
    if (segBlocked(pts[i], pts[i + 1], blockers)) return true;
  }
  return false;
}

/** Drop repeated + collinear points from an axis-aligned polyline. */
function simplify(pts: RoutePoint[]): RoutePoint[] {
  const out: RoutePoint[] = [];
  for (const p of pts) {
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev.x - p.x) < 1e-4 && Math.abs(prev.y - p.y) < 1e-4) continue;
    const prev2 = out[out.length - 2];
    if (
      prev &&
      prev2 &&
      ((Math.abs(prev2.x - prev.x) < 1e-4 && Math.abs(prev.x - p.x) < 1e-4) ||
        (Math.abs(prev2.y - prev.y) < 1e-4 && Math.abs(prev.y - p.y) < 1e-4))
    ) {
      out[out.length - 1] = p; // extend the straight run
      continue;
    }
    out.push(p);
  }
  return out;
}

/** Replace right-angle corners with sampled quarter-arc fillets. */
function roundCorners(pts: RoutePoint[], radius: number): RoutePoint[] {
  if (pts.length < 3) return pts;
  const out: RoutePoint[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    const inLen = Math.hypot(p.x - a.x, p.y - a.y);
    const outLen = Math.hypot(b.x - p.x, b.y - p.y);
    const r = Math.min(radius, inLen * 0.5, outLen * 0.5);
    if (r < 0.05) {
      out.push(p);
      continue;
    }
    const inDir = { x: (p.x - a.x) / inLen, y: (p.y - a.y) / inLen };
    const outDir = { x: (b.x - p.x) / outLen, y: (b.y - p.y) / outLen };
    const start = { x: p.x - inDir.x * r, y: p.y - inDir.y * r };
    const end = { x: p.x + outDir.x * r, y: p.y + outDir.y * r };
    // Quadratic-bezier fillet through the corner (visually a clean quarter-round).
    const SAMPLES = 6;
    for (let k = 0; k <= SAMPLES; k++) {
      const t = k / SAMPLES;
      const mt = 1 - t;
      out.push({
        x: mt * mt * start.x + 2 * mt * t * p.x + t * t * end.x,
        y: mt * mt * start.y + 2 * mt * t * p.y + t * t * end.y,
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Candidate Manhattan paths between the two stub points, in preference order. */
function manhattanCandidates(a: RoutePoint, b: RoutePoint, aSide: Side, bSide: Side): RoutePoint[][] {
  const viaX = [a, { x: b.x, y: a.y }, b]; // run X first
  const viaY = [a, { x: a.x, y: b.y }, b]; // run Y first
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const zX = [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b]; // X, jog, X
  const zY = [a, { x: a.x, y: midY }, { x: b.x, y: midY }, b]; // Y, jog, Y
  // Leaving along the exit-side axis first reads best.
  const xFirst = aSide === "x+" || aSide === "x-";
  const ordered = xFirst ? [viaX, zX, viaY, zY] : [viaY, zY, viaX, zX];
  // When the sides face each other head-on, the jogged Z-path looks cleaner
  // than an L that hugs one node.
  if ((aSide === "x+" && bSide === "x-") || (aSide === "x-" && bSide === "x+")) {
    return [zX, viaX, zY, viaY];
  }
  if ((aSide === "y+" && bSide === "y-") || (aSide === "y-" && bSide === "y+")) {
    return [zY, viaY, zX, viaX];
  }
  return ordered;
}

export const isoRoute: RouteAlgorithm = (source, target, allNodes, opts?: RouteOptions) => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const sSide = sideOf(dx, dy);
  const tSide = sideOf(-dx, -dy);

  const sFoot = nodeFootprint(source);
  const tFoot = nodeFootprint(target);
  const sSpan = sSide === "x+" || sSide === "x-" ? sFoot.hd : sFoot.hw;
  const tSpan = tSide === "x+" || tSide === "x-" ? tFoot.hd : tFoot.hw;

  const A = anchorOnSide(source, sSide, laneOffset(opts?.laneIndex, opts?.laneCount, sSpan));
  const B = anchorOnSide(target, tSide, laneOffset(opts?.laneInIndex, opts?.laneInCount, tSpan));
  const A2 = stepOut(A, sSide, nubLength(source, A, sSide, allNodes));
  const B2 = stepOut(B, tSide, nubLength(target, B, tSide, allNodes));

  const ay = nodeAttachY(source);
  const by = nodeAttachY(target);

  // Degenerate: overlapping footprints → a simple straight run at attach height.
  if (Math.hypot(dx, dy) < (sFoot.hw + tFoot.hw) * 0.6) {
    return [
      { ...A, h: ay },
      { ...B, h: by },
    ];
  }

  const blockers = allNodes.filter(
    (n) => n.id !== source.id && n.id !== target.id && blocksGroundRail(n, RAIL_Y),
  );

  let ground: RoutePoint[] | null = null;
  for (const cand of manhattanCandidates(A2, B2, sSide, tSide)) {
    if (!pathBlocked(cand, blockers)) {
      ground = cand;
      break;
    }
  }
  if (!ground) {
    // A* over the blocked grid (coarse), then simplify to corners.
    const grid = createGrid(blockers);
    const cells = aStar(grid, toCell(A2.x, A2.y), toCell(B2.x, B2.y));
    ground = cells && cells.length > 0 ? simplify([A2, ...cells.map(cellCenter), B2]) : [A2, B2];
  }

  const rounded = roundCorners(simplify(ground), CORNER_R).map((p) => ({ ...p, h: RAIL_Y }));

  return [
    { ...A, h: ay }, // side port
    { ...A2, h: ay }, // nub out
    { ...A2, h: RAIL_Y }, // drop to the rail
    ...rounded,
    { ...B2, h: RAIL_Y },
    { ...B2, h: by }, // rise at the target
    { ...B, h: by }, // plug into the side (arrowhead here)
  ];
};
