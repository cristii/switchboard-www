import React from "react";

/**
 * Stat — a big Bricolage number in orange with a muted label beneath.
 * Used in the dark proof band and the about section.
 */
export function Stat({ value, label, onDark = false, style = {} }) {
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
