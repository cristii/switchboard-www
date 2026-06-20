import type { Meta, StoryObj } from "@storybook/react";
import { Pill } from "./Pill";

const meta = {
  title: "Core/Pill",
  component: Pill,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Outlined capsule used in the conversion 'flow' rows (Conversation → Qualified lead → Booked call). Active turns orange; onDark lightens the resting outline.",
      },
    },
  },
  args: { children: "Conversation", active: false, onDark: false },
  argTypes: {
    active: { control: "boolean" },
    onDark: { control: "boolean" },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Resting: Story = {};

export const Active: Story = { args: { active: true } };

export const FlowOnDark: Story = {
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--ink)", padding: 28, borderRadius: 14 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <Pill active onDark>
        Conversation
      </Pill>
      <span style={{ color: "var(--orange)" }}>→</span>
      <Pill onDark>Qualified lead</Pill>
      <span style={{ color: "var(--orange)" }}>→</span>
      <Pill onDark>Booked call</Pill>
    </div>
  ),
};
