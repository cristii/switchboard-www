"use client";

// A capabilities-pillar isometric scene for /services. three.js is code-split
// (ssr:false) AND lazy-mounted on scroll (IntersectionObserver) so each pillar's
// WebGL context only initialises when it nears the viewport — important with
// several scenes on one marketing page. The page must import editor tokens CSS.
//
// The scene blends into its containing pillar card: no inner card chrome, a white
// background to match the card, and the grid enabled (the blueprint theme ships
// grid-off, so we pass an inline override here).

import * as React from "react";
import dynamic from "next/dynamic";
import { blueprintTheme } from "@/components/editor/theme/themes/blueprint";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <Fallback /> },
);

function Fallback() {
  return <div className="grid h-full place-items-center text-sm text-ink-soft">Loading diagram…</div>;
}

// Blueprint, but on a flat white ground (matching the pillar card) with the grid on.
const pillarTheme = {
  ...blueprintTheme,
  background: { type: "flat" as const, color: "#ffffff", colorHi: "#ffffff" },
  grid: { show: true, color: "#dfe2d9", sectionColor: "#cbd2c5", opacity: 0.5 },
};

export function PillarIsoPreview({ diagram }: { diagram: Diagram }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-[340px] w-full overflow-hidden sm:h-[400px]">
      {show ? (
        <DiagramPreview
          diagram={diagram}
          config={{ theme: pillarTheme, showGrid: true, showGround: true, showLabels: true, cameraMovable: false }}
          style={{ background: "transparent" }}
        />
      ) : (
        <Fallback />
      )}
    </div>
  );
}

export default PillarIsoPreview;
