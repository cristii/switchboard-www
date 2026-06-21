import type { Meta, StoryObj } from "@storybook/react";
import { NodePalette } from "./NodePalette";

// The palette is categories + kinds generated from the catalog. onAdd is stubbed
// here so the standalone story doesn't mutate the shared store.

const meta = {
  title: "Editor/Panels/NodePalette",
  component: NodePalette,
  parameters: { layout: "centered" },
  args: { onAdd: () => undefined },
} satisfies Meta<typeof NodePalette>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <div
      data-editor-theme={theme}
      style={{
        width: 240,
        height: 560,
        border: "1.5px solid var(--editor-border-soft)",
        borderRadius: "var(--r-lg, 18px)",
        overflow: "hidden",
        background: "var(--editor-bg)",
      }}
    >
      {children}
    </div>
  );
}

export const Light: Story = {
  render: (args) => (
    <Frame theme="light">
      <NodePalette {...args} style={{ height: "100%" }} />
    </Frame>
  ),
};

export const Dark: Story = {
  render: (args) => (
    <Frame theme="dark">
      <NodePalette {...args} style={{ height: "100%" }} />
    </Frame>
  ),
};
