"use client";

// /process isometric scenes (signal theme): the hero horizontal workflow ("flow")
// and the per-step single node ("node"). Rendered once to a static image via
// IsoSnapshotPreview. `background` matches the diagram to its parent section (the
// 3D backdrop + the DOM wrapper) so it blends in; on a dark section the grid flips
// to a faint light tint. The host page must import the editor tokens CSS.

import * as React from "react";
import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { ThemeSpec } from "@/components/editor/theme/themeSpec";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

/** Relative luminance of a #rrggbb colour (0 dark – 1 light). */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

export function ProcessIsoPreview({
  diagram,
  variant = "node",
  background,
}: {
  diagram: Diagram;
  variant?: "flow" | "node";
  background?: string;
}) {
  const theme = React.useMemo<ThemeSpec>(() => {
    if (!background) return signalTheme;
    const dark = luminance(background) < 0.4;
    return {
      ...signalTheme,
      background: { type: "flat", color: background, colorHi: background },
      grid: dark
        ? { show: true, color: "#e9e8df", sectionColor: "#e9e8df", opacity: 0.07 }
        : signalTheme.grid,
    };
  }, [background]);

  const className =
    variant === "flow"
      ? "mx-auto h-[210px] w-full max-w-[880px] overflow-hidden rounded-xl sm:h-[250px]"
      : "mx-auto h-[300px] w-full max-w-[320px] overflow-hidden rounded-xl";

  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className={className}
      background={background ?? signalTheme.background.color}
      config={{
        theme,
        showGrid: true,
        showGround: true,
        showLabels: true,
        cameraMovable: false,
        cameraFit: variant === "flow" ? 0.94 : 1.0,
      }}
    />
  );
}

export default ProcessIsoPreview;
