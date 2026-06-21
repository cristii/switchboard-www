// Orthogonal edge routing. A* over a coarse grid where node footprints are
// blocked, producing right-angled paths that avoid other nodes. Ported and
// generalised from the prototype (createGrid / aStar / getOrthogonalPath):
// blockers use each node's real footprint, and a straight fallback is returned
// when no path is found. Also provides smooth + direct route variants.
// See description.md §8.

import * as THREE from "three";
import { getNodeCatalogEntry } from "../../catalog/nodeCatalog";
import type { EdgeRouting, WorkflowNode } from "../../state/types";

/** A 2D point on the ground plane; `y` maps to world Z in the scene. */
export interface RoutePoint {
  x: number;
  y: number;
}

const WORLD_MIN = -24;
const WORLD_MAX = 24;
const GRID = 48;
const CELL = (WORLD_MAX - WORLD_MIN) / GRID;

interface Cell {
  i: number;
  j: number;
}

function footprint(node: WorkflowNode): { hw: number; hd: number } {
  const e = getNodeCatalogEntry(node.kind);
  return {
    hw: (node.width ?? e.defaultSize.width) / 2,
    hd: (node.depth ?? e.defaultSize.depth) / 2,
  };
}

function center(node: WorkflowNode): RoutePoint {
  return { x: node.x, y: node.y };
}

/** Build a blocked-cell grid from the given blocker nodes (with light padding). */
function createGrid(blockers: WorkflowNode[]): number[][] {
  const grid = Array.from({ length: GRID }, () => new Array<number>(GRID).fill(0));
  for (const n of blockers) {
    const { hw, hd } = footprint(n);
    const minX = n.x - hw - CELL;
    const maxX = n.x + hw + CELL;
    const minY = n.y - hd - CELL;
    const maxY = n.y + hd + CELL;
    for (let i = 0; i < GRID; i++) {
      const cx = WORLD_MIN + (i + 0.5) * CELL;
      if (cx < minX || cx > maxX) continue;
      for (let j = 0; j < GRID; j++) {
        const cy = WORLD_MIN + (j + 0.5) * CELL;
        if (cy >= minY && cy <= maxY) grid[i][j] = 1;
      }
    }
  }
  return grid;
}

const heuristic = (a: Cell, b: Cell) => Math.abs(a.i - b.i) + Math.abs(a.j - b.j);

function aStar(grid: number[][], start: Cell, end: Cell): Cell[] | null {
  const key = (i: number, j: number) => `${i},${j}`;
  const open = new Set<string>([key(start.i, start.j)]);
  const cameFrom = new Map<string, string>();
  const g = Array.from({ length: GRID }, () => new Array<number>(GRID).fill(Infinity));
  const f = Array.from({ length: GRID }, () => new Array<number>(GRID).fill(Infinity));
  g[start.i][start.j] = 0;
  f[start.i][start.j] = heuristic(start, end);

  while (open.size > 0) {
    let currentKey: string | null = null;
    let best = Infinity;
    for (const k of open) {
      const [i, j] = k.split(",").map(Number);
      if (f[i][j] < best) {
        best = f[i][j];
        currentKey = k;
      }
    }
    if (!currentKey) break;
    const [ci, cj] = currentKey.split(",").map(Number);
    if (ci === end.i && cj === end.j) {
      const path: Cell[] = [];
      let cur: string | undefined = currentKey;
      while (cur) {
        const [i, j] = cur.split(",").map(Number);
        path.unshift({ i, j });
        cur = cameFrom.get(cur);
      }
      return path;
    }
    open.delete(currentKey);
    for (const [di, dj] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const ni = ci + di;
      const nj = cj + dj;
      if (ni < 0 || ni >= GRID || nj < 0 || nj >= GRID) continue;
      if (grid[ni][nj] === 1) continue;
      const tentative = g[ci][cj] + 1;
      if (tentative < g[ni][nj]) {
        cameFrom.set(key(ni, nj), currentKey);
        g[ni][nj] = tentative;
        f[ni][nj] = tentative + heuristic({ i: ni, j: nj }, end);
        open.add(key(ni, nj));
      }
    }
  }
  return null;
}

const clampCell = (v: number) => Math.max(0, Math.min(GRID - 1, v));
const toCell = (x: number, y: number): Cell => ({
  i: clampCell(Math.floor((x - WORLD_MIN) / CELL)),
  j: clampCell(Math.floor((y - WORLD_MIN) / CELL)),
});

/** Anchor on a node's bounding rect, nearest to a target point. */
function anchor(node: WorkflowNode, toward: RoutePoint): RoutePoint {
  const { hw, hd } = footprint(node);
  return {
    x: Math.max(node.x - hw, Math.min(toward.x, node.x + hw)),
    y: Math.max(node.y - hd, Math.min(toward.y, node.y + hd)),
  };
}

/** Right-angled path from source to target avoiding the other nodes. Always
 *  returns at least the two anchors (straight) if A* finds no route. */
function orthogonalPath(
  source: WorkflowNode,
  target: WorkflowNode,
  others: WorkflowNode[],
): RoutePoint[] {
  const srcAnchor = anchor(source, center(target));
  const tgtAnchor = anchor(target, center(source));
  const blockers = others.filter((n) => n.id !== source.id && n.id !== target.id);
  const grid = createGrid(blockers);
  const cells = aStar(grid, toCell(srcAnchor.x, srcAnchor.y), toCell(tgtAnchor.x, tgtAnchor.y));
  if (!cells || cells.length === 0) return [srcAnchor, tgtAnchor];
  const path = cells.map((c) => ({
    x: WORLD_MIN + (c.i + 0.5) * CELL,
    y: WORLD_MIN + (c.j + 0.5) * CELL,
  }));
  return [srcAnchor, ...path, tgtAnchor];
}

function smooth(points: RoutePoint[]): RoutePoint[] {
  if (points.length < 3) return points;
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
  return curve.getPoints(points.length * 6).map((v) => ({ x: v.x, y: v.z }));
}

/** Resolve the world-space points for an edge given its routing strategy. */
export function getRoutePoints(
  routing: EdgeRouting | undefined,
  source: WorkflowNode,
  target: WorkflowNode,
  allNodes: WorkflowNode[],
): RoutePoint[] {
  if (routing === "direct") return [center(source), center(target)];
  const path = orthogonalPath(source, target, allNodes);
  return routing === "smooth" ? smooth(path) : path;
}
