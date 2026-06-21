// Runs inside the Canvas. Each frame it projects every node's world position to
// screen pixels and writes the result directly onto the matching DOM label via a
// shared registry ref — no React state, so labels track the camera with zero
// re-renders. The DOM overlay itself is LabelsLayer (outside the Canvas).
// Registry is passed by ref (props), not context: React context does not cross
// the R3F Canvas boundary.

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { WorkflowNode } from "../state/types";
import type { LabelsRegistry } from "./LabelsLayer";

export interface LabelProjectorProps {
  nodes: WorkflowNode[];
  labelsRef: React.MutableRefObject<LabelsRegistry>;
}

export function LabelProjector({ nodes, labelsRef }: LabelProjectorProps) {
  const { camera, gl } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const rect = gl.domElement.getBoundingClientRect();
    for (const node of nodes) {
      const el = labelsRef.current.get(node.id);
      if (!el) continue;
      const height = node.height ?? 0.7;
      vec.set(node.x, height + 0.55, node.y);
      vec.project(camera);
      const x = (vec.x * 0.5 + 0.5) * rect.width;
      const y = (-vec.y * 0.5 + 0.5) * rect.height;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
  });

  return null;
}
