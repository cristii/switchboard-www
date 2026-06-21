"use client";

// Top-level, composed editor. Owns the data-editor-theme root + theme toggle,
// seeds the store, and lays out the chrome responsively: toolbar on top, then
// either palette | stage | inspector (desktop) or stage + a segmented
// Add/Inspect bar opening bottom-sheet drawers (mobile). `chrome={false}`
// renders just the stage (galleries / read-only embeds).

import * as React from "react";
import { DiagramCanvas } from "./scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "./scene/LabelsLayer";
import { EdgeLabelsLayer, type EdgeLabelsRegistry } from "./scene/edges/EdgeLabelsLayer";
import type { CameraApi } from "./scene/CameraControls";
import { NodePalette } from "./panels/NodePalette";
import { Toolbar } from "./panels/Toolbar";
import { Inspector } from "./panels/Inspector";
import { MobileDrawer } from "./panels/MobileDrawer";
import { NodeGlyph } from "./icons/NodeGlyph";
import { useEditorTheme } from "./theme/useEditorTheme";
import { useResponsiveLayout } from "./hooks/useResponsiveLayout";
import { useWorkflowStore } from "./state/useWorkflowStore";
import { mvpSampleDiagram } from "./sampleDiagram";
import type { Diagram, EditorTheme, NodeKind } from "./state/types";

export interface IsometricWorkflowEditorProps {
  /** Seed document loaded on mount. @default mvpSampleDiagram */
  initialDiagram?: Diagram;
  /** Force an initial theme (deterministic). When omitted, the editor uses the
   *  stored preference, then the OS preference. */
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

type Drawer = "none" | "add" | "inspect";

export function IsometricWorkflowEditor({
  initialDiagram = mvpSampleDiagram,
  defaultTheme,
  chrome = true,
  className,
  style,
}: IsometricWorkflowEditorProps) {
  const { theme, toggle: toggleTheme } = useEditorTheme(defaultTheme);
  const [ready, setReady] = React.useState(false);
  const [drawer, setDrawer] = React.useState<Drawer>("none");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mode = useResponsiveLayout(rootRef);
  const isMobile = mode === "mobile";

  const labelsRef = React.useRef<LabelsRegistry>(new Map());
  const edgeLabelsRef = React.useRef<EdgeLabelsRegistry>(new Map());
  const apiRef = React.useRef<CameraApi>({ ...NOOP_API });

  const loadDiagram = useWorkflowStore((s) => s.loadDiagram);
  const addNode = useWorkflowStore((s) => s.addNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selection = useWorkflowStore((s) => s.selection);

  React.useEffect(() => {
    loadDiagram(initialDiagram);
  }, [initialDiagram, loadDiagram]);

  // Minimal keyboard handling (full shortcuts in P13): delete selection; escape
  // cancels a connect drag or clears the selection.
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

  const stage = (
    <div style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 0 }}>
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
  );

  const segButton = (active: boolean): React.CSSProperties => ({
    flex: 1,
    height: 50,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border: "none",
    background: active ? "var(--editor-surface-2)" : "transparent",
    color: active ? "var(--editor-accent)" : "var(--editor-text)",
    fontFamily: "var(--font-display, sans-serif)",
    fontWeight: 700,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
  });

  return (
    <div ref={rootRef} data-editor-theme={theme} className={className} style={rootStyle}>
      {chrome ? <Toolbar apiRef={apiRef} theme={theme} onToggleTheme={toggleTheme} compact={isMobile} /> : null}

      {!chrome ? (
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>{stage}</div>
      ) : isMobile ? (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {stage}
          <div style={{ display: "flex", flex: "none", borderTop: "1.5px solid var(--editor-border-soft)", background: "var(--editor-surface)" }}>
            <button
              type="button"
              style={segButton(drawer === "add")}
              onClick={() => setDrawer((d) => (d === "add" ? "none" : "add"))}
            >
              <NodeGlyph name="plus" size={16} /> Add
            </button>
            <span style={{ width: 1, background: "var(--editor-border-soft)" }} aria-hidden />
            <button
              type="button"
              style={segButton(drawer === "inspect")}
              onClick={() => setDrawer((d) => (d === "inspect" ? "none" : "inspect"))}
            >
              Inspect
            </button>
          </div>
          <MobileDrawer open={drawer === "add"} title="Add node" onClose={() => setDrawer("none")}>
            <NodePalette
              onAdd={(k: NodeKind) => {
                addNode(k);
                setDrawer("none");
              }}
            />
          </MobileDrawer>
          <MobileDrawer open={drawer === "inspect"} title="Inspector" onClose={() => setDrawer("none")}>
            <Inspector />
          </MobileDrawer>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <NodePalette
            style={{ flex: "none", width: 208, height: "100%", borderRight: "1.5px solid var(--editor-border-soft)" }}
          />
          {stage}
          <Inspector
            style={{ flex: "none", width: 264, height: "100%", borderLeft: "1.5px solid var(--editor-border-soft)" }}
          />
        </div>
      )}
    </div>
  );
}

export default IsometricWorkflowEditor;
