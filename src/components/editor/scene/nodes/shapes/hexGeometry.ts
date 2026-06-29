// Rounded-hexagon extruded geometry for the double-layer hex platform (the
// architecture-reference "stage" platforms). A flat-top hexagon Shape with
// quadratic-rounded corners, extruded with a small bevel for soft edges, laid
// flat in the XZ plane (extrudes up +Y, base ~y=0).

import * as THREE from "three";

export function roundedHexGeometry(radius: number, corner: number, depth: number): THREE.ExtrudeGeometry {
  const pts: THREE.Vector2[] = [];
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 6 + k * (Math.PI / 3);
    pts.push(new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius));
  }
  const shape = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const curr = pts[i];
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const v1 = prev.clone().sub(curr).normalize();
    const v2 = next.clone().sub(curr).normalize();
    const p1 = curr.clone().addScaledVector(v1, corner);
    const p2 = curr.clone().addScaledVector(v2, corner);
    if (i === 0) shape.moveTo(p1.x, p1.y);
    else shape.lineTo(p1.x, p1.y);
    shape.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
  }
  shape.closePath();

  const bevel = Math.min(depth * 0.3, corner * 0.5);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    steps: 1,
  });
  geo.rotateX(-Math.PI / 2); // lay flat: extrude becomes +Y
  geo.translate(0, bevel, 0); // rest the base near y=0
  return geo;
}
