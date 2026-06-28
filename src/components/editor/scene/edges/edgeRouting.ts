// Back-compat shim. The routing algorithms now live in the pluggable registry
// (scene/edges/routing/). This re-exports the RoutePoint type and a convenience
// getRoutePoints() that resolves the algorithm by id. New code should import from
// "./routing" directly. See docs/paths/PATH_ALGORITHMS.md.

import { getRoutingAlgorithm, type RouteOptions } from "./routing";
import type { EdgeRouting, WorkflowNode } from "../../state/types";

export type { RoutePoint } from "./routing";

/** Resolve the world-space points for an edge given its routing strategy id. */
export function getRoutePoints(
  routing: EdgeRouting | string | undefined,
  source: WorkflowNode,
  target: WorkflowNode,
  allNodes: WorkflowNode[],
  opts?: RouteOptions,
) {
  return getRoutingAlgorithm(routing)(source, target, allNodes, opts);
}
