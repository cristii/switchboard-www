"use client";

// The R3F scene: orthographic isometric canvas with a soft gradient backdrop,
// hemisphere + key/fill lighting, real (toggleable) soft cast shadows, a faded
// grid, node meshes, edges (with optional data-flow pulse), the connection
// preview, label projectors and camera controls. Colours come from the theme
// palette (sceneTheme.ts). preserveDrawingBuffer keeps PNG export working.

import { Canvas } from "@react-three/fiber";
import { Backdrop } from "./Backdrop";
import { Grid } from "./Grid";
import { NodeMesh } from "./nodes/NodeMesh";
import { OrthogonalEdge } from "./edges/OrthogonalEdge";
import { ConnectPreview } from "./edges/ConnectPreview";
import { EdgeLabelProjector, type EdgeLabelsRegistry } from "./edges/EdgeLabelsLayer";
import { LabelProjector } from "./LabelProjector";
import { CameraControls, type CameraApi } from "./CameraControls";
import type { LabelsRegistry } from "./LabelsLayer";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { getSceneTheme } from "../theme/sceneTheme";
import type { EditorTheme } from "../state/types";

export interface DiagramCanvasProps {
  theme: EditorTheme;
  labelsRef: React.MutableRefObject<LabelsRegistry>;
  edgeLabelsRef: React.MutableRefObject<EdgeLabelsRegistry>;
  /** Imperative camera/scene api, populated by CameraControls + onCreated. */
  apiRef: React.MutableRefObject<CameraApi>;
  /** Show the ground grid. @default true */
  showGrid?: boolean;
  /** Cast soft node shadows onto a ground plane. @default true */
  showGround?: boolean;
  onReady?: () => void;
}

export function DiagramCanvas({
  theme,
  labelsRef,
  edgeLabelsRef,
  apiRef,
  showGrid = true,
  showGround = true,
  onReady,
}: DiagramCanvasProps) {
  const scene = getSceneTheme(theme);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selection = useWorkflowStore((s) => s.selection);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);

  // Stagger parallel edges that share a source so they don't perfectly overlap.
  const laneBySource: Record<string, number> = {};

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [24, 24, 24], zoom: 38, near: 0.1, far: 200 }}
      style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
      onCreated={({ gl }) => {
        apiRef.current.capturePng = () => gl.domElement.toDataURL("image/png");
        onReady?.();
      }}
    >
      <Backdrop inner={scene.backgroundHi} outer={scene.background} />

      <hemisphereLight args={[scene.hemiSky, scene.hemiGround, scene.hemiIntensity]} />
      <ambientLight color={scene.ambient} intensity={scene.ambientIntensity} />
      <directionalLight
        position={[16, 24, 12]}
        color={scene.key}
        intensity={scene.keyIntensity}
        castShadow={showGround}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={6}
      />
      <directionalLight position={[-14, 10, -10]} color={scene.fill} intensity={scene.fillIntensity} />

      {showGrid ? <Grid color={scene.grid} sectionColor={scene.gridStrong} /> : null}

      {/* soft cast-shadow ground (toggleable) */}
      {showGround ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[400, 400]} />
          <shadowMaterial transparent opacity={scene.shadowOpacity} />
        </mesh>
      ) : null}

      {/* invisible ground for empty-space clicks (clear) and double-click (reset) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={(e) => {
          e.stopPropagation();
          clearSelection();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          apiRef.current.reset();
        }}
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
          />
        );
      })}

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          theme={scene}
          selected={selection?.type === "node" && selection.id === node.id}
        />
      ))}

      <ConnectPreview color={scene.flow} />

      <LabelProjector nodes={nodes} labelsRef={labelsRef} />
      <EdgeLabelProjector edges={edges} nodes={nodes} registry={edgeLabelsRef} />
      <CameraControls api={apiRef} />
    </Canvas>
  );
}
