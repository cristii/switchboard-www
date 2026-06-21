"use client";

// Top-level, composed editor. Owns the data-editor-theme root + theme toggle,
// seeds the store, and lays out the chrome: toolbar on top, then
// palette | stage | inspector. The lifted camera api ref drives the toolbar's
// camera + PNG capture. `chrome={false}` renders just the stage (galleries /
// read-only embeds). Persisted theme + system default arrive in P7.

import * as React from "react";
import { DiagramCanvas } from "./scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "./scene/LabelsLayer";
import { EdgeLabelsLayer, type EdgeLabelsRegistry } from "./scene/edges/EdgeLabelsLayer";
import type { CameraApi } from "./scene/CameraControls";
import { NodePalette } from "./panels/NodePalette";
import { Toolbar } from "./panels/Toolbar";
import { Inspector } from "./panels/Inspector";
import { useWorkflowStore } from "./state/useWorkflowStore";
import { mvpSampleDiagram } from "./sampleDiagram";
import type { Diagram, EditorTheme } from "./state/types";

export interface IsometricWorkflowEditorProps {
  /** Seed document loaded on mount. @default mvpSampleDiagram */
  initialDiagram?: Diagram;
  /** Initial theme; persistence + system default land in P7. @default "light" */
  defaultTheme?: EditorTheme;
  /** Render the toolbar + palette + inspector. @default true */
  chrome?: boolean;
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
  chrome = true,
  className,
  style,
}: IsometricWorkflowEditorProps) {
  const [theme, setTheme] = React.useState<EditorTheme>(defaultTheme);
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

  // Minimal keyboard handling (full shortcuts in P13): delete selection, and
  // escape to cancel a connect drag or clear the selection.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const s = useWorkflowStore.getState();
      if (e.key === "Delete" || e.key === "Backspace") {
        if (s.selection?.type === "node") s.deleteNode(s.selection.id);
        else if (s.selection?.type === "edge") s.deleteEdge(s.selection.id);
      } else if (e.key === "Escape") {
        if (s.connectSourceId) s.endConnect();
        else s.clearSelection();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const rootStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
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
      {chrome ? <Toolbar apiRef={apiRef} theme={theme} onToggleTheme={toggleTheme} /> : null}

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {chrome ? (
          <NodePalette
            style={{ flex: "none", width: 208, height: "100%", borderRight: "1.5px solid var(--editor-border-soft)" }}
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

        {chrome ? (
          <Inspector
            style={{ flex: "none", width: 264, height: "100%", borderLeft: "1.5px solid var(--editor-border-soft)" }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default IsometricWorkflowEditor;
