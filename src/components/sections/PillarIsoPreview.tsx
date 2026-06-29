"use client";

// A capabilities-pillar isometric scene for /services, rendered ONCE to a static
// image. three.js is code-split (ssr:false) and lazy-mounted on scroll, but only one
// pillar holds a live WebGL context at a time (a module-level serial queue): they
// otherwise compete for GL contexts and the global SoftShadows shader patch, which
// left later canvases without their meshes. Each pillar renders, snapshots to a PNG
// once it settles, then unmounts its canvas — so after first paint the page is just
// images (no persistent WebGL). The host page must import the editor tokens CSS.
//
// Uses the layered "signal" theme: a double-layer rounded-square slab per stage on a
// white ground with the grid on, matching (and blending into) the capability card.

import * as React from "react";
import dynamic from "next/dynamic";
import { signalTheme } from "@/components/editor/theme/themes/signal";
import type { CameraApi } from "@/components/editor/scene/CameraControls";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <Fallback /> },
);

// One-at-a-time render queue (module-level, shared across all pillar instances).
let queueActive = false;
const queueWaiters: (() => void)[] = [];
function acquireSlot(): Promise<void> {
  if (!queueActive) {
    queueActive = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => queueWaiters.push(resolve));
}
function releaseSlot(): void {
  const next = queueWaiters.shift();
  if (next) next();
  else queueActive = false;
}

const WRAP = "mx-auto h-[440px] w-full max-w-[400px] overflow-hidden rounded-xl sm:h-[520px]";

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

const NOOP_API: CameraApi = {
  reset: () => {},
  fit: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  capturePng: () => null,
};

export function PillarIsoPreview({ diagram }: { diagram: Diagram }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<CameraApi>({ ...NOOP_API });
  const released = React.useRef(false);
  const [phase, setPhase] = React.useState<"idle" | "live" | "image">("idle");
  const [img, setImg] = React.useState<string | null>(null);

  // Mount the live canvas only when scrolled near AND our queue slot is free.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          acquireSlot().then(() => {
            if (cancelled) releaseSlot();
            else setPhase("live");
          });
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Once rendered + settled (fit + scale-in), snapshot to a PNG and tear the canvas
  // down. If capture fails (e.g. a tainted buffer), leave the canvas live.
  const onReady = React.useCallback(() => {
    window.setTimeout(() => {
      let url: string | null = null;
      try {
        url = apiRef.current.capturePng();
      } catch {
        url = null;
      }
      if (url) {
        setImg(url);
        setPhase("image");
      }
      // Free the queue slot a beat after unmount so contexts don't overlap.
      window.setTimeout(() => {
        if (!released.current) {
          released.current = true;
          releaseSlot();
        }
      }, 120);
    }, 1100);
  }, []);

  const style = { background: signalTheme.background.color } as React.CSSProperties;

  if (phase === "image" && img) {
    return (
      <div className={WRAP} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div ref={ref} className={WRAP} style={style}>
      {phase === "live" ? (
        <DiagramPreview
          diagram={diagram}
          apiRef={apiRef}
          onReady={onReady}
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
