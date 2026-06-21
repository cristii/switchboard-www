"use client";

// Labelled native <select> for the inspector (edge routing/style). Editor-token
// styled; native control keeps it accessible and dependency-free.

import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
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

const selectStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "6px 8px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border-soft)",
  background: "var(--editor-surface-2)",
  color: "var(--editor-text)",
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.82rem",
  outline: "none",
  cursor: "pointer",
};

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      <select
        value={value}
        style={selectStyle}
        onChange={(e) => onChange(e.currentTarget.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Select;
