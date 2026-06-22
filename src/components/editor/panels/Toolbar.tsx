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
  /** Pack buttons + allow horizontal scroll (narrow screens). @default false */
  compact?: boolean;
  /** Optional template picker entries (load presets). */
  templates?: { id: string; label: string }[];
  onPickTemplate?: (id: string) => void;
  /** Optional auto-arrange action. */
  onAutoArrange?: () => void;
  /** View toggles. */
  showGrid?: boolean;
  showGround?: boolean;
  onToggleGrid?: () => void;
  onToggleGround?: () => void;
  /** Theme manager pane toggle. */
  onToggleThemeManager?: () => void;
  themeManagerOpen?: boolean;
}

const templateSelectStyle: React.CSSProperties = {
  height: 32,
  maxWidth: 150,
  padding: "0 8px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border-soft)",
  background: "var(--editor-surface-2)",
  color: "var(--editor-text)",
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.78rem",
  cursor: "pointer",
  flex: "none",
};

function Divider() {
  return (
    <span
      aria-hidden
      style={{ width: 1, height: 22, background: "var(--editor-border-soft)", margin: "0 4px", flex: "none" }}
    />
  );
}

export function Toolbar({
  apiRef,
  theme,
  onToggleTheme,
  compact = false,
  templates,
  onPickTemplate,
  onAutoArrange,
  showGrid = true,
  showGround = true,
  onToggleGrid,
  onToggleGround,
  onToggleThemeManager,
  themeManagerOpen = false,
}: ToolbarProps) {
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
        overflowX: compact ? "auto" : "visible",
      }}
    >
      {templates && templates.length > 0 ? (
        <>
          <select
            aria-label="Load a template"
            title="Load a template"
            value=""
            onChange={(e) => {
              if (e.currentTarget.value) onPickTemplate?.(e.currentTarget.value);
              e.currentTarget.value = "";
            }}
            style={templateSelectStyle}
          >
            <option value="" disabled>
              Templates…
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <Divider />
        </>
      ) : null}
      <IconButton label="Undo" glyph="undo" onClick={undo} disabled={pastLen === 0} />
      <IconButton label="Redo" glyph="redo" onClick={redo} disabled={futureLen === 0} />
      <Divider />
      <IconButton label="Zoom in" glyph="zoomIn" onClick={() => apiRef.current.zoomIn()} />
      <IconButton label="Zoom out" glyph="zoomOut" onClick={() => apiRef.current.zoomOut()} />
      <IconButton label="Fit to content" glyph="fit" onClick={() => apiRef.current.fit()} />
      <IconButton label="Reset view" glyph="reset" onClick={() => apiRef.current.reset()} />
      {onAutoArrange ? (
        <IconButton label="Auto-arrange" glyph="layout" onClick={onAutoArrange} />
      ) : null}
      <Divider />
      {onToggleGrid ? (
        <IconButton label="Toggle grid" glyph="grid" active={showGrid} onClick={onToggleGrid} />
      ) : null}
      {onToggleGround ? (
        <IconButton label="Toggle shadows" glyph="shadow" active={showGround} onClick={onToggleGround} />
      ) : null}
      <Divider />
      <IconButton label="Export JSON" glyph="download" onClick={exportJson} />
      <IconButton label="Export PNG" glyph="image" onClick={exportPng} />
      {compact ? <Divider /> : <div style={{ flex: 1 }} />}
      {onToggleThemeManager ? (
        <IconButton label="Theme manager" glyph="palette" active={themeManagerOpen} onClick={onToggleThemeManager} />
      ) : null}
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

export default Toolbar;
