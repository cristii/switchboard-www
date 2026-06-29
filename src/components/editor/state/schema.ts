// Versioned (de)serialisation for diagrams. See
// isometric_workflow_editor_description.md §6. Exports embedded in the portfolio
// carry `version`, so `migrate()` is the single place future formats are upgraded.

import type {
  ConnectorStyle,
  Diagram,
  EdgeFlow,
  EdgeStyle,
  EditorTheme,
  TextOrientation,
  Viewport,
  WorkflowEdge,
  WorkflowNode,
} from "./types";

export const SCHEMA_VERSION = 1 as const;

export interface SerializeInput {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: Viewport;
  theme?: EditorTheme;
}

/** Build a clean, versioned document from the current store slices. */
export function serialize(input: SerializeInput): Diagram {
  return {
    version: SCHEMA_VERSION,
    nodes: input.nodes,
    edges: input.edges,
    viewport: input.viewport,
    theme: input.theme,
  };
}

/** Pretty JSON for file export. */
export function toJSON(diagram: Diagram): string {
  return JSON.stringify(diagram, null, 2);
}

const STYLES: EdgeStyle[] = ["solid", "dashed"];
const CONNECTORS: ConnectorStyle[] = ["line", "tube", "ribbonArrow", "boldArrow", "cornerConnect"];
const FLOWS: EdgeFlow[] = ["off", "slow", "normal", "fast"];
const ORIENTATIONS: TextOrientation[] = ["billboard", "ground", "uprightX", "uprightZ"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asNode(v: unknown): WorkflowNode | null {
  if (!isRecord(v)) return null;
  const { id, kind, label, x, y } = v;
  if (typeof id !== "string" || typeof kind !== "string") return null;
  if (typeof x !== "number" || typeof y !== "number") return null;
  const node: WorkflowNode = {
    id,
    kind: kind as WorkflowNode["kind"],
    label: typeof label === "string" ? label : id,
    x,
    y,
  };
  if (typeof v.sublabel === "string") node.sublabel = v.sublabel;
  if (typeof v.width === "number") node.width = v.width;
  if (typeof v.depth === "number") node.depth = v.depth;
  if (typeof v.height === "number") node.height = v.height;
  if (typeof v.color === "string") node.color = v.color;
  if (typeof v.opacity === "number") node.opacity = v.opacity;
  if (typeof v.icon === "string") node.icon = v.icon;
  if (typeof v.parentId === "string") node.parentId = v.parentId;
  if (typeof v.labelOrientation === "string" && ORIENTATIONS.includes(v.labelOrientation as TextOrientation)) {
    node.labelOrientation = v.labelOrientation as TextOrientation;
  }
  if (Array.isArray(v.ports)) node.ports = v.ports as WorkflowNode["ports"];
  if (isRecord(v.meta)) node.meta = v.meta;
  return node;
}

function asEdge(v: unknown): WorkflowEdge | null {
  if (!isRecord(v)) return null;
  const { id, source, target } = v;
  if (typeof id !== "string" || typeof source !== "string" || typeof target !== "string") {
    return null;
  }
  const edge: WorkflowEdge = { id, source, target };
  if (typeof v.sourcePort === "string") edge.sourcePort = v.sourcePort;
  if (typeof v.targetPort === "string") edge.targetPort = v.targetPort;
  if (typeof v.label === "string") edge.label = v.label;
  // Routing is now an open registry id (built-ins + any registered algorithm).
  if (typeof v.routing === "string") edge.routing = v.routing;
  if (typeof v.style === "string" && STYLES.includes(v.style as EdgeStyle)) {
    edge.style = v.style as EdgeStyle;
  }
  if (typeof v.connector === "string" && CONNECTORS.includes(v.connector as ConnectorStyle)) {
    edge.connector = v.connector as ConnectorStyle;
  }
  if (typeof v.flow === "string" && FLOWS.includes(v.flow as EdgeFlow)) {
    edge.flow = v.flow as EdgeFlow;
  }
  if (typeof v.color === "string") edge.color = v.color;
  if (typeof v.labelOrientation === "string" && ORIENTATIONS.includes(v.labelOrientation as TextOrientation)) {
    edge.labelOrientation = v.labelOrientation as TextOrientation;
  }
  if (isRecord(v.meta)) edge.meta = v.meta;
  return edge;
}

/** Coerce unknown input into a valid Diagram, dropping malformed entries and
 *  pruning edges whose endpoints are missing. Throws only on non-object input. */
export function validate(data: unknown): Diagram {
  if (!isRecord(data)) throw new Error("Invalid diagram: expected an object");
  const nodes = Array.isArray(data.nodes)
    ? (data.nodes.map(asNode).filter(Boolean) as WorkflowNode[])
    : [];
  const ids = new Set(nodes.map((n) => n.id));
  const edges = Array.isArray(data.edges)
    ? (data.edges.map(asEdge).filter(Boolean) as WorkflowEdge[]).filter(
        (e) => ids.has(e.source) && ids.has(e.target),
      )
    : [];
  const diagram: Diagram = { version: SCHEMA_VERSION, nodes, edges };
  if (isRecord(data.viewport)) {
    const vp = data.viewport;
    if (typeof vp.zoom === "number" && Array.isArray(vp.target) && vp.target.length === 2) {
      diagram.viewport = { zoom: vp.zoom, target: [Number(vp.target[0]), Number(vp.target[1])] };
    }
  }
  if (data.theme === "light" || data.theme === "dark") diagram.theme = data.theme;
  return diagram;
}

/** Upgrade older documents to the current version before validation. */
export function migrate(data: unknown): unknown {
  if (!isRecord(data)) return data;
  // version 1 is current; future migrations switch on `data.version` here.
  return data;
}

/** Parse JSON (or accept an object), migrate, then validate into a Diagram. */
export function deserialize(input: string | unknown): Diagram {
  const raw = typeof input === "string" ? JSON.parse(input) : input;
  return validate(migrate(raw));
}
