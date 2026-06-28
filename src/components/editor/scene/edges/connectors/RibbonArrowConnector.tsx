// Ribbon-arrow connector — the AWS isometric look: a thick, flat orange band laid
// just above the ground following the route, ending in a solid triangular
// arrowhead. Built as a custom flat BufferGeometry (rails + arrowhead) in the XZ
// plane, double-sided + unlit so it reads as a crisp painted arrow. Width scales
// from the theme line width; arrowSize scales the head.

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ConnectorProps } from "./types";

const RIBBON_Y = 0.09; // just above the grid / ground shadow plane

function build(points: THREE.Vector3[], halfW: number, arrowLen: number, arrowHalf: number) {
  // Flatten to 2D (x,z) and drop duplicate consecutive points.
  let p = points.map((v) => new THREE.Vector2(v.x, v.z));
  p = p.filter((pt, i) => i === 0 || pt.distanceTo(p[i - 1]) > 1e-4);
  if (p.length < 2) return null;

  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < p.length; i++) {
    const d = p[i].distanceTo(p[i - 1]);
    seg.push(d);
    total += d;
  }
  const bodyLen = Math.max(0.001, total - arrowLen);

  // Walk the path up to bodyLen → the ribbon body polyline + the arrowhead base.
  const body: THREE.Vector2[] = [p[0]];
  let acc = 0;
  let baseCenter = p[p.length - 1].clone();
  let endDir = new THREE.Vector2(1, 0);
  for (let i = 1; i < p.length; i++) {
    const d = seg[i - 1];
    const dir = p[i].clone().sub(p[i - 1]).normalize();
    endDir = dir;
    if (acc + d >= bodyLen) {
      const t = (bodyLen - acc) / d;
      const cut = p[i - 1].clone().lerp(p[i], t);
      body.push(cut);
      baseCenter = cut.clone();
      break;
    }
    acc += d;
    body.push(p[i]);
  }

  const positions: number[] = [];
  const indices: number[] = [];
  const perpAt = (i: number) => {
    const a = body[Math.max(0, i - 1)];
    const b = body[Math.min(body.length - 1, i + 1)];
    const t = b.clone().sub(a);
    if (t.lengthSq() < 1e-8) t.copy(endDir);
    t.normalize();
    return new THREE.Vector2(-t.y, t.x); // perpendicular in XZ
  };

  for (let i = 0; i < body.length; i++) {
    const n = perpAt(i);
    const c = body[i];
    const l = c.clone().addScaledVector(n, halfW);
    const r = c.clone().addScaledVector(n, -halfW);
    positions.push(l.x, RIBBON_Y, l.y, r.x, RIBBON_Y, r.y);
  }
  for (let i = 0; i < body.length - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, b, c, b, d, c);
  }

  // Arrowhead triangle: tip at the real end, base across the truncation point.
  const tip = p[p.length - 1];
  const n = new THREE.Vector2(-endDir.y, endDir.x);
  const bl = baseCenter.clone().addScaledVector(n, arrowHalf);
  const br = baseCenter.clone().addScaledVector(n, -arrowHalf);
  const base = positions.length / 3;
  positions.push(bl.x, RIBBON_Y, bl.y, br.x, RIBBON_Y, br.y, tip.x, RIBBON_Y, tip.y);
  indices.push(base, base + 1, base + 2);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

export function RibbonArrowConnector({ points, color, width, arrowSize, onSelect }: ConnectorProps) {
  const halfW = Math.max(0.06, width * 0.045);
  const arrowHalf = halfW * 2.4 * arrowSize;
  const arrowLen = halfW * 4 * arrowSize;

  const geometry = useMemo(
    () => build(points, halfW, arrowLen, arrowHalf),
    [points, halfW, arrowLen, arrowHalf],
  );
  useEffect(() => () => geometry?.dispose(), [geometry]);
  if (!geometry) return null;

  return (
    <mesh geometry={geometry} onClick={onSelect} renderOrder={1}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}
