import * as React from "react";

/**
 * Outlined capsule for step/flow sequences. Active turns orange; onDark
 * lightens the resting outline for dark surfaces.
 */
export interface PillProps {
  children: React.ReactNode;
  /** @default false */
  active?: boolean;
  /** @default false */
  onDark?: boolean;
  style?: React.CSSProperties;
}

export function Pill(props: PillProps): JSX.Element;
