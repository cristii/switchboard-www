import React from "react";

/**
 * StickyNote — a slightly rotated, taped paper note set in Caveat.
 * Used for asides like the "Tech stack" list. Playful, hand-made feel.
 */
export function StickyNote({ title, children, rotate = -1.4, style = {} }) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--paper)",
        border: "1.5px solid var(--ink)",
        borderRadius: "10px",
        padding: "18px 20px",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "var(--shadow-card, 4px 4px 0 rgba(21,33,31,.1))",
        ...style,
      }}
    >
      {/* tape */}
      <span
        aria-hidden="true"
        style={{
          content: '""',
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
            marginBottom: "8px",
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
