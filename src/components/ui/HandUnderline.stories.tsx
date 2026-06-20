import type { Meta, StoryObj } from "@storybook/react";
import { HandUnderline } from "./HandUnderline";

const meta = {
  title: "Core/HandUnderline",
  component: HandUnderline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps inline text with the brand's wobbly hand-drawn underline. Use on a single emphasized phrase inside a heading or eyebrow — never a whole sentence.",
      },
    },
  },
  args: { children: "Chat with it.", weight: 7 },
  argTypes: {
    color: { control: "color" },
    weight: { control: { type: "range", min: 2, max: 12, step: 1 } },
  },
} satisfies Meta<typeof HandUnderline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InAHeading: Story = {
  render: (args) => (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: "clamp(2rem, 5vw, 3.4rem)",
        lineHeight: 1.04,
        letterSpacing: "-.02em",
        margin: 0,
      }}
    >
      Don&apos;t read about my service.{" "}
      <span style={{ color: "var(--orange)" }}>
        <HandUnderline {...args}>Chat with it.</HandUnderline>
      </span>
    </h1>
  ),
};
