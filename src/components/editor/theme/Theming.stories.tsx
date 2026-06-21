import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "../IsometricWorkflowEditor";
import { branchingSampleDiagram } from "../sampleDiagram";

// Editor-scoped theming: the same diagram in both themes. The toggle lives in
// the toolbar (see Editor/Panels/Toolbar); here we force each theme to compare
// the scene + chrome side by side. The rest of the site is unaffected.

const meta: Meta = { title: "Editor/Theming" };
export default meta;

export const SideBySide: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 16, height: "82vh", boxSizing: "border-box" }}>
      <IsometricWorkflowEditor
        defaultTheme="light"
        chrome={false}
        initialDiagram={branchingSampleDiagram}
        style={{ height: "100%", flex: 1 }}
      />
      <IsometricWorkflowEditor
        defaultTheme="dark"
        chrome={false}
        initialDiagram={branchingSampleDiagram}
        style={{ height: "100%", flex: 1 }}
      />
    </div>
  ),
};
