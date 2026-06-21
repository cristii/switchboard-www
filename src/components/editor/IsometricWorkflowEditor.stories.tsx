import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "./IsometricWorkflowEditor";

// P2 Scene MVP: the live isometric canvas. Drag nodes; ctrl/middle/right-drag to
// pan; wheel to zoom; double-click empty space to reset the view.

const meta = {
  title: "Editor/Scene MVP",
  component: IsometricWorkflowEditor,
  parameters: { layout: "fullscreen" },
  argTypes: {
    defaultTheme: { control: "inline-radio", options: ["light", "dark"] },
  },
  args: {
    defaultTheme: "light",
    style: { height: "78vh" },
  },
} satisfies Meta<typeof IsometricWorkflowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  args: { defaultTheme: "dark" },
};

export const Empty: Story = {
  args: { initialDiagram: { version: 1, nodes: [], edges: [] } },
};
