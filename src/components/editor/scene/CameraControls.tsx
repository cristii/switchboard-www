// Isometric camera controls, driven by a theme CameraSpec (orthographic OR
// perspective, with a configurable view direction, distance and FOV). A fixed iso
// view direction looks onto a movable ground target. Pan = ctrl/middle/right drag
// + two-finger touch; zoom = wheel / pinch (instant). Button/double-click actions
// (reset/fit/zoom) tween via a per-frame lerp (disabled under reduced motion).
// Store-free: `nodes` (for fit) and the camera config come from props, so the
// editor and previews share it. Orthographic "scale" = zoom; perspective "scale"
// = distance to the target (smaller = closer).

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { WorkflowNode } from "../state/types";

const MIN_ZOOM = 8;
const MAX_ZOOM = 120;
const MIN_DIST = 12;
const MAX_DIST = 200;

export interface CameraSpec {
  kind: "orthographic" | "perspective";
  /** View direction onto the target. @default [1,1,1] */
  isoDir?: [number, number, number];
  /** Base camera distance along isoDir (perspective; ortho uses a fixed rig). */
  distance?: number;
  /** Perspective field of view (deg). @default 35 */
  fov?: number;
}

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
  /** Theme camera configuration. */
  camera?: CameraSpec;
  /** Attach pan/zoom/touch listeners ("camera movable"). @default true */
  enabled?: boolean;
  /** Orthographic zoom on first frame. @default 38 */
  initialZoom?: number;
  /** @default [0,0] */
  initialTarget?: [number, number];
  /** Frame all nodes on first mount instead of using initialZoom/Target. */
  fitOnMount?: boolean;
}

const ORTHO_DISTANCE = 40;

