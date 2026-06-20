import type { Meta, StoryObj } from "@storybook/react";
import { Portrait } from "./Portrait";

const meta = {
  title: "Surfaces/Portrait",
  component: Portrait,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A framed portrait surface (2px ink outline, hard offset shadow, fixed ratio). Shows an image when `src` is set, otherwise a hand-written placeholder.",
      },
    },
  },
  args: { placeholder: "[ your photo here ]", ratio: "4 / 4.4" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Portrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};
export const Square: Story = { args: { ratio: "1 / 1" } };
