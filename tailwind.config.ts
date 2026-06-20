import type { Config } from "tailwindcss";

/**
 * Switchboard Tailwind theme — a thin mapping onto the brand design tokens.
 *
 * The tokens themselves live in `src/styles/*.css` (the single source of truth,
 * also consumed directly by Storybook). Here we only reference those CSS
 * variables so there are no duplicated values: editing a token updates both the
 * design system and the Tailwind utilities. Use the brand classes
 * (`bg-paper text-ink font-display shadow-card rounded-lg`) — never raw hex.
 *
 * `src/components/ui` stays Tailwind-free, so it is intentionally NOT scanned.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/sections/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    // Replace the palette with brand tokens only (plus the CSS keywords), so
    // raw colours like `bg-blue-500` can't sneak in.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      black: "#000",
      white: "var(--white)",

      paper: "var(--paper)",
      "paper-2": "var(--paper-2)",
      "paper-3": "var(--paper-3)",

      ink: "var(--ink)",
      "ink-soft": "var(--ink-soft)",
      "ink-body": "var(--text-body)",
      dark: "var(--dark)",

      line: "var(--line)",
      "line-soft": "var(--line-soft)",

      orange: "var(--orange)",
      "orange-deep": "var(--orange-deep)",
      amber: "var(--amber)",
      green: "var(--green)",
      violet: "var(--violet)",

      // Tag tints (paired bg/fg)
      "tint-green-bg": "var(--tint-green-bg)",
      "tint-green-fg": "var(--tint-green-fg)",
      "tint-amber-bg": "var(--tint-amber-bg)",
      "tint-amber-fg": "var(--tint-amber-fg)",
      "tint-violet-bg": "var(--tint-violet-bg)",
      "tint-violet-fg": "var(--tint-violet-fg)",
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        hand: ["var(--font-hand)"],
      },
      fontSize: {
        hero: [
          "var(--fs-hero)",
          { lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-display)" },
        ],
        h2: [
          "var(--fs-h2)",
          { lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-display)" },
        ],
        h3: ["var(--fs-h3)", { lineHeight: "var(--lh-snug)" }],
        h4: ["var(--fs-h4)", { lineHeight: "var(--lh-snug)" }],
        lead: ["var(--fs-lead)", { lineHeight: "var(--lh-body)" }],
        base: ["var(--fs-body)", { lineHeight: "var(--lh-body)" }],
        sm: ["var(--fs-sm)", { lineHeight: "var(--lh-body)" }],
        xs: ["var(--fs-xs)", { lineHeight: "var(--lh-body)" }],
        eyebrow: [
          "var(--fs-eyebrow)",
          { letterSpacing: "var(--ls-eyebrow)" },
        ],
        button: ["var(--fs-button)", { letterSpacing: "var(--ls-button)" }],
      },
      letterSpacing: {
        display: "var(--ls-display)",
        tight: "var(--ls-tight)",
        eyebrow: "var(--ls-eyebrow)",
        button: "var(--ls-button)",
      },
      lineHeight: {
        tight: "var(--lh-tight)",
        snug: "var(--lh-snug)",
        body: "var(--lh-body)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        DEFAULT: "var(--r)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      borderWidth: {
        hair: "var(--bw-hair)",
        DEFAULT: "var(--bw)",
        strong: "var(--bw-strong)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
        pop: "var(--shadow-pop)",
        btn: "var(--shadow-btn)",
        "btn-hover": "var(--shadow-btn-hover)",
        "btn-ghost": "var(--shadow-btn-ghost)",
        accent: "var(--shadow-accent)",
      },
      maxWidth: {
        content: "var(--maxw)",
      },
      spacing: {
        gutter: "var(--gutter)",
        section: "var(--section-y)",
      },
    },
  },
  plugins: [],
};

export default config;
