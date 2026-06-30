import * as React from "react";

export interface StickyNoteProps {
  /** Heading shown in the Caveat hand. */
  title?: string;
  children: React.ReactNode;
  /** Rotation in degrees. @default -1.4 */
  rotate?: number;
  style?: React.CSSProperties;
}

/**
 * A slightly rotated, taped paper note set in the Caveat hand. Use sparingly
 * for asides, tech-stack lists, marginalia. One per view, max.
 */
export function StickyNote({
  title,
  children,
  rotate = -1.4,
  style = {},
}: StickyNoteProps) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--paper)",
        border: "1.5px solid var(--ink)",
        borderRadius: "10px",
        padding: "18px 20px",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-card, 4px 4px 0 rgba(var(--shadow-ink),.1))",
        ...style,
      }}
    >
      {/* tape */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-9px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "50px",
          height: "16px",
          background: "rgba(180,83,9,.5)",
          border: "1px solid var(--orange-deep)",
          borderRadius: "3px",
        }}
      />
      {title ? (
        <h4
          style={{
            fontFamily: "var(--font-hand, 'Caveat', cursive)",
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: "0 0 8px",
          }}
        >
          {title}
        </h4>
      ) : null}
      <div
        style={{
          fontFamily: "var(--font-hand, 'Caveat', cursive)",
          fontSize: "1.18rem",
          lineHeight: 1.55,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default StickyNote;
