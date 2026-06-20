import * as React from "react";

/**
 * Small rounded label. Tint variants categorize (e.g. difficulty levels);
 * the solid variant is the orange "flag" used for callouts.
 */
export interface BadgeProps {
  children: React.ReactNode;
  /** @default "neutral" */
  variant?: "neutral" | "green" | "amber" | "violet" | "solid";
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
