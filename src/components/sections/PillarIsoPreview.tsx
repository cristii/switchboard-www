"use client";

// A capabilities-pillar isometric scene for /services. three.js is code-split
// (ssr:false) AND lazy-mounted on scroll (IntersectionObserver) so each pillar's
// WebGL context only initialises when it nears the viewport — important with
// several scenes on one marketing page. The page must import editor tokens CSS.

import * as React from "react";
import dynamic from "next/dynamic";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <Fallback /> },
);

function Fallback() {
  return <div className="grid h-full place-items-center text-sm text-ink-soft">Loading diagram…</div>;
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
      className="h-[440px] w-full overflow-hidden rounded-[14px] border border-ink bg-paper-2 shadow-card sm:h-[500px]"
    >
      {show ? (
        <DiagramPreview
          diagram={diagram}
          config={{ theme: "blueprint", showGrid: false, showGround: true, cameraMovable: false, showLabels: true }}
        />
      ) : (
        <Fallback />
      )}
    </div>
  );
}

export default PillarIsoPreview;
