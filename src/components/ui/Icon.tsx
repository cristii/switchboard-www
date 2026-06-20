import * as React from "react";

/**
 * A bundler-resolved asset reference. Vite (Storybook) resolves `*.svg` imports
 * to a URL string; Next resolves them to a static-import object exposing `.src`.
 * Accepting both keeps `Icon` usable from either app with no per-bundler glue.
 */
export type IconSource = string | { src: string };

export interface IconProps {
  /**
   * An SVG from the bespoke set (`src/assets/icons`), imported through the
   * bundler. It is mask-tinted, so the file's own colours are ignored.
   */
  src: IconSource;
  /** Tint colour — any CSS colour or token. @default "currentColor" */
  color?: string;
  /** Square size: a px number or any CSS length. @default 24 */
  size?: number | string;
  /** Accessible label. Omit for decorative icons (rendered `aria-hidden`). */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Normalise either accepted source form to a URL string. */
function toUrl(src: IconSource): string {
  return typeof src === "string" ? src : src.src;
}

/**
 * A single bespoke line icon, tinted via CSS `mask` so one SVG renders in any
 * brand colour (`currentColor` is not inherited by `<img>`, hence the mask).
 * Defaults to `currentColor`, so an Icon picks up the text colour of its
 * context unless a `color` is given. Import an SVG from `src/assets/icons` and
 * pass it as `src`. No icon font, no third-party library — see AGENTS.md.
 */
export function Icon({
  src,
  color = "currentColor",
  size = 24,
  label,
  className,
  style = {},
}: IconProps) {
  const mask = `url(${toUrl(src)}) center / contain no-repeat`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flex: "none",
        background: color,
        WebkitMask: mask,
        mask,
        ...style,
      }}
    />
  );
}

export default Icon;
