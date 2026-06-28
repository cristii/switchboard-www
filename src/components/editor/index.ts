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
export { ThemeManager } from "./panels/ThemeManager";
export type { ThemeManagerProps } from "./panels/ThemeManager";
export { NodeContextMenu } from "./panels/NodeContextMenu";
export { MobileDrawer } from "./panels/MobileDrawer";

// Pluggable routing + connectors (Step 3)
export {
  ROUTING_ALGORITHMS,
  registerRoutingAlgorithm,
  getRoutingAlgorithm,
  listRoutingIds,
} from "./scene/edges/routing";
export type { RouteAlgorithm, RoutePoint, RouteOptions } from "./scene/edges/routing";
export { CONNECTORS } from "./scene/edges/connectors";
export type { ConnectorProps } from "./scene/edges/connectors";
export { useEditorTheme } from "./theme/useEditorTheme";
export { useThemeManager } from "./theme/useThemeManager";
export type { ThemeManagerApi } from "./theme/useThemeManager";

// Theme system (ThemeSpec authoring + registry + resolution)
export { cloneThemeSpec, normalizeThemeSpec } from "./theme/themeSpec";
export type { ThemeSpec, LightSpec, ConnectorStyle } from "./theme/themeSpec";
export {
  BUILT_IN_THEMES,
  listThemes,
  getThemeSpec,
  saveUserTheme,
  deleteUserTheme,
  resolveThemeFromConfig,
  USER_THEMES_KEY,
} from "./theme/themeRegistry";
export { lightTheme } from "./theme/themes/light";
export { darkTheme } from "./theme/themes/dark";
export { awsTheme } from "./theme/themes/aws";
export { resolveSceneTheme, getSceneTheme } from "./theme/sceneTheme";
export type { SceneTheme } from "./theme/sceneTheme";
export { useResponsiveLayout } from "./hooks/useResponsiveLayout";
export { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
export { NodeGlyph } from "./icons/NodeGlyph";
export type { GlyphName } from "./icons/NodeGlyph";

export { IconButton } from "./primitives/IconButton";
export { Panel } from "./primitives/Panel";
export { Field } from "./primitives/Field";
export { Select } from "./primitives/Select";

export { useExportJson } from "./hooks/useExportJson";
export { useExportPng } from "./hooks/useExportPng";

export { DiagramPreview } from "./preview/DiagramPreview";
export type { DiagramPreviewProps } from "./preview/DiagramPreview";
export {
  DEFAULT_PREVIEW_CONFIG,
  mergePreviewConfig,
  parsePreviewDoc,
  serializePreviewDoc,
} from "./preview/previewConfig";
export type { PreviewConfig, PreviewDoc } from "./preview/previewConfig";

export {
  NODE_CATALOG,
  CATALOG_LIST,
  CATEGORIES,
  getNodeCatalogEntry,
  catalogByCategory,
} from "./catalog/nodeCatalog";
export type { NodeCatalogEntry, NodeCategory } from "./catalog/nodeCatalog";
export type { ShapeId } from "./scene/nodes/shapes/types";
export { ModelNode } from "./scene/nodes/shapes/ModelNode";

export { useWorkflowStore } from "./state/useWorkflowStore";
export type { WorkflowState } from "./state/useWorkflowStore";

export { serialize, deserialize, toJSON, validate, SCHEMA_VERSION } from "./state/schema";
export {
  mvpSampleDiagram,
  allKindsDiagram,
  branchingSampleDiagram,
  groupedSampleDiagram,
} from "./sampleDiagram";

export { PRESETS, n8nSampleDiagram, scoutsLeadsDiagram, awsWebHostingDiagram } from "./catalog/presets";
export type { PresetEntry } from "./catalog/presets";
export { layeredLayout } from "./catalog/layout/autoLayout";

export type {
  Diagram,
  EdgeRouting,
  EdgeStyle,
  EditorTheme,
  NodeColorRole,
  NodeKind,
  Port,
  Selection,
  TextOrientation,
  Viewport,
  WorkflowEdge,
  WorkflowNode,
} from "./state/types";
