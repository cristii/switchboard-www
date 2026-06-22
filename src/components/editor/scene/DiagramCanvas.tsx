"use client";

// The shared R3F scene: orthographic isometric canvas with a soft gradient
// backdrop, hemisphere + key/fill lighting, real (toggleable) soft cast shadows,
// a faded grid, nodes, edges (with optional data-flow pulse), label projectors
// and camera controls. Fully controlled (nodes/edges/selection via props) so the
// editor and the read-only preview reuse it. `interactive` swaps the editable
// NodeMesh / ConnectPreview for the static PreviewNode.

import { Canvas } from "@react-three/fiber";
import { Backdrop } from "./Backdrop";
import { Grid } from "./Grid";
import { NodeMesh } from "./nodes/NodeMesh";
import { PreviewNode } from "./nodes/PreviewNode";
import { OrthogonalEdge } from "./edges/OrthogonalEdge";
import { ConnectPreview } from "./edges/ConnectPreview";
import { EdgeLabelProjector, type EdgeLabelsRegistry } from "./edges/EdgeLabelsLayer";
import { LabelProjector } from "./LabelProjector";
import { CameraControls, type CameraApi } from "./CameraControls";
import type { LabelsRegistry } from "./LabelsLayer";
import { getSceneTheme } from "../theme/sceneTheme";
import type { EditorTheme, Selection, WorkflowEdge, WorkflowNode } from "../state/types";

export interface DiagramCanvasProps {
  theme: EditorTheme;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selection?: Selection;
  /** Editable (NodeMesh + connect) vs static preview (PreviewNode). @default true */
  interactive?: boolean;
  showGrid?: boolean;
  showGround?: boolean;
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

export function DiagramCanvas({
  theme,
  nodes,
  edges,
  selection = null,
  interactive = true,
  showGrid = true,
  showGround = true,
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
  const scene = getSceneTheme(theme);

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
      camera={{ position: [24, 24, 24], zoom: initialZoom ?? 38, near: 0.1, far: 200 }}
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

      {showGround ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[400, 400]} />
          <shadowMaterial transparent opacity={scene.shadowOpacity} />
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

      <LabelProjector nodes={nodes} labelsRef={labelsRef} />
      <EdgeLabelProjector edges={edges} nodes={nodes} registry={edgeLabelsRef} />
      <CameraControls
        api={apiRef}
        nodes={nodes}
        enabled={cameraEnabled}
        initialZoom={initialZoom}
        initialTarget={initialTarget}
        fitOnMount={fitOnMount}
      />
    </Canvas>
  );
}
