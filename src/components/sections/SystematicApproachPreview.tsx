"use client";

// The /services "systematic approach" section's diagram: a live, read-only
// isometric 3D scene of New lead → AI classification → CRM / Calendar, themed with
// the Switchboard "blueprint" theme and laid out as a screen-horizontal row.
// three.js is code-split (ssr:false) so it never ships on other routes. The page
// must import the editor tokens CSS so --editor-* resolve for the embed.

import * as React from "react";
import dynamic from "next/dynamic";
import { servicesFlowDiagram } from "@/components/editor/catalog/presets";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <Fallback /> },
);

function Fallback() {
  return (
    <div className="grid h-full place-items-center text-sm text-ink-soft">Loading diagram…</div>
  );
}

export function SystematicApproachPreview() {
  return (
    <div className="mx-auto h-[420px] w-full max-w-[920px] overflow-hidden rounded-[18px] border border-ink shadow-card sm:h-[460px]">
      <DiagramPreview
        diagram={servicesFlowDiagram}
        config={{
          theme: "blueprint",
          showGrid: false,
          showGround: true,
          showLabels: true,
          cameraMovable: false,
        }}
      />
    </div>
  );
}

export default SystematicApproachPreview;
