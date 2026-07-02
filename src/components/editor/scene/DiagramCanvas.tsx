"use client";

// The shared R3F scene: a theme-driven isometric canvas. The active ThemeSpec
// supplies the camera (orthographic OR perspective + FOV/position), a soft gradient
// backdrop, multiple coloured lights + real (toggleable) soft cast shadows, an
// optional faded grid, node materials (incl. transparency), connector width/colour
// and 3D text. Fully controlled (nodes/edges/selection via props) so the editor and
// the read-only preview reuse it. `interactive` swaps the editable NodeMesh /
// ConnectPreview for the static PreviewNode.

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Line, SoftShadows } from "@react-three/drei";
import { Backdrop } from "./Backdrop";
import { Grid } from "./Grid";
import { Lights } from "./Lights";
import { NodeMesh } from "./nodes/NodeMesh";
import { PreviewNode } from "./nodes/PreviewNode";
import { OrthogonalEdge } from "./edges/OrthogonalEdge";
import { ConnectPreview } from "./edges/ConnectPreview";
import { LinkPreview } from "./edges/LinkPreview";
import { EdgeLabelProjector, type EdgeLabelsRegistry } from "./edges/EdgeLabelsLayer";
import { LabelProjector } from "./LabelProjector";
import { NodeLabels3D } from "./NodeLabels3D";
import { CameraControls, type CameraApi, type CameraSpec } from "./CameraControls";
import type { LabelsRegistry } from "./LabelsLayer";
import { resolveSceneTheme } from "../theme/sceneTheme";
import type { ThemeSpec } from "../theme/themeSpec";
import type { Selection, WorkflowEdge, WorkflowNode } from "../state/types";

export interface DiagramCanvasProps {
  /** Active resolved theme. */
  spec: ThemeSpec;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selection?: Selection;
  /** Editable (NodeMesh + connect) vs static preview (PreviewNode). @default true */
  interactive?: boolean;
  /** Master grid toggle (ANDed with the theme's grid.show via the host). */
  showGrid?: boolean;
  /** Master shadow toggle. */
  showGround?: boolean;
  /** Master label toggle (3D labels or DOM chips, per theme.text.mode). @default true */
  showLabels?: boolean;
  labelsRef: React.MutableRefObject<LabelsRegistry>;
  edgeLabelsRef: React.MutableRefObject<EdgeLabelsRegistry>;
  apiRef: React.MutableRefObject<CameraApi>;
  /** Allow pan/zoom ("camera movable"). @default true */
  cameraEnabled?: boolean;
  /** Staggered mount motion for preview nodes (live embeds only — snapshots must
   *  stay static so a capture can't catch a node mid-animation). @default false */
  animateNodes?: boolean;
  initialZoom?: number;
  initialTarget?: [number, number];
  fitOnMount?: boolean;
  /** fit() zoom multiplier (<1 margin, >1 tighter). @default 0.98 */
  fitScale?: number;
  /** Transparent canvas (alpha, no backdrop) so the host background shows through. */
  transparent?: boolean;
  onSelectEdge?: (id: string) => void;
  onBackgroundClick?: () => void;
  /** Right-click on an edge / on empty canvas (editor context menus). */
  onEdgeContextMenu?: (id: string, x: number, y: number) => void;
  onCanvasContextMenu?: (x: number, y: number) => void;
  /** Marquee (desktop left-drag on empty ground) selection result. */
  onMarqueeSelect?: (ids: string[], additive: boolean) => void;
  /** Live smart-guide lines while dragging (world x / z). */
  guides?: { x: number | null; z: number | null };
  onReady?: () => void;
}

/** Marquee select: left-drag on empty ground (mouse only) draws a screen rect
 *  (portaled next to the canvas so editor tokens resolve) and selects the nodes
 *  whose projected centres fall inside. Sets `suppressRef` so the ground click
 *  that follows pointer-up doesn't immediately clear the fresh selection. */
