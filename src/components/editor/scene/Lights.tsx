// Data-driven scene lighting: maps a ThemeSpec's `lights[]` (multiple, coloured)
// to R3F light elements. The first shadow-casting directional light gets the full
// shadow-map config (resolution + framed ortho shadow camera) from `shadow`.
// Shadows are globally gated by `enabled` (the editor's "toggle shadows" button
// passes castShadow=false to suppress them without dropping the lights).

import type { LightSpec, ThemeSpec } from "../theme/themeSpec";

export interface LightsProps {
  lights: LightSpec[];
  shadow: ThemeSpec["shadow"];
  /** Master switch for cast shadows (the toolbar "shadows" toggle). @default true */
  castShadow?: boolean;
}

export function Lights({ lights, shadow, castShadow = true }: LightsProps) {
  return (
    <>
      {lights.map((l) => {
        switch (l.type) {
          case "ambient":
            return <ambientLight key={l.id} color={l.color} intensity={l.intensity} />;
          case "hemisphere":
            return (
              <hemisphereLight key={l.id} args={[l.sky, l.ground, l.intensity]} />
            );
          case "point":
            return (
              <pointLight
                key={l.id}
                position={l.position}
                color={l.color}
                intensity={l.intensity}
                distance={l.distance ?? 0}
              />
            );
          case "directional": {
            const casts = castShadow && shadow.enabled && !!l.castShadow;
            return (
              <directionalLight
                key={l.id}
                position={l.position}
                color={l.color}
                intensity={l.intensity}
                castShadow={casts}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={1}
                shadow-camera-far={90}
                shadow-camera-left={-24}
                shadow-camera-right={24}
                shadow-camera-top={24}
                shadow-camera-bottom={-24}
                shadow-bias={shadow.bias}
                shadow-normalBias={0.02}
                shadow-radius={shadow.radius}
              />
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
