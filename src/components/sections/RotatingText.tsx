"use client";

import * as React from "react";

export interface RotatingTextProps {
  /** The phrases to cycle through. The first is shown immediately (and is all
   *  that's shown when motion is reduced). */
  words: string[];
  /** Milliseconds each word stays on screen. @default 2400 */
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cycles through `words` with a short fade/lift, the way the hero outcome line
 * does ("Picture your … missed calls answered → quotes followed up → …").
 * Honours `prefers-reduced-motion`: when set, it shows the first word and never
 * animates. App-level flair, so it lives in sections/ (not the DS library).
 */
export function RotatingText({ words, interval = 2400, className, style = {} }: RotatingTextProps) {
  const [index, setIndex] = React.useState(0);
  const [out, setOut] = React.useState(false);

  React.useEffect(() => {
    if (words.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setOut(true);
      window.setTimeout(() => {
        setIndex((v) => (v + 1) % words.length);
        setOut(false);
      }, 300);
    }, interval);
    return () => window.clearInterval(id);
  }, [words, interval]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transition: "opacity .3s ease, transform .3s ease",
        opacity: out ? 0 : 1,
        transform: out ? "translateY(-8px)" : "none",
        ...style,
      }}
    >
      {words[index]}
    </span>
  );
}

export default RotatingText;
