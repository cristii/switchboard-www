import * as React from "react";

export interface EyebrowProps {
  children: React.ReactNode;
  /** @default "orange" */
  tone?: "orange" | "amber" | "ink";
  style?: React.CSSProperties;
}

/**
 * The small uppercase Bricolage kicker that labels a section. Orange by
 * default; amber on dark surfaces, ink when a quiet label is wanted.
 */
export function Eyebrow({ children, tone = "orange", style = {} }: EyebrowProps) {
  const color =
    tone === "amber"
      ? "var(--amber)"
      : tone === "ink"
        ? "var(--ink)"
        : "var(--orange)";
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

export default Eyebrow;
