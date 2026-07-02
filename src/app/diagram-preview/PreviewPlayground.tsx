"use client";

// Playground for the read-only DiagramPreview. Desktop: JSON editor + preview
// side by side; mobile: real tabs. The JSON document is `{ config, diagram }` —
// editing either updates the live preview. Toolbar: examples picker (every
// library item), Format, Copy, Share link (doc → base64 #hash, parsed on
// load), Reset, Fullscreen. The editor pane has a scroll-synced line-number
// gutter and errors report line:col. Camera zoom/target/fit are editable as
// fields, and "Grab camera" captures the live framed camera into the doc.
// The preview is lazy-loaded so three.js stays code-split.

import * as React from "react";
import dynamic from "next/dynamic";
import { scoutsLeadsDiagram } from "@/components/editor/catalog/presets";
import {
  DEFAULT_PREVIEW_CONFIG,
  parsePreviewDoc,
  serializePreviewDoc,
  type PreviewConfig,
  type PreviewDoc,
} from "@/components/editor/preview/previewConfig";
import { BUILT_IN_THEMES } from "@/components/editor/theme/themeRegistry";
import type { CameraApi } from "@/components/editor/scene/CameraControls";
import { diagramTemplates, nodeComponents } from "@/lib/diagramLibrary";
import { readHandoff } from "@/lib/diagramHandoff";
import { Tabs, Toast, useToast } from "@/components/ui";

const DiagramPreview = dynamic(
  () => import("@/components/editor/preview/DiagramPreview").then((m) => m.DiagramPreview),
  { ssr: false, loading: () => <PreviewFallback /> },
);

function PreviewFallback() {
  return (
    <div className="grid h-full place-items-center text-sm text-ink-soft">Loading preview…</div>
  );
}

const INITIAL_DOC: PreviewDoc = {
  config: { ...DEFAULT_PREVIEW_CONFIG, cameraMovable: true },
  diagram: scoutsLeadsDiagram,
};

const NOOP_API: CameraApi = {
  reset: () => {},
  fit: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  capturePng: () => null,
  zoomTo: () => {},
  beginPan: () => {},
  getCamera: () => ({ zoom: 1, target: [0, 0] }),
  groundAt: () => null,
};

// --- share permalink helpers (unicode-safe base64 in the hash) ---

function encodeDoc(doc: PreviewDoc): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(doc))));
}

function readHashDoc(): PreviewDoc | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/^#doc=(.+)$/);
  if (!m) return null;
  try {
    return parsePreviewDoc(decodeURIComponent(escape(atob(m[1]))));
  } catch {
    return null;
  }
}

/** line:col from a "position N" JSON.parse message (best effort). */
function errorLocation(message: string, text: string): string | null {
  const m = message.match(/position (\d+)/);
  if (!m) return null;
  const pos = Math.min(Number(m[1]), text.length);
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  return `line ${line}, column ${col}`;
}

type Tab = "preview" | "json";

