"use client";

import * as React from "react";

export interface FaqItemProps {
  question: React.ReactNode;
  children: React.ReactNode;
  /** Start expanded. @default false */
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}

const display = "var(--font-display, 'Bricolage Grotesque', sans-serif)";

/**
 * A single expandable question/answer row with the rotating orange +/- glyph.
 * Each item manages its own open state (independent, not a single-open
 * accordion). The answer height animates and is hidden from AT when collapsed.
 */
export function FaqItem({ question, children, defaultOpen = false, style = {} }: FaqItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1.5px solid var(--line)", padding: "16px 0", ...style }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: display,
          fontWeight: 600,
          fontSize: "1rem",
          color: "var(--ink)",
          padding: 0,
        }}
      >
        {question}
        <span
          aria-hidden="true"
          style={{
            fontSize: "1.4rem",
            color: "var(--orange)",
            flex: "none",
            transition: "transform .2s ease",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 240 : 0,
          overflow: "hidden",
          transition: "max-height .28s ease",
          color: "var(--ink-soft)",
          fontSize: ".92rem",
        }}
      >
        <div style={{ paddingTop: 12 }} hidden={!open}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default FaqItem;
