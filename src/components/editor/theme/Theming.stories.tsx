import type { Meta, StoryObj } from "@storybook/react";
import { IsometricWorkflowEditor } from "../IsometricWorkflowEditor";
import { branchingSampleDiagram } from "../sampleDiagram";
import { awsWebHostingDiagram, servicesFlowDiagram } from "../catalog/presets";

// Editor-scoped theming: the same diagram in both themes. The toggle lives in
// the toolbar (see Editor/Panels/Toolbar); here we force each theme to compare
// the scene + chrome side by side. The rest of the site is unaffected. The AWS
// story shows the built-in `aws` ThemeSpec — open the palette button in the
// toolbar to edit every visual live (lights, shadows, camera, colours, text).

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

/** The built-in `aws` theme: white backdrop, matte-grey nodes, soft shadows,
 *  thick orange flow, translucent orange platform, 3D text + an edge label. */
export const AWS: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ padding: 16, height: "82vh", boxSizing: "border-box" }}>
      <IsometricWorkflowEditor
        defaultThemeId="aws"
        initialDiagram={awsWebHostingDiagram}
        style={{ height: "100%" }}
      />
    </div>
  ),
};

/** The Switchboard `blueprint` theme with the clean Service-flow example: bubble-tag
 *  labels (decluttered), bold-arrow connectors, paper backdrop, brand accents. This
 *  is what embeds on the /services "systematic approach" section. */
export const Blueprint: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ padding: 16, height: "82vh", boxSizing: "border-box" }}>
      <IsometricWorkflowEditor
        defaultThemeId="blueprint"
        initialDiagram={servicesFlowDiagram}
        style={{ height: "100%" }}
      />
    </div>
  ),
};
