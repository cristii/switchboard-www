"use client";

// Top-level, composed editor. Owns the data-editor-theme root (so the scoped
// tokens apply), seeds the store from `initialDiagram`, and lays out the node
// palette beside the 3D stage (canvas + DOM label overlays). The lifted camera
// api ref lets the (P6) toolbar drive the camera + PNG capture. Toolbar/inspector
// arrive in P6; the real light/dark toggle in P7.

import * as React from "react";
import { DiagramCanvas } from "./scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "./scene/LabelsLayer";
import { EdgeLabelsLayer, type EdgeLabelsRegistry } from "./scene/edges/EdgeLabelsLayer";
import type { CameraApi } from "./scene/CameraControls";
import { NodePalette } from "./panels/NodePalette";
import { useWorkflowStore } from "./state/useWorkflowStore";
import { mvpSampleDiagram } from "./sampleDiagram";
import type { Diagram, EditorTheme } from "./state/types";

export interface IsometricWorkflowEditorProps {
  /** Seed document loaded on mount. @default mvpSampleDiagram */
  initialDiagram?: Diagram;
  /** Initial theme; an interactive toggle lands in P7. @default "light" */
  defaultTheme?: EditorTheme;
  /** Hide the node palette (e.g. read-only embeds). @default false */
  hidePalette?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const NOOP_API: CameraApi = {
  reset: () => {},
  fit: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  capturePng: () => null,
};

export function IsometricWorkflowEditor({
  initialDiagram = mvpSampleDiagram,
  defaultTheme = "light",
  hidePalette = false,
  className,
  style,
}: IsometricWorkflowEditorProps) {
  const [theme] = React.useState<EditorTheme>(defaultTheme);
  const [ready, setReady] = React.useState(false);
  const labelsRef = React.useRef<LabelsRegistry>(new Map());
  const edgeLabelsRef = React.useRef<EdgeLabelsRegistry>(new Map());
  const apiRef = React.useRef<CameraApi>({ ...NOOP_API });

  const loadDiagram = useWorkflowStore((s) => s.loadDiagram);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selection = useWorkflowStore((s) => s.selection);

  React.useEffect(() => {
    loadDiagram(initialDiagram);
  }, [initialDiagram, loadDiagram]);

  const rootStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "70vh",
    minHeight: 420,
    borderRadius: "var(--r-lg, 18px)",
    border: "1.5px solid var(--editor-border-soft)",
    background: "var(--editor-bg)",
    boxShadow: "var(--editor-shadow)",
    overflow: "hidden",
    ...style,
  };

  return (
    <div data-editor-theme={theme} className={className} style={rootStyle}>
      {!hidePalette ? (
        <NodePalette
          style={{
            flex: "none",
            width: 212,
            height: "100%",
            borderRight: "1.5px solid var(--editor-border-soft)",
          }}
        />
      ) : null}

      <div style={{ position: "relative", flex: 1, minWidth: 0, height: "100%" }}>
        <DiagramCanvas
          theme={theme}
          labelsRef={labelsRef}
          edgeLabelsRef={edgeLabelsRef}
          apiRef={apiRef}
          onReady={() => setReady(true)}
        />
        <LabelsLayer nodes={nodes} selection={selection} labelsRef={labelsRef} />
        <EdgeLabelsLayer edges={edges} registry={edgeLabelsRef} />

        {!ready ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "var(--editor-bg)",
              color: "var(--editor-text-muted)",
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: "0.8rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Initialising scene…
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default IsometricWorkflowEditor;
