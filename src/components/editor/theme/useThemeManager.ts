"use client";

// Owns the editor's active theme: which ThemeSpec is live, plus create / rename /
// duplicate / delete / import / export. Editing autosaves to localStorage (the
// active id under `sb-editor-theme-id`, user themes via the registry) — editing a
// built-in transparently forks an override you can "Reset to built-in" later.
// The editor derives `data-editor-theme` from spec.chromeBase. Instance-local
// (not in the singleton store), so previews/embeds stay independent.

import { useCallback, useMemo, useState } from "react";
import { cloneThemeSpec, normalizeThemeSpec, type ThemeSpec } from "./themeSpec";
import {
  deleteUserTheme,
  getThemeSpec,
  isBuiltIn,
  listThemes,
  saveUserTheme,
  uniqueThemeId,
} from "./themeRegistry";
import { lightTheme } from "./themes/light";

const ACTIVE_KEY = "sb-editor-theme-id";

function readActiveId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

// With no saved editor theme, follow the site's light/dark mode (set on <html>
// by the no-flash bootstrap in src/app/layout.tsx) instead of defaulting to
// light. Maps onto the built-in "light"/"dark" editor themes. Once the user
// picks an editor theme explicitly, that choice is persisted and wins.
function siteThemeId(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function writeActiveId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
}

export interface ThemeManagerApi {
  themeId: string;
  spec: ThemeSpec;
  chromeBase: "light" | "dark";
  themes: ThemeSpec[];
  /** Switch the active theme. */
  setThemeId: (id: string) => void;
  /** Quick light/dark chrome flip (maps to the built-in light/dark themes). */
  toggleChrome: () => void;
  /** Mutate the active spec via a draft; live + autosaved. */
  patch: (mutate: (draft: ThemeSpec) => void) => void;
  /** Replace the active spec wholesale; live + autosaved. */
  replace: (next: ThemeSpec) => void;
  /** Fork the current spec into a new user theme and switch to it. */
  createTheme: (name: string) => void;
  duplicateTheme: (name?: string) => void;
  renameTheme: (name: string) => void;
  /** Delete the active user theme (no-op message for shipped built-ins). */
  deleteTheme: () => void;
  /** Drop a built-in override, restoring the shipped values. */
  resetToBuiltIn: () => void;
  /** Import pasted JSON as the active theme. Returns an error string or null. */
  importThemeJson: (json: string) => string | null;
  exportThemeJson: () => string;
}

export function useThemeManager(initialId?: string): ThemeManagerApi {
  const startId = initialId ?? readActiveId() ?? siteThemeId();
  const [themeId, setThemeIdState] = useState<string>(startId);
  const [spec, setSpec] = useState<ThemeSpec>(() => getThemeSpec(startId));
  // Bumped on any persistence change so the themes list refreshes.
  const [version, setVersion] = useState(0);

  const themes = useMemo(() => listThemes(), [version, themeId]);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    writeActiveId(id);
    setSpec(getThemeSpec(id));
  }, []);

  const patch = useCallback((mutate: (draft: ThemeSpec) => void) => {
    setSpec((prev) => {
      const draft = cloneThemeSpec(prev);
      mutate(draft);
      saveUserTheme(draft);
      return draft;
    });
    setVersion((v) => v + 1);
  }, []);

  const replace = useCallback((next: ThemeSpec) => {
    setSpec(next);
    saveUserTheme(next);
    setVersion((v) => v + 1);
  }, []);

  const forkInto = useCallback(
    (name: string) => {
      const id = uniqueThemeId(name || "theme");
      const next: ThemeSpec = { ...cloneThemeSpec(spec), id, name: name || id, builtIn: false };
      saveUserTheme(next);
      setThemeIdState(id);
      writeActiveId(id);
      setSpec(next);
      setVersion((v) => v + 1);
    },
    [spec],
  );

  const createTheme = useCallback((name: string) => forkInto(name), [forkInto]);
  const duplicateTheme = useCallback(
    (name?: string) => forkInto(name ?? `${spec.name} copy`),
    [forkInto, spec.name],
  );

  const renameTheme = useCallback((name: string) => patch((d) => (d.name = name)), [patch]);

  const deleteTheme = useCallback(() => {
    deleteUserTheme(themeId);
    setVersion((v) => v + 1);
    if (isBuiltIn(themeId)) {
      setSpec(getThemeSpec(themeId)); // restore shipped built-in
    } else {
      const fallback = "light";
      setThemeIdState(fallback);
      writeActiveId(fallback);
      setSpec(getThemeSpec(fallback));
    }
  }, [themeId]);

  const resetToBuiltIn = useCallback(() => {
    if (!isBuiltIn(themeId)) return;
    deleteUserTheme(themeId);
    setSpec(getThemeSpec(themeId));
    setVersion((v) => v + 1);
  }, [themeId]);

  const importThemeJson = useCallback(
    (json: string): string | null => {
      try {
        const parsed = JSON.parse(json) as unknown;
        const normalized = normalizeThemeSpec(parsed, getThemeSpec(themeId) ?? lightTheme);
        const next: ThemeSpec = { ...normalized, id: themeId, name: spec.name, builtIn: false };
        replace(next);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : String(e);
      }
    },
    [themeId, spec.name, replace],
  );

  const exportThemeJson = useCallback(() => JSON.stringify(spec, null, 2), [spec]);

  const toggleChrome = useCallback(() => {
    setThemeId(spec.chromeBase === "light" ? "dark" : "light");
  }, [spec.chromeBase, setThemeId]);

  return {
    themeId,
    spec,
    chromeBase: spec.chromeBase,
    themes,
    setThemeId,
    toggleChrome,
    patch,
    replace,
    createTheme,
    duplicateTheme,
    renameTheme,
    deleteTheme,
    resetToBuiltIn,
    importThemeJson,
    exportThemeJson,
  };
}
