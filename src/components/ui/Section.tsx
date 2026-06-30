import * as React from "react";

export interface SectionProps {
  children: React.ReactNode;
  /** Background treatment. `default` is transparent (the paper canvas shows through). */
  tone?: "default" | "alt" | "dark" | "ink";
  id?: string;
  /** Vertical padding. @default "var(--section-y)" (62px) */
  py?: number | string;
  /** Max width of the inner column. @default "var(--maxw)" (1180px) */
  width?: number | string;
  /** Styles for the inner column wrapper. */
  innerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const backgrounds: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "transparent",
  alt: "var(--paper-2)",
  dark: "var(--dark)",
  // Theme-stable inverse band: --ink flips to light in dark mode, so the "ink"
  // band reads from --surface-inverse-2 to stay dark in both themes.
  ink: "var(--surface-inverse-2)",
};

/**
 * A page section: full-bleed background band with a centered, gutter-padded
 * inner column. `tone` picks the brand surface; `dark`/`ink` flip the text to
 * paper. The rhythm primitive every marketing page is built from.
 */
export function Section({
  children,
  tone = "default",
  id,
  py = "var(--section-y)",
  width = "var(--maxw)",
  innerStyle = {},
  style = {},
}: SectionProps) {
  const onDark = tone === "dark" || tone === "ink";
  return (
    <section
      id={id}
      style={{
        background: backgrounds[tone],
        // --on-dark is theme-stable (always light); --paper would flip dark.
        color: onDark ? "var(--on-dark)" : "var(--ink)",
        paddingTop: py,
        paddingBottom: py,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: width,
          margin: "0 auto",
          padding: "0 var(--gutter, 24px)",
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default Section;
