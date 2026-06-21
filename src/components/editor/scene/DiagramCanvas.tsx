"use client";

// The R3F scene: orthographic isometric canvas, lights, grid, contact shadow,
// node meshes, edges, the connection preview, the label projectors and camera
// controls. Colours come from the theme palette (sceneTheme.ts).
// preserveDrawingBuffer is on so PNG export (P6) can read the canvas.

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
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
  onReady?: () => void;
}

export function DiagramCanvas({ theme, labelsRef, edgeLabelsRef, apiRef, onReady }: DiagramCanvasProps) {
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
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [24, 24, 24], zoom: 38, near: 0.1, far: 200 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      onCreated={({ gl }) => {
        apiRef.current.capturePng = () => gl.domElement.toDataURL("image/png");
        onReady?.();
      }}
    >
      <color attach="background" args={[scene.background]} />

      <ambientLight color={scene.ambient} intensity={scene.ambientIntensity} />
      <directionalLight position={[14, 22, 10]} color={scene.key} intensity={scene.keyIntensity} />
      <directionalLight position={[-12, 10, -8]} color={scene.fill} intensity={scene.fillIntensity} />

      <Grid color={scene.grid} sectionColor={scene.gridStrong} />

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

      <ContactShadows
        position={[0, 0, 0]}
        scale={48}
        far={9}
        blur={2.4}
        opacity={scene.contactShadowOpacity}
        color={scene.contactShadow}
      />

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

      <ConnectPreview color={scene.nodeColors.orange} />

      <LabelProjector nodes={nodes} labelsRef={labelsRef} />
      <EdgeLabelProjector edges={edges} nodes={nodes} registry={edgeLabelsRef} />
      <CameraControls api={apiRef} />
    </Canvas>
  );
}
