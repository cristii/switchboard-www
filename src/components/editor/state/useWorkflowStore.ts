// The editor's single source of runtime truth: nodes, edges, selection,
// viewport and undo/redo history. Renderer-agnostic (no three.js / DOM here) so
// the same store drives the R3F scene, the 2D chrome and Storybook.
// See isometric_workflow_editor_description.md §5.

import { create } from "zustand";
import { cloneSnapshot, pushPast, type HistorySnapshot } from "./history";
import { deserialize, serialize } from "./schema";
import type {
  Diagram,
  NodeKind,
  Selection,
  Viewport,
  WorkflowEdge,
  WorkflowNode,
} from "./types";

/** Next free numeric id for a prefix, derived from existing ids (`n7` → 8). */
function nextIdFrom(items: { id: string }[], prefix: string): number {
  let max = 0;
  for (const it of items) {
    const m = it.id.match(new RegExp(`^${prefix}(\\d+)$`));
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selection: Selection;
  viewport: Viewport;
  nextNodeId: number;
  nextEdgeId: number;
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  // --- history ---
  /** Snapshot the present before a discrete change (also called at gesture start). */
  beginInteraction: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // --- nodes ---
  addNode: (kind: NodeKind, partial?: Partial<WorkflowNode>) => string;
  updateNode: (id: string, patch: Partial<WorkflowNode>) => void;
  /** Position update during a drag — intentionally does NOT push history.
   *  Moving a group cascades the delta to its child nodes. */
  moveNode: (id: string, x: number, y: number) => void;
  /** Set/clear group membership (used by auto-membership on drag end). No history. */
  setParent: (id: string, parentId: string | null) => void;
  deleteNode: (id: string) => void;

  // --- edges ---
  addEdge: (source: string, target: string, partial?: Partial<WorkflowEdge>) => string | null;
  updateEdge: (id: string, patch: Partial<WorkflowEdge>) => void;
  deleteEdge: (id: string) => void;

  // --- selection ---
  select: (selection: Selection) => void;
  selectNode: (id: string) => void;
  selectEdge: (id: string) => void;
  clearSelection: () => void;

  // --- connecting (port-drag) ---
  /** Source node id while dragging a new connection from its out-handle. */
  connectSourceId: string | null;
  startConnect: (id: string) => void;
  endConnect: () => void;

  // --- viewport ---
  setViewport: (viewport: Partial<Viewport>) => void;

  // --- document ---
  /** Apply computed positions in one undo step; group moves cascade to children. */
  arrange: (positions: Record<string, { x: number; y: number }>) => void;
  loadDiagram: (diagram: Diagram, opts?: { resetHistory?: boolean }) => void;
  exportDiagram: () => Diagram;
  importDiagram: (input: string | unknown) => void;
  clear: () => void;
}

const DEFAULT_VIEWPORT: Viewport = { zoom: 38, target: [0, 0] };

export const useWorkflowStore = create<WorkflowState>()((set, get) => {
  /** Push the current document onto the undo stack and clear the redo stack. */
  const snapshot = () => {
    const { past, nodes, edges, selection, nextNodeId, nextEdgeId } = get();
    set({
      past: pushPast(past, { nodes, edges, selection, nextNodeId, nextEdgeId }),
      future: [],
    });
  };

  return {
    nodes: [],
    edges: [],
    selection: null,
    connectSourceId: null,
    viewport: DEFAULT_VIEWPORT,
    nextNodeId: 1,
    nextEdgeId: 1,
    past: [],
    future: [],

    beginInteraction: snapshot,

    undo: () => {
      const { past, future, nodes, edges, selection, nextNodeId, nextEdgeId } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      set({
        past: past.slice(0, -1),
        future: [...future, cloneSnapshot({ nodes, edges, selection, nextNodeId, nextEdgeId })],
        nodes: previous.nodes,
        edges: previous.edges,
        selection: previous.selection,
        nextNodeId: previous.nextNodeId,
        nextEdgeId: previous.nextEdgeId,
      });
    },

    redo: () => {
      const { past, future, nodes, edges, selection, nextNodeId, nextEdgeId } = get();
      if (future.length === 0) return;
      const next = future[future.length - 1];
      set({
        past: [...past, cloneSnapshot({ nodes, edges, selection, nextNodeId, nextEdgeId })],
        future: future.slice(0, -1),
        nodes: next.nodes,
        edges: next.edges,
        selection: next.selection,
        nextNodeId: next.nextNodeId,
        nextEdgeId: next.nextEdgeId,
      });
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    addNode: (kind, partial = {}) => {
      snapshot();
      const id = partial.id ?? `n${get().nextNodeId}`;
      const node: WorkflowNode = {
        id,
        kind,
        label: partial.label ?? defaultLabel(kind),
        x: partial.x ?? (Math.random() - 0.5) * 4,
        y: partial.y ?? (Math.random() - 0.5) * 4,
        ...partial,
      };
      set((s) => ({
        nodes: [...s.nodes, node],
        nextNodeId: partial.id ? s.nextNodeId : s.nextNodeId + 1,
        selection: { type: "node", id },
      }));
      return id;
    },

    updateNode: (id, patch) => {
      snapshot();
      set((s) => ({
        nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch, id: n.id } : n)),
      }));
    },

    moveNode: (id, x, y) => {
      set((s) => {
        const node = s.nodes.find((n) => n.id === id);
        if (!node) return {};
        const dx = x - node.x;
        const dy = y - node.y;
        const cascade = node.kind === "group";
        return {
          nodes: s.nodes.map((n) => {
            if (n.id === id) return { ...n, x, y };
            if (cascade && n.parentId === id) return { ...n, x: n.x + dx, y: n.y + dy };
            return n;
          }),
        };
      });
    },

    setParent: (id, parentId) => {
      set((s) => ({
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, parentId: parentId ?? undefined } : n,
        ),
      }));
    },

    deleteNode: (id) => {
      snapshot();
      set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
        selection: s.selection?.type === "node" && s.selection.id === id ? null : s.selection,
      }));
    },

    addEdge: (source, target, partial = {}) => {
      if (source === target) return null;
      const exists = get().edges.some((e) => e.source === source && e.target === target);
      if (exists) return null;
      snapshot();
      const id = partial.id ?? `e${get().nextEdgeId}`;
      const edge: WorkflowEdge = { id, source, target, routing: "orthogonal", ...partial };
      set((s) => ({
        edges: [...s.edges, edge],
        nextEdgeId: partial.id ? s.nextEdgeId : s.nextEdgeId + 1,
      }));
      return id;
    },

    updateEdge: (id, patch) => {
      snapshot();
      set((s) => ({
        edges: s.edges.map((e) => (e.id === id ? { ...e, ...patch, id: e.id } : e)),
      }));
    },

    deleteEdge: (id) => {
      snapshot();
      set((s) => ({
        edges: s.edges.filter((e) => e.id !== id),
        selection: s.selection?.type === "edge" && s.selection.id === id ? null : s.selection,
      }));
    },

    select: (selection) => set({ selection }),
    selectNode: (id) => set({ selection: { type: "node", id } }),
    selectEdge: (id) => set({ selection: { type: "edge", id } }),
    clearSelection: () => set({ selection: null }),

    startConnect: (id) => set({ connectSourceId: id }),
    endConnect: () => set({ connectSourceId: null }),

    setViewport: (viewport) => set((s) => ({ viewport: { ...s.viewport, ...viewport } })),

    arrange: (positions) => {
      snapshot();
      set((s) => {
        const deltas: Record<string, { dx: number; dy: number }> = {};
        for (const n of s.nodes) {
          const p = positions[n.id];
          if (p && n.kind === "group") deltas[n.id] = { dx: p.x - n.x, dy: p.y - n.y };
        }
        return {
          nodes: s.nodes.map((n) => {
            const p = positions[n.id];
            if (p) return { ...n, x: p.x, y: p.y };
            if (n.parentId && deltas[n.parentId]) {
              const d = deltas[n.parentId];
              return { ...n, x: n.x + d.dx, y: n.y + d.dy };
            }
            return n;
          }),
        };
      });
    },

    loadDiagram: (diagram, opts = {}) => {
      const { resetHistory = true } = opts;
      set((s) => ({
        nodes: diagram.nodes,
        edges: diagram.edges,
        viewport: diagram.viewport ?? DEFAULT_VIEWPORT,
        selection: null,
        nextNodeId: nextIdFrom(diagram.nodes, "n"),
        nextEdgeId: nextIdFrom(diagram.edges, "e"),
        past: resetHistory ? [] : s.past,
        future: resetHistory ? [] : s.future,
      }));
    },

    exportDiagram: () => {
      const { nodes, edges, viewport } = get();
      return serialize({ nodes, edges, viewport });
    },

    importDiagram: (input) => {
      get().loadDiagram(deserialize(input));
    },

    clear: () => set({ nodes: [], edges: [], selection: null, past: [], future: [] }),
  };
});

function defaultLabel(kind: NodeKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}
