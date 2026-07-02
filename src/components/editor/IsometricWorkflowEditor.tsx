"use client";

// Top-level, composed editor. Owns the active ThemeSpec (via useThemeManager) +
// the data-editor-theme root, seeds the store, and lays out the chrome
// responsively: toolbar on top, then either palette | stage | inspector (desktop)
// or stage + a segmented Add/Inspect bar opening bottom-sheet drawers (mobile).
// The Theme manager pane opens from the toolbar (desktop overlay / mobile drawer).
// `chrome={false}` renders just the stage (galleries / read-only embeds).

import * as React from "react";
import { DiagramCanvas } from "./scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "./scene/LabelsLayer";
import { EdgeLabelsLayer, type EdgeLabelsRegistry } from "./scene/edges/EdgeLabelsLayer";
import type { CameraApi } from "./scene/CameraControls";
import { NodePalette } from "./panels/NodePalette";
import { Toolbar } from "./panels/Toolbar";
import { Inspector } from "./panels/Inspector";
import { ThemeManager } from "./panels/ThemeManager";
import { NodeContextMenu } from "./panels/NodeContextMenu";
import { InlineLabelEditor } from "./panels/InlineLabelEditor";
import { ShortcutSheet } from "./panels/ShortcutSheet";
import { MobileDrawer } from "./panels/MobileDrawer";
import { NodeGlyph } from "./icons/NodeGlyph";
import { useThemeManager } from "./theme/useThemeManager";
import { useResponsiveLayout } from "./hooks/useResponsiveLayout";
import { findFreeSpot, useWorkflowStore } from "./state/useWorkflowStore";
import { PRESETS } from "./catalog/presets";
import { layeredLayout } from "./catalog/layout/autoLayout";
import { mvpSampleDiagram } from "./sampleDiagram";
import { serializePreviewDoc, type PreviewDoc } from "./preview/previewConfig";
import type { Diagram, EditorTheme, NodeKind, WorkflowNode } from "./state/types";

const AUTOSAVE_KEY = "sb-editor-doc";
const REF_ZOOM = 38; // orthographic zoom that reads as "100%"

export interface IsometricWorkflowEditorProps {
  /** Seed document loaded on mount. @default mvpSampleDiagram */
  initialDiagram?: Diagram;
  /** Force an initial chrome theme (deterministic). Maps to the built-in
   *  light/dark theme ids. When omitted, the stored/last-used theme is used. */
  defaultTheme?: EditorTheme;
  /** Force an initial theme by id ("light" | "dark" | "aws" | user id). Takes
   *  precedence over defaultTheme. */
  defaultThemeId?: string;
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
  zoomTo: () => {},
  beginPan: () => {},
  getCamera: () => ({ zoom: 1, target: [0, 0] }),
  groundAt: () => null,
};

type Drawer = "none" | "add" | "inspect" | "theme";

