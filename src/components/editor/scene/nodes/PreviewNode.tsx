// Read-only node for the preview: same look as NodeMesh (shared resolver +
// scale-in) but no interaction, no port handles, no store coupling — so multiple
// previews are fully independent. Highlight/dim props arrive with preview phase 2.

import { animated, useSpring } from "@react-spring/three";
import { GroupContainer } from "./shapes/GroupContainer";
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
  const { isGroup, Shape, width, depth, height, color, emissive, emissiveIntensity } =
    resolveNodeVisual(node, theme, false);

  const { scale } = useSpring({
    from: { scale: 0.85 },
    to: { scale: 1 },
    immediate: reduced,
    config: { tension: 320, friction: 24 },
  });

  return (
    <group position={[node.x, 0, node.y]}>
      <animated.group scale={scale}>
        {isGroup ? (
          <GroupContainer node={node} theme={theme} selected={false} />
        ) : (
          <Shape
            width={width}
            depth={depth}
            height={height}
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        )}
      </animated.group>
    </group>
  );
}
