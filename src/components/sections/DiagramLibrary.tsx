"use client";

// /diagram-library gallery: a searchable grid of diagram cards (snapshot
// previews with a skeleton shimmer while the serial snapshot queue works).
// Each card has a right-click / long-press / "Actions"-button menu (the shared
// accessible ui/Menu): Open in editor, Copy JSON, Copy PNG (disabled until the
// snapshot exists), Copy embed code, Open in playground. The "open" actions
// stash the scene via the one-shot localStorage handoff, then navigate. Cards
// follow the site's light/dark toggle (signal → signalDark, display-only).
// The host page must import the editor tokens CSS.

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, Toast, useToast, type MenuAction } from "@/components/ui";
import { NodeGlyph } from "@/components/editor/icons/NodeGlyph";
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
  pngReady: boolean;
}

export function DiagramLibraryGallery({
  items,
  searchable = true,
}: {
  items: LibraryItem[];
  searchable?: boolean;
}) {
  const router = useRouter();
  const [menu, setMenu] = React.useState<MenuState | null>(null);
  const [query, setQuery] = React.useState("");
  const toast = useToast();
  // Captured PNG data URLs, keyed by item id (filled as cards snapshot).
  const pngs = React.useRef<Record<string, string>>({});

  const q = query.trim().toLowerCase();
  const shown = q
    ? items.filter(
        (it) => it.title.toLowerCase().includes(q) || (it.blurb ?? "").toLowerCase().includes(q),
      )
    : items;

  const openMenu = (item: LibraryItem, x: number, y: number) =>
    setMenu({ item, x, y, pngReady: !!pngs.current[item.id] });

  const run = async (action: string, item: LibraryItem) => {
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
        toast.show((await copyText(serializePreviewDoc(item.doc))) ? "JSON copied" : "Copy failed");
        break;
      case "embed":
        toast.show((await copyText(embedSnippet(item))) ? "Embed code copied" : "Copy failed");
        break;
      case "png": {
        const url = pngs.current[item.id];
        if (!url) return toast.show("Image not ready yet");
        toast.show((await copyPng(url)) ? "PNG copied" : "Copy failed");
        break;
      }
    }
  };

  const glyph = (name: React.ComponentProps<typeof NodeGlyph>["name"]) => (
    <NodeGlyph name={name} size={16} />
  );
  const actions: MenuAction[] = menu
    ? [
        { id: "editor", label: "Open in editor", icon: glyph("edit") },
        { id: "playground", label: "Open in playground", icon: glyph("play") },
        { id: "json", label: "Copy JSON", icon: glyph("copy"), dividerBefore: true },
        { id: "png", label: "Copy PNG", icon: glyph("image"), disabled: !menu.pngReady },
        { id: "embed", label: "Copy embed code", icon: glyph("frame") },
      ]
    : [];

  return (
    <>
      {searchable && items.length > 6 ? (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${items.length} items…`}
          aria-label="Search this gallery"
          className="mb-5 h-10 w-full max-w-[320px] rounded-pill border border-line bg-white px-4 text-sm text-ink outline-none focus:border-ink"
        />
      ) : null}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {shown.map((item) => (
          <LibraryCard
            key={item.id}
            item={item}
            onSnapshot={(url) => {
              pngs.current[item.id] = url;
            }}
            onMenu={(x, y) => openMenu(item, x, y)}
          />
        ))}
        {shown.length === 0 ? (
          <p className="text-sm text-ink-soft">No items match “{query}”.</p>
        ) : null}
      </div>

      <Menu
        open={menu !== null}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        label="Diagram actions"
        actions={actions}
        onAction={(id) => menu && void run(id, menu.item)}
        onClose={() => setMenu(null)}
      />
      <Toast message={toast.message} />
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
  const [shot, setShot] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => setShot(false), [scheme]);

  const clearLong = () => {
    if (longPress.current) {
      window.clearTimeout(longPress.current);
      longPress.current = null;
    }
    setPressed(false);
  };

  return (
    <div className="overflow-hidden rounded-[16px] border-2 border-ink bg-white shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-raised">
      <div
        className="relative cursor-context-menu"
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          transform: pressed ? "scale(0.985)" : undefined,
          transition: "transform 120ms ease",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onMenu(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          setPressed(true);
          longPress.current = window.setTimeout(() => {
            setPressed(false);
            onMenu(t.clientX, t.clientY);
          }, 500);
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
          onSnapshot={(url) => {
            setShot(true);
            onSnapshot(url);
          }}
        />
        {!shot ? (
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse"
            style={{ background: bg, opacity: 0.9 }}
          >
            <div className="absolute left-1/2 top-1/2 h-3 w-24 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-paper-2" />
          </div>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3 border-t-2 border-ink px-4 py-3">
        <div>
          <h3 className="font-display text-[1rem] font-bold leading-tight text-ink">{item.title}</h3>
          <p className="mt-1 text-[.82rem] leading-[1.4] text-ink-soft">{item.blurb}</p>
        </div>
        <button
          type="button"
          aria-label={`Actions for ${item.title}`}
          title="Actions"
          onClick={(e) => {
            // Keyboard activation reports (0,0) — anchor at the button instead.
            if (e.clientX === 0 && e.clientY === 0) {
              const r = e.currentTarget.getBoundingClientRect();
              onMenu(r.left, r.bottom + 4);
            } else {
              onMenu(e.clientX, e.clientY);
            }
          }}
          className="grid h-9 w-9 flex-none place-items-center rounded-[9px] border-strong border-ink text-ink transition-colors hover:bg-paper-2"
        >
          <NodeGlyph name="layers" size={16} />
        </button>
      </div>
    </div>
  );
}

export default DiagramLibraryGallery;
