import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

type Token = { name: string; value: string; dark?: boolean };

const groups: { title: string; note: string; tokens: Token[] }[] = [
  {
    title: "Paper neutrals",
    note: "Backgrounds & surfaces. The page is recycled paper; two darker steps alternate sections and wells.",
    tokens: [
      { name: "--paper", value: "#E9E8DF" },
      { name: "--paper-2", value: "#E1E2D7" },
      { name: "--paper-3", value: "#D7D9CB" },
      { name: "--white", value: "#FFFFFF" },
    ],
  },
  {
    title: "Ink & dark surfaces",
    note: "Primary text, the signature hard borders, and the near-black dark bands.",
    tokens: [
      { name: "--ink", value: "#15211F", dark: true },
      { name: "--ink-soft", value: "#54605C", dark: true },
      { name: "--dark", value: "#11201E", dark: true },
    ],
  },
  {
    title: "Lines",
    note: "Hairline borders and faint dividers on light surfaces.",
    tokens: [
      { name: "--line", value: "#B9C2B6" },
      { name: "--line-soft", value: "#CBD2C5" },
    ],
  },
  {
    title: "Brand accent, burnt orange",
    note: "The single accent: CTAs, links, numbers, the hand-drawn underline.",
    tokens: [
      { name: "--orange", value: "#B45309", dark: true },
      { name: "--orange-deep", value: "#92400E", dark: true },
      { name: "--amber", value: "#FBBF24" },
    ],
  },
  {
    title: "Supporting hues",
    note: "Green marks success/checks; violet appears only on the 'Advanced' tag.",
    tokens: [
      { name: "--green", value: "#3F7A4E", dark: true },
      { name: "--violet", value: "#6A4A8A", dark: true },
    ],
  },
  {
    title: "Tag tints (paired bg / fg)",
    note: "A ~12% wash paired with the saturated foreground.",
    tokens: [
      { name: "--tint-green-bg", value: "#E6EFE4" },
      { name: "--tint-green-fg", value: "#3F7A4E", dark: true },
      { name: "--tint-amber-bg", value: "#FBE8CF" },
      { name: "--tint-amber-fg", value: "#92400E", dark: true },
      { name: "--tint-violet-bg", value: "#E9E0F0" },
      { name: "--tint-violet-fg", value: "#6A4A8A", dark: true },
    ],
  },
];

function Swatch({ token }: { token: Token }) {
  return (
    <div style={{ width: 150 }}>
      <div
        style={{
          height: 64,
          borderRadius: 10,
          border: "1.5px solid var(--ink)",
          background: token.value,
          boxShadow: "var(--shadow-card)",
        }}
      />
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: ".74rem",
          marginTop: 8,
          color: "var(--ink)",
        }}
      >
        {token.name}
      </div>
      <div style={{ fontSize: ".72rem", color: "var(--ink-soft)" }}>
        {token.value}
      </div>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "2rem",
          letterSpacing: "-.02em",
          margin: "0 0 6px",
        }}
      >
        Colors
      </h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "40em", margin: "0 0 32px" }}>
        A flat printed palette, no gradients as identity. Recycled paper, pine
        ink, one burnt-orange accent, and quiet supporting hues.
      </p>
      {groups.map((g) => (
        <section key={g.title} style={{ marginBottom: 34 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.1rem",
              margin: "0 0 4px",
            }}
          >
            {g.title}
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", margin: "0 0 14px" }}>
            {g.note}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {g.tokens.map((t) => (
              <Swatch key={t.name} token={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
