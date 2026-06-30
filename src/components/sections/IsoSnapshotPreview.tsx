"use client";

// Renders an isometric DiagramPreview ONCE to a static image, then tears the WebGL
// canvas down. three.js is code-split (ssr:false) and lazy-mounted on scroll, but
// only ONE preview holds a live WebGL context at a time (a module-level serial
// queue): multiple live canvases otherwise compete for GL contexts and the global
// SoftShadows shader patch, which leaves later canvases without their meshes. Each
// preview renders, snapshots to a PNG once it settles, then unmounts — so after
// first paint the page is just images. Shared by the /services + /process scenes.
// The host page must import the editor tokens CSS.

import * as React from "react";
import dynamic from "next/dynamic";
import type { CameraApi } from "@/components/editor/scene/CameraControls";
import type { PreviewConfig } from "@/components/editor/preview/previewConfig";
import type { Diagram } from "@/components/editor/state/types";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => null },
);

// One-at-a-time render queue (module-level, shared across all instances).
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

const NOOP_API: CameraApi = {
  reset: () => {},
  fit: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  capturePng: () => null,
  getCamera: () => ({ zoom: 1, target: [0, 0] }),
};

export interface IsoSnapshotPreviewProps {
  diagram: Diagram;
  config: Partial<PreviewConfig>;
  /** Wrapper sizing/shape classes. */
  className?: string;
  /** Wrapper background (also the loading-state background). */
  background?: string;
  /** Delay after first paint before snapshotting (lets fit + scale-in settle). */
  settleMs?: number;
  /** Fired with the captured PNG data URL (e.g. for a "Copy PNG" action). */
  onSnapshot?: (dataUrl: string) => void;
}

export function IsoSnapshotPreview({ diagram, config, className, background, settleMs = 1100, onSnapshot }: IsoSnapshotPreviewProps) {
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

  // Once rendered + settled, snapshot to a PNG and tear the canvas down. If capture
  // fails (e.g. a tainted buffer) leave the canvas live so it still shows.
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
        onSnapshot?.(url);
      }
      window.setTimeout(() => {
        if (!released.current) {
          released.current = true;
          releaseSlot();
        }
      }, 120);
    }, settleMs);
  }, [settleMs, onSnapshot]);

  const style = { background } as React.CSSProperties;

  if (phase === "image" && img) {
    return (
      <div className={className} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={style}>
      {phase === "live" ? (
        <DiagramPreview diagram={diagram} apiRef={apiRef} onReady={onReady} config={config} style={{ background: "transparent" }} />
      ) : null}
    </div>
  );
}

export default IsoSnapshotPreview;
