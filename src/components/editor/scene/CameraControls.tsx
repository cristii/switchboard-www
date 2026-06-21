// Orthographic isometric camera: a fixed iso view direction onto a movable
// ground target. Pan = ctrl/middle/right drag (raycast-based, so the grabbed
// point stays under the cursor); zoom = wheel. Exposes reset()/fit() via an
// imperative api ref for the ground double-click now and the toolbar in P6.

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkflowStore } from "../state/useWorkflowStore";

const ISO_DIR = new THREE.Vector3(1, 1, 1).normalize();
const CAM_DISTANCE = 40;
const MIN_ZOOM = 12;
const MAX_ZOOM = 100;
const DEFAULT_ZOOM = 38;

export interface CameraApi {
  reset: () => void;
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  /** Read the current WebGL frame as a PNG data URL (set by the canvas). */
  capturePng: () => string | null;
}

export interface CameraControlsProps {
  api?: React.MutableRefObject<CameraApi>;
}

export function CameraControls({ api }: CameraControlsProps) {
  const { camera, gl, raycaster, size } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const panning = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;

    const applyCamera = () => {
      camera.position.copy(target.current).addScaledVector(ISO_DIR, CAM_DISTANCE);
      camera.up.set(0, 1, 0);
      camera.lookAt(target.current);
      camera.updateProjectionMatrix();
    };

    const groundAt = (clientX: number, clientY: number): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const p = new THREE.Vector3();
      return raycaster.ray.intersectPlane(plane, p) ? p : null;
    };

    const reset = () => {
      target.current.set(0, 0, 0);
      ortho.zoom = DEFAULT_ZOOM;
      applyCamera();
    };

    const fit = () => {
      const nodes = useWorkflowStore.getState().nodes;
      if (nodes.length === 0) {
        reset();
        return;
      }
      let minX = Infinity;
      let maxX = -Infinity;
      let minZ = Infinity;
      let maxZ = -Infinity;
      for (const n of nodes) {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minZ = Math.min(minZ, n.y);
        maxZ = Math.max(maxZ, n.y);
      }
      target.current.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
      const pad = 3;
      const worldW = maxX - minX + pad * 2;
      const worldH = maxZ - minZ + pad * 2;
      // R3F orthographic: visible world span ≈ pixels / zoom. The iso tilt
      // compresses the footprint, so allow extra headroom with isoFactor.
      const isoFactor = 1.7;
      const zoom = Math.min(size.width / (worldW * isoFactor), size.height / (worldH * isoFactor));
      ortho.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
      applyCamera();
    };

    const zoomBy = (factor: number) => {
      ortho.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, ortho.zoom * factor));
      ortho.updateProjectionMatrix();
    };
    const zoomIn = () => zoomBy(1.2);
    const zoomOut = () => zoomBy(1 / 1.2);

    reset();
    // Merge fields (don't replace the object) so capturePng set in onCreated survives.
    if (api) {
      api.current.reset = reset;
      api.current.fit = fit;
      api.current.zoomIn = zoomIn;
      api.current.zoomOut = zoomOut;
    }

    const onPointerDown = (e: PointerEvent) => {
      const isPan = e.button === 1 || e.button === 2 || (e.button === 0 && e.ctrlKey);
      if (!isPan) return;
      e.preventDefault();
      panning.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      gl.domElement.style.cursor = "grabbing";
      gl.domElement.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!panning.current) return;
      const before = groundAt(last.current.x, last.current.y);
      const after = groundAt(e.clientX, e.clientY);
      if (before && after) {
        target.current.add(before.sub(after));
        applyCamera();
      }
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!panning.current) return;
      panning.current = false;
      gl.domElement.style.cursor = "default";
      gl.domElement.releasePointerCapture?.(e.pointerId);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      ortho.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, ortho.zoom * factor));
      ortho.updateProjectionMatrix();
    };
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContextMenu);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
    // camera/gl are stable for the canvas lifetime; api ref identity is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl, raycaster, size.width, size.height]);

  return null;
}
