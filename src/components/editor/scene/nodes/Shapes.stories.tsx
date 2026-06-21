import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "../../IsometricWorkflowEditor";
import { allKindsDiagram } from "../../sampleDiagram";

// Gallery of every catalog kind's isometric shape, laid out in a grid. Palette
// hidden to keep the focus on the shapes; flip the editorTheme toolbar or use
// the Dark story to check both palettes.

const meta = {
  title: "Editor/Nodes/Shapes",
  component: IsometricWorkflowEditor,
  parameters: { layout: "fullscreen" },
  args: {
    initialDiagram: allKindsDiagram,
    hidePalette: true,
    defaultTheme: "light",
    style: { height: "82vh" },
  },
} satisfies Meta<typeof IsometricWorkflowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
  args: { defaultTheme: "dark" },
};
