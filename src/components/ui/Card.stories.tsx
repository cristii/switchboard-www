import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const Sample = (
  <>
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "1.18rem",
        margin: "0 0 7px",
      }}
    >
      Website Assistant
    </h3>
    <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: ".92rem" }}>
      FAQ answers + basic lead capture, ready to install with a single script tag.
    </p>
  </>
);

const meta = {
  title: "Surfaces/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The workhorse surface: filled, ink-outlined, with a HARD offset shadow. `featured` swaps the outline + shadow to orange (the popular-plan treatment).",
      },
    },
  },
  args: { tone: "white", featured: false, flat: false, children: Sample },
  argTypes: {
    tone: { control: "inline-radio", options: ["white", "paper", "sunken"] },
    featured: { control: "boolean" },
    flat: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { style: { maxWidth: 320 } },
};

export const Featured: Story = {
  args: { featured: true, style: { maxWidth: 320 } },
};

export const Flat: Story = {
  args: { flat: true, style: { maxWidth: 320 } },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
      <Card tone="white" style={{ maxWidth: 240 }}>
        {Sample}
      </Card>
      <Card tone="paper" style={{ maxWidth: 240 }}>
        {Sample}
      </Card>
      <Card tone="sunken" style={{ maxWidth: 240 }}>
        {Sample}
      </Card>
    </div>
  ),
};
