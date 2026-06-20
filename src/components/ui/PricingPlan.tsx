import * as React from "react";
import { Tick } from "./Tick";

export interface PricingPlanProps {
  /** Plan icon node (~30px). */
  icon?: React.ReactNode;
  name: React.ReactNode;
  /** One-line summary. */
  desc: React.ReactNode;
  /** Price figure, e.g. "€399". */
  price: React.ReactNode;
  /** Small suffix after the price, e.g. "+" or "/mo". */
  priceSuffix?: React.ReactNode;
  /** Show the "from" kicker above the price. @default true */
  from?: boolean;
  /** Terms line under the price, e.g. "one-time setup". */
  terms?: React.ReactNode;
  /** Feature bullets (rendered with green ticks). */
  features?: React.ReactNode[];
  /** Footer line, e.g. "Best for getting started". */
  best?: React.ReactNode;
  /** Highlight as the popular plan (orange outline + shadow + flag). @default false */
  featured?: boolean;
  /** Flag label shown when featured. @default "Most popular" */
  flag?: React.ReactNode;
  style?: React.CSSProperties;
}

const display = "var(--font-display, 'Bricolage Grotesque', sans-serif)";

/**
 * A pricing tier card. `featured` applies the popular-plan treatment (orange
 * outline, orange offset shadow, corner flag, solid-orange footer).
 */
export function PricingPlan({
  icon,
  name,
  desc,
  price,
  priceSuffix,
  from = true,
  terms,
  features = [],
  best,
  featured = false,
  flag = "Most popular",
  style = {},
}: PricingPlanProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)",
        border: featured ? "1.5px solid var(--orange)" : "1.5px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        padding: 22,
        boxShadow: featured
          ? "var(--shadow-accent, 5px 5px 0 var(--orange))"
          : "var(--shadow-card, 4px 4px 0 rgba(21,33,31,.1))",
        ...style,
      }}
    >
      {featured ? (
        <span
          style={{
            position: "absolute",
            top: -12,
            right: 16,
            background: "var(--orange)",
            color: "#fff",
            fontFamily: display,
            fontWeight: 700,
            fontSize: ".66rem",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            padding: "4px 10px",
            borderRadius: "var(--r-pill, 20px)",
          }}
        >
          {flag}
        </span>
      ) : null}

      {icon ? <div style={{ marginBottom: 12 }}>{icon}</div> : null}

      <h3 style={{ fontFamily: display, fontWeight: 700, fontSize: "1.08rem", margin: 0 }}>
        {name}
      </h3>
      <div
        style={{
          fontSize: ".82rem",
          color: "var(--ink-soft)",
          margin: "5px 0 16px",
          minHeight: "2.5em",
        }}
      >
        {desc}
      </div>

      {from ? (
        <div style={{ fontSize: ".72rem", color: "var(--ink-soft)", fontWeight: 600, marginBottom: 2 }}>
          from
        </div>
      ) : null}
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>
        {price}
        {priceSuffix ? (
          <small style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--ink-soft)" }}>
            {" "}
            {priceSuffix}
          </small>
        ) : null}
      </div>
      {terms ? (
        <div style={{ fontSize: ".74rem", color: "var(--ink-soft)", margin: "4px 0 14px" }}>
          {terms}
        </div>
      ) : null}

      {features.length ? (
        <ul style={{ listStyle: "none", display: "grid", gap: 9, flex: 1, margin: "0 0 16px", padding: 0 }}>
          {features.map((f, i) => (
            <li key={i} style={{ fontSize: ".86rem" }}>
              <Tick tone="green" size={15} top>
                {f}
              </Tick>
            </li>
          ))}
        </ul>
      ) : null}

      {best ? (
        <div
          style={{
            textAlign: "center",
            fontFamily: display,
            fontWeight: 700,
            fontSize: ".74rem",
            textTransform: "uppercase",
            letterSpacing: ".03em",
            padding: 9,
            borderRadius: 8,
            background: featured ? "var(--orange)" : "var(--paper-3)",
            color: featured ? "#fff" : "var(--ink)",
          }}
        >
          {best}
        </div>
      ) : null}
    </div>
  );
}

export default PricingPlan;
