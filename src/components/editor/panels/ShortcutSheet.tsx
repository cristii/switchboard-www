"use client";

// Keyboard-shortcut cheat sheet: a small overlay opened with "?" or the toolbar
// help button. Read-only, closes on Escape / outside click / the close button.
// Editor-token styled (hard shadow, no blur).

import * as React from "react";
import { IconButton } from "../primitives/IconButton";

export interface ShortcutSheetProps {
  open: boolean;
  onClose: () => void;
}

const GROUPS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Edit",
    rows: [
      ["⌘/Ctrl + Z", "Undo"],
      ["⇧ + ⌘/Ctrl + Z", "Redo"],
      ["⌘/Ctrl + C / V", "Copy / paste selection"],
      ["⌘/Ctrl + D", "Duplicate selection"],
      ["Delete / ⌫", "Delete selection"],
      ["Double-click", "Rename node"],
    ],
  },
  {
    title: "Select & move",
    rows: [
      ["Click", "Select node / edge"],
      ["⇧ + click", "Add / remove from selection"],
      ["Drag on empty canvas", "Marquee select"],
      ["⌘/Ctrl + A", "Select all nodes"],
      ["Arrow keys", "Nudge selection (⇧ = larger)"],
      ["Alt + drag", "Drag a copy"],
    ],
  },
  {
    title: "Canvas",
    rows: [
      ["Scroll / pinch", "Zoom"],
      ["Ctrl/middle/right drag", "Pan"],
      ["Double-click canvas", "Reset view"],
      ["Drag from orange port", "Connect nodes"],
      ["Right-click", "Context menu"],
      ["Esc", "Cancel / close"],
    ],
  },
];

export function ShortcutSheet({ open, onClose }: ShortcutSheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "grid",
        placeItems: "center",
        background: "color-mix(in srgb, var(--editor-bg) 55%, transparent)",
      }}
    >
      <div
        role="dialog"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, calc(100% - 32px))",
          maxHeight: "calc(100% - 48px)",
          overflowY: "auto",
          borderRadius: 14,
          border: "1.5px solid var(--editor-border-soft)",
          background: "var(--editor-surface)",
          color: "var(--editor-text)",
          boxShadow: "var(--editor-shadow)",
          padding: "16px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.92rem",
            }}
          >
            Keyboard shortcuts
          </span>
          <IconButton label="Close" glyph="close" onClick={onClose} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "6px 22px",
          }}
        >
          {GROUPS.map((g) => (
            <div key={g.title}>
              <div
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--editor-text-muted)",
                  margin: "8px 0 6px",
                }}
              >
                {g.title}
              </div>
              {g.rows.map(([keys, what]) => (
                <div
                  key={keys}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "3px 0",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-body, sans-serif)",
                  }}
                >
                  <span style={{ color: "var(--editor-text-muted)" }}>{what}</span>
                  <code
                    style={{
                      flex: "none",
                      padding: "1px 7px",
                      borderRadius: 6,
                      border: "1px solid var(--editor-border-soft)",
                      background: "var(--editor-surface-2)",
                      fontSize: "0.7rem",
                    }}
                  >
                    {keys}
                  </code>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShortcutSheet;
