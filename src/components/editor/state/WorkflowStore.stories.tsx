import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useWorkflowStore } from "./useWorkflowStore";
import { deserialize, toJSON } from "./schema";
import { mvpSampleDiagram } from "../sampleDiagram";
import type { NodeKind } from "./types";

// Renderer-agnostic exercise of the data core (P1.5): add/delete, undo/redo and
// a serialize → deserialize round-trip. No 3D — just the store + schema.

const KINDS: NodeKind[] = ["trigger", "action", "ai", "logic", "database", "output"];

const btn: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.74rem",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border)",
  background: "var(--editor-surface)",
  color: "var(--editor-text)",
  cursor: "pointer",
};

function Sandbox() {
  const store = useWorkflowStore();
  const [json, setJson] = useState("");
  const [roundTrip, setRoundTrip] = useState<string>("");

  useEffect(() => {
    if (useWorkflowStore.getState().nodes.length === 0) {
      useWorkflowStore.getState().loadDiagram(mvpSampleDiagram);
    }
  }, []);

  const doExport = () => {
    const diagram = store.exportDiagram();
    const text = toJSON(diagram);
    setJson(text);
    const back = deserialize(text);
    setRoundTrip(
      `round-trip OK → ${back.nodes.length} nodes, ${back.edges.length} edges (v${back.version})`,
    );
  };

  return (
    <div
      data-editor-theme="light"
      style={{
        fontFamily: "var(--font-body, sans-serif)",
        color: "var(--editor-text)",
        maxWidth: 760,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {KINDS.map((k) => (
          <button key={k} style={btn} onClick={() => store.addNode(k)}>
            + {k}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <button
          style={btn}
          onClick={() => store.selection?.type === "node" && store.deleteNode(store.selection.id)}
        >
          Delete selected
        </button>
        <button style={btn} disabled={!store.canUndo()} onClick={store.undo}>
          Undo
        </button>
        <button style={btn} disabled={!store.canRedo()} onClick={store.redo}>
          Redo
        </button>
        <button style={btn} onClick={() => store.loadDiagram(mvpSampleDiagram)}>
          Load sample
        </button>
        <button style={btn} onClick={store.clear}>
          Clear
        </button>
        <button style={btn} onClick={doExport}>
          Export JSON
        </button>
      </div>

      <p style={{ fontSize: "0.84rem", color: "var(--editor-text-muted)", margin: "0 0 8px" }}>
        {store.nodes.length} nodes · {store.edges.length} edges · selection:{" "}
        {store.selection ? `${store.selection.type} ${store.selection.id}` : "none"} · history:{" "}
        {store.past.length}↩ / {store.future.length}↪
      </p>
      {roundTrip ? (
        <p style={{ fontSize: "0.8rem", color: "var(--editor-accent)", margin: "0 0 8px" }}>
          {roundTrip}
        </p>
      ) : null}

      <pre
        style={{
          background: "var(--editor-surface-2)",
          border: "1.5px solid var(--editor-border-soft)",
          borderRadius: 10,
          padding: 12,
          fontSize: "0.68rem",
          maxHeight: 320,
          overflow: "auto",
          margin: 0,
        }}
      >
        {json || "Press “Export JSON” to serialise the current diagram."}
      </pre>
    </div>
  );
}

const meta: Meta<typeof Sandbox> = {
  title: "Editor/State Sandbox",
  component: Sandbox,
};
export default meta;
type Story = StoryObj<typeof Sandbox>;

export const Default: Story = {};