export function IsometricWorkflowEditor({
  initialDiagram = mvpSampleDiagram,
  defaultTheme,
  defaultThemeId,
  chrome = true,
  className,
  style,
}: IsometricWorkflowEditorProps) {
  const manager = useThemeManager(defaultThemeId ?? defaultTheme);
  const spec = manager.spec;
  const labelMode = spec.text.mode ?? "3d";
  const [ready, setReady] = React.useState(false);
  const [drawer, setDrawer] = React.useState<Drawer>("none");
  const [themePanel, setThemePanel] = React.useState(false);
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
  const selectEdge = useWorkflowStore((s) => s.selectEdge);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);
  const linkMode = useWorkflowStore((s) => s.linkMode);
  const linkSourceId = useWorkflowStore((s) => s.linkSourceId);
  const snap = useWorkflowStore((s) => s.snap);
  const setSnap = useWorkflowStore((s) => s.setSnap);
  const guides = useWorkflowStore((s) => s.guides);
  const openContextMenu = useWorkflowStore((s) => s.openContextMenu);

  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [zoomPct, setZoomPct] = React.useState(100);

  // Autosaved doc captured SYNCHRONOUSLY before the seed effect can overwrite it.
  const [savedAtMount] = React.useState<Diagram | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(AUTOSAVE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Diagram) : null;
      return parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  });
  // Offer a restore only when we opened with the default sample (an explicit
  // initialDiagram — a library/playground handoff — always wins).
  const [restoreOffer, setRestoreOffer] = React.useState<boolean>(
    () => chrome && initialDiagram === mvpSampleDiagram && savedAtMount !== null,
  );

  React.useEffect(() => {
    loadDiagram(initialDiagram);
  }, [initialDiagram, loadDiagram]);

  // Autosave the working document (debounced) so a reload never loses work.
  React.useEffect(() => {
    if (!chrome) return;
    let t: number | undefined;
    const unsub = useWorkflowStore.subscribe((s, prev) => {
      if (s.nodes === prev.nodes && s.edges === prev.edges) return;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        try {
          window.localStorage.setItem(
            AUTOSAVE_KEY,
            JSON.stringify(useWorkflowStore.getState().exportDiagram()),
          );
        } catch {
          /* quota / privacy mode */
        }
      }, 800);
    });
    return () => {
      window.clearTimeout(t);
      unsub();
    };
  }, [chrome]);

  // Live zoom readout (poll — cheap, avoids threading camera state through R3F).
  React.useEffect(() => {
    if (!chrome) return;
    const t = window.setInterval(() => {
      const z = apiRef.current.getCamera().zoom;
      const pct = Math.max(1, Math.round((z / REF_ZOOM) * 100));
      setZoomPct((p) => (p === pct ? p : pct));
    }, 300);
    return () => window.clearInterval(t);
  }, [chrome]);

  // Copy the current scene as a { config, diagram } doc (the playground / library
  // format) — captures the live camera + the active theme (background/grid/lights).
  const handleCopyJson = React.useCallback(() => {
    const cam = apiRef.current.getCamera();
    const json: PreviewDoc = {
      config: {
        theme: spec,
        showGrid: spec.grid.show,
        showGround: spec.shadow.enabled,
        showLabels: true,
        cameraMovable: true,
        cameraZoom: cam.zoom,
        cameraTarget: cam.target,
      },
      diagram: useWorkflowStore.getState().exportDiagram(),
    };
    void navigator.clipboard.writeText(serializePreviewDoc(json)).catch(() => {});
  }, [spec]);

  // Full keyboard map: undo/redo, clipboard, duplicate, select-all, delete,
  // arrow nudge, "?" cheat sheet, Escape cascade. Never fires while typing.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.closest("input, textarea, select") || (el as HTMLElement).isContentEditable)
      ) {
        return;
      }
      const s = useWorkflowStore.getState();
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();

      if (mod && k === "z") {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (mod && k === "y") {
        e.preventDefault();
        s.redo();
        return;
      }
      if (mod && k === "a") {
        e.preventDefault();
        s.selectAll();
        return;
      }
      if (mod && k === "c") {
        s.copySelection();
        return;
      }
      if (mod && k === "v") {
        s.pasteClipboard();
        return;
      }
      if (mod && k === "d") {
        e.preventDefault();
        void s.duplicateSelection();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        s.deleteSelection();
        return;
      }
      if (e.key === "?") {
        setShortcutsOpen((v) => !v);
        return;
      }
      if (e.key.startsWith("Arrow")) {
        if (s.selection?.type !== "node") return;
        e.preventDefault();
        const step = e.shiftKey ? 2 : 0.5;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        s.nudgeSelection(dx, dy);
        return;
      }
      if (e.key === "Escape") {
        setShortcutsOpen(false);
        if (s.labelEditor) s.closeLabelEditor();
        else if (s.linkMode) s.cancelLink();
        else if (s.connectSourceId) s.endConnect();
        else s.clearSelection();
        s.closeContextMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const templateOptions = React.useMemo(
    () => [...PRESETS.map((p) => ({ id: p.id, label: p.label })), { id: "clear", label: "Clear canvas" }],
    [],
  );
  const handlePickTemplate = (id: string) => {
    if (id === "clear") useWorkflowStore.getState().clear();
    else {
      const preset = PRESETS.find((p) => p.id === id);
      if (preset) loadDiagram(preset.diagram);
    }
    setDrawer("none");
  };
  const handleAutoArrange = () => {
    const s = useWorkflowStore.getState();
    s.arrange(layeredLayout(s.nodes, s.edges));
  };

  // Click-to-add places at the viewport centre (nearest free spot, snapped);
  // dragging a palette item drops it exactly at the pointer's ground point.
  const snapVal = (v: number) => (useWorkflowStore.getState().snap ? Math.round(v * 2) / 2 : v);
  const handlePaletteAdd = React.useCallback(
    (kind: NodeKind, partial?: Partial<WorkflowNode>) => {
      const s = useWorkflowStore.getState();
      const [tx, ty] = apiRef.current.getCamera().target;
      const spot = findFreeSpot(s.nodes, snapVal(tx), snapVal(ty));
      addNode(kind, { x: snapVal(spot.x), y: snapVal(spot.y), ...partial });
    },
    [addNode],
  );
  const handleDropNode = React.useCallback(
    (kind: NodeKind, partial: Partial<WorkflowNode> | undefined, clientX: number, clientY: number) => {
      const pt = apiRef.current.groundAt(clientX, clientY);
      if (!pt) return; // dropped outside the canvas
      addNode(kind, { x: snapVal(pt[0]), y: snapVal(pt[1]), ...partial });
    },
    [addNode],
  );

  const handleMarqueeSelect = React.useCallback((ids: string[], additive: boolean) => {
    const s = useWorkflowStore.getState();
    if (additive && s.selection?.type === "node") {
      s.selectNodes(Array.from(new Set([...s.selection.ids, ...ids])));
    } else if (ids.length > 0) {
      s.selectNodes(ids);
    } else if (!additive) {
      s.clearSelection();
    }
  }, []);

  const toggleThemeManager = () => {
    if (isMobile) setDrawer((d) => (d === "theme" ? "none" : "theme"));
    else setThemePanel((v) => !v);
  };

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
    <div style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 0, cursor: linkMode ? "crosshair" : undefined }}>
      <DiagramCanvas
        spec={spec}
        nodes={nodes}
        edges={edges}
        selection={selection}
        labelsRef={labelsRef}
        edgeLabelsRef={edgeLabelsRef}
        apiRef={apiRef}
        showGrid={spec.grid.show}
        showGround={spec.shadow.enabled}
        onSelectEdge={selectEdge}
        onBackgroundClick={clearSelection}
        onEdgeContextMenu={(id, x, y) => {
          selectEdge(id);
          openContextMenu("edge", id, x, y);
        }}
        onCanvasContextMenu={(x, y) => openContextMenu("canvas", null, x, y)}
        onMarqueeSelect={handleMarqueeSelect}
        guides={guides}
        onReady={() => setReady(true)}
      />
      {ready && nodes.length === 0 && chrome ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "18px 22px",
              borderRadius: 12,
              border: "1.5px dashed var(--editor-border-soft)",
              background: "var(--editor-surface)",
              color: "var(--editor-text-muted)",
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "0.84rem",
              textAlign: "center",
              maxWidth: 320,
            }}
          >
            <span>
              The canvas is empty. {isMobile ? "Tap Add below" : "Click or drag a node from the palette"} —
              or start from a template.
            </span>
            <button
              type="button"
              onClick={() => handlePickTemplate(PRESETS[0]?.id ?? "clear")}
              style={{
                pointerEvents: "auto",
                padding: "7px 14px",
                borderRadius: 999,
                border: "1.5px solid var(--editor-accent)",
                background: "transparent",
                color: "var(--editor-accent)",
                fontFamily: "var(--font-display, sans-serif)",
                fontWeight: 700,
                fontSize: "0.74rem",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Load a sample
            </button>
          </div>
        </div>
      ) : null}
      {labelMode === "dom" ? (
        <>
          <LabelsLayer nodes={nodes} selection={selection} labelsRef={labelsRef} />
          <EdgeLabelsLayer edges={edges} registry={edgeLabelsRef} />
        </>
      ) : null}
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
      {linkMode ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 11,
            padding: "6px 12px",
            borderRadius: 8,
            background: "var(--editor-surface)",
            border: "1.5px solid var(--editor-accent)",
            color: "var(--editor-text)",
            boxShadow: "var(--editor-shadow)",
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {linkSourceId ? "Click the target node" : "Click the first node"} · Esc to cancel
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
    <div ref={rootRef} data-editor-theme={manager.chromeBase} className={className} style={rootStyle}>
      {chrome ? (
        <Toolbar
          apiRef={apiRef}
          theme={manager.chromeBase}
          onToggleTheme={manager.toggleChrome}
          compact={isMobile}
          templates={templateOptions}
          onPickTemplate={handlePickTemplate}
          onAutoArrange={handleAutoArrange}
          showGrid={spec.grid.show}
          showGround={spec.shadow.enabled}
          onToggleGrid={() => manager.patch((d) => (d.grid.show = !d.grid.show))}
          onToggleGround={() => manager.patch((d) => (d.shadow.enabled = !d.shadow.enabled))}
          snap={snap}
          onToggleSnap={() => setSnap(!snap)}
          zoomPercent={zoomPct}
          onZoomTo100={() => apiRef.current.zoomTo(REF_ZOOM)}
          onShowShortcuts={() => setShortcutsOpen(true)}
          onToggleThemeManager={toggleThemeManager}
          themeManagerOpen={isMobile ? drawer === "theme" : themePanel}
          onCopyJson={handleCopyJson}
        />
      ) : null}

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
              onAdd={(k, partial) => {
                handlePaletteAdd(k, partial);
                setDrawer("none");
              }}
            />
          </MobileDrawer>
          <MobileDrawer open={drawer === "inspect"} title="Inspector" onClose={() => setDrawer("none")}>
            <Inspector roleColors={spec.nodes.colors} />
          </MobileDrawer>
          <MobileDrawer open={drawer === "theme"} title="Theme manager" onClose={() => setDrawer("none")}>
            <ThemeManager manager={manager} />
          </MobileDrawer>
        </div>
      ) : (
        <div style={{ position: "relative", display: "flex", flex: 1, minHeight: 0 }}>
          <NodePalette
            onAdd={handlePaletteAdd}
            onDropNode={handleDropNode}
            style={{ flex: "none", width: 208, height: "100%", borderRight: "1.5px solid var(--editor-border-soft)" }}
          />
          {stage}
          <Inspector
            roleColors={spec.nodes.colors}
            style={{ flex: "none", width: 264, height: "100%", borderLeft: "1.5px solid var(--editor-border-soft)" }}
          />
          {themePanel ? (
            <ThemeManager
              manager={manager}
              onClose={() => setThemePanel(false)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 300,
                height: "100%",
                borderLeft: "1.5px solid var(--editor-border-soft)",
                boxShadow: "var(--editor-shadow)",
                zIndex: 12,
              }}
            />
          ) : null}
        </div>
      )}

      {chrome ? <NodeContextMenu onFitView={() => apiRef.current.fit()} /> : null}
      {chrome ? <InlineLabelEditor /> : null}
      {chrome ? <ShortcutSheet open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} /> : null}

      {restoreOffer ? (
        <div
          role="status"
          style={{
            position: "absolute",
            bottom: isMobile ? 62 : 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 14px",
            borderRadius: 12,
            border: "1.5px solid var(--editor-border-soft)",
            background: "var(--editor-surface)",
            color: "var(--editor-text)",
            boxShadow: "var(--editor-shadow)",
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}
        >
          Restore your last session?
          <button
            type="button"
            onClick={() => {
              if (savedAtMount) useWorkflowStore.getState().importDiagram(savedAtMount);
              setRestoreOffer(false);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "1.5px solid var(--editor-accent)",
              background: "var(--editor-accent)",
              color: "#fff",
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Restore
          </button>
          <button
            type="button"
            onClick={() => setRestoreOffer(false)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "1.5px solid var(--editor-border-soft)",
              background: "transparent",
              color: "var(--editor-text-muted)",
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default IsometricWorkflowEditor;
