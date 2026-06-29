// Read-only node for the preview: same look as NodeMesh (shared resolver +
// scale-in) but no interaction, no port handles, no store coupling — so multiple
// previews are fully independent. Highlight/dim props arrive with preview phase 2.

import { Suspense } from "react";
import { animated, useSpring } from "@react-spring/three";
import { GroupContainer } from "./shapes/GroupContainer";
import { TextNode } from "./shapes/TextNode";
import { ModelNode } from "./shapes/ModelNode";
import { StepIcon } from "./shapes/StepIcon";
import { resolveNodeVisual } from "./nodeVisual";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { SceneTheme } from "../../theme/sceneTheme";
import type { WorkflowNode } from "../../state/types";

export interface PreviewNodeProps {
  node: WorkflowNode;
  theme: SceneTheme;
}

export function PreviewNode({ node, theme }: PreviewNodeProps) {
  const reduced = usePrefersReducedMotion();
  const { isGroup, isText, isIcon, Shape, width, depth, height, color, emissive, emissiveIntensity, opacity, roughness, metalness, elevation } =
    resolveNodeVisual(node, theme, false);
  const modelUrl = typeof node.meta?.model === "string" ? (node.meta.model as string) : null;

  const { scale } = useSpring({
    from: { scale: 0.85 },
    to: { scale: 1 },
    immediate: reduced,
    config: { tension: 320, friction: 24 },
  });

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
      <animated.group scale={scale}>
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
        ) : modelUrl ? (
          <Suspense fallback={shapeEl}>
            <ModelNode url={modelUrl} width={width} depth={depth} height={height} color={color} opacity={opacity} />
          </Suspense>
        ) : (
          shapeEl
        )}
      </animated.group>
    </group>
  );
}
