import * as React from "react";

export interface ProcessStepProps {
  /** Two-digit index, e.g. "01". */
  number: React.ReactNode;
  /** Leading icon node (~38px, ink stroke). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  /** Show the trailing connector arrow (omit on the last step). @default false */
  arrow?: boolean;
  style?: React.CSSProperties;
}

const display = "var(--font-display, 'Bricolage Grotesque', sans-serif)";

/**
 * One numbered step in the implementation timeline: icon, orange index, title
 * and blurb, with an optional connector arrow pointing to the next step.
 */
export function ProcessStep({
  number,
  icon,
  title,
  children,
  arrow = false,
  style = {},
}: ProcessStepProps) {
  return (
    <div style={{ position: "relative", ...style }}>
      {icon ? <div style={{ marginBottom: 12 }}>{icon}</div> : null}
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: ".95rem", color: "var(--orange)" }}>
        {number}
      </div>
      <h4 style={{ fontFamily: display, fontWeight: 700, fontSize: "1rem", margin: "4px 0 7px" }}>
        {title}
      </h4>
      <p style={{ margin: 0, fontSize: ".82rem", color: "var(--ink-soft)" }}>{children}</p>
      {arrow ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 8,
            right: -12,
            color: "var(--line)",
            fontSize: "1.1rem",
          }}
        >
          →
        </span>
      ) : null}
    </div>
  );
}

export default ProcessStep;
