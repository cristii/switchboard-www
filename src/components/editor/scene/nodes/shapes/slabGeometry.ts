// Rounded-rectangle prism for the "slab" platform. A 2D rounded rectangle extruded
// straight up with NO bevel, so only the VERTICAL corner edges are smooth (rounded)
// while the horizontal top/bottom perimeter edges stay SHARP — the layered-cuboid
// look from the capabilities reference. Footprint lies in XZ with the base at y=0.

import * as THREE from "three";

export function roundedRectPrismGeometry(
  width: number,
  depth: number,
  height: number,
  radius: number,
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.max(0.001, Math.min(radius, hw - 0.001, hd - 0.001));

  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 12,
  });
  geo.rotateX(-Math.PI / 2); // extrude +Z → +Y; footprint in XZ, base at y=0
  geo.computeVertexNormals();
  return geo;
}
