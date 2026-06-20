import * as React from "react";

/**
 * The small uppercase kicker that sits above a section heading.
 */
export interface EyebrowProps {
  children: React.ReactNode;
  /** @default "orange" */
  tone?: "orange" | "amber" | "ink";
  style?: React.CSSProperties;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
