"use client";

// A /services capabilities-pillar isometric scene (the layered "signal" theme).
// Rendered once to a static image via IsoSnapshotPreview on a TRANSPARENT canvas so
// it blends into the (white) capability card; the 3D grid stays on. The host page
// must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function PillarIsoPreview({ diagram }: { diagram: Diagram }) {
  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className="mx-auto h-[460px] w-full max-w-[420px] overflow-hidden sm:h-[560px]"
      config={{ theme: signalTheme, transparent: true, showGrid: true, showGround: true, showLabels: true, cameraMovable: false, cameraFit: 1.04 }}
    />
  );
}

export default PillarIsoPreview;
