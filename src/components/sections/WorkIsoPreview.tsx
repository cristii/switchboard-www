"use client";

// A /work case-study isometric scene (signal theme) — e.g. an n8n workflow rendered
// as white nodeCard slabs on colored base trays. Rendered once to a static image via
// IsoSnapshotPreview on a TRANSPARENT canvas, so the section background shows
// through. The host page must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function WorkIsoPreview({ diagram }: { diagram: Diagram }) {
  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className="mx-auto h-[440px] w-full max-w-[1100px] overflow-hidden sm:h-[540px]"
      config={{
        theme: signalTheme,
        transparent: true,
        showGrid: false,
        showGround: true,
        showLabels: true,
        cameraMovable: false,
        cameraFit: 0.95,
      }}
    />
  );
}

export default WorkIsoPreview;
