// Shared standard material for node shapes. Centralises the theme-driven knobs:
// per-node opacity (transparent when < 1) and optional roughness/metalness
// overrides, each shape supplying its own intrinsic defaults so the light/dark
// look is unchanged while themes (e.g. the matte-grey AWS theme) can override.

export interface NodeStandardMaterialProps {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  /** Shape's intrinsic values, used when the theme doesn't override. */
  defaultRoughness?: number;
  defaultMetalness?: number;
  flatShading?: boolean;
}

export function NodeStandardMaterial({
  color,
  emissive,
  emissiveIntensity,
  opacity = 1,
  roughness,
  metalness,
  defaultRoughness = 0.42,
  defaultMetalness = 0.06,
  flatShading,
}: NodeStandardMaterialProps) {
  const transparent = opacity < 1;
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness ?? defaultRoughness}
      metalness={metalness ?? defaultMetalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent={transparent}
      opacity={opacity}
      flatShading={flatShading}
    />
  );
}
