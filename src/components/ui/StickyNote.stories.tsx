import type { Meta, StoryObj } from "@storybook/react";
import { StickyNote } from "./StickyNote";

const meta = {
  title: "Surfaces/StickyNote",
  component: StickyNote,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A slightly rotated, taped paper note set in the Caveat hand. Use sparingly for asides — tech-stack lists, marginalia. One per view, max.",
      },
    },
  },
  args: {
    title: "Tech stack",
    rotate: -1.4,
    children: (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>– n8n</li>
        <li>– Trigger.dev</li>
        <li>– OpenAI / Claude</li>
        <li>– Supabase</li>
      </ul>
    ),
  },
  argTypes: {
    rotate: { control: { type: "range", min: -6, max: 6, step: 0.2 } },
    title: { control: "text" },
  },
} satisfies Meta<typeof StickyNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { style: { maxWidth: 220 } } };

export const NoTitle: Story = {
  args: {
    title: undefined,
    children: "↳ that's the whole system.",
    style: { maxWidth: 220 },
  },
};
