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

/** Node selection helper: `ids` is the set, `id` the primary (Inspector focus). */
function nodeSel(ids: string[], primary?: string): Selection {
  if (ids.length === 0) return null;
  const id = primary && ids.includes(primary) ? primary : ids[ids.length - 1];
  return { type: "node", id, ids };
}

const SNAP_KEY = "sb-editor-snap";

function readSnapPref(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SNAP_KEY) !== "off";
  } catch {
    return true;
  }
}

/** A free spot near (x0,y0): step outward until no other node centre is within r. */
export function findFreeSpot(nodes: WorkflowNode[], x0: number, y0: number): { x: number; y: number } {
  const occupied = (x: number, y: number) =>
    nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 1.6);
  if (!occupied(x0, y0)) return { x: x0, y: y0 };
  for (let ring = 1; ring <= 8; ring++) {
    const d = ring * 1.8;
    for (const [dx, dy] of [
      [d, 0],
      [0, d],
      [-d, 0],
      [0, -d],
      [d, d],
      [-d, d],
      [d, -d],
      [-d, -d],
    ]) {
      if (!occupied(x0 + dx, y0 + dy)) return { x: x0 + dx, y: y0 + dy };
    }
  }
  return { x: x0, y: y0 };
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
  /** Select a node; `additive` (shift-click) toggles it within the current set. */
  selectNode: (id: string, additive?: boolean) => void;
  /** Replace the node selection with a set (marquee result). */
  selectNodes: (ids: string[], primary?: string) => void;
  selectAll: () => void;
  selectEdge: (id: string) => void;
  clearSelection: () => void;
  /** Delete everything selected (nodes + their edges, or the selected edge). */
  deleteSelection: () => void;

  // --- clipboard (in-editor) ---
  clipboard: { nodes: WorkflowNode[]; edges: WorkflowEdge[] } | null;
  /** Copy the selected nodes + the edges between them. */
  copySelection: () => void;
  /** Paste the clipboard slightly offset; selects the pasted nodes. */
  pasteClipboard: () => void;
  /** Duplicate the selected nodes in place (+ small offset); selects the clones.
   *  Returns old→new id mapping (used by alt-drag clone). */
  duplicateSelection: () => Record<string, string> | null;

  // --- move / arrange selection ---
  /** Translate every selected node by (dx,dy) as ONE undo step (arrow nudge). */
  nudgeSelection: (dx: number, dy: number) => void;
  alignSelection: (mode: "left" | "centerX" | "right" | "top" | "centerY" | "bottom") => void;
  distributeSelection: (axis: "x" | "y") => void;

  // --- snapping + smart guides ---
  /** Snap dragged/pasted nodes to the 0.5 grid (persisted preference). */
  snap: boolean;
  setSnap: (on: boolean) => void;
  /** Live alignment-guide lines while dragging (world x / z), null when idle. */
  guides: { x: number | null; z: number | null };
  setGuides: (guides: { x: number | null; z: number | null }) => void;

  // --- inline label editing (double-click a node) ---
  labelEditor: { nodeId: string; x: number; y: number } | null;
  openLabelEditor: (nodeId: string, x: number, y: number) => void;
  closeLabelEditor: () => void;

  // --- connecting (port-drag) ---
  /** Source node id while dragging a new connection from its out-handle. */
  connectSourceId: string | null;
  startConnect: (id: string) => void;
  endConnect: () => void;

  // --- linking (click-to-link: inspector / toolbar / context menu) ---
  /** When true, clicking nodes links them instead of selecting/dragging. */
  linkMode: boolean;
  /** First node picked while linking (null = pick a source next). */
  linkSourceId: string | null;
  /** Enter link mode, optionally pre-seeding the source node. */
  beginLink: (fromId?: string | null) => void;
  /** Handle a node click while linking: set source, or complete the edge. */
  linkClick: (id: string) => void;
  cancelLink: () => void;

  // --- context menu (right-click on a node / edge / empty canvas) ---
  contextMenu: { kind: "node" | "edge" | "canvas"; id: string | null; x: number; y: number } | null;
  openContextMenu: (kind: "node" | "edge" | "canvas", id: string | null, x: number, y: number) => void;
  closeContextMenu: () => void;
  /** Duplicate a node a little offset from the original; selects the copy. */
  duplicateNode: (id: string) => string | null;

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
    linkMode: false,
    linkSourceId: null,
    contextMenu: null,
    clipboard: null,
    snap: readSnapPref(),
    guides: { x: null, z: null },
    labelEditor: null,
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
      // Deterministic placement: the caller's position, else the nearest free
      // spot to the origin (no more random scatter / off-screen drops).
      const spot =
        partial.x !== undefined && partial.y !== undefined
          ? { x: partial.x, y: partial.y }
          : findFreeSpot(get().nodes, partial.x ?? 0, partial.y ?? 0);
      const node: WorkflowNode = {
        id,
        kind,
        label: partial.label ?? defaultLabel(kind),
        ...partial,
        x: spot.x,
        y: spot.y,
      };
      set((s) => ({
        nodes: [...s.nodes, node],
        nextNodeId: partial.id ? s.nextNodeId : s.nextNodeId + 1,
        selection: nodeSel([id]),
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
      set((s) => {
        let selection = s.selection;
        if (selection?.type === "node") {
          const ids = selection.ids.filter((i) => i !== id);
          selection = nodeSel(ids, selection.id);
        }
        return {
          nodes: s.nodes.filter((n) => n.id !== id),
          edges: s.edges.filter((e) => e.source !== id && e.target !== id),
          selection,
        };
      });
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
    selectNode: (id, additive = false) =>
      set((s) => {
        if (!additive || s.selection?.type !== "node") return { selection: nodeSel([id], id) };
        const has = s.selection.ids.includes(id);
        const ids = has ? s.selection.ids.filter((i) => i !== id) : [...s.selection.ids, id];
        return { selection: nodeSel(ids, has ? undefined : id) };
      }),
    selectNodes: (ids, primary) => set({ selection: nodeSel(ids, primary) }),
    selectAll: () =>
      set((s) => ({ selection: nodeSel(s.nodes.filter((n) => n.kind !== "group").map((n) => n.id)) })),
    selectEdge: (id) => set({ selection: { type: "edge", id } }),
    clearSelection: () => set({ selection: null }),

    deleteSelection: () => {
      const sel = get().selection;
      if (!sel) return;
      if (sel.type === "edge") {
        get().deleteEdge(sel.id);
        return;
      }
      snapshot();
      const drop = new Set(sel.ids);
      set((s) => ({
        nodes: s.nodes.filter((n) => !drop.has(n.id)),
        edges: s.edges.filter((e) => !drop.has(e.source) && !drop.has(e.target)),
        selection: null,
      }));
    },

    copySelection: () => {
      const sel = get().selection;
      if (sel?.type !== "node") return;
      const ids = new Set(sel.ids);
      const { nodes, edges } = get();
      set({
        clipboard: {
          nodes: nodes.filter((n) => ids.has(n.id)).map((n) => ({ ...n })),
          edges: edges.filter((e) => ids.has(e.source) && ids.has(e.target)).map((e) => ({ ...e })),
        },
      });
    },

    pasteClipboard: () => {
      const clip = get().clipboard;
      if (!clip || clip.nodes.length === 0) return;
      snapshot();
      set((s) => {
        let nid = s.nextNodeId;
        let eid = s.nextEdgeId;
        const map: Record<string, string> = {};
        const nodes = clip.nodes.map((n) => {
          const id = `n${nid++}`;
          map[n.id] = id;
          return {
            ...n,
            id,
            x: n.x + 0.8,
            y: n.y + 0.8,
            parentId: n.parentId && clip.nodes.some((m) => m.id === n.parentId) ? undefined : n.parentId,
          };
        });
        // Re-point pasted parent links at the pasted copies.
        for (const n of nodes) {
          if (n.parentId && map[n.parentId]) n.parentId = map[n.parentId];
        }
        const edges = clip.edges.map((e) => ({
          ...e,
          id: `e${eid++}`,
          source: map[e.source],
          target: map[e.target],
        }));
        return {
          nodes: [...s.nodes, ...nodes],
          edges: [...s.edges, ...edges],
          nextNodeId: nid,
          nextEdgeId: eid,
          selection: nodeSel(nodes.map((n) => n.id)),
        };
      });
    },

    duplicateSelection: () => {
      const sel = get().selection;
      if (sel?.type !== "node") return null;
      snapshot();
      const ids = new Set(sel.ids);
      const map: Record<string, string> = {};
      set((s) => {
        let nid = s.nextNodeId;
        let eid = s.nextEdgeId;
        const clones = s.nodes
          .filter((n) => ids.has(n.id))
          .map((n) => {
            const id = `n${nid++}`;
            map[n.id] = id;
            return { ...n, id, x: n.x + 0.8, y: n.y + 0.8 };
          });
        for (const c of clones) {
          if (c.parentId && map[c.parentId]) c.parentId = map[c.parentId];
          else if (c.parentId && ids.has(c.parentId)) c.parentId = undefined;
        }
        const cloneEdges = s.edges
          .filter((e) => ids.has(e.source) && ids.has(e.target))
          .map((e) => ({ ...e, id: `e${eid++}`, source: map[e.source], target: map[e.target] }));
        return {
          nodes: [...s.nodes, ...clones],
          edges: [...s.edges, ...cloneEdges],
          nextNodeId: nid,
          nextEdgeId: eid,
          selection: nodeSel(Object.values(map)),
        };
      });
      return map;
    },

    nudgeSelection: (dx, dy) => {
      const sel = get().selection;
      if (sel?.type !== "node") return;
      snapshot();
      const ids = new Set(sel.ids);
      set((s) => ({
        nodes: s.nodes.map((n) => {
          if (ids.has(n.id)) return { ...n, x: n.x + dx, y: n.y + dy };
          // Cascade groups being nudged onto children not separately selected.
          if (n.parentId && ids.has(n.parentId) && !ids.has(n.id)) {
            return { ...n, x: n.x + dx, y: n.y + dy };
          }
          return n;
        }),
      }));
    },

    alignSelection: (mode) => {
      const sel = get().selection;
      if (sel?.type !== "node" || sel.ids.length < 2) return;
      snapshot();
      const ids = new Set(sel.ids);
      set((s) => {
        const picked = s.nodes.filter((n) => ids.has(n.id));
        const xs = picked.map((n) => n.x);
        const ys = picked.map((n) => n.y);
        const to = (n: WorkflowNode): { x: number; y: number } => {
          switch (mode) {
            case "left":
              return { x: Math.min(...xs), y: n.y };
            case "centerX":
              return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: n.y };
            case "right":
              return { x: Math.max(...xs), y: n.y };
            case "top":
              return { x: n.x, y: Math.min(...ys) };
            case "centerY":
              return { x: n.x, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
            default:
              return { x: n.x, y: Math.max(...ys) };
          }
        };
        return { nodes: s.nodes.map((n) => (ids.has(n.id) ? { ...n, ...to(n) } : n)) };
      });
    },

    distributeSelection: (axis) => {
      const sel = get().selection;
      if (sel?.type !== "node" || sel.ids.length < 3) return;
      snapshot();
      const ids = new Set(sel.ids);
      set((s) => {
        const picked = s.nodes.filter((n) => ids.has(n.id));
        const sorted = [...picked].sort((a, b) => (axis === "x" ? a.x - b.x : a.y - b.y));
        const first = axis === "x" ? sorted[0].x : sorted[0].y;
        const last = axis === "x" ? sorted[sorted.length - 1].x : sorted[sorted.length - 1].y;
        const step = sorted.length > 1 ? (last - first) / (sorted.length - 1) : 0;
        const targetPos = new Map(sorted.map((n, i) => [n.id, first + step * i]));
        return {
          nodes: s.nodes.map((n) => {
            const v = targetPos.get(n.id);
            if (v === undefined) return n;
            return axis === "x" ? { ...n, x: v } : { ...n, y: v };
          }),
        };
      });
    },

    setSnap: (on) => {
      set({ snap: on });
      try {
        window.localStorage.setItem(SNAP_KEY, on ? "on" : "off");
      } catch {
        /* ignore */
      }
    },
    setGuides: (guides) => set({ guides }),

    openLabelEditor: (nodeId, x, y) => set({ labelEditor: { nodeId, x, y }, contextMenu: null }),
    closeLabelEditor: () => set({ labelEditor: null }),

    startConnect: (id) => set({ connectSourceId: id }),
    endConnect: () => set({ connectSourceId: null }),

    beginLink: (fromId = null) =>
      set((s) => ({
        linkMode: true,
        linkSourceId: fromId ?? null,
        contextMenu: null,
        selection: fromId ? nodeSel([fromId]) : s.selection,
      })),
    linkClick: (id) => {
      const { linkSourceId } = get();
      if (!linkSourceId) {
        set({ linkSourceId: id });
        return;
      }
      if (id !== linkSourceId) get().addEdge(linkSourceId, id);
      set({ linkMode: false, linkSourceId: null });
    },
    cancelLink: () => set({ linkMode: false, linkSourceId: null }),

    openContextMenu: (kind, id, x, y) => set({ contextMenu: { kind, id, x, y } }),
    closeContextMenu: () => set({ contextMenu: null }),

    duplicateNode: (id) => {
      const original = get().nodes.find((n) => n.id === id);
      if (!original) return null;
      const { id: _omit, ...rest } = original;
      void _omit;
      return get().addNode(original.kind, { ...rest, x: original.x + 1.2, y: original.y + 1.2, parentId: undefined });
    },

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
