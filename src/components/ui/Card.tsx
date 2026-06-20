import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Fill color. @default "white" */
  tone?: "white" | "paper" | "sunken";
  /** Orange outline + orange shadow (the popular-plan treatment). @default false */
  featured?: boolean;
  /** Drop the offset shadow. @default false */
  flat?: boolean;
  style?: React.CSSProperties;
}

/**
 * The workhorse surface: filled, ink-outlined, with a HARD offset shadow.
 * `featured` swaps the outline + shadow to orange (the popular-plan treatment).
 * `tone` picks the fill so cards read on either paper background.
 */
export function Card({
  children,
  tone = "white",
  featured = false,
  flat = false,
  style = {},
  ...rest
}: CardProps) {
  const fills: Record<NonNullable<CardProps["tone"]>, string> = {
    white: "var(--white)",
    paper: "var(--paper)",
    sunken: "var(--paper-2)",
  };
  return (
    <div
      style={{
        background: fills[tone] || fills.white,
        border: featured ? "1.5px solid var(--orange)" : "1.5px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        boxShadow: flat
          ? "none"
          : featured
            ? "var(--shadow-accent, 5px 5px 0 var(--orange))"
            : "var(--shadow-card, 4px 4px 0 rgba(21,33,31,.1))",
        padding: "22px 24px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
