import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Uppercase Bricolage label with a HARD, blur-free offset shadow that grows on hover. The primary call-to-action across the brand.",
      },
    },
  },
  args: {
    children: "Book a 15-min call",
    variant: "primary",
    size: "md",
    arrow: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "ghost", "light"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    arrow: { control: "boolean" },
    disabled: { control: "boolean" },
    href: { control: "text" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Ghost: Story = {
  args: { variant: "ghost", children: "See the work" },
};

export const Light: Story = {
  args: { variant: "light", children: "Book a 15-min call" },
  parameters: { backgrounds: { default: "dark" } },
};

export const WithArrow: Story = {
  args: { arrow: true, children: "Try the chatbot" },
};

export const AsLink: Story = {
  args: { href: "#", arrow: true, children: "Start with a free demo" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="primary" arrow>
        Primary
      </Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="light">Light</Button>
    </div>
  ),
};
