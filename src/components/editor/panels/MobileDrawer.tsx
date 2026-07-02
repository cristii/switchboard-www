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
  const [dragY, setDragY] = React.useState(0);
  const spring = useSpring({
    transform: open ? "translateY(0%)" : "translateY(101%)",
    immediate: reduced,
    config: { tension: 320, friction: 32 },
  });

  React.useEffect(() => {
    if (!open) setDragY(0);
  }, [open]);

  // Swipe-to-dismiss: drag the handle/header down; past the threshold closes.
  const onHandlePointerDown = (e: React.PointerEvent) => {
    const startY = e.clientY;
    const onMove = (ev: PointerEvent) => setDragY(Math.max(0, ev.clientY - startY));
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (ev.clientY - startY > 70) onClose();
      setDragY(0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

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
          transform: spring.transform.to((t) => `${t} translateY(${dragY}px)`),
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          onPointerDown={onHandlePointerDown}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px 8px 14px",
            borderBottom: "1.5px solid var(--editor-border-soft)",
            touchAction: "none",
            cursor: "grab",
            position: "relative",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 4,
              borderRadius: 999,
              background: "var(--editor-border-soft)",
            }}
          />
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
