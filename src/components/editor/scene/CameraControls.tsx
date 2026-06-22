// Orthographic isometric camera: a fixed iso view direction onto a movable
// ground target. Pan = ctrl/middle/right drag + two-finger touch; zoom = wheel /
// pinch (instant). Button/double-click actions (reset/fit/zoom) tween via a
// per-frame lerp (disabled under reduced motion). Store-free: `nodes` (for fit)
// and the initial camera come from props, so the editor and previews share it.

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { WorkflowNode } from "../state/types";

const ISO_DIR = new THREE.Vector3(1, 1, 1).normalize();
const CAM_DISTANCE = 40;
const MIN_ZOOM = 8;
const MAX_ZOOM = 120;

export interface CameraApi {
  reset: () => void;
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  capturePng: () => string | null;
}

export interface CameraControlsProps {
  api?: React.MutableRefObject<CameraApi>;
  /** Nodes used by fit(). */
  nodes: WorkflowNode[];
  /** Attach pan/zoom/touch listeners ("camera movable"). @default true */
  enabled?: boolean;
  /** @default 38 */
  initialZoom?: number;
  /** @default [0,0] */
  initialTarget?: [number, number];
  /** Frame all nodes on first mount instead of using initialZoom/Target. */
  fitOnMount?: boolean;
}

export function CameraControls({
  api,
  nodes,
  enabled = true,
  initialZoom = 38,
  initialTarget,
  fitOnMount = false,
}: CameraControlsProps) {
  const { camera, gl, raycaster, size } = useThree();
  const reduced = usePrefersReducedMotion();

  const target = useRef(new THREE.Vector3(0, 0, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredZoom = useRef(initialZoom);
  const tweening = useRef(false);
  const panning = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const didInit = useRef(false);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  // Live-value refs so the camera fns read current props without re-binding.
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const sizeRef = useRef({ w: size.width, h: size.height });
  sizeRef.current = { w: size.width, h: size.height };
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const ix = initialTarget?.[0] ?? 0;
  const iy = initialTarget?.[1] ?? 0;
  const initRef = useRef({ zoom: initialZoom, x: ix, y: iy, fit: fitOnMount });
  initRef.current = { zoom: initialZoom, x: ix, y: iy, fit: fitOnMount };

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

  const goTo = (tx: number, tz: number, zoom: number) => {
    desiredTarget.current.set(tx, 0, tz);
    desiredZoom.current = clampZoom(zoom);
    if (reducedRef.current) {
      target.current.copy(desiredTarget.current);
      ortho().zoom = desiredZoom.current;
      tweening.current = false;
      applyCamera();
    } else {
      tweening.current = true;
    }
  };

  const reset = () => goTo(initRef.current.x, initRef.current.y, initRef.current.zoom);

  const fit = () => {
    const ns = nodesRef.current;
    if (ns.length === 0) return reset();
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const n of ns) {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      minZ = Math.min(minZ, n.y);
      maxZ = Math.max(maxZ, n.y);
    }
    const pad = 3;
    const worldW = maxX - minX + pad * 2;
    const worldH = maxZ - minZ + pad * 2;
    const isoFactor = 1.7;
    const { w, h } = sizeRef.current;
    const zoom = Math.min(w / (worldW * isoFactor), h / (worldH * isoFactor));
    goTo((minX + maxX) / 2, (minZ + maxZ) / 2, zoom);
  };

  const baseline = () => (tweening.current ? desiredZoom.current : ortho().zoom);
  const zoomIn = () => goTo(desiredTarget.current.x, desiredTarget.current.z, baseline() * 1.2);
  const zoomOut = () => goTo(desiredTarget.current.x, desiredTarget.current.z, baseline() / 1.2);

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

  // Attach listeners + expose api once. Handlers no-op when `enabled` is off
  // (read via ref) so toggling "camera movable" never re-binds listeners.
  useEffect(() => {
    if (api) {
      api.current.reset = reset;
      api.current.fit = fit;
      api.current.zoomIn = zoomIn;
      api.current.zoomOut = zoomOut;
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!enabledRef.current) return;
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
      if (!enabledRef.current) return;
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      ortho().zoom = clampZoom(ortho().zoom * factor);
      desiredZoom.current = ortho().zoom;
      ortho().updateProjectionMatrix();
    };
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    type Pinch = { dist: number; cx: number; cy: number };
    let pinch: Pinch | null = null;
    const pinchInfo = (touches: TouchList): Pinch => {
      const a = touches[0];
      const b = touches[1];
      return {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        cx: (a.clientX + b.clientX) / 2,
        cy: (a.clientY + b.clientY) / 2,
      };
    };
    const onTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      if (e.touches.length === 2) {
        pinch = pinchInfo(e.touches);
        tweening.current = false;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!enabledRef.current || !pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const info = pinchInfo(e.touches);
      const before = groundAt(pinch.cx, pinch.cy);
      const after = groundAt(info.cx, info.cy);
      if (before && after) {
        target.current.add(before.sub(after));
        desiredTarget.current.copy(target.current);
      }
      ortho().zoom = clampZoom(ortho().zoom * (info.dist / pinch.dist));
      desiredZoom.current = ortho().zoom;
      applyCamera();
      pinch = info;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch = null;
    };

    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl, raycaster]);

  // Initial framing on mount; re-frame when the explicit camera config changes.
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      if (initRef.current.fit) fit();
      else reset();
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialZoom, ix, iy]);

  return null;
}
