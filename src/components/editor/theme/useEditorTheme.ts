"use client";

// Editor-scoped theme state: persisted to localStorage, defaulting to the OS
// preference. An explicit `initial` (e.g. a Storybook story) takes precedence so
// stories stay deterministic. The resolved value is written to data-editor-theme
// on the editor root (by IsometricWorkflowEditor) — the rest of the site is
// untouched. See description.md §9. The scene reads matching palettes from
// sceneTheme.ts (constants kept in sync with editor-tokens.css).

import { useCallback, useState } from "react";
import type { EditorTheme } from "../state/types";

const STORAGE_KEY = "sb-editor-theme";

function readStored(): EditorTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemPreference(): EditorTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** `initial`, when provided, wins (deterministic stories). Otherwise: stored
 *  preference → OS preference → light. */
export function useEditorTheme(initial?: EditorTheme) {
  const [theme, setThemeState] = useState<EditorTheme>(() => initial ?? readStored() ?? systemPreference());

  const setTheme = useCallback((next: EditorTheme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((t) => {
      const next = t === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, setTheme, toggle };
}
