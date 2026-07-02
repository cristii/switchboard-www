"use client";

// Labelled text/number input for the inspector. Uncontrolled with commit on blur
// or Enter (so editing doesn't spam the undo history). Reset it across selections
// with a `key`. Editor-token styled.

import * as React from "react";

export interface FieldProps {
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: "text" | "number";
  onCommit: (value: string) => void;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.58rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: "0 0 4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border-soft)",
  background: "var(--editor-surface-2)",
  color: "var(--editor-text)",
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.82rem",

};

export function Field({ label, defaultValue, placeholder, type = "text", onCommit }: FieldProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={inputStyle}
        onBlur={(e) => onCommit(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--editor-accent)";
        }}
      />
    </label>
  );
}

export default Field;
