import * as React from "react";

/**
 * A slightly rotated, taped paper note set in the Caveat hand. Use sparingly
 * for asides — tech-stack lists, marginalia. One per view, max.
 */
export interface StickyNoteProps {
  /** Heading shown in Caveat. */
  title?: string;
  children: React.ReactNode;
  /** Rotation in degrees. @default -1.4 */
  rotate?: number;
  style?: React.CSSProperties;
}

export function StickyNote(props: StickyNoteProps): JSX.Element;
