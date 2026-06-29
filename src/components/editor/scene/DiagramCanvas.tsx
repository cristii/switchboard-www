"use client";

// The shared R3F scene: a theme-driven isometric canvas. The active ThemeSpec
// supplies the camera (orthographic OR perspective + FOV/position), a soft gradient
// backdrop, multiple coloured lights + real (toggleable) soft cast shadows, an
// optional faded grid, node materials (incl. transparency), connector width/colour
// and 3D text. Fully controlled (nodes/edges/selection via props) so the editor and
// the read-only preview reuse it. `interactive` swaps the editable NodeMesh /
// ConnectPreview for the static PreviewNode.

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";
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
  initialZoom?: number;
  initialTarget?: [number, number];
  fitOnMount?: boolean;
  onSelectEdge?: (id: string) => void;
  onBackgroundClick?: () => void;
  onReady?: () => void;
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
  initialZoom,
  initialTarget,
  fitOnMount,
  onSelectEdge,
  onBackgroundClick,
  onReady,
}: DiagramCanvasProps) {
  const scene = resolveSceneTheme(spec);
  const isOrtho = spec.camera.kind !== "perspective";
  const cameraSpec: CameraSpec = {
    kind: spec.camera.kind,
    isoDir: spec.camera.isoDir,
    distance: spec.camera.distance,
    fov: spec.camera.fov,
  };
  const initialTargetVal = initialTarget ?? spec.camera.target;
  const showShadows = showGround && spec.shadow.enabled;

  // Stagger parallel edges that share a source so they don't perfectly overlap.
  const laneBySource: Record<string, number> = {};

  return (
    <Canvas
      key={spec.camera.kind}
      orthographic={isOrtho}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      camera={initialCamera(spec.camera, initialZoom)}
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      onCreated={({ gl }) => {
        apiRef.current.capturePng = () => gl.domElement.toDataURL("image/png");
        onReady?.();
      }}
    >
      <Backdrop inner={spec.background.colorHi ?? spec.background.color} outer={spec.background.color} />

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

      {/* invisible ground for empty-space clicks + double-click reset */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={
          onBackgroundClick
            ? (e) => {
                e.stopPropagation();
                onBackgroundClick();
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

      {edges.map((edge) => {
        const lane = laneBySource[edge.source] ?? 0;
        laneBySource[edge.source] = lane + 1;
        return (
          <OrthogonalEdge
            key={edge.id}
            edge={edge}
            nodes={nodes}
            theme={scene}
            selected={selection?.type === "edge" && selection.id === edge.id}
            laneIndex={lane}
            showLabel={showLabels}
            onSelect={interactive ? onSelectEdge : undefined}
          />
        );
      })}

      {nodes.map((node) =>
        interactive ? (
          <NodeMesh
            key={node.id}
            node={node}
            theme={scene}
            selected={selection?.type === "node" && selection.id === node.id}
          />
        ) : (
          <PreviewNode key={node.id} node={node} theme={scene} />
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
      />
    </Canvas>
  );
}
