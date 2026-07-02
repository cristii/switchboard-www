"use client";

// Compact square icon button for the editor chrome. Editor-token styled (inline,
// Tailwind-free). Renders a NodeGlyph by name, or arbitrary children.

import * as React from "react";
import { NodeGlyph, type GlyphName } from "../icons/NodeGlyph";

export interface IconButtonProps {
  /** Accessible label (also the tooltip). */
  label: string;
  glyph?: GlyphName;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: number;
  children?: React.ReactNode;
}

export function IconButton({
  label,
  glyph,
  onClick,
  active = false,
  disabled = false,
  size,
  children,
}: IconButtonProps) {
  // Default size reads --editor-iconbtn-size so a container (e.g. the compact
  // mobile toolbar) can bump every button to a ≥44px touch target at once.
  const dim: number | string = size ?? "var(--editor-iconbtn-size, 32px)";
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dim,
    height: dim,
    borderRadius: 8,
    border: "1.5px solid",
    borderColor: active ? "var(--editor-accent)" : "transparent",
    background: active ? "var(--editor-surface-2)" : "transparent",
    color: active ? "var(--editor-accent)" : "var(--editor-text)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background 0.12s ease, border-color 0.12s ease",
    flex: "none",
  };
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      style={style}
      onMouseEnter={(e) => {
        if (disabled || active) return;
        e.currentTarget.style.background = "var(--editor-surface-2)";
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = "transparent";
      }}
    >
      {glyph ? <NodeGlyph name={glyph} size={Math.round((size ?? 32) * 0.56)} /> : children}
    </button>
  );
}

export default IconButton;
