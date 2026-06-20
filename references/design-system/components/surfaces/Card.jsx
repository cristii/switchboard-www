import React from "react";

/**
 * Card — the workhorse surface: white/paper fill, ink outline, hard offset
 * shadow. `featured` swaps the shadow to orange (used for the popular plan).
 * `tone` picks the fill so cards read on either paper background.
 */
export function Card({
  children,
  tone = "white",
  featured = false,
  flat = false,
  style = {},
  ...rest
}) {
  const fills = {
    white: "var(--white)",
    paper: "var(--paper)",
    sunken: "var(--paper-2)",
  };
  return (
    <div
      style={{
        background: fills[tone] || fills.white,
        border: featured
          ? "1.5px solid var(--orange)"
          : "1.5px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        boxShadow: flat
          ? "none"
          : featured
          ? "var(--shadow-accent, 5px 5px 0 var(--orange))"
          : "var(--shadow-card, 4px 4px 0 rgba(21,33,31,.1))",
        padding: "22px 24px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
