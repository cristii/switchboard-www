// A dashed preview line shown while linking two nodes (click-to-link). Tracks the
// cursor's ground point and draws from the chosen source node to the cursor, so
// the user sees the pending connection before clicking the target. Reads the
// store's linkSourceId; nothing else is required. See useWorkflowStore link slice.

import { useEffect, useMemo, useState } from "react";
import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkflowStore } from "../../state/useWorkflowStore";

export interface LinkPreviewProps {
  color: string;
}

export function LinkPreview({ color }: LinkPreviewProps) {
  const { camera, gl, raycaster } = useThree();
  const linkSourceId = useWorkflowStore((s) => s.linkSourceId);
  const source = useWorkflowStore((s) => s.nodes.find((n) => n.id === s.linkSourceId) ?? null);
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  useEffect(() => {
    if (!linkSourceId) {
      setCursor(null);
      return;
    }
    const onMove = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const p = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, p)) setCursor([p.x, p.z]);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [linkSourceId, gl, camera, raycaster, plane]);

  if (!linkSourceId || !source || !cursor) return null;

  const points = [
    new THREE.Vector3(source.x, 0.55, source.y),
    new THREE.Vector3(cursor[0], 0.55, cursor[1]),
  ];
  return <Line points={points} color={color} lineWidth={2.4} dashed dashSize={0.3} gapSize={0.18} />;
}
