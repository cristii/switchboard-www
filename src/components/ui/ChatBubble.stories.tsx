import type { Meta, StoryObj } from "@storybook/react";
import { ChatBubble } from "./ChatBubble";

const meta = {
  title: "Chat/ChatBubble",
  component: ChatBubble,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single message bubble in the assistant widget. Bot bubbles are white with an ink hairline and an 'Assistant' label; user bubbles are orange.",
      },
    },
  },
  args: {
    from: "bot",
    showLabel: true,
    children:
      "Hi, I'm a live demo assistant. I can tell you what Switchboard builds, what it costs, and help you book a call. What would you like to know?",
  },
  argTypes: {
    from: { control: "inline-radio", options: ["bot", "user"] },
    showLabel: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 420,
          background: "var(--paper)",
          padding: 16,
          border: "1.5px solid var(--line)",
          borderRadius: 14,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bot: Story = {};

export const User: Story = {
  args: { from: "user", children: "How much does a booking assistant cost?" },
};

export const Conversation: Story = {
  render: () => (
    <>
      <ChatBubble from="bot">
        Hi, I&apos;m a live demo assistant. What would you like to know?
      </ChatBubble>
      <ChatBubble from="user">Can you book calls?</ChatBubble>
      <ChatBubble from="bot" showLabel={false}>
        Yes, I qualify the visitor and book straight into your calendar, so the
        calls you get are already warm.
      </ChatBubble>
    </>
  ),
};
