// Flat 2D icon textures for `nodeCard` (n8n-style) nodes — the icon that sits on a
// white slab's top face. Each is a Lucide line icon (MIT) as an inline SVG string,
// rasterised to a THREE.CanvasTexture via an <Image> of a data URI (same pattern as
// Backdrop). Drawn in WHITE on transparent so a node can TINT it through the
// material's `color`. Same-origin data URIs ⇒ the canvas isn't tainted ⇒ the
// IsoSnapshotPreview capturePng still works. The registry is just a string map, so
// adding more icons (incl. Simple Icons brand marks) is a one-line drop-in.

import * as THREE from "three";

/** Lucide 24×24 line-icon path markup (stroke, no fill). */
const ICONS: Record<string, string> = {
  webhook:
    '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 1 1-3.92 4.74"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  gitBranch:
    '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  userPlus:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  shuffle:
    '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  reply: '<polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
};

export type IconTextureKey = keyof typeof ICONS;

const cache = new Map<string, THREE.Texture>();

/** A white-on-transparent icon texture for `key`, or null if unknown / no DOM. */
export function getIconTexture(key: string): THREE.Texture | null {
  if (!(key in ICONS)) return null;
  const hit = cache.get(key);
  if (hit) return hit;
  if (typeof document === "undefined") return null; // SSR guard

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[key]}</svg>`;
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pad = size * 0.18;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
    tex.needsUpdate = true;
  };
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);

  cache.set(key, tex);
  return tex;
}
