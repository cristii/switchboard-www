// Public surface of the Isometric Workflow Editor module. The Next route (P11)
// loads the component lazily via next/dynamic so three.js stays off other
// route bundles. Keep heavy three/R3F imports confined to this module's tree.

export { IsometricWorkflowEditor } from "./IsometricWorkflowEditor";
export type { IsometricWorkflowEditorProps } from "./IsometricWorkflowEditor";

export { NodePalette } from "./panels/NodePalette";
export type { NodePaletteProps } from "./panels/NodePalette";
export { Toolbar } from "./panels/Toolbar";
export { Inspector } from "./panels/Inspector";
export { ThemeToggle } from "./panels/ThemeToggle";
export { useEditorTheme } from "./theme/useEditorTheme";
export { NodeGlyph } from "./icons/NodeGlyph";
export type { GlyphName } from "./icons/NodeGlyph";

export { IconButton } from "./primitives/IconButton";
export { Panel } from "./primitives/Panel";
export { Field } from "./primitives/Field";
export { Select } from "./primitives/Select";

export { useExportJson } from "./hooks/useExportJson";
export { useExportPng } from "./hooks/useExportPng";

export {
  NODE_CATALOG,
  CATALOG_LIST,
  CATEGORIES,
  getNodeCatalogEntry,
  catalogByCategory,
} from "./catalog/nodeCatalog";
export type { NodeCatalogEntry, NodeCategory } from "./catalog/nodeCatalog";
export type { ShapeId } from "./scene/nodes/shapes/types";

export { useWorkflowStore } from "./state/useWorkflowStore";
export type { WorkflowState } from "./state/useWorkflowStore";

export { serialize, deserialize, toJSON, validate, SCHEMA_VERSION } from "./state/schema";
export {
  mvpSampleDiagram,
  allKindsDiagram,
  branchingSampleDiagram,
  groupedSampleDiagram,
} from "./sampleDiagram";

export type {
  Diagram,
  EdgeRouting,
  EdgeStyle,
  EditorTheme,
  NodeColorRole,
  NodeKind,
  Port,
  Selection,
  Viewport,
  WorkflowEdge,
  WorkflowNode,
} from "./state/types";
