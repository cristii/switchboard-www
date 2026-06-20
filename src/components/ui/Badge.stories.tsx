import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Core/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Small rounded label. Tint variants categorize (difficulty levels, tags); the solid variant is the orange 'flag' for callouts like 'Most popular'.",
      },
    },
  },
  args: { children: "n8n", variant: "neutral" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["neutral", "green", "amber", "violet", "solid"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Green: Story = { args: { variant: "green", children: "Beginner" } };
export const Amber: Story = { args: { variant: "amber", children: "Intermediate" } };
export const Violet: Story = { args: { variant: "violet", children: "Advanced" } };
export const Solid: Story = { args: { variant: "solid", children: "Most popular" } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="green">Beginner</Badge>
      <Badge variant="amber">Intermediate</Badge>
      <Badge variant="violet">Advanced</Badge>
      <Badge variant="solid">Most popular</Badge>
    </div>
  ),
};
