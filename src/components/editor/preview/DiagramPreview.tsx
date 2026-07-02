"use client";

// Read-only, embeddable diagram view. Reuses the shared DiagramCanvas in
// non-interactive mode (PreviewNode, no editing) so it has no store coupling and
// multiple instances are independent. Appearance + camera come from PreviewConfig.
// Phase 1: static (optional camera movement). Scroll-driven control + highlights
// arrive in phase 2 — see isometric_workflow_editor_preview_mode.md.
//
// Heavy (three.js): consumers should mount it via next/dynamic({ ssr: false }).
// The host page must import the editor tokens CSS so --editor-* resolve.

import * as React from "react";
import { DiagramCanvas } from "../scene/DiagramCanvas";
import { LabelsLayer, type LabelsRegistry } from "../scene/LabelsLayer";
import { EdgeLabelsLayer, type EdgeLabelsRegistry } from "../scene/edges/EdgeLabelsLayer";
import type { CameraApi } from "../scene/CameraControls";
import { DEFAULT_PREVIEW_CONFIG, type PreviewConfig } from "./previewConfig";
import { resolveThemeFromConfig } from "../theme/themeRegistry";
import type { Diagram } from "../state/types";

export interface DiagramPreviewProps {
  diagram: Diagram;
  config?: Partial<PreviewConfig>;
  className?: string;
  style?: React.CSSProperties;
  /** External camera API ref (e.g. to capturePng for a static snapshot). */
  apiRef?: React.MutableRefObject<CameraApi>;
  /** Fired once the canvas is created/ready. */
  onReady?: () => void;
}

const NOOP_API: CameraApi = {
  reset: () => {},
  fit: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  capturePng: () => null,
  getCamera: () => ({ zoom: 1, target: [0, 0] }),
};

export function DiagramPreview({ diagram, config, className, style, apiRef: externalApiRef, onReady }: DiagramPreviewProps) {
  const cfg: PreviewConfig = { ...DEFAULT_PREVIEW_CONFIG, ...config };
  const spec = React.useMemo(() => resolveThemeFromConfig(cfg.theme), [cfg.theme]);
  const labelMode = spec.text.mode ?? "3d";
  const [ready, setReady] = React.useState(false);
  const labelsRef = React.useRef<LabelsRegistry>(new Map());
  const edgeLabelsRef = React.useRef<EdgeLabelsRegistry>(new Map());
  const internalApiRef = React.useRef<CameraApi>({ ...NOOP_API });
  const apiRef = externalApiRef ?? internalApiRef;

  const fitOnMount = cfg.cameraZoom === undefined && cfg.cameraTarget === undefined;

  const rootStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    background: cfg.transparent ? "transparent" : "var(--editor-bg)",
    overflow: "hidden",
    ...style,
  };

  return (
    <div data-editor-theme={spec.chromeBase} className={className} style={rootStyle}>
      <div style={{ position: "absolute", inset: 0 }}>
        <DiagramCanvas
          spec={spec}
          nodes={diagram.nodes}
          edges={diagram.edges}
          interactive={false}
          showGrid={cfg.showGrid}
          showGround={cfg.showGround}
          showLabels={cfg.showLabels}
          labelsRef={labelsRef}
          edgeLabelsRef={edgeLabelsRef}
          apiRef={apiRef}
          cameraEnabled={cfg.cameraMovable}
          animateNodes={cfg.cameraMovable}
          initialZoom={cfg.cameraZoom}
          initialTarget={cfg.cameraTarget}
          fitOnMount={fitOnMount}
          fitScale={cfg.cameraFit}
          transparent={cfg.transparent}
          onReady={() => {
            setReady(true);
            onReady?.();
          }}
        />
        {cfg.showLabels && labelMode === "dom" ? (
          <LabelsLayer nodes={diagram.nodes} selection={null} labelsRef={labelsRef} />
        ) : null}
        {cfg.showLabels && labelMode === "dom" ? (
          <EdgeLabelsLayer edges={diagram.edges} registry={edgeLabelsRef} />
        ) : null}
      </div>

      {!ready ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: cfg.transparent ? "transparent" : "var(--editor-bg)",
            color: "var(--editor-text-muted)",
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: "0.78rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          Loading…
        </div>
      ) : null}
    </div>
  );
}

export default DiagramPreview;
