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
  | "note";

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
