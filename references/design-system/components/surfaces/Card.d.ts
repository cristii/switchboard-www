import * as React from "react";

/**
 * The workhorse surface: filled, ink-outlined, with a hard offset shadow.
 */
export interface CardProps {
  children: React.ReactNode;
  /** Fill color. @default "white" */
  tone?: "white" | "paper" | "sunken";
  /** Orange outline + orange shadow (the popular-plan treatment). @default false */
  featured?: boolean;
  /** Drop the offset shadow. @default false */
  flat?: boolean;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
