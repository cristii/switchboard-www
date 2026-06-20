import * as React from "react";

/**
 * A large orange Bricolage figure with a muted caption — for proof/impact
 * numbers. Keep figures honest (the brand never invents fake stats).
 */
export interface StatProps {
  /** The headline figure, e.g. "<5s", "3×", "40+". */
  value: React.ReactNode;
  /** Supporting caption. */
  label: React.ReactNode;
  /** Lighten the caption for dark backgrounds. @default false */
  onDark?: boolean;
  style?: React.CSSProperties;
}

export function Stat(props: StatProps): JSX.Element;
