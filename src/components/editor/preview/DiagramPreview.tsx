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
import type { Diagram } from "../state/types";

export interface DiagramPreviewProps {
  diagram: Diagram;
  config?: Partial<PreviewConfig>;
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

export function DiagramPreview({ diagram, config, className, style }: DiagramPreviewProps) {
  const cfg: PreviewConfig = { ...DEFAULT_PREVIEW_CONFIG, ...config };
  const [ready, setReady] = React.useState(false);
  const labelsRef = React.useRef<LabelsRegistry>(new Map());
  const edgeLabelsRef = React.useRef<EdgeLabelsRegistry>(new Map());
  const apiRef = React.useRef<CameraApi>({ ...NOOP_API });

  const fitOnMount = cfg.cameraZoom === undefined && cfg.cameraTarget === undefined;

  const rootStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "var(--editor-bg)",
    overflow: "hidden",
    ...style,
  };

  return (
    <div data-editor-theme={cfg.theme} className={className} style={rootStyle}>
      <div style={{ position: "absolute", inset: 0 }}>
        <DiagramCanvas
          theme={cfg.theme}
          nodes={diagram.nodes}
          edges={diagram.edges}
          interactive={false}
          showGrid={cfg.showGrid}
          showGround={cfg.showGround}
          labelsRef={labelsRef}
          edgeLabelsRef={edgeLabelsRef}
          apiRef={apiRef}
          cameraEnabled={cfg.cameraMovable}
          initialZoom={cfg.cameraZoom}
          initialTarget={cfg.cameraTarget}
          fitOnMount={fitOnMount}
          onReady={() => setReady(true)}
        />
        {cfg.showLabels ? (
          <LabelsLayer nodes={diagram.nodes} selection={null} labelsRef={labelsRef} />
        ) : null}
        {cfg.showLabels ? <EdgeLabelsLayer edges={diagram.edges} registry={edgeLabelsRef} /> : null}
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
