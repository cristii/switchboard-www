// The pluggable routing contract. A routing algorithm turns a source/target node
// pair (+ all nodes, for obstacle avoidance) into an ordered list of ground-plane
// points the connector renders along. Register new algorithms by id in ./index.ts
// — see docs/paths/PATH_ALGORITHMS.md for a worked example.

import type { WorkflowNode } from "../../../state/types";

/** A 2D point on the ground plane; `y` maps to world Z in the scene. */
export interface RoutePoint {
  x: number;
  y: number;
}

/** Per-edge hints passed to the algorithm (extend freely; algorithms ignore
 *  fields they don't use). */
export interface RouteOptions {
  /** Index among edges sharing this source, for lane separation. */
  laneIndex?: number;
}

/** Pure function: (source, target, allNodes, opts) => ordered ground points. */
export type RouteAlgorithm = (
  source: WorkflowNode,
  target: WorkflowNode,
  allNodes: WorkflowNode[],
  opts?: RouteOptions,
) => RoutePoint[];
