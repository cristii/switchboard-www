import * as React from "react";

export interface PillProps {
  children: React.ReactNode;
  /** @default false */
  active?: boolean;
  /** Lighten the resting outline for dark surfaces. @default false */
  onDark?: boolean;
  style?: React.CSSProperties;
}

/**
 * Outlined capsule used in the conversion "flow" rows
 * (Conversation → Qualified lead → Booked call). Active state turns orange.
 */
export function Pill({
  children,
  active = false,
  onDark = false,
  style = {},
}: PillProps) {
  const border = active ? "var(--orange)" : onDark ? "#54605C" : "var(--line)";
  const color = active
    ? "var(--orange)"
    : onDark
      ? "var(--paper)"
      : "var(--ink)";
  return (
    <span
      style={{
        display: "inline-block",
        border: `1.5px solid ${border}`,
        borderRadius: "var(--r-pill, 20px)",
        padding: "6px 14px",
        fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
        fontWeight: 600,
        fontSize: ".74rem",
        textTransform: "uppercase",
        letterSpacing: ".04em",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Pill;
