// ThemeSpec — the serialisable unit of "a theme": a named object describing ALL
// canvas visuals (background, grid, lights, shadows, camera, nodes, edges, text).
// Built-in themes are repo modules (theme/themes/*); user themes live in
// localStorage; both flow through the registry and resolve to a flat SceneTheme
// (theme/sceneTheme.ts) that the scene already consumes. The Theme manager pane
// edits a ThemeSpec live. See docs/themes/CREATING_THEMES.md + IMPLEMENTATION_PLAN.md.

import type { ConnectorStyle, LabelStyle, NodeColorRole, TextOrientation } from "../state/types";

export type { ConnectorStyle };

/** A single coloured light. The scene maps these to R3F light elements. */
export type LightSpec =
  | { id: string; type: "ambient"; color: string; intensity: number }
  | { id: string; type: "hemisphere"; sky: string; ground: string; intensity: number }
  | {
      id: string;
      type: "directional";
      color: string;
      intensity: number;
      position: [number, number, number];
      castShadow?: boolean;
    }
  | {
      id: string;
      type: "point";
      color: string;
      intensity: number;
      position: [number, number, number];
      distance?: number;
    };

export interface ThemeSpec {
  /** Stable id ("light" | "dark" | "aws" | user ids). */
  id: string;
  name: string;
  /** Repo-shipped themes set this; user (localStorage) themes don't. */
  builtIn?: boolean;
  /** Which editor-tokens.css block the DOM chrome uses. */
  chromeBase: "light" | "dark";
  background: { type: "flat" | "radial"; color: string; colorHi?: string };
  grid: { show: boolean; color: string; sectionColor: string; opacity?: number };
  /** Multiple, coloured light sources. */
  lights: LightSpec[];
  shadow: { enabled: boolean; opacity: number; radius: number; bias: number };
  camera: {
    kind: "orthographic" | "perspective";
    /** View direction onto the target. @default [1,1,1] */
    isoDir?: [number, number, number];
    target?: [number, number];
    /** Orthographic zoom. */
    zoom?: number;
    /** Perspective field of view (deg). */
    fov?: number;
    /** Camera distance along isoDir (perspective). */
    distance?: number;
  };
  nodes: {
    opacity: number;
    roughness?: number;
    metalness?: number;
    emissive: number;
    selectionEmissive: number;
    colors: Record<NodeColorRole, string>;
    selection: string;
    paper: string;
  };
  edges: {
    color: string;
    width: number;
    widthSelected: number;
    flow: string;
    /** Arrowhead size multiplier (1 = default cone). */
    arrowSize: number;
    /** Routing-algorithm id (Step 3 registry); default "orthogonal". */
    routing: string;
    connector: ConnectorStyle;
  };
  text: {
    /** Optional font-file URL passed to troika; default sans when omitted. */
    font?: string;
    color: string;
    opacity: number;
    size: number;
    orientation: TextOrientation;
    /** Default label container style ("tag"). @default "plain" */
    style?: LabelStyle;
    /** Where node/edge labels render: 3D in-canvas hovering text (default) or
     *  flat DOM chips. @default "3d" */
    mode?: "3d" | "dom";
  };
}

/** Deep clone (themes are plain JSON, so this is safe + dependency-free). */
export function cloneThemeSpec(spec: ThemeSpec): ThemeSpec {
  return JSON.parse(JSON.stringify(spec)) as ThemeSpec;
}

const ORIENTATIONS: TextOrientation[] = ["billboard", "ground", "uprightX", "uprightZ"];
const LABEL_STYLES: LabelStyle[] = ["plain", "bubble", "tips", "info", "note"];
const CONNECTORS: ConnectorStyle[] = ["line", "tube", "ribbonArrow", "boldArrow", "cornerConnect"];
const COLOR_ROLES: NodeColorRole[] = ["orange", "green", "violet", "amber", "ink"];

function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function str(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}
function vec3(v: unknown, fallback: [number, number, number]): [number, number, number] {
  return Array.isArray(v) && v.length === 3
    ? [num(v[0], fallback[0]), num(v[1], fallback[1]), num(v[2], fallback[2])]
    : fallback;
}

function normalizeLight(v: unknown, i: number): LightSpec | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const id = str(o.id, `l${i}`);
  switch (o.type) {
    case "ambient":
      return { id, type: "ambient", color: str(o.color, "#ffffff"), intensity: num(o.intensity, 0.4) };
    case "hemisphere":
      return {
        id,
        type: "hemisphere",
        sky: str(o.sky, "#ffffff"),
        ground: str(o.ground, "#888888"),
        intensity: num(o.intensity, 0.5),
      };
    case "directional":
      return {
        id,
        type: "directional",
        color: str(o.color, "#ffffff"),
        intensity: num(o.intensity, 1),
        position: vec3(o.position, [16, 24, 12]),
        castShadow: bool(o.castShadow, false),
      };
    case "point":
      return {
        id,
        type: "point",
        color: str(o.color, "#ffffff"),
        intensity: num(o.intensity, 1),
        position: vec3(o.position, [0, 12, 0]),
        distance: typeof o.distance === "number" ? o.distance : undefined,
      };
    default:
      return null;
  }
}

