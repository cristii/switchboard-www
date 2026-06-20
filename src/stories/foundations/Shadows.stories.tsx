import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Shadows",
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

const shadows: { name: string; value: string; note: string }[] = [
  { name: "--shadow-card", value: "4px 4px 0 rgba(21,33,31,.10)", note: "resting card" },
  { name: "--shadow-raised", value: "6px 6px 0 rgba(21,33,31,.14)", note: "video / portrait" },
  { name: "--shadow-pop", value: "8px 8px 0 rgba(21,33,31,.16)", note: "chat widget" },
  { name: "--shadow-btn", value: "3px 3px 0 var(--ink)", note: "primary button" },
  { name: "--shadow-btn-hover", value: "5px 5px 0 var(--ink)", note: "button lifted" },
  { name: "--shadow-accent", value: "5px 5px 0 var(--orange)", note: "featured plan" },
];

export const HardOffset: Story = {
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
        Shadows
      </h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "44em", margin: "0 0 8px" }}>
        <b>Hard, zero-blur offset shadows</b> — solid ink or orange blocks, never
        soft glows. This is the most important and most easily-broken rule of the
        brand: <b>never add blur.</b>
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 28,
          marginTop: 28,
        }}
      >
        {shadows.map((s) => (
          <div key={s.name}>
            <div
              style={{
                height: 92,
                background: "var(--white)",
                border: `1.5px solid ${
                  s.name === "--shadow-accent" ? "var(--orange)" : "var(--ink)"
                }`,
                borderRadius: 14,
                boxShadow: `var(${s.name})`,
              }}
            />
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: ".74rem",
                marginTop: 12,
              }}
            >
              {s.name}
            </div>
            <div style={{ fontSize: ".74rem", color: "var(--ink-soft)" }}>
              {s.value} · {s.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
