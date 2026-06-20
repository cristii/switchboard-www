import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

// Import every bespoke line icon as a bundler-resolved URL so paths stay correct
// under the GitHub Pages subpath. Icons are tinted via CSS `mask` (currentColor
// is not inherited by <img>), which is the pattern used across the system.
const modules = import.meta.glob("../../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const icons = Object.entries(modules)
  .map(([path, url]) => ({
    name: path.split("/").pop()!.replace(".svg", ""),
    url,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function IconTile({ name, url, color }: { name: string; url: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "18px 8px",
        background: "var(--white)",
        border: "1.5px solid var(--ink)",
        borderRadius: 14,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          background: color,
          WebkitMask: `url(${url}) center / contain no-repeat`,
          mask: `url(${url}) center / contain no-repeat`,
        }}
      />
      <span
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: ".7rem",
          color: "var(--ink-soft)",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export const LineSet: Story = {
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
        Icons
      </h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "44em", margin: "0 0 28px" }}>
        A bespoke, hand-drawn-feel line set — ~1.8 stroke, round caps and joins,
        no fills. There is no icon font and no third-party library. Tint via CSS{" "}
        <code>mask</code>: ink by default, orange for emphasis.
      </p>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", margin: "0 0 12px" }}>
        Ink ({icons.length})
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))",
          gap: 14,
          marginBottom: 30,
        }}
      >
        {icons.map((i) => (
          <IconTile key={i.name} name={i.name} url={i.url} color="var(--ink)" />
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", margin: "0 0 12px" }}>
        Orange (emphasis)
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))",
          gap: 14,
        }}
      >
        {icons.map((i) => (
          <IconTile key={i.name} name={i.name} url={i.url} color="var(--orange)" />
        ))}
      </div>
    </div>
  ),
};
