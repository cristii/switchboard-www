// Interactive wrapper around a node's visible shape: selection + drag-on-ground.
// P2 renders every kind as a BoxNode; P3 swaps in catalog-driven shape dispatch.
// Dragging uses window listeners (robust when the pointer leaves the mesh) and
// raycasts onto the y=0 plane, mirroring the prototype's math.

import { useMemo } from "react";
import { type ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BoxNode } from "./shapes/BoxNode";
import { useWorkflowStore } from "../../state/useWorkflowStore";
import { nodeRoleForKind, type SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowNode } from "../../state/types";

export interface NodeMeshProps {
  node: WorkflowNode;
  theme: SceneTheme;
  selected: boolean;
}

function SelectionRing({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={999}>
      <ringGeometry args={[radius, radius + 0.08, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export const NodeMesh = ({ node, theme, selected }: NodeMeshProps) => {
  const { camera, gl, raycaster } = useThree();
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const moveNode = useWorkflowStore((s) => s.moveNode);
  const beginInteraction = useWorkflowStore((s) => s.beginInteraction);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const width = node.width ?? 1.3;
  const depth = node.depth ?? 1.3;
  const height = node.height ?? 0.7;

  const role = nodeRoleForKind(node.kind);
  const color = node.color ?? theme.nodeColors[role];
  const emissive = selected ? theme.selection : color;
  const emissiveIntensity = selected
    ? theme.selectionEmissiveIntensity
    : theme.nodeEmissiveIntensity;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Left-button only; ctrl/middle/right are reserved for camera panning.
    if (e.button !== 0 || e.nativeEvent.ctrlKey) return;
    e.stopPropagation();
    selectNode(node.id);
    beginInteraction();
    gl.domElement.style.cursor = "grabbing";

    const onMove = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const point = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, point)) {
        moveNode(node.id, point.x, point.z);
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      gl.domElement.style.cursor = "default";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <group position={[node.x, 0, node.y]}>
      {/* invisible, slightly enlarged hit volume for comfortable grabbing */}
      <mesh
        position={[0, height / 2, 0]}
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
      >
        <boxGeometry args={[width + 0.25, height + 0.25, depth + 0.25]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <BoxNode
        width={width}
        depth={depth}
        height={height}
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />

      {selected ? (
        <SelectionRing radius={Math.max(width, depth) * 0.62} color={theme.selection} />
      ) : null}
    </group>
  );
};
