import type { Meta, StoryObj } from "@storybook/react";
import { VideoPlaceholder } from "./VideoPlaceholder";

const meta = {
  title: "Surfaces/VideoPlaceholder",
  component: VideoPlaceholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A 16:10 video poster placeholder in the brand frame, dark gradient panel, paper play disc, gradient-masked labels. Swap for a real embed when footage exists.",
      },
    },
  },
  args: {
    label: "Sample build · FAQ Chatbot",
    duration: "2:00 highlight",
    title: "90-second highlight",
    caption: "The fastest way to see what an assistant actually does",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bare: Story = { args: { label: undefined, duration: undefined, title: undefined, caption: undefined } };
