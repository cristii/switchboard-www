// Layered ("ranked") auto-arrange: rank = longest path from the roots, one row
// per rank, spread horizontally and centred. Operates on top-level nodes
// (grouped children ride along with their group when applied). Best for flat /
// branching graphs; pre-laid-out presets are typically left as-is.

import type { WorkflowEdge, WorkflowNode } from "../../state/types";

const Y_SPACING = 3.2;
const X_SPACING = 4.4;

export function layeredLayout(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): Record<string, { x: number; y: number }> {
  const top = nodes.filter((n) => !n.parentId);
  const ids = new Set(top.map((n) => n.id));
  const e = edges.filter((x) => ids.has(x.source) && ids.has(x.target));

  const adj: Record<string, string[]> = {};
  const indeg: Record<string, number> = {};
  for (const n of top) {
    adj[n.id] = [];
    indeg[n.id] = 0;
  }
  for (const x of e) {
    adj[x.source].push(x.target);
    indeg[x.target] += 1;
  }

  // Longest-path rank via Kahn's algorithm (cycles keep rank 0).
  const rank: Record<string, number> = {};
  for (const n of top) rank[n.id] = 0;
  const queue = top.filter((n) => indeg[n.id] === 0).map((n) => n.id);
  while (queue.length) {
    const u = queue.shift() as string;
    for (const v of adj[u]) {
      rank[v] = Math.max(rank[v], rank[u] + 1);
      if (--indeg[v] === 0) queue.push(v);
    }
  }

  const byRank: Record<number, string[]> = {};
  for (const n of top) (byRank[rank[n.id]] ??= []).push(n.id);
  const ranks = Object.keys(byRank)
    .map(Number)
    .sort((a, b) => a - b);
  const maxRank = ranks.length ? ranks[ranks.length - 1] : 0;

  const positions: Record<string, { x: number; y: number }> = {};
  for (const r of ranks) {
    const row = byRank[r];
    const startX = -((row.length - 1) * X_SPACING) / 2;
    row.forEach((id, i) => {
      positions[id] = { x: startX + i * X_SPACING, y: r * Y_SPACING - (maxRank * Y_SPACING) / 2 };
    });
  }
  return positions;
}
