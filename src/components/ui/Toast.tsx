"use client";

import * as React from "react";

// Transient status pill (e.g. "JSON copied"), announced to screen readers via a
// PERSISTENT polite live region — the region always renders so announcements
// work; the visual pill only shows while there's a message. Brand-token styled.

export interface ToastProps {
  /** Current message; null hides the pill (the live region stays mounted). */
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 70,
        pointerEvents: "none",
      }}
    >
      {message ? (
        <span
          style={{
            display: "inline-block",
            padding: "9px 18px",
            borderRadius: "var(--r-pill, 20px)",
            border: "2px solid var(--ink)",
            background: "var(--dark)",
            color: "var(--text-on-dark)",
            boxShadow: "var(--shadow-raised)",
            fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
            fontWeight: 600,
            fontSize: ".84rem",
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

/** Timer-managed toast state: `show("Copied")` displays for `ms` then clears. */
export function useToast(ms = 1800): { message: string | null; show: (msg: string) => void } {
  const [message, setMessage] = React.useState<string | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const show = React.useCallback(
    (msg: string) => {
      setMessage(msg);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMessage(null), ms);
    },
    [ms],
  );
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return { message, show };
}

export default Toast;
