import React from "react";

/**
 * Switchboard Button — uppercase Bricolage label with a HARD offset shadow.
 * On hover it lifts (translateY) and the shadow grows. No blur, ever.
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
}) {
  const sizes = {
    sm: { padding: ".7em 1.1em", fontSize: ".78rem" },
    md: { padding: ".85em 1.3em", fontSize: "var(--fs-button, .86rem)" },
    lg: { padding: "1em 1.6em", fontSize: ".95rem" },
  };

  const variants = {
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
      boxShadow: "var(--shadow-btn-ghost, 3px 3px 0 rgba(21,33,31,.18))",
    },
    light: {
      background: "var(--paper)",
      color: "var(--ink)",
      borderColor: "var(--ink)",
      boxShadow: "var(--shadow-btn-ghost, 3px 3px 0 rgba(21,33,31,.18))",
    },
  };

  const base = {
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
    transition: "transform var(--dur-fast,.12s) ease, box-shadow var(--dur-fast,.12s) ease",
    textDecoration: "none",
    lineHeight: 1,
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const Tag = href ? "a" : "button";
  const onEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow =
      variant === "primary"
        ? "var(--shadow-btn-hover, 5px 5px 0 var(--ink))"
        : "5px 5px 0 rgba(21,33,31,.22)";
  };
  const onLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = variants[variant].boxShadow;
  };

  return (
    <Tag
      href={href}
      style={base}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex" }}>{icon}</span> : null}
      {children}
      {iconRight ? <span style={{ display: "inline-flex" }}>{iconRight}</span> : null}
      {arrow ? <span style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>→</span> : null}
    </Tag>
  );
}
