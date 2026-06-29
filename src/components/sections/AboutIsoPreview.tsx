"use client";

// /about "How I work" isometric scene (signal theme): a horizontal workflow with a
// title tag above and a description card below each node. Rendered once to a static
// image via IsoSnapshotPreview on a TRANSPARENT canvas, so the section background
// shows straight through. The host page must import the editor tokens CSS.

import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

export function AboutIsoPreview({ diagram }: { diagram: Diagram }) {
  return (
    <IsoSnapshotPreview
      diagram={diagram}
      className="mx-auto h-[440px] w-full max-w-[1100px] overflow-hidden sm:h-[500px]"
      config={{
        theme: signalTheme,
        transparent: true,
        showGrid: false,
        showGround: true,
        showLabels: true,
        cameraMovable: false,
        cameraFit: 0.96,
      }}
    />
  );
}

export default AboutIsoPreview;
