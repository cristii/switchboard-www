import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "Core/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Site light/dark switch: ink-outlined square with the brand's hard offset shadow, showing a bespoke sun (in dark mode) or moon (in light mode). Presentational — in the app it's wired to the `useTheme` hook in the header and mobile menu.",
      },
    },
  },
  args: { theme: "light", onToggle: () => {} },
  argTypes: {
    theme: { control: "inline-radio", options: ["light", "dark"] },
    onDark: { control: "boolean" },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Light mode shows the moon ("switch to dark"). */
export const Light: Story = {};

/** Dark mode shows the sun ("switch to light"). */
export const Dark: Story = {
  args: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};

/** On a dark band (footer): transparent fill, on-dark outline. */
export const OnDark: Story = {
  args: { theme: "light", onDark: true },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--dark)", padding: 28, borderRadius: 14 }}>
        <Story />
      </div>
    ),
  ],
};

/** Interactive: click to flip between sun and moon. */
export const Interactive: Story = {
  render: function Render() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return (
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />
    );
  },
};