/** Coerce arbitrary JSON into a valid ThemeSpec, filling gaps from `base`
 *  (defaults to the built-in light theme passed by the registry). Used when
 *  importing pasted JSON or reading user themes from localStorage. */
export function normalizeThemeSpec(input: unknown, base: ThemeSpec): ThemeSpec {
  const o = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const nodesIn = (o.nodes ?? {}) as Record<string, unknown>;
  const edgesIn = (o.edges ?? {}) as Record<string, unknown>;
  const textIn = (o.text ?? {}) as Record<string, unknown>;
  const bgIn = (o.background ?? {}) as Record<string, unknown>;
  const gridIn = (o.grid ?? {}) as Record<string, unknown>;
  const shadowIn = (o.shadow ?? {}) as Record<string, unknown>;
  const camIn = (o.camera ?? {}) as Record<string, unknown>;

  const colorsIn = (nodesIn.colors ?? {}) as Record<string, unknown>;
  const colors = {} as Record<NodeColorRole, string>;
  for (const role of COLOR_ROLES) colors[role] = str(colorsIn[role], base.nodes.colors[role]);

  const lights = Array.isArray(o.lights)
    ? (o.lights.map(normalizeLight).filter(Boolean) as LightSpec[])
    : base.lights;

  const orientation = ORIENTATIONS.includes(textIn.orientation as TextOrientation)
    ? (textIn.orientation as TextOrientation)
    : base.text.orientation;
  const labelStyle = LABEL_STYLES.includes(textIn.style as LabelStyle)
    ? (textIn.style as LabelStyle)
    : base.text.style;
  const connector = CONNECTORS.includes(edgesIn.connector as ConnectorStyle)
    ? (edgesIn.connector as ConnectorStyle)
    : base.edges.connector;

  return {
    id: str(o.id, base.id),
    name: str(o.name, base.name),
    builtIn: false,
    chromeBase: o.chromeBase === "dark" ? "dark" : o.chromeBase === "light" ? "light" : base.chromeBase,
    background: {
      type: bgIn.type === "radial" ? "radial" : bgIn.type === "flat" ? "flat" : base.background.type,
      color: str(bgIn.color, base.background.color),
      colorHi: typeof bgIn.colorHi === "string" ? bgIn.colorHi : base.background.colorHi,
    },
    grid: {
      show: bool(gridIn.show, base.grid.show),
      color: str(gridIn.color, base.grid.color),
      sectionColor: str(gridIn.sectionColor, base.grid.sectionColor),
      opacity: typeof gridIn.opacity === "number" ? gridIn.opacity : base.grid.opacity,
    },
    lights: lights.length > 0 ? lights : base.lights,
    shadow: {
      enabled: bool(shadowIn.enabled, base.shadow.enabled),
      opacity: num(shadowIn.opacity, base.shadow.opacity),
      radius: num(shadowIn.radius, base.shadow.radius),
      bias: num(shadowIn.bias, base.shadow.bias),
    },
    camera: {
      kind: camIn.kind === "perspective" ? "perspective" : "orthographic",
      isoDir: vec3(camIn.isoDir, base.camera.isoDir ?? [1, 1, 1]),
      target:
        Array.isArray(camIn.target) && camIn.target.length === 2
          ? [num(camIn.target[0], 0), num(camIn.target[1], 0)]
          : base.camera.target,
      zoom: typeof camIn.zoom === "number" ? camIn.zoom : base.camera.zoom,
      fov: typeof camIn.fov === "number" ? camIn.fov : base.camera.fov,
      distance: typeof camIn.distance === "number" ? camIn.distance : base.camera.distance,
    },
    nodes: {
      opacity: num(nodesIn.opacity, base.nodes.opacity),
      roughness: typeof nodesIn.roughness === "number" ? nodesIn.roughness : base.nodes.roughness,
      metalness: typeof nodesIn.metalness === "number" ? nodesIn.metalness : base.nodes.metalness,
      emissive: num(nodesIn.emissive, base.nodes.emissive),
      selectionEmissive: num(nodesIn.selectionEmissive, base.nodes.selectionEmissive),
      colors,
      selection: str(nodesIn.selection, base.nodes.selection),
      paper: str(nodesIn.paper, base.nodes.paper),
    },
    edges: {
      color: str(edgesIn.color, base.edges.color),
      width: num(edgesIn.width, base.edges.width),
      widthSelected: num(edgesIn.widthSelected, base.edges.widthSelected),
      flow: str(edgesIn.flow, base.edges.flow),
      arrowSize: num(edgesIn.arrowSize, base.edges.arrowSize),
      routing: str(edgesIn.routing, base.edges.routing),
      connector,
    },
    text: {
      font: typeof textIn.font === "string" ? textIn.font : base.text.font,
      color: str(textIn.color, base.text.color),
      opacity: num(textIn.opacity, base.text.opacity),
      size: num(textIn.size, base.text.size),
      orientation,
      style: labelStyle,
      mode: textIn.mode === "dom" ? "dom" : textIn.mode === "3d" ? "3d" : base.text.mode,
    },
  };
}
