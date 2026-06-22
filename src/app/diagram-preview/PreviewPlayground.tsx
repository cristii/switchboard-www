"use client";

// Playground for the read-only DiagramPreview. Desktop: JSON editor + preview
// side by side; mobile: two tabs. The JSON document is `{ config, diagram }` —
// editing either updates the live preview. Quick toggles above the editor write
// back into the JSON. The preview is lazy-loaded so three.js stays code-split.

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

type Tab = "preview" | "json";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill border px-3 py-1 text-sm transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function PreviewPlayground() {
  const [text, setText] = React.useState(() => serializePreviewDoc(INITIAL_DOC));
  const [doc, setDoc] = React.useState<PreviewDoc>(INITIAL_DOC);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<Tab>("preview");

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
    const next: PreviewDoc = { ...doc, config: { ...doc.config, ...patch } };
    setDoc(next);
    setText(serializePreviewDoc(next));
    setError(null);
  };

  const cfg = doc.config;

  const editorCard = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border-strong border-ink bg-white shadow-card">
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
        <Chip
          active={cfg.theme === "dark"}
          onClick={() => setConfig({ theme: cfg.theme === "dark" ? "light" : "dark" })}
        >
          Dark
        </Chip>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        spellCheck={false}
        className="min-h-[280px] flex-1 resize-none border-0 bg-white p-3 text-xs text-ink outline-none"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.5 }}
        aria-label="Diagram JSON"
      />
      <div className="border-t border-line p-2 text-xs">
        {error ? (
          <span className="text-orange">⚠ {error}</span>
        ) : (
          <span className="text-ink-soft">
            Valid · {doc.diagram.nodes.length} nodes · {doc.diagram.edges.length} edges
          </span>
        )}
      </div>
    </div>
  );

  const previewCard = (
    <div className="h-full overflow-hidden rounded-lg border-strong border-ink shadow-card">
      <DiagramPreview diagram={doc.diagram} config={doc.config} />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* mobile tabs */}
      <div className="flex gap-2 md:hidden">
        <Chip active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </Chip>
        <Chip active={tab === "json"} onClick={() => setTab("json")}>
          JSON editor
        </Chip>
      </div>

      <div className="grid h-[72vh] min-h-[460px] gap-4 md:grid-cols-2">
        <div className={tab === "json" ? "h-full" : "hidden h-full md:block"}>{editorCard}</div>
        <div className={tab === "preview" ? "h-full" : "hidden h-full md:block"}>{previewCard}</div>
      </div>
    </div>
  );
}

export default PreviewPlayground;
