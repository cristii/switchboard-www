"use client";

import * as React from "react";

export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** The currently active theme. */
  theme: "light" | "dark";
  /** Flip to the other theme. */
  onToggle: () => void;
  /** Sit on a dark band (footer): swaps the outline/fill to the on-dark set. */
  onDark?: boolean;
}

/**
 * Site light/dark switch: an ink-outlined square button with the brand's hard
 * offset shadow, showing a bespoke sun (in dark mode → "switch to light") or
 * moon (in light mode → "switch to dark"). No third-party icons, no emoji.
 * Presentational — wire it to the `useTheme` hook at the call site.
 */
export function ThemeToggle({
  theme,
  onToggle,
  onDark = false,
  style = {},
  ...rest
}: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={onToggle}
      style={{
        display: "inline-grid",
        placeItems: "center",
        height: 40,
        width: 40,
        padding: 0,
        borderRadius: "var(--r-sm, 9px)",
        border: `var(--bw, 1.5px) solid ${onDark ? "var(--on-dark-line-2)" : "var(--ink)"}`,
        background: onDark ? "transparent" : "var(--white)",
        color: onDark ? "var(--on-dark)" : "var(--ink)",
        boxShadow: onDark ? "none" : "var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))",
        cursor: "pointer",
        transition: "transform var(--dur-fast,.12s) ease, box-shadow var(--dur-fast,.12s) ease",
        ...style,
      }}
      {...rest}
    >
      {isDark ? (
        // Sun
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.4M12 19v2.4M21.4 12H19M5 12H2.6M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3" />
        </svg>
      ) : (
        // Moon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
