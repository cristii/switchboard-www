import React from "react";

/**
 * Badge / Tag — small rounded label. Two roles:
 *  - tint tags (level / category): soft colored pill.
 *  - "flag" (solid orange) for callouts like "Most popular".
 */
export function Badge({ children, variant = "neutral", style = {} }) {
  const tints = {
    neutral: { background: "var(--paper-3)", color: "var(--ink)" },
    green: { background: "var(--tint-green-bg)", color: "var(--tint-green-fg)" },
    amber: { background: "var(--tint-amber-bg)", color: "var(--tint-amber-fg)" },
    violet: { background: "var(--tint-violet-bg)", color: "var(--tint-violet-fg)" },
    solid: { background: "var(--orange)", color: "#fff" },
  };
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
        fontWeight: 700,
        fontSize: ".7rem",
        textTransform: "uppercase",
        letterSpacing: ".05em",
        padding: "3px 10px",
        borderRadius: "var(--r-pill, 20px)",
        lineHeight: 1.5,
        ...tints[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
