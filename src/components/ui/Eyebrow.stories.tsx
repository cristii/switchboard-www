import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Core/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The small uppercase Bricolage kicker that labels a section. Orange by default; amber on dark surfaces.",
      },
    },
  },
  args: { children: "AI chatbots · automation · results", tone: "orange" },
  argTypes: {
    tone: { control: "inline-radio", options: ["orange", "amber", "ink"] },
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Orange: Story = {};

export const Ink: Story = {
  args: { tone: "ink", children: "My services" },
};

export const AmberOnDark: Story = {
  args: { tone: "amber", children: "Why 'results' isn't just a word" },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--dark)", padding: 28, borderRadius: 14 }}>
        <Story />
      </div>
    ),
  ],
};
