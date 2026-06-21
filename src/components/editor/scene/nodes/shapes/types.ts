// Shared contract for isometric node shapes. Each shape renders the visible
// geometry of a node, sitting on the ground plane (y grows up from 0). The
// catalog (catalog/nodeCatalog.ts) maps each NodeKind to one of these ShapeIds.

export type ShapeId =
  | "box"
  | "cylinder"
  | "hexPrism"
  | "diamond"
  | "slab"
  | "capsule"
  | "paperTile";

export interface ShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
}
