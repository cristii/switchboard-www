import * as React from "react";

export interface LogoProps {
  /** Pixel size of the square connector mark. @default 30 */
  markSize?: number;
  /** Show the "Switchboard / AI SYSTEMS" wordmark beside the mark. @default true */
  wordmark?: boolean;
  style?: React.CSSProperties;
}

/**
 * The Switchboard brand lockup: the line-drawn "connector" mark plus the
 * Bricolage wordmark. Colour is inherited (`currentColor`) so it sits on light
 * or dark surfaces — the header passes ink, the footer passes paper. The
 * "AI SYSTEMS" line is the same colour at reduced opacity, so it adapts too.
 * Presentational only: wrap it in a link to make it navigate.
 */
export function Logo({ markSize = 30, wordmark = true, style = {} }: LogoProps) {
  const display = "var(--font-display, 'Bricolage Grotesque', sans-serif)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color: "inherit",
        ...style,
      }}
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 30 30"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flex: "none" }}
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="22" cy="22" r="3" />
        <path d="M11 8H19a3 3 0 0 1 3 3V19" />
        <path d="M19 22H11a3 3 0 0 1 -3 -3V11" />
      </svg>
      {wordmark ? (
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <b
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: "1.32rem",
              letterSpacing: "-.03em",
            }}
          >
            Switchboard
          </b>
          <span
            style={{
              fontFamily: display,
              fontWeight: 600,
              fontSize: ".58rem",
              letterSpacing: ".22em",
              opacity: 0.62,
              marginTop: 3,
            }}
          >
            AI SYSTEMS
          </span>
        </span>
      ) : null}
    </span>
  );
}

export default Logo;
