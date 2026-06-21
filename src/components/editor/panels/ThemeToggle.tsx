"use client";

// Light/dark toggle button (sun in dark mode, moon in light). Thin wrapper over
// IconButton so the toolbar and any other surface share one control.

import { IconButton } from "../primitives/IconButton";
import type { EditorTheme } from "../state/types";

export interface ThemeToggleProps {
  theme: EditorTheme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <IconButton
      label={theme === "dark" ? "Switch to light" : "Switch to dark"}
      glyph={theme === "dark" ? "sun" : "moon"}
      onClick={onToggle}
    />
  );
}

export default ThemeToggle;
