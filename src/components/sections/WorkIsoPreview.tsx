"use client";

// A /work case-study isometric scene (signal theme) — e.g. an n8n workflow rendered
// as white nodeCard slabs on colored base trays. Unlike the pillar/process scenes
// (which snapshot to a static image), this one stays LIVE with a movable camera:
// the /work detail page has a single canvas, so there's no multi-context contention.
// three.js is code-split (ssr:false) and lazy-mounted on scroll. Transparent canvas
// so the section background shows through. The host page must import editor tokens.

import * as React from "react";
import dynamic from "next/dynamic";
import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => null },
);

export function WorkIsoPreview({ diagram }: { diagram: Diagram }) {
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
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className="mx-auto h-[480px] w-full max-w-[1100px] overflow-hidden rounded-xl border border-line sm:h-[600px]"
      >
        {show ? (
          <DiagramPreview
            diagram={diagram}
            config={{
              theme: signalTheme,
              transparent: true,
              showGrid: false,
              showGround: true,
              showLabels: true,
              cameraMovable: true,
              cameraFit: 0.95,
            }}
            style={{ background: "transparent" }}
          />
        ) : null}
      </div>
      <p className="mt-3 text-center text-[.82rem] text-ink-soft">Drag to pan · scroll or pinch to zoom</p>
    </div>
  );
}

export default WorkIsoPreview;
