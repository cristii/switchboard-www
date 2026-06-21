"use client";

// Reports "mobile" vs "desktop" from the editor container's width (not the
// window — the editor can be embedded at any size). Drives the panel layout.

import { useEffect, useState } from "react";

export type LayoutMode = "mobile" | "desktop";

export function useResponsiveLayout(
  ref: React.RefObject<HTMLElement>,
  breakpoint = 720,
): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>("desktop");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setMode(el.clientWidth < breakpoint ? "mobile" : "desktop");
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);

  return mode;
}
