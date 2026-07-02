import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { JsonEditor } from "./JsonEditor";
import "../theme/editor-tokens.css";

// The CodeMirror-based JSON editor used by the playground and the editor's
// live "Document JSON" panel. Brand-themed via the editor tokens, with JSON
// lint squiggles + an optional doc-shape validator.

const meta: Meta<typeof JsonEditor> = {
  title: "Editor/JsonEditor",
  component: JsonEditor,
};
export default meta;

const SAMPLE = JSON.stringify(
  {
    version: 1,
    nodes: [
      { id: "n1", kind: "trigger", label: "Webhook", x: -3, y: 0 },
      { id: "n2", kind: "ai", label: "Classify", x: 0, y: 0 },
      { id: "n3", kind: "output", label: "Notify", x: 3, y: 0, meta: { icon: "reply" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", flow: "slow" },
      { id: "e2", source: "n2", target: "n3" },
    ],
  },
  null,
  2,
);

function Shell({ theme }: { theme: "light" | "dark" }) {
  const [text, setText] = React.useState(SAMPLE);
  return (
    <div
      data-editor-theme={theme}
      style={{
        height: 420,
        border: "1.5px solid var(--editor-border-soft)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--editor-surface)",
      }}
    >
      <JsonEditor
        value={text}
        onChange={setText}
        validate={(t) => {
          try {
            const doc = JSON.parse(t) as { nodes?: unknown };
            return Array.isArray(doc.nodes) ? null : "Document needs a nodes array";
          } catch {
            return null;
          }
        }}
      />
    </div>
  );
}

export const Light: StoryObj = { render: () => <Shell theme="light" /> };
export const Dark: StoryObj = { render: () => <Shell theme="dark" /> };
