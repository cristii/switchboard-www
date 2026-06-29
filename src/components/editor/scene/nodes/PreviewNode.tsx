// Read-only node for the preview: same look as NodeMesh (shared resolver) but no
// interaction, no port handles, no store coupling — so multiple previews are fully
// independent. Renders statically (NO scale-in) so a snapshot of the preview can
// never catch a node mid-animation. Highlight/dim props arrive with preview phase 2.

import { Suspense } from "react";
import { GroupContainer } from "./shapes/GroupContainer";
import { TextNode } from "./shapes/TextNode";
import { ModelNode } from "./shapes/ModelNode";
import { StepIcon } from "./shapes/StepIcon";
import { NodeCardNode } from "./shapes/NodeCardNode";
import { resolveNodeVisual } from "./nodeVisual";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowNode } from "../../state/types";

export interface PreviewNodeProps {
  node: WorkflowNode;
  theme: SceneTheme;
}

export function PreviewNode({ node, theme }: PreviewNodeProps) {
  const { isGroup, isText, isIcon, isNodeCard, Shape, width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness, elevation } =
    resolveNodeVisual(node, theme, false);
  const modelUrl = typeof node.meta?.model === "string" ? (node.meta.model as string) : null;

  const shapeEl = (
    <Shape
      width={width}
      depth={depth}
      height={height}
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      opacity={opacity}
      roughness={roughness}
      metalness={metalness}
    />
  );

  return (
    <group position={[node.x, 0, node.y]}>
      {isGroup ? (
        <GroupContainer node={node} theme={theme} selected={false} />
      ) : isText ? (
        <TextNode node={node} theme={theme} selected={false} />
      ) : isIcon ? (
        <group position={[0, elevation, 0]}>
          <StepIcon
            icon={(node.meta?.icon as string) ?? "spark"}
            width={width}
            depth={depth}
            height={height}
            color={color}
            opacity={opacity}
            roughness={roughness}
            metalness={metalness}
          />
        </group>
      ) : isNodeCard ? (
        <group position={[0, elevation, 0]}>
          <NodeCardNode width={width} depth={depth} height={height} icon={node.meta?.icon as string | undefined} iconColor={color} />
        </group>
      ) : modelUrl ? (
        <Suspense fallback={shapeEl}>
          <ModelNode url={modelUrl} width={width} depth={depth} height={height} color={color} opacity={opacity} />
        </Suspense>
      ) : (
        shapeEl
      )}
    </group>
  );
}
