// Interactive wrapper around a node's visible shape: catalog-driven shape +
// colour, selection, drag-on-ground, and port handles for creating connections.
// Dragging the body uses window listeners (robust off-mesh). Dragging from the
// out-handle starts a connection; on pointer-up the scene is raycast for a
// target node (tagged via group userData.nodeId). See description.md §7/§8.

import { Suspense, useMemo } from "react";
import { type ThreeEvent, useThree } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { GroupContainer } from "./shapes/GroupContainer";
import { TextNode } from "./shapes/TextNode";
import { ModelNode } from "./shapes/ModelNode";
import { StepIcon } from "./shapes/StepIcon";
import { resolveNodeVisual } from "./nodeVisual";
import { getNodeCatalogEntry } from "../../catalog/nodeCatalog";
import { useWorkflowStore } from "../../state/useWorkflowStore";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowNode } from "../../state/types";

export interface NodeMeshProps {
  node: WorkflowNode;
  theme: SceneTheme;
  selected: boolean;
}

/** Walk up the object graph to find the nodeId tagged on a node's group. */
function findNodeId(object: THREE.Object3D | null): string | null {
  let o: THREE.Object3D | null = object;
  while (o) {
    const id = (o.userData as { nodeId?: unknown }).nodeId;
    if (typeof id === "string") return id;
    o = o.parent;
  }
  return null;
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
  const { camera, gl, raycaster, scene } = useThree();
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const moveNode = useWorkflowStore((s) => s.moveNode);
  const beginInteraction = useWorkflowStore((s) => s.beginInteraction);
  const addEdge = useWorkflowStore((s) => s.addEdge);
  const startConnect = useWorkflowStore((s) => s.startConnect);
  const endConnect = useWorkflowStore((s) => s.endConnect);
  const setParent = useWorkflowStore((s) => s.setParent);
  const linkMode = useWorkflowStore((s) => s.linkMode);
  const linkSourceId = useWorkflowStore((s) => s.linkSourceId);
  const linkClick = useWorkflowStore((s) => s.linkClick);
  const openContextMenu = useWorkflowStore((s) => s.openContextMenu);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const reduced = usePrefersReducedMotion();
  const {
    entry,
    isGroup,
    isText,
    isIcon,
    Shape,
    width,
    depth,
    height,
    color: baseColor,
    emissive,
    emissiveIntensity,
    opacity,
    roughness,
    metalness,
    elevation,
  } = resolveNodeVisual(node, theme, selected);
  const hasOut = entry.defaultPorts.some((p) => p.side === "out");
  const hasIn = entry.defaultPorts.some((p) => p.side === "in");
  const modelUrl = typeof node.meta?.model === "string" ? (node.meta.model as string) : null;
  const shapeEl = (
    <Shape
      width={width}
      depth={depth}
      height={height}
      color={baseColor}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      opacity={opacity}
      roughness={roughness}
      metalness={metalness}
    />
  );

  // Scale-in on mount, a gentle pop when selected. Disabled under reduced motion.
  const { scale } = useSpring({
    from: { scale: 0.85 },
    to: { scale: selected ? 1.06 : 1 },
    immediate: reduced,
    config: { tension: 320, friction: 22 },
  });

  // On drop, assign/clear this node's group membership by footprint containment.
  const assignMembership = () => {
    const st = useWorkflowStore.getState();
    const moved = st.nodes.find((n) => n.id === node.id);
    if (!moved) return;
    let parent: string | null = null;
    for (const g of st.nodes) {
      if (g.kind !== "group") continue;
      const ge = getNodeCatalogEntry("group");
      const hw = (g.width ?? ge.defaultSize.width) / 2;
      const hd = (g.depth ?? ge.defaultSize.depth) / 2;
      if (moved.x >= g.x - hw && moved.x <= g.x + hw && moved.y >= g.y - hd && moved.y <= g.y + hd) {
        parent = g.id;
        break;
      }
    }
    if ((moved.parentId ?? null) !== parent) setParent(node.id, parent);
  };

  const ndcFromEvent = (ev: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
  };

  const handleBodyPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (linkMode) return; // a click links; never drag while linking
    if (e.button !== 0 || e.nativeEvent.ctrlKey) return; // ctrl/middle/right = camera pan
    e.stopPropagation();
    selectNode(node.id);
    beginInteraction();
    gl.domElement.style.cursor = "grabbing";

    const onMove = (ev: PointerEvent) => {
      raycaster.setFromCamera(ndcFromEvent(ev), camera);
      const point = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, point)) moveNode(node.id, point.x, point.z);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      gl.domElement.style.cursor = "default";
      if (!isGroup) assignMembership();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleOutPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    startConnect(node.id);
    const onUp = (ev: PointerEvent) => {
      raycaster.setFromCamera(ndcFromEvent(ev), camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      let targetId: string | null = null;
      for (const hit of hits) {
        const id = findNodeId(hit.object);
        if (id) {
          targetId = id;
          break;
        }
      }
      if (targetId && targetId !== node.id) addEdge(node.id, targetId);
      endConnect();
    };
    window.addEventListener("pointerup", onUp, { once: true });
  };

  return (
    <group position={[node.x, 0, node.y]} userData={{ nodeId: node.id }}>
      {/* invisible, slightly enlarged hit volume for comfortable grabbing */}
      <mesh
        position={[0, height / 2, 0]}
        onPointerDown={handleBodyPointerDown}
        onClick={(e) => {
          e.stopPropagation();
          if (linkMode) {
            linkClick(node.id);
            return;
          }
          selectNode(node.id);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          const ne = e.nativeEvent as MouseEvent;
          ne.preventDefault?.();
          selectNode(node.id);
          openContextMenu(node.id, ne.clientX, ne.clientY);
        }}
      >
        <boxGeometry args={[width + 0.25, height + 0.25, depth + 0.25]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <animated.group scale={scale}>
        {isGroup ? (
          <GroupContainer node={node} theme={theme} selected={selected} />
        ) : isText ? (
          <TextNode node={node} theme={theme} selected={selected} />
        ) : isIcon ? (
          <group position={[0, elevation, 0]}>
            <StepIcon
              icon={(node.meta?.icon as string) ?? "spark"}
              width={width}
              depth={depth}
              height={height}
              color={baseColor}
              opacity={opacity}
              roughness={roughness}
              metalness={metalness}
            />
          </group>
        ) : modelUrl ? (
          <Suspense fallback={shapeEl}>
            <ModelNode url={modelUrl} width={width} depth={depth} height={height} color={baseColor} opacity={opacity} />
          </Suspense>
        ) : (
          shapeEl
        )}

        {hasIn ? (
          <mesh position={[-(width / 2 + 0.16), height * 0.5, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={theme.edge} roughness={0.6} />
          </mesh>
        ) : null}
        {hasOut ? (
          <mesh position={[width / 2 + 0.16, height * 0.5, 0]} onPointerDown={handleOutPointerDown}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={theme.nodeColors.orange}
              emissive={theme.nodeColors.orange}
              emissiveIntensity={0.45}
              roughness={0.5}
            />
          </mesh>
        ) : null}

        {selected && !isGroup && !isText ? (
          <SelectionRing radius={Math.max(width, depth) * 0.62} color={theme.selection} />
        ) : null}
        {linkMode && linkSourceId === node.id && !isText ? (
          <SelectionRing radius={Math.max(width, depth) * 0.7} color={theme.flow} />
        ) : null}
      </animated.group>
    </group>
  );
};
