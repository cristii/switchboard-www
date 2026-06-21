"use client";

// Top-level, composed editor. Owns the data-editor-theme root (so the scoped
// tokens apply), seeds the store from `initialDiagram`, and stacks the 3D canvas
// under the DOM label overlay. Chrome (toolbar/palette/inspector) and the real
// light/dark toggle arrive in P6/P7; this is the P2 Scene MVP shell.

import * as React from "react";
import { DiagramCanvas } from "./scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "./scene/LabelsLayer";
import { useWorkflowStore } from "./state/useWorkflowStore";
import { mvpSampleDiagram } from "./sampleDiagram";
import type { Diagram, EditorTheme } from "./state/types";

export interface IsometricWorkflowEditorProps {
  /** Seed document loaded on mount. @default mvpSampleDiagram */
  initialDiagram?: Diagram;
  /** Initial theme; an interactive toggle lands in P7. @default "light" */
  defaultTheme?: EditorTheme;
  className?: string;
  style?: React.CSSProperties;
}

export function IsometricWorkflowEditor({
  initialDiagram = mvpSampleDiagram,
  defaultTheme = "light",
  className,
  style,
}: IsometricWorkflowEditorProps) {
  const [theme] = React.useState<EditorTheme>(defaultTheme);
  const [ready, setReady] = React.useState(false);
  const labelsRef = React.useRef<LabelsRegistry>(new Map());

  const loadDiagram = useWorkflowStore((s) => s.loadDiagram);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selection = useWorkflowStore((s) => s.selection);

  React.useEffect(() => {
    loadDiagram(initialDiagram);
  }, [initialDiagram, loadDiagram]);

  const rootStyle: React.CSSProperties = {
    position: "relative",
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
      <div style={{ position: "absolute", inset: 0 }}>
        <DiagramCanvas theme={theme} labelsRef={labelsRef} onReady={() => setReady(true)} />
        <LabelsLayer nodes={nodes} selection={selection} labelsRef={labelsRef} />
      </div>

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
  );
}

export default IsometricWorkflowEditor;
