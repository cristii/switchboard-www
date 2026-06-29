// Shape registry: maps a ShapeId to the component that renders it. NodeMesh
// looks the node's catalog shape up here. Add a new shape by adding a component
// + an entry; the catalog then references it by id.

import type { ComponentType } from "react";
import type { ShapeId, ShapeProps } from "./types";
import { BoxNode } from "./BoxNode";
import { CylinderNode } from "./CylinderNode";
import { HexPrismNode } from "./HexPrismNode";
import { DiamondNode } from "./DiamondNode";
import { SlabNode } from "./SlabNode";
import { CapsuleNode } from "./CapsuleNode";
import { PaperTileNode } from "./PaperTileNode";
import { MonitorNode } from "./MonitorNode";
import { LaptopNode } from "./LaptopNode";
import { PhoneNode } from "./PhoneNode";
import { BrowserNode } from "./BrowserNode";
import { ServerStackNode } from "./ServerStackNode";

export const SHAPES: Record<ShapeId, ComponentType<ShapeProps>> = {
  box: BoxNode,
  cylinder: CylinderNode,
  hexPrism: HexPrismNode,
  diamond: DiamondNode,
  slab: SlabNode,
  capsule: CapsuleNode,
  paperTile: PaperTileNode,
  monitor: MonitorNode,
  laptop: LaptopNode,
  phone: PhoneNode,
  browser: BrowserNode,
  serverStack: ServerStackNode,
};

export type { ShapeId, ShapeProps } from "./types";
