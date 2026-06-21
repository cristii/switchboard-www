// Public surface of the Isometric Workflow Editor module. The Next route (P11)
// loads the component lazily via next/dynamic so three.js stays off other
// route bundles. Keep heavy three/R3F imports confined to this module's tree.

export { IsometricWorkflowEditor } from "./IsometricWorkflowEditor";
export type { IsometricWorkflowEditorProps } from "./IsometricWorkflowEditor";

export { useWorkflowStore } from "./state/useWorkflowStore";
export type { WorkflowState } from "./state/useWorkflowStore";

export { serialize, deserialize, toJSON, validate, SCHEMA_VERSION } from "./state/schema";
export { mvpSampleDiagram } from "./sampleDiagram";

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
