"use client";

// A capabilities-pillar isometric scene for /services. three.js is code-split
// (ssr:false) AND lazy-mounted on scroll (IntersectionObserver) so each pillar's
// WebGL context only initialises when it nears the viewport — important with
// several scenes on one marketing page. The page must import editor tokens CSS.
//
// Uses the layered "signal" theme: a double-layer rounded-square slab per stage on a
// white ground with the grid on, matching (and blending into) the capability card.

import * as React from "react";
import dynamic from "next/dynamic";
import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <Fallback /> },
);

function Fallback() {
  return (
    <div
      className="grid h-full place-items-center text-sm text-ink-soft"
      style={{ background: signalTheme.background.color }}
    >
      Loading diagram…
    </div>
  );
}

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
    <div
      ref={ref}
      className="mx-auto h-[440px] w-full max-w-[400px] overflow-hidden rounded-xl sm:h-[520px]"
      style={{ background: signalTheme.background.color }}
    >
      {show ? (
        <DiagramPreview
          diagram={diagram}
          config={{ theme: signalTheme, showGrid: true, showGround: true, showLabels: true, cameraMovable: false, cameraFit: 1.04 }}
          style={{ background: "transparent" }}
        />
      ) : (
        <Fallback />
      )}
    </div>
  );
}

export default PillarIsoPreview;
