"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

// The editor is heavy (three.js) and DOM/WebGL-only, so it loads client-side
// via a code-split chunk (ssr: false). This keeps three.js off every other
// route and out of the server render. See description.md §4, §13.
const IsometricWorkflowEditor = dynamic(
  () => import("@/components/editor").then((m) => m.IsometricWorkflowEditor),
  { ssr: false, loading: () => <EditorLoading /> },
);

const bar: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  height: 52,
  flex: "none",
  padding: "0 16px",
  background: "var(--editor-surface)",
  color: "var(--editor-text)",
  borderBottom: "1.5px solid var(--editor-border-soft)",
};

const backLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.78rem",
  letterSpacing: "0.01em",
  textDecoration: "none",
  color: "var(--editor-text)",
};

const titleWrap: CSSProperties = { display: "flex", alignItems: "center", gap: 10 };

const title: CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.9rem",
  color: "var(--editor-text)",
};

const wip: CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.58rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#fff",
  background: "var(--editor-accent)",
  borderRadius: 999,
  padding: "2px 8px",
};

function EditorLoading() {
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        background: "var(--editor-bg)",
        color: "var(--editor-text-muted)",
        fontFamily: "var(--font-display, sans-serif)",
        fontSize: "0.8rem",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      Loading editor…
    </div>
  );
}

/** Full-screen, chromeless shell: a thin top bar + the editor filling the rest. */
export function EditorMount() {
  return (
    <div
      data-editor-theme="light"
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--editor-bg)",
        overflow: "hidden",
      }}
    >
      <header style={bar}>
        <Link href="/" style={backLink} aria-label="Back to Switchboard home">
          <span aria-hidden>&larr;</span> Switchboard
        </Link>
        <div style={titleWrap}>
          <span style={title}>Isometric Workflow Editor</span>
          <span style={wip}>WIP</span>
        </div>
        {/* spacer to keep the title visually centred */}
        <span aria-hidden style={{ width: 96 }} />
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <IsometricWorkflowEditor
          style={{ height: "100%", borderRadius: 0, border: "none", boxShadow: "none" }}
        />
      </div>
    </div>
  );
}

export default EditorMount;
