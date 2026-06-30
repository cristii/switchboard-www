"use client";

// Site light/dark theme. The no-flash bootstrap in src/app/layout.tsx sets the
// initial data-theme on <html> before paint; this hook owns runtime changes.
//
// Persistence model (mirrors the editor's sb-editor-theme-id convention):
//   • localStorage["sb-theme"] = "light" | "dark"  → an explicit manual choice
//   • absent                                       → follow the OS (system mode)
// In system mode we live-subscribe to prefers-color-scheme so the site flips
// when the OS does. Toggling writes an explicit choice and stops following.

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sb-theme";
const MEDIA = "(prefers-color-scheme: dark)";

export type Theme = "light" | "dark";
export type ThemeSource = "system" | "manual";

/** Browser-UI colour per theme; keep in step with --paper in colors.css. */
const META_COLOR: Record<Theme, string> = { light: "#E9E8DF", dark: "#0E1A18" };

function readStored(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", META_COLOR[theme]);
}

export interface UseThemeApi {
  /** The currently rendered theme. */
  theme: Theme;
  /** Whether we're following the OS or honouring an explicit choice. */
  source: ThemeSource;
  /** Flip to the opposite theme and persist it as a manual choice. */
  toggle: () => void;
  /** Forget the manual choice and follow the OS again. */
  useSystem: () => void;
}

export function useTheme(): UseThemeApi {
  // Start from whatever the bootstrap already put on <html> to avoid a hydration
  // mismatch; fall back to stored/system for the very first client render.
  const [theme, setTheme] = useState<Theme>("light");
  const [source, setSource] = useState<ThemeSource>("system");

  useEffect(() => {
    const stored = readStored();
    const current =
      (document.documentElement.dataset.theme as Theme | undefined) ??
      stored ??
      systemTheme();
    setTheme(current);
    setSource(stored ? "manual" : "system");
  }, []);

  // While following the OS, react to its changes live.
  useEffect(() => {
    if (source !== "system") return;
    const mq = window.matchMedia(MEDIA);
    const onChange = () => {
      const next = mq.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [source]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      applyTheme(next);
      return next;
    });
    setSource("manual");
  }, []);

  const useSystem = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSource("system");
    const next = systemTheme();
    setTheme(next);
    applyTheme(next);
  }, []);

  return { theme, source, toggle, useSystem };
}

export default useTheme;
