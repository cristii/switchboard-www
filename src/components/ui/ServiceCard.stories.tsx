import type { Meta, StoryObj } from "@storybook/react";
import { ServiceCard } from "./ServiceCard";

const icon = (
  <svg
    viewBox="0 0 34 34"
    fill="none"
    stroke="#B45309"
    strokeWidth={1.8}
    strokeLinejoin="round"
    style={{ width: 34, height: 34 }}
  >
    <rect x="6" y="10" width="22" height="15" rx="3" />
    <path d="M17 10V6M13 4.5h8" />
    <circle cx="12.5" cy="17" r="1.6" fill="#B45309" stroke="none" />
    <circle cx="21.5" cy="17" r="1.6" fill="#B45309" stroke="none" />
  </svg>
);

const meta = {
  title: "Surfaces/ServiceCard",
  component: ServiceCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A numbered service offering: big orange index, icon, title and blurb in an ink-outlined card.",
      },
    },
  },
  args: {
    number: "01",
    icon,
    title: "AI Chatbot Architecture",
    children:
      "A website assistant trained on your services, FAQs, offers and rules, ready to answer visitors and guide them to the next step.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutNumber: Story = { args: { number: undefined } };
