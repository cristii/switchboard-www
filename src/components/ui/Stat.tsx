import * as React from "react";

export interface StatProps {
  /** The headline figure, e.g. "<5s", "3×", "40+". */
  value: React.ReactNode;
  /** Supporting caption. */
  label: React.ReactNode;
  /** Lighten the caption for dark backgrounds. @default false */
  onDark?: boolean;
  style?: React.CSSProperties;
}

/**
 * A large orange Bricolage figure with a muted caption — for proof/impact
 * numbers. Keep figures honest (the brand never invents fake stats).
 */
export function Stat({ value, label, onDark = false, style = {} }: StatProps) {
  return (
    <div style={style}>
      <div
        style={{
          fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
          fontWeight: 800,
          fontSize: "2.5rem",
          lineHeight: 1,
          color: "var(--orange)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: ".86rem",
          marginTop: "6px",
          color: onDark ? "#bcc4bd" : "var(--ink-soft)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default Stat;