export function CameraControls({
  api,
  nodes,
  camera: cameraSpec = { kind: "orthographic" },
  enabled = true,
  initialZoom = 38,
  initialTarget,
  fitOnMount = false,
}: CameraControlsProps) {
  const { camera, gl, raycaster, size } = useThree();
  const reduced = usePrefersReducedMotion();

  const isPersp = cameraSpec.kind === "perspective";
  const dir = useMemo(() => {
    const [x, y, z] = cameraSpec.isoDir ?? [1, 1, 1];
    const v = new THREE.Vector3(x, y, z);
    if (v.lengthSq() === 0) v.set(1, 1, 1);
    return v.normalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraSpec.isoDir?.[0], cameraSpec.isoDir?.[1], cameraSpec.isoDir?.[2]]);
  const baseDistance = cameraSpec.distance ?? (isPersp ? 52 : ORTHO_DISTANCE);
  const fov = cameraSpec.fov ?? 35;

  const target = useRef(new THREE.Vector3(0, 0, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredScale = useRef(isPersp ? baseDistance : initialZoom); // zoom (ortho) | distance (persp)
  const dist = useRef(baseDistance); // live distance (persp)
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
  const cfgRef = useRef({ isPersp, dir, baseDistance, fov });
  cfgRef.current = { isPersp, dir, baseDistance, fov };
  const ix = initialTarget?.[0] ?? 0;
  const iy = initialTarget?.[1] ?? 0;
  const initRef = useRef({ zoom: initialZoom, x: ix, y: iy, fit: fitOnMount });
  initRef.current = { zoom: initialZoom, x: ix, y: iy, fit: fitOnMount };

  const ortho = () => camera as THREE.OrthographicCamera;
  const persp = () => camera as THREE.PerspectiveCamera;
  const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
  const clampDist = (d: number) => Math.max(MIN_DIST, Math.min(MAX_DIST, d));

  const applyCamera = () => {
    const { isPersp: p, dir: d, baseDistance: base, fov: f } = cfgRef.current;
    const distance = p ? dist.current : base;
    camera.position.copy(target.current).addScaledVector(d, distance);
    camera.up.set(0, 1, 0);
    camera.lookAt(target.current);
    if (p) {
      const pc = persp();
      if (pc.fov !== f) pc.fov = f;
    }
    camera.updateProjectionMatrix();
  };

  const groundAt = (clientX: number, clientY: number): THREE.Vector3 | null => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const pt = new THREE.Vector3();
    return raycaster.ray.intersectPlane(plane, pt) ? pt : null;
  };

  const goTo = (tx: number, tz: number, scale: number) => {
    desiredTarget.current.set(tx, 0, tz);
    desiredScale.current = cfgRef.current.isPersp ? clampDist(scale) : clampZoom(scale);
    if (reducedRef.current) {
      target.current.copy(desiredTarget.current);
      if (cfgRef.current.isPersp) dist.current = desiredScale.current;
      else ortho().zoom = desiredScale.current;
      tweening.current = false;
      applyCamera();
    } else {
      tweening.current = true;
    }
  };

  const resetScale = () => (cfgRef.current.isPersp ? cfgRef.current.baseDistance : initRef.current.zoom);
  const reset = () => goTo(initRef.current.x, initRef.current.y, resetScale());

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
    const pad = 1;
    const worldW = maxX - minX + pad * 2;
    const worldH = maxZ - minZ + pad * 2;
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    if (cfgRef.current.isPersp) {
      const half = (cfgRef.current.fov * Math.PI) / 180 / 2;
      const need = Math.max(worldW, worldH) * 0.7;
      const distance = need / Math.max(0.1, Math.tan(half));
      goTo(cx, cz, distance);
    } else {
      // Frame the actual on-screen footprint: the iso view projects (x−z) → the
      // screen-x axis and (x+z) → screen-y. Using these per-node extents (not the
      // square world bbox) lets a diagonal/vertical layout fill a tall frame
      // instead of being width-limited, and a horizontal row fill a wide one.
      let minU = Infinity;
      let maxU = -Infinity;
      let minV = Infinity;
      let maxV = -Infinity;
      for (const n of ns) {
        const u = n.x - n.y;
        const v = n.x + n.y;
        if (u < minU) minU = u;
        if (u > maxU) maxU = u;
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
      }
      const spanU = (maxU - minU) / Math.SQRT2 + pad * 2;
      const spanV = (maxV - minV) / Math.SQRT2 + pad * 2;
      const { w, h } = sizeRef.current;
      const zoom = Math.min(w / spanU, h / spanV) * 0.98;
      const uc = (minU + maxU) / 2;
      const vc = (minV + maxV) / 2;
      goTo((uc + vc) / 2, (vc - uc) / 2, zoom);
    }
  };

  const baseline = () => {
    if (tweening.current) return desiredScale.current;
    return cfgRef.current.isPersp ? dist.current : ortho().zoom;
  };
  // Perspective "zoom in" = smaller distance; orthographic "zoom in" = larger zoom.
  const zoomIn = () =>
    goTo(desiredTarget.current.x, desiredTarget.current.z, cfgRef.current.isPersp ? baseline() / 1.2 : baseline() * 1.2);
  const zoomOut = () =>
    goTo(desiredTarget.current.x, desiredTarget.current.z, cfgRef.current.isPersp ? baseline() * 1.2 : baseline() / 1.2);

  useFrame(() => {
    if (!tweening.current) return;
    target.current.lerp(desiredTarget.current, 0.18);
    if (cfgRef.current.isPersp) {
      dist.current += (desiredScale.current - dist.current) * 0.18;
    } else {
      const oz = ortho().zoom;
      ortho().zoom = oz + (desiredScale.current - oz) * 0.18;
    }
    applyCamera();
    const cur = cfgRef.current.isPersp ? dist.current : ortho().zoom;
    if (
      target.current.distanceTo(desiredTarget.current) < 0.01 &&
      Math.abs(cur - desiredScale.current) < (cfgRef.current.isPersp ? 0.08 : 0.05)
    ) {
      target.current.copy(desiredTarget.current);
      if (cfgRef.current.isPersp) dist.current = desiredScale.current;
      else ortho().zoom = desiredScale.current;
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
      if (cfgRef.current.isPersp) {
        dist.current = clampDist(dist.current * Math.exp(e.deltaY * 0.0015));
        desiredScale.current = dist.current;
        applyCamera();
      } else {
        const factor = Math.exp(-e.deltaY * 0.0015);
        ortho().zoom = clampZoom(ortho().zoom * factor);
        desiredScale.current = ortho().zoom;
        ortho().updateProjectionMatrix();
      }
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
      const ratio = info.dist / pinch.dist;
      if (cfgRef.current.isPersp) {
        dist.current = clampDist(dist.current / ratio);
        desiredScale.current = dist.current;
      } else {
        ortho().zoom = clampZoom(ortho().zoom * ratio);
        desiredScale.current = ortho().zoom;
      }
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

  // Re-apply when the theme camera (direction / distance / fov) changes.
  useEffect(() => {
    if (!didInit.current) return;
    if (isPersp) dist.current = Math.min(dist.current, baseDistance);
    applyCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPersp, baseDistance, fov, dir]);

  return null;
}
