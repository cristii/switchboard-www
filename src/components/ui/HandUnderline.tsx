import * as React from "react";

export interface HandUnderlineProps {
  children: React.ReactNode;
  /** Stroke color. @default "var(--orange)" */
  color?: string;
  /** Stroke width in SVG units. @default 7 */
  weight?: number;
  style?: React.CSSProperties;
}

/**
 * Wraps inline text with the brand's wobbly hand-drawn underline stroke — the
 * signature emphasis device. Use on a single emphasized phrase inside a heading
 * or eyebrow, never a whole sentence.
 */
export function HandUnderline({
  children,
  color = "var(--orange)",
  weight = 7,
  style = {},
}: HandUnderlineProps) {
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

export default HandUnderline;
