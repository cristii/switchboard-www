// Ground grid drawn as one lineSegments buffer. Each line is subdivided so a
// radial alpha falloff (RGBA vertex colours) fades it into the backdrop toward
// the edges — the grid "melts" into the canvas instead of ending in a hard
// square. Section lines read slightly stronger. Colours are theme-driven. 3D only.

import { useEffect, useMemo } from "react";
import * as THREE from "three";

export interface GridProps {
  size?: number;
  divisions?: number;
  /** Minor line colour. */
  color: string;
  /** Major ("section") line colour. */
  sectionColor: string;
  sectionSize?: number;
  /** Global opacity multiplier on top of the radial falloff. */
  opacity?: number;
}

const SEGMENTS = 28; // per line, for a smooth radial fade

export function Grid({
  size = 44,
  divisions = 44,
  color,
  sectionColor,
  sectionSize = 5,
  opacity = 0.6,
}: GridProps) {
  const geometry = useMemo(() => {
    const half = size / 2;
    const step = size / divisions;
    const R = half * 0.96;
    const minor = new THREE.Color(color);
    const major = new THREE.Color(sectionColor);
    const positions: number[] = [];
    const colors: number[] = [];

    const falloff = (x: number, z: number) => {
      const d = Math.hypot(x, z) / R;
      return Math.max(0, 1 - d) ** 1.4;
    };

    const addLine = (axis: "x" | "z", pos: number, isSection: boolean) => {
      const c = isSection ? major : minor;
      const base = (isSection ? 0.85 : 0.5) * opacity;
      const segStep = size / SEGMENTS;
      for (let k = 0; k < SEGMENTS; k++) {
        const t0 = -half + k * segStep;
        const t1 = -half + (k + 1) * segStep;
        const p0 = axis === "x" ? [pos, t0] : [t0, pos];
        const p1 = axis === "x" ? [pos, t1] : [t1, pos];
        positions.push(p0[0], 0, p0[1], p1[0], 0, p1[1]);
        const a0 = falloff(p0[0], p0[1]) * base;
        const a1 = falloff(p1[0], p1[1]) * base;
        colors.push(c.r, c.g, c.b, a0, c.r, c.g, c.b, a1);
      }
    };

    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      const isSection = Math.abs(pos) % sectionSize < 1e-3;
      addLine("x", pos, isSection); // parallel to Z
      addLine("z", pos, isSection); // parallel to X
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    return geom;
  }, [size, divisions, color, sectionColor, sectionSize, opacity]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} position={[0, -0.004, 0]}>
      <lineBasicMaterial vertexColors transparent toneMapped={false} depthWrite={false} />
    </lineSegments>
  );
}
