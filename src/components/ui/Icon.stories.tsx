import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";

// Import the bespoke set as bundler-resolved URLs so paths stay correct under
// the GitHub Pages subpath. The Next app imports the same files directly; Icon
// accepts either a URL string (Vite) or a static-import object (Next).
const modules = import.meta.glob("../../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [
    path.split("/").pop()!.replace(".svg", ""),
    url,
  ]),
) as Record<string, string>;

const meta = {
  title: "Core/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single bespoke line icon, tinted via CSS `mask` so one SVG renders in any brand colour. Defaults to `currentColor` (inherits the surrounding text colour). Import an SVG from `src/assets/icons` and pass it as `src`. No icon font, no third-party library.",
      },
    },
  },
  args: { src: icons.assistant, color: "var(--ink)", size: 28 },
  argTypes: {
    color: { control: "color" },
    size: { control: { type: "number", min: 12, max: 96, step: 2 } },
    src: { control: false },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Orange: Story = { args: { color: "var(--orange)" } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {[16, 24, 32, 48].map((s) => (
        <Icon key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const Tints: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      {["var(--ink)", "var(--orange)", "var(--green)", "var(--violet)", "var(--amber)"].map(
        (c) => (
          <Icon key={c} src={icons.workflow} color={c} size={34} />
        ),
      )}
    </div>
  ),
};

export const Gallery: Story = {
  parameters: {
    docs: {
      description: { story: "Every icon in the set, ink-tinted." },
    },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
        gap: 16,
        maxWidth: 760,
      }}
    >
      {Object.entries(icons).map(([name, url]) => (
        <div
          key={name}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <Icon src={url} color="var(--ink)" size={26} />
          <span
            style={{
              fontSize: ".68rem",
              color: "var(--ink-soft)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
