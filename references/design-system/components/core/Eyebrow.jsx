import React from "react";

/**
 * Eyebrow — the small uppercase Bricolage kicker that labels a section.
 * Orange by default; amber on dark surfaces.
 */
export function Eyebrow({ children, tone = "orange", style = {} }) {
  const color = tone === "amber" ? "var(--amber)" : tone === "ink" ? "var(--ink)" : "var(--orange)";
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
        fontWeight: 700,
        letterSpacing: "var(--ls-eyebrow, .14em)",
        textTransform: "uppercase",
        fontSize: "var(--fs-eyebrow, .72rem)",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
