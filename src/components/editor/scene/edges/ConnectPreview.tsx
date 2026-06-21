// A dashed preview line shown while dragging a new connection from a node's
// out-handle. Tracks the cursor's ground point itself (window pointermove +
// ground raycast) so it needs nothing from NodeMesh beyond the store's
// connectSourceId. NodeMesh handles target picking on pointer-up.

import { useEffect, useMemo, useState } from "react";
import { Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkflowStore } from "../../state/useWorkflowStore";

export interface ConnectPreviewProps {
  color: string;
}

export function ConnectPreview({ color }: ConnectPreviewProps) {
  const { camera, gl, raycaster } = useThree();
  const connectSourceId = useWorkflowStore((s) => s.connectSourceId);
  const source = useWorkflowStore((s) => s.nodes.find((n) => n.id === s.connectSourceId) ?? null);
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  useEffect(() => {
    if (!connectSourceId) {
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
  }, [connectSourceId, gl, camera, raycaster, plane]);

  if (!connectSourceId || !source || !cursor) return null;

  const points = [
    new THREE.Vector3(source.x, 0.55, source.y),
    new THREE.Vector3(cursor[0], 0.55, cursor[1]),
  ];
  return <Line points={points} color={color} lineWidth={2} dashed dashSize={0.25} gapSize={0.16} />;
}
