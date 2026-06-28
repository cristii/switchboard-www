// Shared contract for connector renderers. A connector draws the visible
// geometry of an edge along a routed path (+ an arrowhead). The flow pulse and
// 3D label are handled by OrthogonalEdge, so connectors only render the path.

import type { ThreeEvent } from "@react-three/fiber";
import type * as THREE from "three";

export interface ConnectorProps {
  /** Routed path points (already lifted to the edge's working height). */
  points: THREE.Vector3[];
  color: string;
  /** Theme/edge line width (px for Line; scaled to a radius/half-width otherwise). */
  width: number;
  /** Arrowhead size multiplier (1 = default). */
  arrowSize: number;
  dashed?: boolean;
  onSelect?: (e: ThreeEvent<MouseEvent>) => void;
}
