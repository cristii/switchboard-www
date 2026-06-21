import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { IconButton } from "./IconButton";
import { Panel } from "./Panel";
import { Field } from "./Field";
import { Select } from "./Select";

// Editor-local chrome primitives (IconButton / Panel / Field / Select), styled
// only with editor CSS variables so they render correctly without Tailwind.

const meta: Meta = { title: "Editor/Primitives" };
export default meta;

function Showcase() {
  const [routing, setRouting] = useState("orthogonal");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 340 }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {(["undo", "redo", "zoomIn", "zoomOut", "fit", "reset", "download", "image", "moon"] as const).map(
          (g) => (
            <IconButton key={g} label={g} glyph={g} onClick={() => undefined} />
          ),
        )}
      </div>
      <Panel raised style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Label" defaultValue="Command Parser" onCommit={() => undefined} />
        <Select
          label="Routing"
          value={routing}
          options={[
            { value: "orthogonal", label: "Orthogonal" },
            { value: "smooth", label: "Smooth" },
            { value: "direct", label: "Direct" },
          ]}
          onChange={setRouting}
        />
      </Panel>
    </div>
  );
}

export const Light: StoryObj = {
  render: () => (
    <div data-editor-theme="light">
      <Showcase />
    </div>
  ),
};

export const Dark: StoryObj = {
  render: () => (
    <div data-editor-theme="dark" style={{ background: "var(--editor-bg)", padding: 24, borderRadius: 14 }}>
      <Showcase />
    </div>
  ),
};
