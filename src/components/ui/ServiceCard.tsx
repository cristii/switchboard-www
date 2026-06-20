import * as React from "react";

export interface ServiceCardProps {
  /** Two-digit index, e.g. "01". */
  number?: React.ReactNode;
  /** Leading icon node (sized ~34px, orange stroke). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const display = "var(--font-display, 'Bricolage Grotesque', sans-serif)";

/**
 * A numbered service offering: big orange index, icon, title and blurb in an
 * ink-outlined card with the hard offset shadow.
 */
export function ServiceCard({
  number,
  icon,
  title,
  children,
  style = {},
}: ServiceCardProps) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1.5px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        padding: "22px 24px",
        display: "grid",
        gridTemplateColumns: number ? "auto 1fr" : "1fr",
        gap: 20,
        alignItems: "start",
        boxShadow: "var(--shadow-card, 4px 4px 0 rgba(21,33,31,.1))",
        ...style,
      }}
    >
      {number ? (
        <span
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: "2rem",
            color: "var(--orange)",
            lineHeight: 1,
          }}
        >
          {number}
        </span>
      ) : null}
      <div>
        {icon ? <div style={{ marginBottom: 6 }}>{icon}</div> : null}
        <h3
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: "1.18rem",
            margin: "0 0 7px",
          }}
        >
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: ".92rem", color: "var(--ink-soft)" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default ServiceCard;
