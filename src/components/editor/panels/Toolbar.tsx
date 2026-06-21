"use client";

// Top toolbar: undo/redo, zoom/fit/reset, export JSON/PNG, and a light/dark
// toggle. Built from editor IconButtons (bespoke glyphs, no emoji). Camera +
// PNG capture go through the lifted editor api ref; undo/redo + export read the
// store. The theme toggle flips the editor theme end-to-end (P7 adds persistence).

import * as React from "react";
import { IconButton } from "../primitives/IconButton";
import { ThemeToggle } from "./ThemeToggle";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { useExportJson } from "../hooks/useExportJson";
import { useExportPng } from "../hooks/useExportPng";
import type { CameraApi } from "../scene/CameraControls";
import type { EditorTheme } from "../state/types";

export interface ToolbarProps {
  apiRef: React.MutableRefObject<CameraApi>;
  theme: EditorTheme;
  onToggleTheme: () => void;
}

function Divider() {
  return (
    <span
      aria-hidden
      style={{ width: 1, height: 22, background: "var(--editor-border-soft)", margin: "0 4px", flex: "none" }}
    />
  );
}

export function Toolbar({ apiRef, theme, onToggleTheme }: ToolbarProps) {
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const pastLen = useWorkflowStore((s) => s.past.length);
  const futureLen = useWorkflowStore((s) => s.future.length);
  const exportJson = useExportJson();
  const exportPng = useExportPng(apiRef);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flex: "none",
        height: 46,
        padding: "0 10px",
        background: "var(--editor-surface)",
        borderBottom: "1.5px solid var(--editor-border-soft)",
        color: "var(--editor-text)",
      }}
    >
      <IconButton label="Undo" glyph="undo" onClick={undo} disabled={pastLen === 0} />
      <IconButton label="Redo" glyph="redo" onClick={redo} disabled={futureLen === 0} />
      <Divider />
      <IconButton label="Zoom in" glyph="zoomIn" onClick={() => apiRef.current.zoomIn()} />
      <IconButton label="Zoom out" glyph="zoomOut" onClick={() => apiRef.current.zoomOut()} />
      <IconButton label="Fit to content" glyph="fit" onClick={() => apiRef.current.fit()} />
      <IconButton label="Reset view" glyph="reset" onClick={() => apiRef.current.reset()} />
      <Divider />
      <IconButton label="Export JSON" glyph="download" onClick={exportJson} />
      <IconButton label="Export PNG" glyph="image" onClick={exportPng} />
      <div style={{ flex: 1 }} />
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

export default Toolbar;
