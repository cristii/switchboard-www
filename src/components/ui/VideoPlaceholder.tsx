import * as React from "react";

export interface VideoPlaceholderProps {
  /** Top-left label, e.g. "Sample build · FAQ Chatbot". */
  label?: React.ReactNode;
  /** Top-right label, e.g. "2:00 highlight". */
  duration?: React.ReactNode;
  /** Bold caption over the bottom, e.g. "90-second highlight". */
  title?: React.ReactNode;
  /** Sub-caption under the title. */
  caption?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * A 16:10 video poster placeholder in the brand frame: dark gradient panel,
 * paper play disc, gradient-masked labels top and a caption bottom. Purely
 * presentational — swap for a real embed when footage exists.
 */
export function VideoPlaceholder({
  label,
  duration,
  title,
  caption,
  style = {},
}: VideoPlaceholderProps) {
  return (
    <div
      style={{
        position: "relative",
        border: "2px solid var(--ink)",
        borderRadius: "var(--r, 14px)",
        overflow: "hidden",
        aspectRatio: "16 / 10",
        background: "linear-gradient(135deg, #1e2a28, #11201e)",
        display: "grid",
        placeItems: "center",
        boxShadow: "var(--shadow-raised, 6px 6px 0 rgba(21,33,31,.14))",
        ...style,
      }}
    >
      {(label || duration) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "11px 14px",
            color: "var(--paper)",
            fontSize: ".82rem",
            fontWeight: 600,
            background: "linear-gradient(rgba(0,0,0,.55), transparent)",
          }}
        >
          <span>{label}</span>
          <span>{duration}</span>
        </div>
      )}

      <span
        aria-hidden="true"
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "rgba(241,234,221,.92)",
          display: "grid",
          placeItems: "center",
          border: "2px solid #fff",
        }}
      >
        <svg viewBox="0 0 24 24" fill="var(--ink)" style={{ width: 26, height: 26, marginLeft: 4 }}>
          <path d="M7 4v16l13-8z" />
        </svg>
      </span>

      {(title || caption) && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 14,
            color: "var(--paper)",
          }}
        >
          {title && (
            <b
              style={{
                fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)",
                fontWeight: 700,
                fontSize: "1.3rem",
                display: "block",
              }}
            >
              {title}
            </b>
          )}
          {caption && <span style={{ fontSize: ".84rem", color: "#c5cdc4" }}>{caption}</span>}
        </div>
      )}
    </div>
  );
}

export default VideoPlaceholder;
