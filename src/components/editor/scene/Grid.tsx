// Ground grid drawn as a single lineSegments buffer with per-vertex colours so
// every Nth line (a "section") reads stronger. Ported from the prototype's
// SimpleGrid; colours are theme-driven (see sceneTheme.ts). 3D only.

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
  opacity?: number;
}

export function Grid({
  size = 40,
  divisions = 40,
  color,
  sectionColor,
  sectionSize = 5,
  opacity = 0.55,
}: GridProps) {
  const geometry = useMemo(() => {
    const half = size / 2;
    const step = size / divisions;
    const vertices: number[] = [];
    const colors: number[] = [];
    const minor = new THREE.Color(color);
    const major = new THREE.Color(sectionColor);
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      const isSection = Math.abs(pos) % sectionSize < 1e-3;
      const c = isSection ? major : minor;
      // line parallel to Z
      vertices.push(pos, 0, -half, pos, 0, half);
      colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
      // line parallel to X
      vertices.push(-half, 0, pos, half, 0, pos);
      colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, [size, divisions, color, sectionColor, sectionSize]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} position={[0, -0.005, 0]}>
      <lineBasicMaterial vertexColors transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  );
}
