import * as React from "react";

export interface TickProps {
  children: React.ReactNode;
  /** Check colour. @default "green" */
  tone?: "green" | "orange";
  /** Icon size in px. @default 18 */
  size?: number;
  /** Vertically align the icon with the first line (for multi-line items). @default false */
  top?: boolean;
  style?: React.CSSProperties;
}

const colors: Record<NonNullable<TickProps["tone"]>, string> = {
  green: "var(--green)",
  orange: "var(--orange)",
};

/**
 * A checkmark + label row — the brand's affirmation device. Green by default
 * (feature lists, "what you'll see"); orange for the hero proof ticks. Text
 * styling (size/weight) is inherited from the surrounding context.
 */
export function Tick({
  children,
  tone = "green",
  size = 18,
  top = false,
  style = {},
}: TickProps) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: top ? "flex-start" : "center",
        gap: 8,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors[tone]}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          flex: "none",
          marginTop: top ? "0.2em" : 0,
        }}
      >
        <path d="M4 13l5 5L20 6" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

export default Tick;
