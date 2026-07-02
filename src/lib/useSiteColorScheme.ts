"use client";

// The site's current light/dark scheme, as applied to <html data-theme> by the
// no-flash bootstrap + useTheme (src/lib/useTheme.ts). Unlike useTheme (which
// OWNS the choice), this is a passive reader: it observes attribute changes via
// MutationObserver, so any component — e.g. the embedded isometric diagrams
// picking signal vs signalDark — re-renders when the toggle flips.

import { useEffect, useState } from "react";

export type SiteColorScheme = "light" | "dark";

function read(): SiteColorScheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useSiteColorScheme(): SiteColorScheme {
  // First client render matches SSR ("light"); the effect corrects it before paint.
  const [scheme, setScheme] = useState<SiteColorScheme>("light");

  useEffect(() => {
    setScheme(read());
    const observer = new MutationObserver(() => setScheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return scheme;
}

export default useSiteColorScheme;
