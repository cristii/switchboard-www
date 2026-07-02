// Pure geometric metrics for nodes — footprint, elevation and the *visual* height
// span each kind occupies (platform-aware). Shared by the edge routing (rail
// heights + ground blockers), the camera fit (screen-space extents incl. height)
// and the labels layer. Three-free: catalog + state types only.

import { getNodeCatalogEntry } from "../../catalog/nodeCatalog";
import type { WorkflowNode } from "../../state/types";

export interface Footprint {
  hw: number;
  hd: number;
}

/** Half-extents of a node's ground footprint (catalog defaults applied). */
export function nodeFootprint(node: WorkflowNode): Footprint {
  const e = getNodeCatalogEntry(node.kind);
  return {
    hw: (node.width ?? e.defaultSize.width) / 2,
    hd: (node.depth ?? e.defaultSize.depth) / 2,
  };
}

/** Extra +Y lift from `meta.elevation` (e.g. a card seated on a floating tray). */
export function nodeElevation(node: WorkflowNode): number {
  const v = (node.meta as { elevation?: unknown } | undefined)?.elevation;
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

/** The node's own body height (overrides → catalog default). */
export function nodeBodyHeight(node: WorkflowNode): number {
  const e = getNodeCatalogEntry(node.kind);
  return node.height ?? e.defaultSize.height;
}

function groupPlatform(node: WorkflowNode): string | undefined {
  return (node.meta as { platform?: string } | undefined)?.platform;
}

/** World Y of the node's visual BOTTOM face (platforms float; see GroupContainer). */
export function nodeBottomY(node: WorkflowNode): number {
  const h = Math.max(0.16, nodeBodyHeight(node));
  if (node.kind === "group") {
    const p = groupPlatform(node);
    if (p === "base" || p === "slab") return h; // floats one layer off the ground
    return 0;
  }
  if (node.kind === "text") return nodeElevation(node);
  return nodeElevation(node);
}

/** World Y of the node's visual TOP face (platform stacking included). */
export function nodeTopY(node: WorkflowNode): number {
  const h = Math.max(0.16, nodeBodyHeight(node));
  if (node.kind === "group") {
    const p = groupPlatform(node);
    if (p === "base") return 2 * h; // floats at h, one layer thick
    if (p === "slab") return 4 * h; // two floating layers with air gaps
    if (p === "hex") return h * 0.92 + h * 0.55;
    return h;
  }
  if (node.kind === "text") {
    // Billboard tags hover at their lift; approximate the plate top for framing.
    const meta = (node.meta ?? {}) as { elevation?: unknown; size?: unknown };
    const size = typeof meta.size === "number" ? meta.size : 0.5;
    const lift = typeof meta.elevation === "number" ? meta.elevation : Math.max(size * 0.7, 0.4);
    return lift + size * 1.6;
  }
  return nodeElevation(node) + nodeBodyHeight(node);
}

/** World Y where an edge should attach on the node's SIDE (mid of the body). */
export function nodeAttachY(node: WorkflowNode): number {
  if (node.kind === "group") {
    return (nodeBottomY(node) + nodeTopY(node)) / 2;
  }
  const h = nodeBodyHeight(node);
  return Math.max(0.16, nodeElevation(node) + h * 0.5);
}

/** Whether this node's body blocks a ground-level edge rail (floating trays and
 *  cards leave a visible air gap that traces can pass under). */
export function blocksGroundRail(node: WorkflowNode, railY: number): boolean {
  if (node.kind === "text" || node.kind === "note") return false;
  return nodeBottomY(node) < railY + 0.18;
}
