import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { Inspector } from "./Inspector";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { branchingSampleDiagram } from "../sampleDiagram";

// The inspector in isolation, driven by the shared store. Each story seeds a
// diagram and selects a node / edge / nothing.

const meta: Meta = { title: "Editor/Panels/Inspector" };
export default meta;

function Demo({ select }: { select: "node" | "edge" | "none" }) {
  useEffect(() => {
    const s = useWorkflowStore.getState();
    s.loadDiagram(branchingSampleDiagram);
    if (select === "node") s.selectNode("p1");
    else if (select === "edge") s.selectEdge("x3");
    else s.clearSelection();
  }, [select]);

  return (
    <div
      data-editor-theme="light"
      style={{
        width: 280,
        height: 540,
        border: "1.5px solid var(--editor-border-soft)",
        borderRadius: "var(--r-lg, 18px)",
        overflow: "hidden",
        background: "var(--editor-bg)",
      }}
    >
      <Inspector style={{ height: "100%" }} />
    </div>
  );
}

export const NodeSelected: StoryObj = { render: () => <Demo select="node" /> };
export const EdgeSelected: StoryObj = { render: () => <Demo select="edge" /> };
export const Empty: StoryObj = { render: () => <Demo select="none" /> };