function MarqueeController({
  nodes,
  startRef,
  suppressRef,
  onSelect,
}: {
  nodes: WorkflowNode[];
  startRef: React.MutableRefObject<((e: ThreeEvent<PointerEvent>) => void) | null>;
  suppressRef: React.MutableRefObject<boolean>;
  onSelect: (ids: string[], additive: boolean) => void;
}) {
  const { gl, camera } = useThree();
  const [rect, setRect] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    startRef.current = (e) => {
      const ne = e.nativeEvent;
      if (ne.pointerType !== "mouse" || ne.button !== 0 || ne.ctrlKey) return;
      const x0 = ne.clientX;
      const y0 = ne.clientY;
      let live: { x0: number; y0: number; x1: number; y1: number } | null = null;
      const onMove = (ev: PointerEvent) => {
        live = { x0, y0, x1: ev.clientX, y1: ev.clientY };
        setRect(live);
      };
      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        setRect(null);
        if (!live || (Math.abs(live.x1 - live.x0) < 6 && Math.abs(live.y1 - live.y0) < 6)) return;
        suppressRef.current = true;
        const b = gl.domElement.getBoundingClientRect();
        const minX = Math.min(live.x0, live.x1);
        const maxX = Math.max(live.x0, live.x1);
        const minY = Math.min(live.y0, live.y1);
        const maxY = Math.max(live.y0, live.y1);
        const ids: string[] = [];
        const v = new THREE.Vector3();
        for (const n of nodesRef.current) {
          if (n.kind === "group") continue;
          v.set(n.x, 0.4, n.y).project(camera);
          const sx = b.left + ((v.x + 1) / 2) * b.width;
          const sy = b.top + ((1 - v.y) / 2) * b.height;
          if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY) ids.push(n.id);
        }
        onSelectRef.current(ids, ev.shiftKey);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
    return () => {
      startRef.current = null;
    };
  }, [gl, camera, startRef, suppressRef]);

  const host = gl.domElement.parentElement;
  if (!rect || !host) return null;
  const b = gl.domElement.getBoundingClientRect();
  return createPortal(
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: Math.min(rect.x0, rect.x1) - b.left,
        top: Math.min(rect.y0, rect.y1) - b.top,
        width: Math.abs(rect.x1 - rect.x0),
        height: Math.abs(rect.y1 - rect.y0),
        border: "1.5px dashed var(--editor-accent)",
        background: "var(--editor-surface-2)",
        opacity: 0.35,
        borderRadius: 4,
        pointerEvents: "none",
        zIndex: 5,
      }}
    />,
    host,
  );
}

/** Initial three.js camera props derived from the theme camera spec. */
function initialCamera(cam: ThemeSpec["camera"], initialZoom?: number) {
  const [dx, dy, dz] = cam.isoDir ?? [1, 1, 1];
  const dir = new THREE.Vector3(dx, dy, dz);
  if (dir.lengthSq() === 0) dir.set(1, 1, 1);
  dir.normalize();
  if (cam.kind === "perspective") {
    const distance = cam.distance ?? 52;
    const pos = dir.multiplyScalar(distance);
    return { position: [pos.x, pos.y, pos.z] as [number, number, number], fov: cam.fov ?? 35, near: 0.1, far: 400 };
  }
  const pos = dir.multiplyScalar(40);
  return {
    position: [pos.x, pos.y, pos.z] as [number, number, number],
    zoom: initialZoom ?? cam.zoom ?? 38,
    near: 0.1,
    far: 200,
  };
}

