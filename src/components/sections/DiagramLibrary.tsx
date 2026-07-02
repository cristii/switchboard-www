"use client";

// /diagram-library gallery: a grid of diagram cards (snapshot previews). Each card
// has a right-click / long-press (and a ⋯ button) menu: Open in editor, Copy JSON,
// Copy PNG, Copy embed code, Open playground. The "open" actions stash the scene via
// the one-shot localStorage handoff, then navigate. The host page must import the
// editor tokens CSS.

import * as React from "react";
import { useRouter } from "next/navigation";
import { serializePreviewDoc } from "@/components/editor/preview/previewConfig";
import { resolveThemeFromConfig } from "@/components/editor/theme/themeRegistry";
import { writeHandoff } from "@/lib/diagramHandoff";
import { useSiteColorScheme } from "@/lib/useSiteColorScheme";
import type { LibraryItem } from "@/lib/diagramLibrary";
import { IsoSnapshotPreview } from "./IsoSnapshotPreview";

function embedSnippet(item: LibraryItem): string {
  return `<DiagramPreview\n  config={${JSON.stringify(item.doc.config)}}\n  diagram={${JSON.stringify(item.doc.diagram)}}\n/>`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

async function copyPng(dataUrl: string): Promise<boolean> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

interface MenuState {
  item: LibraryItem;
  x: number;
  y: number;
}

export function DiagramLibraryGallery({ items }: { items: LibraryItem[] }) {
  const router = useRouter();
  const [menu, setMenu] = React.useState<MenuState | null>(null);
  const [flash, setFlash] = React.useState<string | null>(null);
  // Captured PNG data URLs, keyed by item id (filled as cards snapshot).
  const pngs = React.useRef<Record<string, string>>({});

  const toast = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash((f) => (f === msg ? null : f)), 1600);
  };

  React.useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
    };
  }, [menu]);

  const run = async (action: string, item: LibraryItem) => {
    setMenu(null);
    switch (action) {
      case "editor":
        writeHandoff(item.doc);
        router.push("/isometric-editor");
        break;
      case "playground":
        writeHandoff(item.doc);
        router.push("/diagram-preview");
        break;
      case "json":
        toast((await copyText(serializePreviewDoc(item.doc))) ? "JSON copied" : "Copy failed");
        break;
      case "embed":
        toast((await copyText(embedSnippet(item))) ? "Embed code copied" : "Copy failed");
        break;
      case "png": {
        const url = pngs.current[item.id];
        if (!url) return toast("Image not ready yet");
        toast((await copyPng(url)) ? "PNG copied" : "Copy failed");
        break;
      }
    }
  };

  return (
    <>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {items.map((item) => (
          <LibraryCard
            key={item.id}
            item={item}
            onSnapshot={(url) => {
              pngs.current[item.id] = url;
            }}
            onMenu={(x, y) => setMenu({ item, x, y })}
          />
        ))}
      </div>

      {menu ? (
        <div
          role="menu"
          className="fixed z-50 min-w-[200px] overflow-hidden rounded-[12px] border-2 border-ink bg-white py-1 shadow-raised"
          style={{ left: Math.min(menu.x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 220), top: menu.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {[
            { id: "editor", label: "Open in editor" },
            { id: "json", label: "Copy JSON" },
            { id: "png", label: "Copy PNG" },
            { id: "embed", label: "Copy embed code" },
            { id: "playground", label: "Open in playground" },
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              onClick={() => run(a.id, menu.item)}
              className="block w-full px-4 py-2 text-left font-display text-[.86rem] font-semibold text-ink hover:bg-paper-2"
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : null}

      {flash ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill border-2 border-ink bg-ink px-4 py-2 text-[.84rem] font-semibold text-paper shadow-raised">
          {flash}
        </div>
      ) : null}
    </>
  );
}

function LibraryCard({
  item,
  onSnapshot,
  onMenu,
}: {
  item: LibraryItem;
  onSnapshot: (url: string) => void;
  onMenu: (x: number, y: number) => void;
}) {
  // Display only: signal-themed cards follow the site's light/dark toggle
  // (re-keyed so they re-snapshot); copy/open actions keep the authored doc.
  const scheme = useSiteColorScheme();
  const displayTheme =
    scheme === "dark" && item.doc.config.theme === "signal" ? "signalDark" : item.doc.config.theme;
  const bg = React.useMemo(() => resolveThemeFromConfig(displayTheme).background.color, [displayTheme]);
  const longPress = React.useRef<number | null>(null);

  const clearLong = () => {
    if (longPress.current) {
      window.clearTimeout(longPress.current);
      longPress.current = null;
    }
  };

  return (
    <div className="overflow-hidden rounded-[16px] border-2 border-ink bg-white shadow-card">
      <div
        className="relative cursor-context-menu"
        onContextMenu={(e) => {
          e.preventDefault();
          onMenu(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          longPress.current = window.setTimeout(() => onMenu(t.clientX, t.clientY), 500);
        }}
        onTouchMove={clearLong}
        onTouchEnd={clearLong}
      >
        <IsoSnapshotPreview
          key={scheme}
          diagram={item.doc.diagram}
          className="h-[240px] w-full"
          background={bg}
          config={{ ...item.doc.config, theme: displayTheme, cameraMovable: false, transparent: false }}
          onSnapshot={onSnapshot}
        />
      </div>
      <div className="flex items-start justify-between gap-3 border-t-2 border-ink px-4 py-3">
        <div>
          <h3 className="font-display text-[1rem] font-bold leading-tight text-ink">{item.title}</h3>
          <p className="mt-1 text-[.82rem] leading-[1.4] text-ink-soft">{item.blurb}</p>
        </div>
        <button
          type="button"
          aria-label="Actions"
          title="Actions"
          onClick={(e) => onMenu(e.clientX, e.clientY)}
          className="grid h-8 w-8 flex-none place-items-center rounded-[8px] border border-line text-ink hover:border-ink"
        >
          <span className="text-[1.1rem] leading-none">⋯</span>
        </button>
      </div>
    </div>
  );
}

export default DiagramLibraryGallery;
