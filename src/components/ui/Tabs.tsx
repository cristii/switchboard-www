"use client";

import * as React from "react";

// Real tabs (role=tablist/tab, aria-selected, arrow-key navigation) styled as
// the brand's pill chips. The consumer renders the panels and links them via
// `id={`${idBase}-panel-${tab.id}`}` + `aria-labelledby={`${idBase}-tab-${tab.id}`}`.

export interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
  /** Prefix for the generated tab/panel ids. @default "tabs" */
  idBase?: string;
  style?: React.CSSProperties;
}

export function Tabs({ tabs, active, onChange, label, idBase = "tabs", style }: TabsProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (i: number) => {
    const n = tabs.length;
    const idx = ((i % n) + n) % n;
    refs.current[idx]?.focus();
    onChange(tabs[idx].id);
  };

  return (
    <div role="tablist" aria-label={label} style={{ display: "flex", gap: 8, ...style }}>
      {tabs.map((t, i) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") focusTab(i + 1);
              else if (e.key === "ArrowLeft") focusTab(i - 1);
              else if (e.key === "Home") focusTab(0);
              else if (e.key === "End") focusTab(tabs.length - 1);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--r-pill, 20px)",
              border: `1.5px solid ${selected ? "var(--ink)" : "var(--line)"}`,
              background: selected ? "var(--dark)" : "var(--white)",
              color: selected ? "var(--text-on-dark)" : "var(--ink)",
              fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
              fontWeight: 600,
              fontSize: ".78rem",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
