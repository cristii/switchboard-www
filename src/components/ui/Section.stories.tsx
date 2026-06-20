import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./Section";

const meta = {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-bleed background band with a centered, gutter-padded inner column. `tone` picks the brand surface; dark/ink flip text to paper.",
      },
    },
  },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "alt", "dark", "ink"] },
  },
  args: {
    tone: "alt",
    children: (
      <>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, margin: 0 }}>
          A section heading
        </h2>
        <p style={{ marginTop: 12, maxWidth: "34em" }}>
          Body copy sits in the centered column with consistent gutters and vertical rhythm.
        </p>
      </>
    ),
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alt: Story = {};
export const Transparent: Story = { args: { tone: "default" } };
export const Dark: Story = { args: { tone: "dark" } };
export const Ink: Story = { args: { tone: "ink" } };
