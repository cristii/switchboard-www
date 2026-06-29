"use client";

// Optional "Architecture Diagram" embed chrome: a titled header bar (title +
// subtitle + optional logo slot) and an optional footer around a diagram preview —
// the framing in the reference architecture renderings. DOM chrome, editor-token
// styled (Tailwind-free) so it works on the marketing site and in Storybook. The
// host must import editor-tokens.css so --editor-* resolve. Wrap any content
// (e.g. <DiagramPreview/>); the children fill the body.

import * as React from "react";

export interface DiagramFrameProps {
  title?: string;
  subtitle?: string;
  /** Optional right-aligned slot (a logo / badge). */
  logo?: React.ReactNode;
  footer?: string;
  /** Header colourway. @default "light" */
  tone?: "light" | "ink" | "accent";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function headerColors(tone: NonNullable<DiagramFrameProps["tone"]>): { bg: string; fg: string; sub: string } {
  switch (tone) {
    case "ink":
      return { bg: "var(--editor-text)", fg: "var(--editor-bg)", sub: "var(--editor-bg)" };
    case "accent":
      return { bg: "var(--editor-accent)", fg: "#ffffff", sub: "rgba(255,255,255,0.82)" };
    default:
      return { bg: "var(--editor-surface-2)", fg: "var(--editor-text)", sub: "var(--editor-text-muted)" };
  }
}

export function DiagramFrame({
  title,
  subtitle,
  logo,
  footer,
  tone = "light",
  children,
  className,
  style,
}: DiagramFrameProps) {
  const c = headerColors(tone);
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: "var(--r-lg, 18px)",
        border: "1.5px solid var(--editor-border-soft)",
        background: "var(--editor-bg)",
        boxShadow: "var(--editor-shadow)",
        overflow: "hidden",
        ...style,
      }}
    >
      {title || subtitle || logo ? (
        <div
          style={{
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            background: c.bg,
            color: c.fg,
            borderBottom: "1.5px solid var(--editor-border-soft)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title ? (
              <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
                {title}
              </div>
            ) : null}
            {subtitle ? (
              <div style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "0.78rem", color: c.sub, marginTop: 2 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          {logo ? <div style={{ flex: "none" }}>{logo}</div> : null}
        </div>
      ) : null}

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>{children}</div>

      {footer ? (
        <div
          style={{
            flex: "none",
            padding: "8px 16px",
            background: "var(--editor-surface)",
            color: "var(--editor-text-muted)",
            borderTop: "1.5px solid var(--editor-border-soft)",
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "0.72rem",
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export default DiagramFrame;
