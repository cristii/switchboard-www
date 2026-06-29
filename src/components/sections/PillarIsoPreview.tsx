"use client";

// A /services capabilities-pillar isometric scene (the layered "signal" theme:
// double-layer rounded-square slabs on a white ground with the grid on, matching the
// capability card). Rendered once to a static image via IsoSnapshotPreview. The host
// page must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function PillarIsoPreview({ diagram }: { diagram: Diagram }) {
  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className="mx-auto h-[440px] w-full max-w-[400px] overflow-hidden rounded-xl sm:h-[520px]"
      background={signalTheme.background.color}
      config={{ theme: signalTheme, showGrid: true, showGround: true, showLabels: true, cameraMovable: false, cameraFit: 1.04 }}
    />
  );
}

export default PillarIsoPreview;
