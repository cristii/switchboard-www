import * as React from "react";

/**
 * Wraps inline text with the brand's wobbly hand-drawn underline stroke.
 * Use on a single emphasized phrase inside a heading or eyebrow — never a
 * whole sentence.
 */
export interface HandUnderlineProps {
  children: React.ReactNode;
  /** Stroke color. @default "var(--orange)" */
  color?: string;
  /** Stroke width in SVG units. @default 7 */
  weight?: number;
  style?: React.CSSProperties;
}

export function HandUnderline(props: HandUnderlineProps): JSX.Element;
