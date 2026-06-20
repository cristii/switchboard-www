import type { Meta, StoryObj } from "@storybook/react";
import { Stat } from "./Stat";

const meta = {
  title: "Data/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A large orange Bricolage figure with a muted caption — for proof/impact numbers. Keep figures honest (the brand never invents fake stats).",
      },
    },
  },
  args: {
    value: "<5s",
    label: "Average time to answer a visitor — day or night",
    onDark: false,
  },
  argTypes: { onDark: { control: "boolean" } },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnPaper: Story = {};

export const OnDark: Story = {
  args: { onDark: true },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--dark)", padding: 28, borderRadius: 14 }}>
        <Story />
      </div>
    ),
  ],
};

export const Row: Story = {
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--dark)", padding: 28, borderRadius: 14 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
      <Stat onDark value="<5s" label="Average time to answer a visitor — day or night" />
      <Stat onDark value="3×" label="More qualified enquiries vs. a static contact form" />
      <Stat onDark value="10 min" label="From your site to a working demo you can try" />
    </div>
  ),
};
