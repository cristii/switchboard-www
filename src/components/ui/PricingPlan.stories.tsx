import type { Meta, StoryObj } from "@storybook/react";
import { PricingPlan } from "./PricingPlan";

const icon = (
  <svg
    viewBox="0 0 30 30"
    fill="none"
    stroke="#15211F"
    strokeWidth={1.7}
    strokeLinejoin="round"
    style={{ width: 30, height: 30 }}
  >
    <rect x="5" y="8" width="20" height="13" rx="3" />
    <path d="M15 8V5M12 3.5h6" />
  </svg>
);

const meta = {
  title: "Surfaces/PricingPlan",
  component: PricingPlan,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pricing tier card. `featured` applies the popular-plan treatment: orange outline, orange offset shadow, corner flag and solid footer.",
      },
    },
  },
  args: {
    icon,
    name: "Website Assistant",
    desc: "FAQ answers + basic lead capture.",
    price: "€399",
    terms: "one-time setup",
    features: ["FAQ answers", "Lead capture", "Human handoff"],
    best: "Best for getting started",
    featured: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PricingPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Featured: Story = {
  args: {
    name: "Booking Assistant",
    desc: "Qualification + calendar handoff.",
    price: "€799",
    features: ["Lead qualification", "Calendar integration", "Booked calls"],
    best: "Best for service businesses",
    featured: true,
  },
};

export const Monthly: Story = {
  args: {
    name: "Care & Improvement",
    desc: "Optional. Keeps it accurate and improving.",
    price: "€99",
    priceSuffix: "/mo",
    terms: "optional add-on to any build",
    features: ["Conversation review", "FAQ updates", "Performance reports"],
    best: "Ongoing optimization",
  },
};
