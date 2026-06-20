import React from "react";

/**
 * Hand-drawn underline — wraps inline text with a wobbly Caveat-spirited
 * stroke beneath it. The brand's signature emphasis device.
 */
export function HandUnderline({ children, color = "var(--orange)", weight = 7, style = {} }) {
  return (
    <span style={{ position: "relative", whiteSpace: "nowrap", ...style }}>
      {children}
      <svg
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-2%",
          bottom: "-0.32em",
          width: "104%",
          height: "0.45em",
          overflow: "visible",
        }}
      >
        <path
          d="M4 14 C 60 6, 120 18, 180 9 S 280 6, 296 12"
          fill="none"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
