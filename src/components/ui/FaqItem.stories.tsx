import type { Meta, StoryObj } from "@storybook/react";
import { FaqItem } from "./FaqItem";

const meta = {
  title: "Surfaces/FaqItem",
  component: FaqItem,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An expandable question/answer row with the rotating orange +/- glyph. Each item manages its own open state.",
      },
    },
  },
  args: {
    question: "Will the chatbot make things up?",
    children:
      "No, it only answers from the knowledge I train it on (your services, FAQs and rules). When it doesn't know something, it says so and hands off to you instead of guessing.",
    defaultOpen: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
