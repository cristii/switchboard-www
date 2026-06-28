// Textured model node — loads a GLB/GLTF via drei useGLTF and drops it in place of
// the procedural shape. The caller wraps this in <Suspense> with a procedural
// fallback (so a missing/loading model just shows the catalog shape). The model is
// cloned (so multiple nodes are independent), centred + scaled to the node's
// footprint with its base on the ground, materials are cloned (no cache mutation),
// a material named "Body" is tinted to the node colour, and opacity is applied.
// Future device models (phone / laptop / browser) are just more GLBs referenced by
// `node.meta.model`. See docs/nodes/BLENDER_MODELING.md.

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export interface ModelNodeProps {
  url: string;
  width: number;
  depth: number;
  height: number;
  color: string;
  opacity?: number;
}

export function ModelNode({ url, width, depth, height, color, opacity = 1 }: ModelNodeProps) {
  const gltf = useGLTF(url);

  const object = useMemo(() => {
    const root = gltf.scene.clone(true);
    const tint = new THREE.Color(color);
    const tintAndClone = (m: THREE.Material): THREE.Material => {
      const mat = m.clone() as THREE.MeshStandardMaterial;
      if (/body/i.test(mat.name) && "color" in mat) mat.color = tint;
      if (opacity < 1) {
        mat.transparent = true;
        mat.opacity = opacity;
      }
      return mat;
    };
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mat = mesh.material;
      mesh.material = Array.isArray(mat) ? mat.map(tintAndClone) : mat ? tintAndClone(mat) : mat;
    });
    return root;
  }, [gltf.scene, color, opacity]);

  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = Math.min(width / (size.x || 1), height / (size.y || 1), depth / (size.z || 1));
    return {
      scale: s,
      position: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    };
  }, [object, width, depth, height]);

  return <primitive object={object} scale={scale} position={position} />;
}
