import type { Meta, StoryObj } from "@storybook/react";
import { ProcessStep } from "./ProcessStep";

const icon = (
  <svg
    viewBox="0 0 38 38"
    fill="none"
    stroke="#15211F"
    strokeWidth={1.7}
    strokeLinejoin="round"
    style={{ width: 38, height: 38 }}
  >
    <rect x="5" y="9" width="28" height="20" rx="2" />
    <path d="M5 12l14 9 14-9" />
  </svg>
);

const meta = {
  title: "Surfaces/ProcessStep",
  component: ProcessStep,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One numbered step in the implementation timeline, with an optional connector arrow to the next step.",
      },
    },
  },
  args: {
    number: "01",
    icon,
    title: "You send your website",
    children: "I review your business, services and visitors.",
    arrow: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 220 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProcessStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Last: Story = { args: { number: "05", arrow: false, title: "We review & improve" } };
