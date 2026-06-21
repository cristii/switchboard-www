"use client";

// A surface container for editor chrome (toolbar / inspector). Editor-token
// styled; the hard offset shadow is opt-in via `raised`.

import * as React from "react";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  children: React.ReactNode;
}

export function Panel({ raised = false, style, children, ...rest }: PanelProps) {
  return (
    <div
      style={{
        background: "var(--editor-surface)",
        color: "var(--editor-text)",
        border: "1.5px solid var(--editor-border-soft)",
        borderRadius: "var(--r, 14px)",
        boxShadow: raised ? "var(--editor-shadow)" : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Panel;
