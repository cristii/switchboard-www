"use client";

// /process isometric scenes (signal theme): the hero horizontal workflow ("flow")
// and the per-step single node ("node"). Rendered once to a static image via
// IsoSnapshotPreview, on a TRANSPARENT canvas so each section's own background
// (including the CSS grid) shows straight through — no per-section adaptation. The
// host page must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import { signalDarkTheme } from "@/components/editor/theme/themes/signalDark";
import { useSiteColorScheme } from "@/lib/useSiteColorScheme";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function ProcessIsoPreview({ diagram, variant = "node" }: { diagram: Diagram; variant?: "flow" | "node" }) {
  // Snapshots bake the scene, so re-key (and re-snapshot) when the site theme flips.
  const scheme = useSiteColorScheme();
  const className =
    variant === "flow"
      ? "mx-auto h-[260px] w-full max-w-[960px] overflow-hidden sm:h-[300px]"
      : "mx-auto h-[360px] w-full max-w-[400px] overflow-hidden";
  return (
    <IsoSnapshotPreview
      key={scheme}
      diagram={diagram}
      className={className}
      config={{
        theme: scheme === "dark" ? signalDarkTheme : signalTheme,
        transparent: true,
        showGrid: false,
        showGround: true,
        showLabels: true,
        cameraMovable: false,
        cameraFit: variant === "flow" ? 0.96 : 0.92,
      }}
    />
  );
}

export default ProcessIsoPreview;
