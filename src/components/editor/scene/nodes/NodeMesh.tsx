// Interactive wrapper around a node's visible shape: catalog-driven shape +
// colour, selection, drag-on-ground, and port handles for creating connections.
// Dragging the body uses window listeners (robust off-mesh). Dragging from the
// out-handle starts a connection; on pointer-up the scene is raycast for a
// target node (tagged via group userData.nodeId). See description.md §7/§8.

import { Suspense, useMemo, useState } from "react";
import { type ThreeEvent, useThree } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { GroupContainer } from "./shapes/GroupContainer";
import { TextNode } from "./shapes/TextNode";
import { ModelNode } from "./shapes/ModelNode";
import { StepIcon } from "./shapes/StepIcon";
import { NodeCardNode } from "./shapes/NodeCardNode";
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
  const openLabelEditor = useWorkflowStore((s) => s.openLabelEditor);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const reduced = usePrefersReducedMotion();
  const {
    entry,
    isGroup,
    isText,
    isIcon,
    isNodeCard,
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

  // Scale-in on mount, a gentle pop when selected, a small lift on hover so the
  // canvas answers the cursor. Disabled under reduced motion.
  const [hovered, setHovered] = useState(false);
  const [portHovered, setPortHovered] = useState(false);
  const liftable = !isGroup && !isText;
  const { scale, lift } = useSpring({
    from: { scale: 0.85, lift: 0 },
    to: { scale: selected ? 1.06 : 1, lift: liftable && hovered ? 0.12 : 0 },
    immediate: reduced,
    config: { tension: 320, friction: 22 },
  });

  // On drop, assign/clear a node's group membership by footprint containment.
  const assignMembership = (id: string) => {
    const st = useWorkflowStore.getState();
    const moved = st.nodes.find((n) => n.id === id);
    if (!moved || moved.kind === "group") return;
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
    if ((moved.parentId ?? null) !== parent) setParent(id, parent);
  };

  const ndcFromEvent = (ev: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
  };

  const groundFromEvent = (ev: PointerEvent): THREE.Vector3 | null => {
    raycaster.setFromCamera(ndcFromEvent(ev), camera);
    const point = new THREE.Vector3();
    return raycaster.ray.intersectPlane(plane, point) ? point : null;
  };

  const handleBodyPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (linkMode) return; // a click links; never drag while linking
    if (e.button !== 0 || e.nativeEvent.ctrlKey) return; // ctrl/middle/right = camera pan
    e.stopPropagation();

    // Shift-click toggles this node in the selection set (no drag).
    if (e.nativeEvent.shiftKey) {
      selectNode(node.id, true);
      return;
    }

    const stBefore = useWorkflowStore.getState();
    const wasInSelection =
      stBefore.selection?.type === "node" && stBefore.selection.ids.includes(node.id);
    if (!wasInSelection) selectNode(node.id);

    // Alt-drag clones the selection and drags the clones (duplicateSelection
    // snapshots history itself; a plain drag snapshots here).
    let anchorId = node.id;
    if (e.nativeEvent.altKey) {
      const map = useWorkflowStore.getState().duplicateSelection();
      if (map) anchorId = map[node.id] ?? anchorId;
    } else {
      beginInteraction();
    }

    // Drag the whole selected set, delta-based from the grab point (the node no
    // longer jumps its centre to the cursor). Children whose parent group is
    // also dragged are skipped — the group cascade already moves them.
    const st = useWorkflowStore.getState();
    const selIds =
      st.selection?.type === "node" && st.selection.ids.includes(anchorId)
        ? st.selection.ids
        : [anchorId];
    const idSet = new Set(selIds);
    const dragIds = selIds.filter((id) => {
      const n = st.nodes.find((m) => m.id === id);
      return !(n?.parentId && idSet.has(n.parentId));
    });
    const starts = new Map(
      dragIds.flatMap((id) => {
        const n = st.nodes.find((m) => m.id === id);
        return n ? [[id, { x: n.x, y: n.y }] as const] : [];
      }),
    );
    const startPoint = groundFromEvent(e.nativeEvent);
    if (!startPoint || starts.size === 0) return;

    gl.domElement.style.cursor = "grabbing";
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const point = groundFromEvent(ev);
      if (!point) return;
      let dx = point.x - startPoint.x;
      let dz = point.z - startPoint.z;
      if (!moved && Math.hypot(dx, dz) > 0.03) moved = true;
      if (!moved) return;

      // Smart guides + grid snap, applied to the anchor node's target position.
      const a = starts.get(anchorId);
      const stNow = useWorkflowStore.getState();
      if (a) {
        let ax = a.x + dx;
        let az = a.y + dz;
        const TH = 0.22;
        let gx: number | null = null;
        let gz: number | null = null;
        for (const n of stNow.nodes) {
          if (idSet.has(n.id) || n.kind === "text") continue;
          if (gx === null && Math.abs(n.x - ax) < TH) gx = n.x;
          if (gz === null && Math.abs(n.y - az) < TH) gz = n.y;
          if (gx !== null && gz !== null) break;
        }
        ax = gx ?? (stNow.snap ? Math.round(ax * 2) / 2 : ax);
        az = gz ?? (stNow.snap ? Math.round(az * 2) / 2 : az);
        stNow.setGuides({ x: gx, z: gz });
        dx = ax - a.x;
        dz = az - a.y;
      }
      for (const [id, s0] of starts) moveNode(id, s0.x + dx, s0.y + dz);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      gl.domElement.style.cursor = "default";
      useWorkflowStore.getState().setGuides({ x: null, z: null });
      if (moved) {
        for (const id of dragIds) assignMembership(id);
      } else if (wasInSelection && selIds.length > 1 && !e.nativeEvent.altKey) {
        // A plain click inside a multi-selection collapses it to that node.
        selectNode(node.id);
      }
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
          // Selection happens on pointerdown; click only completes link mode.
          e.stopPropagation();
          if (linkMode) linkClick(node.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (linkMode || isText) return;
          const ne = e.nativeEvent as MouseEvent;
          openLabelEditor(node.id, ne.clientX, ne.clientY);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          const ne = e.nativeEvent as MouseEvent;
          ne.preventDefault?.();
          const st = useWorkflowStore.getState();
          const inSel = st.selection?.type === "node" && st.selection.ids.includes(node.id);
          if (!inSel) selectNode(node.id);
          openContextMenu("node", node.id, ne.clientX, ne.clientY);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          gl.domElement.style.cursor = linkMode ? "crosshair" : "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          gl.domElement.style.cursor = linkMode ? "crosshair" : "default";
        }}
      >
        <boxGeometry args={[width + 0.25, height + 0.25, depth + 0.25]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <animated.group scale={scale} position-y={lift}>
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
        ) : isNodeCard ? (
          <group position={[0, elevation, 0]}>
            <NodeCardNode width={width} depth={depth} height={height} icon={node.meta?.icon as string | undefined} iconColor={baseColor} />
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
          <mesh
            position={[width / 2 + 0.16, height * 0.5, 0]}
            scale={portHovered ? 1.45 : 1}
            onPointerDown={handleOutPointerDown}
            onPointerOver={(e) => {
              e.stopPropagation();
              setPortHovered(true);
              gl.domElement.style.cursor = "crosshair";
            }}
            onPointerOut={() => {
              setPortHovered(false);
              gl.domElement.style.cursor = hovered ? "pointer" : "default";
            }}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={theme.nodeColors.orange}
              emissive={theme.nodeColors.orange}
              emissiveIntensity={portHovered ? 0.8 : 0.45}
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
