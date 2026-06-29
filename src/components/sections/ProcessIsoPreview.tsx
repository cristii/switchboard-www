"use client";

// /process isometric scenes (signal theme): the hero horizontal workflow ("flow")
// and the per-step single node ("node"). Rendered once to a static image via
// IsoSnapshotPreview. The host page must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function ProcessIsoPreview({ diagram, variant = "node" }: { diagram: Diagram; variant?: "flow" | "node" }) {
  const className =
    variant === "flow"
      ? "mx-auto h-[210px] w-full max-w-[880px] overflow-hidden rounded-xl sm:h-[250px]"
      : "mx-auto h-[300px] w-full max-w-[320px] overflow-hidden rounded-xl";
  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className={className}
      background={signalTheme.background.color}
      config={{
        theme: signalTheme,
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
