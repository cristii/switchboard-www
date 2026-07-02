"use client";

import * as React from "react";

// Anchored action menu (context menu / "actions" dropdown) with real menu
// semantics: focus moves into the menu on open, arrow keys + Home/End walk the
// items, Escape/outside-click closes and focus returns to where it was. The
// panel clamps to the viewport on BOTH axes. Brand-token styled (hard shadow).

export interface MenuAction {
  id: string;
  label: string;
  /** Optional leading icon (16px works best). */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Draw a divider ABOVE this item. */
  dividerBefore?: boolean;
}

export interface MenuProps {
  open: boolean;
  /** Anchor point in client coordinates (e.g. the right-click position). */
  x: number;
  y: number;
  actions: MenuAction[];
  onAction: (id: string) => void;
  onClose: () => void;
  /** Accessible name for the menu. */
  label?: string;
}

const PANEL_W = 224;

export function Menu({ open, x, y, actions, onAction, onClose, label }: MenuProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLElement | null>(null);

  // Focus management: capture the opener, focus the first item, restore on close.
  React.useEffect(() => {
    if (!open) return;
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    const first = ref.current?.querySelector<HTMLElement>("[role=menuitem]:not([disabled])");
    first?.focus();
    return () => restoreRef.current?.focus?.();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const estH = actions.length * 40 + 12;
  const left = Math.max(8, Math.min(x, vw - PANEL_W - 8));
  const top = Math.max(8, Math.min(y, vh - estH - 8));

  const move = (dir: 1 | -1, current: HTMLElement) => {
    const items = Array.from(
      ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not([disabled])") ?? [],
    );
    const i = items.indexOf(current);
    const next = items[(i + dir + items.length) % items.length];
    next?.focus();
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      style={{
        position: "fixed",
        left,
        top,
        zIndex: 60,
        width: PANEL_W,
        padding: "6px 0",
        background: "var(--white)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--r-md, 12px)",
        boxShadow: "var(--shadow-raised)",
        overflow: "hidden",
      }}
      onKeyDown={(e) => {
        const t = e.target as HTMLElement;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          move(1, t);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          move(-1, t);
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          const items = ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not([disabled])");
          if (items?.length) items[e.key === "Home" ? 0 : items.length - 1].focus();
        }
      }}
    >
      {actions.map((a) => (
        <React.Fragment key={a.id}>
          {a.dividerBefore ? (
            <div aria-hidden style={{ height: 1, background: "var(--line)", margin: "5px 0" }} />
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={a.disabled}
            tabIndex={-1}
            onClick={() => {
              onAction(a.id);
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "9px 14px",
              border: "none",
              background: "transparent",
              color: "var(--ink)",
              opacity: a.disabled ? 0.45 : 1,
              fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
              fontWeight: 600,
              fontSize: ".84rem",
              textAlign: "left",
              cursor: a.disabled ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!a.disabled) e.currentTarget.style.background = "var(--paper-2)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {a.icon ? (
              <span aria-hidden style={{ display: "inline-flex", flex: "none" }}>
                {a.icon}
              </span>
            ) : null}
            {a.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Menu;
