"use client";

import * as React from "react";

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "ghost" | "light";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Render as an anchor when set. */
  href?: string;
  /** Button type when rendered as a <button>. */
  type?: "button" | "submit" | "reset";
  /** Anchor target / rel when rendered as a link. */
  target?: string;
  rel?: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  /** Append a → glyph after the label. @default false */
  arrow?: boolean;
  /** @default false */
  disabled?: boolean;
}

/**
 * Switchboard primary action button: uppercase Bricolage label with a hard,
 * blur-free offset shadow that grows on hover. No blur, ever.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  iconRight,
  arrow = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}: ButtonProps) {
  const sizes: Record<NonNullable<ButtonProps["size"]>, React.CSSProperties> = {
    sm: { padding: ".7em 1.1em", fontSize: ".78rem" },
    md: { padding: ".85em 1.3em", fontSize: "var(--fs-button, .86rem)" },
    lg: { padding: "1em 1.6em", fontSize: ".95rem" },
  };

  const variants: Record<
    NonNullable<ButtonProps["variant"]>,
    React.CSSProperties
  > = {
    primary: {
      background: "var(--orange)",
      color: "#fff",
      borderColor: "var(--orange-deep)",
      boxShadow: "var(--shadow-btn, 3px 3px 0 var(--ink))",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
      borderColor: "var(--ink)",
      boxShadow: "var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))",
    },
    light: {
      background: "var(--paper)",
      color: "var(--ink)",
      borderColor: "var(--ink)",
      boxShadow: "var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))",
    },
  };

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: ".5em",
    fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
    fontWeight: 700,
    letterSpacing: "var(--ls-button, .02em)",
    textTransform: "uppercase",
    borderRadius: "10px",
    borderStyle: "solid",
    borderWidth: "var(--bw-strong, 2px)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition:
      "transform var(--dur-fast,.12s) ease, box-shadow var(--dur-fast,.12s) ease",
    textDecoration: "none",
    lineHeight: 1,
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow =
      variant === "primary"
        ? "var(--shadow-btn-hover, 5px 5px 0 var(--ink))"
        : "5px 5px 0 rgba(var(--shadow-ink),.22)";
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = variants[variant].boxShadow as string;
  };

  const content = (
    <>
      {icon ? <span style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
      {iconRight ? (
        <span style={{ display: "inline-flex" }}>{iconRight}</span>
      ) : null}
      {arrow ? (
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>→</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={base}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-disabled={disabled || undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      style={base}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      disabled={disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default Button;
