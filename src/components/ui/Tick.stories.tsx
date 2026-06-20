import type { Meta, StoryObj } from "@storybook/react";
import { Tick } from "./Tick";

const meta = {
  title: "Core/Tick",
  component: Tick,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A checkmark + label row. Green for feature lists; orange for the hero proof ticks. Text styling is inherited from context.",
      },
    },
  },
  args: { children: "Books calls", tone: "green", size: 18 },
  argTypes: {
    tone: { control: "inline-radio", options: ["green", "orange"] },
    size: { control: { type: "range", min: 12, max: 28, step: 1 } },
  },
} satisfies Meta<typeof Tick>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {};
export const Orange: Story = {
  args: { tone: "orange", children: "Answers instantly", style: { fontWeight: 600 } },
};
