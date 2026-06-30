import * as React from "react";

export interface PortraitProps {
  /** Image URL. When omitted, the placeholder panel is shown. */
  src?: string;
  alt?: string;
  /** Placeholder copy (Caveat hand) shown when there's no image. */
  placeholder?: React.ReactNode;
  /** CSS aspect-ratio. @default "4 / 4.4" */
  ratio?: string;
  style?: React.CSSProperties;
}

/**
 * A framed portrait surface: 2px ink outline, hard offset shadow, fixed aspect
 * ratio. Renders an image when `src` is given, otherwise a tinted placeholder
 * panel with a hand-written prompt.
 */
export function Portrait({
  src,
  alt = "",
  placeholder = "[ your photo here ]",
  ratio = "4 / 4.4",
  style = {},
}: PortraitProps) {
  return (
    <div
      style={{
        border: "2px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        overflow: "hidden",
        aspectRatio: ratio,
        boxShadow: "var(--shadow-raised, 6px 6px 0 rgba(var(--shadow-ink),.14))",
        display: "grid",
        placeItems: "center",
        position: "relative",
        background: src
          ? "var(--paper-2)"
          : "linear-gradient(160deg, #b9c2b6, #7e8c84)",
        color: "#fff",
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-hand, 'Caveat', cursive)",
            fontSize: "1.4rem",
            opacity: 0.85,
            textAlign: "center",
            padding: 20,
          }}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
}

export default Portrait;
