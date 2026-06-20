import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta = {
  title: "Core/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The brand lockup (connector mark + Bricolage wordmark). Colour is inherited, so it adapts to light or dark surfaces. Wrap it in a link to navigate home.",
      },
    },
  },
  args: { markSize: 30, wordmark: true },
  argTypes: {
    markSize: { control: { type: "range", min: 18, max: 64, step: 1 } },
    wordmark: { control: "boolean" },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MarkOnly: Story = {
  args: { wordmark: false, markSize: 40 },
};

export const OnDark: Story = {
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--dark)",
          color: "var(--paper)",
          padding: 28,
          borderRadius: 14,
        }}
      >
        <Story />
      </div>
    ),
  ],
};
