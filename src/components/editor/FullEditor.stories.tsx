import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "./IsometricWorkflowEditor";
import { scoutsLeadsDiagram, n8nSampleDiagram } from "./catalog/presets";

// The complete editor (toolbar + palette + canvas + inspector) seeded with the
// presets. Use the Templates picker to switch, Auto-arrange to re-layer, and the
// orange out-handles to connect nodes.

const meta = {
  title: "Editor/Full Editor",
  component: IsometricWorkflowEditor,
  parameters: { layout: "fullscreen" },
  args: { style: { height: "88vh" } },
} satisfies Meta<typeof IsometricWorkflowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full multi-tier Scouts / Leads architecture (groups, fan-out/in, labels). */
export const Architecture: Story = {
  args: { initialDiagram: scoutsLeadsDiagram },
};

export const N8nWorkflow: Story = {
  args: { initialDiagram: n8nSampleDiagram },
};

export const ArchitectureDark: Story = {
  args: { initialDiagram: scoutsLeadsDiagram, defaultTheme: "dark" },
};
