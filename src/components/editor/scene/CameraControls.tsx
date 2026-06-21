// Orthographic isometric camera: a fixed iso view direction onto a movable
// ground target. Pan = ctrl/middle/right drag (raycast-based, instant); zoom =
// wheel (instant). Button/double-click actions (reset/fit/zoom) tween smoothly
// via a per-frame lerp toward a desired target+zoom (disabled under reduced
// motion). Exposes reset/fit/zoomIn/zoomOut via the editor api ref.

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

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
  capturePng: () => string | null;
}

export interface CameraControlsProps {
  api?: React.MutableRefObject<CameraApi>;
}

export function CameraControls({ api }: CameraControlsProps) {
  const { camera, gl, raycaster, size } = useThree();
  const reduced = usePrefersReducedMotion();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredZoom = useRef(DEFAULT_ZOOM);
  const tweening = useRef(false);
  const panning = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const ortho = () => camera as THREE.OrthographicCamera;
  const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

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

  // Animate (or, under reduced motion, jump) to a target + zoom.
  const goTo = (tx: number, tz: number, zoom: number) => {
    desiredTarget.current.set(tx, 0, tz);
    desiredZoom.current = clampZoom(zoom);
    if (reduced) {
      target.current.copy(desiredTarget.current);
      ortho().zoom = desiredZoom.current;
      tweening.current = false;
      applyCamera();
    } else {
      tweening.current = true;
    }
  };

  const reset = () => goTo(0, 0, DEFAULT_ZOOM);

  const fit = () => {
    const nodes = useWorkflowStore.getState().nodes;
    if (nodes.length === 0) return reset();
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
    const pad = 3;
    const worldW = maxX - minX + pad * 2;
    const worldH = maxZ - minZ + pad * 2;
    const isoFactor = 1.7;
    const zoom = Math.min(size.width / (worldW * isoFactor), size.height / (worldH * isoFactor));
    goTo((minX + maxX) / 2, (minZ + maxZ) / 2, zoom);
  };

  const currentZoomBaseline = () => (tweening.current ? desiredZoom.current : ortho().zoom);
  const zoomIn = () => goTo(desiredTarget.current.x, desiredTarget.current.z, currentZoomBaseline() * 1.2);
  const zoomOut = () => goTo(desiredTarget.current.x, desiredTarget.current.z, currentZoomBaseline() / 1.2);

  useFrame(() => {
    if (!tweening.current) return;
    target.current.lerp(desiredTarget.current, 0.18);
    const oz = ortho().zoom;
    ortho().zoom = oz + (desiredZoom.current - oz) * 0.18;
    applyCamera();
    if (
      target.current.distanceTo(desiredTarget.current) < 0.01 &&
      Math.abs(ortho().zoom - desiredZoom.current) < 0.05
    ) {
      target.current.copy(desiredTarget.current);
      ortho().zoom = desiredZoom.current;
      applyCamera();
      tweening.current = false;
    }
  });

  useEffect(() => {
    target.current.set(0, 0, 0);
    desiredTarget.current.set(0, 0, 0);
    desiredZoom.current = DEFAULT_ZOOM;
    ortho().zoom = DEFAULT_ZOOM;
    applyCamera();
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
      tweening.current = false;
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
        desiredTarget.current.copy(target.current);
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
      ortho().zoom = clampZoom(ortho().zoom * factor);
      desiredZoom.current = ortho().zoom;
      ortho().updateProjectionMatrix();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl, raycaster, size.width, size.height, reduced]);

  return null;
}
