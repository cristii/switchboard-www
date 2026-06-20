import * as React from "react";

/**
 * Switchboard primary action button: uppercase Bricolage label with a hard,
 * blur-free offset shadow that grows on hover.
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "ghost" | "light";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Render as an anchor when set. */
  href?: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  /** Append a → glyph after the label. @default false */
  arrow?: boolean;
  /** @default false */
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
