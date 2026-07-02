// Routing registry: maps a routing id to a RouteAlgorithm. Edges/themes pick by
// id (edge.routing ?? theme.routing). Add a new algorithm = register a function
// here (or call registerRoutingAlgorithm at startup). See PATH_ALGORITHMS.md.

import { directRoute, orthogonalRoute, smoothRoute } from "./builtins";
import { isoRoute } from "./iso";
import type { RouteAlgorithm } from "./types";

export const ROUTING_ALGORITHMS: Record<string, RouteAlgorithm> = {
  iso: isoRoute,
  orthogonal: orthogonalRoute,
  smooth: smoothRoute,
  direct: directRoute,
};

/** Register (or override) a routing algorithm by id. */
export function registerRoutingAlgorithm(id: string, algorithm: RouteAlgorithm): void {
  ROUTING_ALGORITHMS[id] = algorithm;
}

/** Resolve an algorithm by id, falling back to orthogonal for unknown ids. */
export function getRoutingAlgorithm(id: string | undefined): RouteAlgorithm {
  return (id ? ROUTING_ALGORITHMS[id] : undefined) ?? ROUTING_ALGORITHMS.orthogonal;
}

/** Ids available in the registry (for the Inspector routing dropdown). */
export function listRoutingIds(): string[] {
  return Object.keys(ROUTING_ALGORITHMS);
}

export type { RouteAlgorithm, RoutePoint, RouteOptions } from "./types";
