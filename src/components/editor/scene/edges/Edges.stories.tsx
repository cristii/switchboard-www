import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "../../IsometricWorkflowEditor";
import { branchingSampleDiagram } from "../../sampleDiagram";
import type { Diagram } from "../../state/types";

// Edge routing exercised end-to-end via the editor. Branching shows fan-out /
// fan-in + labels + a dashed (async) edge; RoutingStyles compares orthogonal /
// smooth / direct and solid / dashed. Drag from a node's orange out-handle to
// another node to create a connection.

const meta = {
  title: "Editor/Edges",
  component: IsometricWorkflowEditor,
  parameters: { layout: "fullscreen" },
  args: { defaultTheme: "light", style: { height: "82vh" } },
} satisfies Meta<typeof IsometricWorkflowEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Branching: Story = {
  args: { initialDiagram: branchingSampleDiagram },
};

const routingStyles: Diagram = {
  version: 1,
  nodes: [
    { id: "a1", kind: "action", label: "Orthogonal", x: -5, y: -3 },
    { id: "a2", kind: "database", label: "Target", x: -5, y: 3 },
    { id: "b1", kind: "action", label: "Smooth", x: 0, y: -3 },
    { id: "b2", kind: "database", label: "Target", x: 0, y: 3 },
    { id: "c1", kind: "action", label: "Direct (dashed)", x: 5, y: -3 },
    { id: "c2", kind: "database", label: "Target", x: 5, y: 3 },
  ],
  edges: [
    { id: "r1", source: "a1", target: "a2", routing: "orthogonal", label: "orthogonal" },
    { id: "r2", source: "b1", target: "b2", routing: "smooth", label: "smooth" },
    { id: "r3", source: "c1", target: "c2", routing: "direct", style: "dashed", label: "direct" },
  ],
};

export const RoutingStyles: Story = {
  args: { initialDiagram: routingStyles },
};

export const Dark: Story = {
  args: { initialDiagram: branchingSampleDiagram, defaultTheme: "dark" },
};