export function DiagramCanvas({
  spec,
  nodes,
  edges,
  selection = null,
  interactive = true,
  showGrid = true,
  showGround = true,
  showLabels = true,
  labelsRef,
  edgeLabelsRef,
  apiRef,
  cameraEnabled = true,
  animateNodes = false,
  initialZoom,
  initialTarget,
  fitOnMount,
  fitScale,
  transparent = false,
  onSelectEdge,
  onBackgroundClick,
  onEdgeContextMenu,
  onCanvasContextMenu,
  onMarqueeSelect,
  guides,
  onReady,
}: DiagramCanvasProps) {
  const scene = resolveSceneTheme(spec);
  // Marquee plumbing: ground pointer-down starts it; the finished drag flags the
  // following ground click so it doesn't clear the fresh selection.
  const marqueeStartRef = useRef<((e: ThreeEvent<PointerEvent>) => void) | null>(null);
  const suppressGroundClickRef = useRef(false);
  const isOrtho = spec.camera.kind !== "perspective";
  const cameraSpec: CameraSpec = {
    kind: spec.camera.kind,
    isoDir: spec.camera.isoDir,
    distance: spec.camera.distance,
    fov: spec.camera.fov,
  };
  const initialTargetVal = initialTarget ?? spec.camera.target;
  const showShadows = showGround && spec.shadow.enabled;

  // Lane bookkeeping: edges sharing a source (fan-out) or target (fan-in) get
  // symmetric lane indices so routing can spread them along the node side.
  const outCount: Record<string, number> = {};
  const inCount: Record<string, number> = {};
  for (const e of edges) {
    outCount[e.source] = (outCount[e.source] ?? 0) + 1;
    inCount[e.target] = (inCount[e.target] ?? 0) + 1;
  }
  const outSeen: Record<string, number> = {};
  const inSeen: Record<string, number> = {};

  return (
    <Canvas
      key={spec.camera.kind}
      orthographic={isOrtho}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: transparent,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      camera={initialCamera(spec.camera, initialZoom)}
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      onCreated={(state) => {
        // Capture at ≥2x for a crisp export: temporarily bump the pixel ratio,
        // force a synchronous render, read the buffer, then restore.
        apiRef.current.capturePng = () => {
          const { gl, scene: threeScene, camera } = state;
          const prev = gl.getPixelRatio();
          const want = Math.max(prev, 2);
          try {
            if (want !== prev) {
              gl.setPixelRatio(want);
              gl.render(threeScene, camera);
            }
            return gl.domElement.toDataURL("image/png");
          } finally {
            if (want !== prev) {
              gl.setPixelRatio(prev);
              gl.render(threeScene, camera);
            }
          }
        };
        onReady?.();
      }}
    >
      {transparent ? null : (
        <Backdrop inner={spec.background.colorHi ?? spec.background.color} outer={spec.background.color} />
      )}

      {/* PCSS soft shadows (distance-soft, diffused) — opt-in per theme. NB: SoftShadows
          patches three's shadow shader chunk globally, so it's a one-time scene cost. */}
      {showShadows && spec.shadow.soft ? <SoftShadows size={48} focus={0.35} samples={16} /> : null}

      <Lights lights={spec.lights} shadow={spec.shadow} castShadow={showShadows} />

      {showGrid && spec.grid.show ? (
        <Grid color={scene.grid} sectionColor={scene.gridStrong} opacity={scene.gridOpacity} />
      ) : null}

      {showShadows ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[400, 400]} />
          <shadowMaterial transparent opacity={spec.shadow.opacity} />
        </mesh>
      ) : null}

      {/* invisible ground for empty-space clicks, marquee + double-click reset */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerDown={(e) => {
          const ne = e.nativeEvent;
          // One-finger touch pans (editor + live embeds); a bare mouse-drag pans
          // read-only previews ("drag to pan") and marquee-selects in the editor.
          if (cameraEnabled && ne.isPrimary && (ne.pointerType === "touch" || !interactive)) {
            if (ne.button === 0 && !ne.ctrlKey) apiRef.current.beginPan(ne);
            return;
          }
          if (interactive && onMarqueeSelect) marqueeStartRef.current?.(e);
        }}
        onClick={
          onBackgroundClick
            ? (e) => {
                e.stopPropagation();
                if (suppressGroundClickRef.current) {
                  suppressGroundClickRef.current = false;
                  return;
                }
                onBackgroundClick();
              }
            : undefined
        }
        onContextMenu={
          onCanvasContextMenu
            ? (e) => {
                e.stopPropagation();
                const ne = e.nativeEvent as MouseEvent;
                ne.preventDefault?.();
                onCanvasContextMenu(ne.clientX, ne.clientY);
              }
            : undefined
        }
        onDoubleClick={
          cameraEnabled
            ? (e) => {
                e.stopPropagation();
                apiRef.current.reset();
              }
            : undefined
        }
      >
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {interactive && onMarqueeSelect ? (
        <MarqueeController
          nodes={nodes}
          startRef={marqueeStartRef}
          suppressRef={suppressGroundClickRef}
          onSelect={onMarqueeSelect}
        />
      ) : null}

      {/* smart alignment guides while dragging */}
      {guides?.x != null ? (
        <Line
          points={[
            [guides.x, 0.03, -60],
            [guides.x, 0.03, 60],
          ]}
          color={scene.selection}
          lineWidth={1.5}
          dashed
          dashSize={0.5}
          gapSize={0.3}
        />
      ) : null}
      {guides?.z != null ? (
        <Line
          points={[
            [-60, 0.03, guides.z],
            [60, 0.03, guides.z],
          ]}
          color={scene.selection}
          lineWidth={1.5}
          dashed
          dashSize={0.5}
          gapSize={0.3}
        />
      ) : null}

      {edges.map((edge) => {
        const lane = outSeen[edge.source] ?? 0;
        outSeen[edge.source] = lane + 1;
        const laneIn = inSeen[edge.target] ?? 0;
        inSeen[edge.target] = laneIn + 1;
        return (
          <OrthogonalEdge
            key={edge.id}
            edge={edge}
            nodes={nodes}
            theme={scene}
            selected={selection?.type === "edge" && selection.id === edge.id}
            laneIndex={lane}
            laneCount={outCount[edge.source] ?? 1}
            laneInIndex={laneIn}
            laneInCount={inCount[edge.target] ?? 1}
            showLabel={showLabels}
            onSelect={interactive ? onSelectEdge : undefined}
            onContextMenu={interactive ? onEdgeContextMenu : undefined}
          />
        );
      })}

      {nodes.map((node, i) =>
        interactive ? (
          <NodeMesh
            key={node.id}
            node={node}
            theme={scene}
            selected={selection?.type === "node" && selection.ids.includes(node.id)}
          />
        ) : (
          <PreviewNode key={node.id} node={node} theme={scene} animate={animateNodes} index={i} />
        ),
      )}

      {interactive ? <ConnectPreview color={scene.flow} /> : null}
      {interactive ? <LinkPreview color={scene.selection} /> : null}

      {showLabels && scene.labelMode === "dom" ? (
        <>
          <LabelProjector nodes={nodes} labelsRef={labelsRef} />
          <EdgeLabelProjector edges={edges} nodes={nodes} registry={edgeLabelsRef} />
        </>
      ) : null}
      {showLabels && scene.labelMode === "3d" ? (
        <NodeLabels3D nodes={nodes} selection={selection} theme={scene} />
      ) : null}
      <CameraControls
        api={apiRef}
        nodes={nodes}
        camera={cameraSpec}
        enabled={cameraEnabled}
        initialZoom={initialZoom ?? spec.camera.zoom}
        initialTarget={initialTargetVal}
        fitOnMount={fitOnMount}
        fitScale={fitScale}
        animate={interactive}
      />
    </Canvas>
  );
}
