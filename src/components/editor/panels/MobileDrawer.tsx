"use client";

// Bottom-sheet drawer for the palette / inspector on small screens. Slides up
// with react-spring (immediate under reduced motion). Positioned absolutely
// within the editor root. Editor-token styled.

import * as React from "react";
import { animated, useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { IconButton } from "../primitives/IconButton";

export interface MobileDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileDrawer({ open, title, onClose, children }: MobileDrawerProps) {
  const reduced = usePrefersReducedMotion();
  const spring = useSpring({
    transform: open ? "translateY(0%)" : "translateY(101%)",
    immediate: reduced,
    config: { tension: 320, friction: 32 },
  });

  return (
    <>
      {open ? (
        <div
          onClick={onClose}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", zIndex: 18 }}
        />
      ) : null}
      <animated.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "62%",
          display: "flex",
          flexDirection: "column",
          background: "var(--editor-surface)",
          borderTop: "1.5px solid var(--editor-border-soft)",
          borderTopLeftRadius: "var(--r-lg, 18px)",
          borderTopRightRadius: "var(--r-lg, 18px)",
          boxShadow: "var(--editor-shadow-pop)",
          zIndex: 19,
          transform: spring.transform,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px 8px 14px",
            borderBottom: "1.5px solid var(--editor-border-soft)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.74rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--editor-text-muted)",
            }}
          >
            {title}
          </span>
          <IconButton label="Close" glyph="close" onClick={onClose} size={36} />
        </div>
        <div style={{ overflowY: "auto", minHeight: 0 }}>{children}</div>
      </animated.div>
    </>
  );
}

export default MobileDrawer;
