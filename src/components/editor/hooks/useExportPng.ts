"use client";

// Download the WebGL canvas as a PNG (canvas only this pass — DOM labels are not
// baked in; label compositing + 2x scale are a later refinement). Reads the frame
// via the editor api's capturePng (the canvas has preserveDrawingBuffer on).

import { useCallback } from "react";
import type { CameraApi } from "../scene/CameraControls";

export function useExportPng(apiRef: React.MutableRefObject<CameraApi>) {
  return useCallback(() => {
    const url = apiRef.current.capturePng();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.png";
    a.click();
  }, [apiRef]);
}
