// Sets the scene background to a soft radial gradient (brighter centre → base
// edge) generated as a CanvasTexture. This is what makes the canvas read as a
// premium, cohesive surface rather than a flat fill. Kept inside WebGL (not CSS)
// so the opaque PNG export includes it. Recomputes + disposes on theme change.

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface BackdropProps {
  inner: string;
  outer: string;
}

export function Backdrop({ inner, outer }: BackdropProps) {
  const scene = useThree((s) => s.scene);

  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size * 0.42, size * 0.05, size / 2, size / 2, size * 0.72);
      g.addColorStop(0, inner);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [inner, outer]);

  useEffect(() => {
    const prev = scene.background;
    scene.background = texture;
    return () => {
      if (scene.background === texture) scene.background = prev ?? null;
      texture.dispose();
    };
  }, [scene, texture]);

  return null;
}
