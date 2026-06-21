"use client";

// The R3F scene: orthographic isometric canvas, lights, grid, contact shadow,
// node meshes, the label projector and camera controls. Colours come from the
// theme palette (sceneTheme.ts). preserveDrawingBuffer is on so PNG export (P6)
// can read the canvas. See description.md §3, §5.

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Grid } from "./Grid";
import { NodeMesh } from "./nodes/NodeMesh";
import { LabelProjector } from "./LabelProjector";
import { CameraControls, type CameraApi } from "./CameraControls";
import type { LabelsRegistry } from "./LabelsLayer";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { getSceneTheme } from "../theme/sceneTheme";
import type { EditorTheme } from "../state/types";

export interface DiagramCanvasProps {
  theme: EditorTheme;
  labelsRef: React.MutableRefObject<LabelsRegistry>;
  onReady?: () => void;
}

export function DiagramCanvas({ theme, labelsRef, onReady }: DiagramCanvasProps) {
  const scene = getSceneTheme(theme);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selection = useWorkflowStore((s) => s.selection);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);
  const cameraApi = useRef<CameraApi>({ reset: () => {}, fit: () => {} });

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
      onCreated={() => onReady?.()}
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
          cameraApi.current.reset();
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

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          theme={scene}
          selected={selection?.type === "node" && selection.id === node.id}
        />
      ))}

      <LabelProjector nodes={nodes} labelsRef={labelsRef} />
      <CameraControls api={cameraApi} />
    </Canvas>
  );
}
