import * as React from "react";

// Bespoke line-icon set for the editor (node kinds + palette). Single-colour,
// tinted via `color`/currentColor — no third-party icon library, matching the
// brand's stroke style (24px box, 1.8 stroke, round caps). See AGENTS.md
// "Icons" and description.md §2/§7. Toolbar-action glyphs are added in P6.

export type GlyphName =
  | "zap"
  | "play"
  | "diamond"
  | "merge"
  | "sparkles"
  | "database"
  | "layers"
  | "server"
  | "hub"
  | "send"
  | "frame"
  | "note"
  | "type"
  // toolbar / action glyphs
  | "undo"
  | "redo"
  | "zoomIn"
  | "zoomOut"
  | "fit"
  | "reset"
  | "download"
  | "image"
  | "sun"
  | "moon"
  | "trash"
  | "plus"
  | "close"
  | "layout"
  | "grid"
  | "shadow"
  | "palette";

const PATHS: Record<GlyphName, React.ReactNode> = {
  zap: <path d="M13 2 L4 14 h7 l-1 8 L20 9 h-7 z" />,
  play: <path d="M8 5 L19 12 L8 19 Z" />,
  diamond: <path d="M12 3 L21 12 L12 21 L3 12 Z" />,
  merge: <path d="M5 4 L12 11 M19 4 L12 11 M12 11 V20" />,
  sparkles: <path d="M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z" />,
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6 v8 a8 3 0 0 0 16 0 V6" />
    </>
  ),
  layers: <path d="M4 8 h16 M4 12 h16 M4 16 h16" />,
  server: (
    <>
      <rect x="4" y="5" width="16" height="6" rx="1.5" />
      <rect x="4" y="13" width="16" height="6" rx="1.5" />
      <path d="M7.5 8 h0.01 M7.5 16 h0.01" />
    </>
  ),
  hub: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3 v3 M12 18 v3 M3 12 h3 M18 12 h3" />
    </>
  ),
  send: <path d="M22 2 L11 13 M22 2 l-7 20 -4 -9 -9 -4 Z" />,
  frame: <rect x="4" y="5" width="16" height="14" rx="2" />,
  note: (
    <>
      <path d="M6 3 h8 l4 4 v14 H6 Z" />
      <path d="M14 3 v4 h4 M9 13 h6 M9 17 h5" />
    </>
  ),
  type: <path d="M5 6 V5 h14 v1 M12 5 v14 M9 19 h6" />,
  undo: <path d="M4 12 l5 -5 M4 12 l5 5 M4 12 h10 a5 5 0 0 1 0 10 h-3" />,
  redo: <path d="M20 12 l-5 -5 M20 12 l-5 5 M20 12 h-10 a5 5 0 0 0 0 10 h3" />,
  zoomIn: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20 l-3.5 -3.5 M11 8 v6 M8 11 h6" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20 l-3.5 -3.5 M8 11 h6" />
    </>
  ),
  fit: <path d="M4 9 V4 h5 M15 4 h5 v5 M20 15 v5 h-5 M9 20 H4 v-5" />,
  reset: <path d="M20 12 a8 8 0 1 1 -2.4 -5.7 M20 4 v4 h-4" />,
  download: <path d="M12 4 v10 M8 11 l4 4 4 -4 M5 19 h14" />,
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M7 15 l3 -3 3 3 2 -2 2 2" />
      <circle cx="9" cy="9" r="1.2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3 v2 M12 19 v2 M3 12 h2 M19 12 h2 M5.6 5.6 l1.4 1.4 M17 17 l1.4 1.4 M18.4 5.6 l-1.4 1.4 M7 17 l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 13 a8 8 0 1 1 -9 -10 a6 6 0 0 0 9 10 z" />,
  trash: <path d="M5 7 h14 M9 7 V5 h6 v2 M7 7 l1 13 h8 l1 -13" />,
  plus: <path d="M12 6 v12 M6 12 h12" />,
  close: <path d="M6 6 l12 12 M18 6 l-12 12" />,
  layout: (
    <>
      <rect x="4" y="5" width="6" height="14" rx="1.5" />
      <rect x="14" y="5" width="6" height="6" rx="1.5" />
      <rect x="14" y="13" width="6" height="6" rx="1.5" />
    </>
  ),
  grid: <path d="M4 9 h16 M4 15 h16 M9 4 v16 M15 4 v16" />,
  shadow: (
    <>
      <rect x="4.5" y="4.5" width="11" height="11" rx="2.5" />
      <path d="M9 19 h10 v-10" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3 a9 9 0 1 0 0 18 a2.5 2.5 0 0 0 0 -5 h1.6 a3.4 3.4 0 0 0 3.4 -3.4 A8 8 0 0 0 12 3 Z" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="12" cy="8" r="1" />
      <circle cx="15.5" cy="11" r="1" />
    </>
  ),
};

export interface NodeGlyphProps {
  name: GlyphName;
  /** Square size in px. @default 18 */
  size?: number;
  /** Stroke colour. @default "currentColor" */
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function NodeGlyph({
  name,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  style,
}: NodeGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flex: "none", ...style }}
    >
      {PATHS[name]}
    </svg>
  );
}

export default NodeGlyph;
