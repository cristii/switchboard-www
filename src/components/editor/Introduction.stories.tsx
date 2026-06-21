import type { Meta, StoryObj } from "@storybook/react";

// Landing page for the Editor/* section in Storybook (P0.5). Plain DOM, styled
// with the editor + brand CSS variables (Tailwind-free) so it renders here.

const meta: Meta = {
  title: "Editor/Introduction",
};
export default meta;

const panel: React.CSSProperties = {
  maxWidth: 720,
  background: "var(--editor-surface)",
  color: "var(--editor-text)",
  border: "1.5px solid var(--editor-border-soft)",
  borderRadius: "var(--r-lg, 18px)",
  boxShadow: "var(--editor-shadow)",
  padding: "26px 28px",
  fontFamily: "var(--font-body, sans-serif)",
  lineHeight: 1.55,
};

export const Overview: StoryObj = {
  render: () => (
    <div data-editor-theme="light" style={panel}>
      <p
        style={{
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--editor-accent)",
          margin: "0 0 8px",
        }}
      >
        Isometric Workflow Editor (WIP)
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "1.7rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: "0 0 12px",
        }}
      >
        2.5D diagrams for n8n &amp; architecture systems
      </h1>
      <p style={{ margin: "0 0 14px", color: "var(--editor-text-muted)" }}>
        A modular, composable editor for authoring premium isometric diagrams of n8n workflows and
        advanced automation architectures, on-brand with the Switchboard design system.
      </p>
      <p style={{ margin: 0, color: "var(--editor-text-muted)", fontSize: "0.86rem" }}>
        This section documents the editor&apos;s building blocks as they land. See{" "}
        <strong style={{ color: "var(--editor-text)" }}>Editor/Scene MVP</strong> for the live
        canvas and <strong style={{ color: "var(--editor-text)" }}>Editor/State Sandbox</strong> for
        the renderer-agnostic data core. Full reference:{" "}
        <code>isometric_workflow_editor_description.md</code>.
      </p>
    </div>
  ),
};
