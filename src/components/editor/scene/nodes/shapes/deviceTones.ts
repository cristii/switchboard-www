// Small colour + material helpers shared by the procedural device shapes
// (monitor / laptop / phone / browser / server-stack). Keeps them theme-aware:
// screens/accents are derived from the node's body colour instead of hardcoded,
// so devices read correctly in any theme.

import * as THREE from "three";
import type { ShapeProps } from "./types";

/** Lerp a hex colour toward white by `amt` (0–1). */
export function lighten(hex: string, amt: number): string {
  return "#" + new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), amt).getHexString();
}

/** Lerp a hex colour toward black by `amt` (0–1). */
export function darken(hex: string, amt: number): string {
  return "#" + new THREE.Color(hex).lerp(new THREE.Color("#000000"), amt).getHexString();
}

/** The themed material props every device body forwards to NodeStandardMaterial. */
export function bodyProps(p: ShapeProps) {
  return {
    color: p.color,
    emissive: p.emissive,
    emissiveIntensity: p.emissiveIntensity,
    opacity: p.opacity,
    roughness: p.roughness,
    metalness: p.metalness,
  };
}
