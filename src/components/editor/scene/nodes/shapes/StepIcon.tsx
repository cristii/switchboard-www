// Simple procedural 3D icons that sit at the centre of a hexagon stage platform
// (the architecture-reference look). Built from primitives, tinted to the node's
// colour with lighter accents — recognisable, not detailed. Selected by
// node.meta.icon; rendered via a NodeMesh/PreviewNode branch on the `icon` kind.
// A real GLB can replace any of these via node.meta.model. Keys:
//   bars · gear · check · mail · send · calendar · refresh · spark · alert (+ box fallback)

import { RoundedBox } from "@react-three/drei";
import { NodeStandardMaterial } from "./NodeStandardMaterial";
import { lighten } from "./deviceTones";

export interface StepIconProps {
  icon: string;
  width: number;
  depth: number;
  height: number;
  color: string;
  opacity?: number;
  roughness?: number;
  metalness?: number;
}

export function StepIcon({ icon, width, depth, height, color, opacity, roughness, metalness }: StepIconProps) {
  const s = Math.min(width, depth);
  const h = height;
  const body = { color, emissive: color, emissiveIntensity: 0.04, opacity, roughness, metalness };
  const accent = lighten(color, 0.62);
  const Body = () => <NodeStandardMaterial {...body} />;

  switch (icon) {
    case "bars": {
      const bw = s * 0.18;
      const gap = s * 0.08;
      const hs = [h * 0.45, h * 0.72, h * 0.98];
      return (
        <group>
          {hs.map((bh, i) => (
            <mesh key={i} position={[(i - 1) * (bw + gap), bh / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[bw, bh, bw]} />
              <Body />
            </mesh>
          ))}
        </group>
      );
    }
    case "gear": {
      const r = s * 0.3;
      const gh = h * 0.5;
      return (
        <group position={[0, gh / 2 + h * 0.05, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[r, r, gh, 24]} />
            <Body />
          </mesh>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * r * 1.12, 0, Math.sin(a) * r * 1.12]} rotation={[0, -a, 0]} castShadow>
                <boxGeometry args={[s * 0.13, gh, s * 0.1]} />
                <Body />
              </mesh>
            );
          })}
          <mesh>
            <cylinderGeometry args={[r * 0.34, r * 0.34, gh * 1.05, 16]} />
            <meshStandardMaterial color={accent} roughness={0.5} />
          </mesh>
        </group>
      );
    }
    case "check": {
      const r = s * 0.42;
      return (
        <group>
          <mesh position={[0, h * 0.16, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, h * 0.32, 32]} />
            <Body />
          </mesh>
          <group position={[0, h * 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[-s * 0.08, -s * 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[s * 0.09, s * 0.24, 0.03]} />
              <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
            <mesh position={[s * 0.05, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[s * 0.09, s * 0.42, 0.03]} />
              <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
          </group>
        </group>
      );
    }
    case "mail": {
      return (
        <group position={[0, h * 0.42, 0]}>
          <RoundedBox args={[s * 0.78, h * 0.56, s * 0.1]} radius={0.04} smoothness={3} castShadow receiveShadow>
            <Body />
          </RoundedBox>
          {/* envelope flap: a V of two thin accent bars on the front */}
          <mesh position={[-s * 0.19, h * 0.06, s * 0.06]} rotation={[0, 0, -0.6]}>
            <boxGeometry args={[s * 0.46, h * 0.05, 0.02]} />
            <meshStandardMaterial color={accent} roughness={0.5} />
          </mesh>
          <mesh position={[s * 0.19, h * 0.06, s * 0.06]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[s * 0.46, h * 0.05, 0.02]} />
            <meshStandardMaterial color={accent} roughness={0.5} />
          </mesh>
        </group>
      );
    }
    case "send": {
      // paper dart: a flattened 4-sided cone tilted forward
      return (
        <group position={[0, h * 0.5, 0]} rotation={[Math.PI / 2.4, Math.PI / 4, 0]}>
          <mesh scale={[1, 1, 0.32]} castShadow>
            <coneGeometry args={[s * 0.4, h * 0.8, 4]} />
            <Body />
          </mesh>
        </group>
      );
    }
    case "calendar": {
      return (
        <group position={[0, h * 0.42, 0]}>
          <RoundedBox args={[s * 0.74, h * 0.6, s * 0.1]} radius={0.04} smoothness={3} castShadow receiveShadow>
            <Body />
          </RoundedBox>
          <mesh position={[0, h * 0.22, s * 0.055]}>
            <boxGeometry args={[s * 0.74, h * 0.14, 0.03]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
          {[-1, 1].map((sgn) => (
            <mesh key={sgn} position={[sgn * s * 0.2, h * 0.34, s * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[s * 0.03, s * 0.03, h * 0.12, 12]} />
              <Body />
            </mesh>
          ))}
        </group>
      );
    }
    case "refresh": {
      const r = s * 0.34;
      return (
        <group position={[0, h * 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[r, r * 0.18, 12, 28, Math.PI * 1.5]} />
            <Body />
          </mesh>
          <mesh position={[r, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[r * 0.32, r * 0.6, 12]} />
            <Body />
          </mesh>
        </group>
      );
    }
    case "spark": {
      return (
        <group position={[0, h * 0.5, 0]}>
          <mesh castShadow receiveShadow>
            <octahedronGeometry args={[s * 0.4, 0]} />
            <Body />
          </mesh>
          <mesh position={[s * 0.4, h * 0.28, 0]}>
            <octahedronGeometry args={[s * 0.1, 0]} />
            <meshStandardMaterial color={accent} roughness={0.4} emissive={accent} emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    }
    case "alert": {
      // warning triangle (3-sided pyramid) + an exclamation on the front face
      const th = h * 0.92;
      return (
        <group>
          <mesh position={[0, th / 2, 0]} rotation={[0, Math.PI / 6, 0]} castShadow receiveShadow>
            <coneGeometry args={[s * 0.5, th, 3]} />
            <Body />
          </mesh>
          <mesh position={[0, th * 0.52, s * 0.24]}>
            <boxGeometry args={[s * 0.07, th * 0.3, 0.02]} />
            <meshStandardMaterial color={accent} roughness={0.4} />
          </mesh>
          <mesh position={[0, th * 0.3, s * 0.24]}>
            <boxGeometry args={[s * 0.08, s * 0.08, 0.02]} />
            <meshStandardMaterial color={accent} roughness={0.4} />
          </mesh>
        </group>
      );
    }
    default:
      return (
        <RoundedBox args={[s * 0.7, h * 0.7, s * 0.7]} radius={0.06} smoothness={3} position={[0, h * 0.35, 0]} castShadow receiveShadow>
          <Body />
        </RoundedBox>
      );
  }
}