function Chip({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-pill border px-3 py-1 text-sm transition-colors ${
        active
          ? "border-ink bg-dark text-on-dark"
          : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function PreviewPlayground() {
  // Seed priority: share-link hash → library/editor handoff → the sample.
  const [seed] = React.useState<PreviewDoc>(() => readHashDoc() ?? readHandoff() ?? INITIAL_DOC);
  const [text, setText] = React.useState(() => serializePreviewDoc(seed));
  const [doc, setDoc] = React.useState<PreviewDoc>(seed);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<Tab>("preview");
  const [fullscreen, setFullscreen] = React.useState(false);
  const toast = useToast();
  const apiRef = React.useRef<CameraApi>({ ...NOOP_API });
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const gutterRef = React.useRef<HTMLDivElement>(null);

  const apply = (next: PreviewDoc) => {
    setDoc(next);
    setText(serializePreviewDoc(next));
    setError(null);
  };

  const onChangeText = (value: string) => {
    setText(value);
    try {
      setDoc(parsePreviewDoc(value));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const setConfig = (patch: Partial<PreviewConfig>) => {
    apply({ ...doc, config: { ...doc.config, ...patch } });
  };

  const shareLink = async () => {
    const hash = `#doc=${encodeDoc(doc)}`;
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", hash);
      toast.show("Share link copied");
    } catch {
      toast.show("Copy failed");
    }
  };

  const grabCamera = () => {
    const cam = apiRef.current.getCamera();
    setConfig({
      cameraZoom: Math.round(cam.zoom * 10) / 10,
      cameraTarget: [Math.round(cam.target[0] * 100) / 100, Math.round(cam.target[1] * 100) / 100],
    });
    toast.show("Camera captured into the doc");
  };

  const cfg = doc.config;
  const lineCount = text.split("\n").length;
  const errLoc = error ? errorLocation(error, text) : null;

  const editorCard = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border-strong border-ink bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Example
          <select
            value=""
            onChange={(e) => {
              const all = [...diagramTemplates, ...nodeComponents];
              const item = all.find((x) => x.id === e.currentTarget.value);
              if (item) apply(structuredClone(item.doc));
              e.currentTarget.value = "";
            }}
            className="max-w-[180px] rounded-pill border border-line bg-white px-3 py-1 text-sm text-ink hover:border-ink"
            aria-label="Load an example"
          >
            <option value="" disabled>
              Load…
            </option>
            <optgroup label="Templates">
              {diagramTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Node components">
              {nodeComponents.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <Chip
          title="Re-indent the JSON"
          onClick={() => {
            try {
              apply(parsePreviewDoc(text));
              toast.show("Formatted");
            } catch {
              toast.show("Fix the JSON first");
            }
          }}
        >
          Format
        </Chip>
        <Chip
          title="Copy the JSON document"
          onClick={() => {
            void navigator.clipboard
              .writeText(text)
              .then(() => toast.show("JSON copied"))
              .catch(() => toast.show("Copy failed"));
          }}
        >
          Copy
        </Chip>
        <Chip title="Copy a link that opens this exact doc" onClick={() => void shareLink()}>
          Share link
        </Chip>
        <Chip
          title="Back to the sample document"
          onClick={() => {
            apply(structuredClone(INITIAL_DOC));
            window.history.replaceState(null, "", window.location.pathname);
          }}
        >
          Reset
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <Chip active={cfg.showGrid} onClick={() => setConfig({ showGrid: !cfg.showGrid })}>
          Grid
        </Chip>
        <Chip active={cfg.showGround} onClick={() => setConfig({ showGround: !cfg.showGround })}>
          Shadows
        </Chip>
        <Chip active={cfg.showLabels} onClick={() => setConfig({ showLabels: !cfg.showLabels })}>
          Labels
        </Chip>
        <Chip
          active={cfg.cameraMovable}
          onClick={() => setConfig({ cameraMovable: !cfg.cameraMovable })}
        >
          Camera movable
        </Chip>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Theme
          <select
            value={typeof cfg.theme === "string" ? cfg.theme : cfg.theme.id}
            onChange={(e) => setConfig({ theme: e.currentTarget.value })}
            className="rounded-pill border border-line bg-white px-3 py-1 text-sm text-ink hover:border-ink"
            aria-label="Preview theme"
          >
            {BUILT_IN_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3 text-sm text-ink-soft">
        Camera
        <label className="flex items-center gap-1">
          zoom
          <input
            type="number"
            value={cfg.cameraZoom ?? ""}
            placeholder="fit"
            onChange={(e) =>
              setConfig({
                cameraZoom: e.currentTarget.value === "" ? undefined : Number(e.currentTarget.value),
              })
            }
            className="w-[72px] rounded-md border border-line bg-white px-2 py-1 text-sm text-ink"
          />
        </label>
        <label className="flex items-center gap-1">
          fit
          <input
            type="number"
            step="0.02"
            value={cfg.cameraFit ?? ""}
            placeholder="0.98"
            onChange={(e) =>
              setConfig({
                cameraFit: e.currentTarget.value === "" ? undefined : Number(e.currentTarget.value),
              })
            }
            className="w-[72px] rounded-md border border-line bg-white px-2 py-1 text-sm text-ink"
          />
        </label>
        <Chip title="Capture the live camera into cameraZoom/cameraTarget" onClick={grabCamera}>
          Grab camera
        </Chip>
      </div>
      <div className="relative flex min-h-[240px] flex-1 overflow-hidden">
        <div
          ref={gutterRef}
          aria-hidden
          className="w-11 flex-none select-none overflow-hidden border-r border-line bg-paper-2 py-3 text-right text-xs text-ink-soft"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.5 }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="pr-2">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onScroll={() => {
            if (gutterRef.current && textRef.current) {
              gutterRef.current.scrollTop = textRef.current.scrollTop;
            }
          }}
          spellCheck={false}
          className="min-w-0 flex-1 resize-none border-0 bg-white p-3 text-xs text-ink outline-none"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.5 }}
          aria-label="Diagram JSON"
        />
      </div>
      <div className="border-t border-line p-2 text-xs">
        {error ? (
          <span className="font-semibold text-orange">
            Error{errLoc ? ` (${errLoc})` : ""}: {error}
          </span>
        ) : (
          <span className="text-ink-soft">
            Valid · {doc.diagram.nodes.length} nodes · {doc.diagram.edges.length} edges
          </span>
        )}
      </div>
    </div>
  );

  const previewCard = (
    <div className="relative h-full overflow-hidden rounded-lg border-strong border-ink shadow-card">
      <DiagramPreview diagram={doc.diagram} config={doc.config} apiRef={apiRef} />
      <button
        type="button"
        onClick={() => setFullscreen(true)}
        title="Fullscreen preview"
        className="absolute right-3 top-3 rounded-pill border border-line bg-white px-3 py-1 text-xs font-semibold text-ink shadow-card transition-colors hover:border-ink"
      >
        Fullscreen
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* mobile tabs */}
      <div className="md:hidden">
        <Tabs
          tabs={[
            { id: "preview", label: "Preview" },
            { id: "json", label: "JSON editor" },
          ]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
          label="Playground views"
          idBase="playground"
        />
      </div>

      <div className="grid h-[72vh] min-h-[460px] gap-4 md:grid-cols-2">
        <div
          role="tabpanel"
          id="playground-panel-json"
          aria-labelledby="playground-tab-json"
          className={tab === "json" ? "h-full" : "hidden h-full md:block"}
        >
          {editorCard}
        </div>
        <div
          role="tabpanel"
          id="playground-panel-preview"
          aria-labelledby="playground-tab-preview"
          className={tab === "preview" ? "h-full" : "hidden h-full md:block"}
        >
          {previewCard}
        </div>
      </div>

      {fullscreen ? (
        <div className="fixed inset-0 z-50 bg-paper p-4">
          <div className="relative h-full overflow-hidden rounded-lg border-strong border-ink shadow-card">
            <DiagramPreview diagram={doc.diagram} config={doc.config} />
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute right-3 top-3 rounded-pill border-strong border-ink bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-card"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <Toast message={toast.message} />
    </div>
  );
}

export default PreviewPlayground;
