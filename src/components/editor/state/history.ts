// Undo/redo support for the workflow store. Extracted from the prototype's
// inline snapshot logic (see isometric_workflow_editor_description.md §5).
// Snapshots are plain, deep-cloned copies of the mutable document slices.

import type { Selection, WorkflowEdge, WorkflowNode } from "./types";

/** A point-in-time copy of everything undo/redo restores. */
export interface HistorySnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selection: Selection;
  nextNodeId: number;
  nextEdgeId: number;
}

/** Cap the stack so long sessions don't grow memory without bound. */
export const MAX_HISTORY = 100;

/** Deep clone via JSON — the document is plain JSON data by design (types.ts),
 *  so this is safe and keeps snapshots fully detached from live state. */
export function cloneSnapshot(s: HistorySnapshot): HistorySnapshot {
  return {
    nodes: JSON.parse(JSON.stringify(s.nodes)) as WorkflowNode[],
    edges: JSON.parse(JSON.stringify(s.edges)) as WorkflowEdge[],
    selection: s.selection ? { ...s.selection } : null,
    nextNodeId: s.nextNodeId,
    nextEdgeId: s.nextEdgeId,
  };
}

/** Push the present onto `past`, clearing `future` (a new branch). */
export function pushPast(past: HistorySnapshot[], present: HistorySnapshot): HistorySnapshot[] {
  const next = [...past, cloneSnapshot(present)];
  if (next.length > MAX_HISTORY) next.shift();
  return next;
}
