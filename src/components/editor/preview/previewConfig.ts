// Appearance/camera config for a DiagramPreview, plus parsing of the playground
// document ({ config, diagram }). The diagram itself is validated by schema.ts.

import { deserialize } from "../state/schema";
import type { ThemeSpec } from "../theme/themeSpec";
import type { Diagram } from "../state/types";

export interface PreviewConfig {
  showGrid: boolean;
  showGround: boolean;
  showLabels: boolean;
  /** Allow pan/zoom in the preview. */
  cameraMovable: boolean;
  /** Explicit camera zoom; if both zoom and target are omitted the preview fits. */
  cameraZoom?: number;
  cameraTarget?: [number, number];
  /** fit() zoom multiplier when fitting (<1 leaves margin, >1 fills tighter). */
  cameraFit?: number;
  /** A registered theme id ("light" | "dark" | "aws" | …) OR an inline ThemeSpec. */
  theme: string | ThemeSpec;
}

export const DEFAULT_PREVIEW_CONFIG: PreviewConfig = {
  showGrid: true,
  showGround: true,
  showLabels: true,
  cameraMovable: false,
  theme: "light",
};

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function mergePreviewConfig(partial?: Partial<PreviewConfig> | null): PreviewConfig {
  const p = (partial ?? {}) as Partial<PreviewConfig>;
  const theme: string | ThemeSpec =
    typeof p.theme === "string" || (!!p.theme && typeof p.theme === "object")
      ? p.theme
      : DEFAULT_PREVIEW_CONFIG.theme;
  const cfg: PreviewConfig = {
    showGrid: bool(p.showGrid, DEFAULT_PREVIEW_CONFIG.showGrid),
    showGround: bool(p.showGround, DEFAULT_PREVIEW_CONFIG.showGround),
    showLabels: bool(p.showLabels, DEFAULT_PREVIEW_CONFIG.showLabels),
    cameraMovable: bool(p.cameraMovable, DEFAULT_PREVIEW_CONFIG.cameraMovable),
    theme,
  };
  if (typeof p.cameraZoom === "number") cfg.cameraZoom = p.cameraZoom;
  if (typeof p.cameraFit === "number") cfg.cameraFit = p.cameraFit;
  if (Array.isArray(p.cameraTarget) && p.cameraTarget.length === 2) {
    cfg.cameraTarget = [Number(p.cameraTarget[0]), Number(p.cameraTarget[1])];
  }
  return cfg;
}

export interface PreviewDoc {
  config: PreviewConfig;
  diagram: Diagram;
}

/** Parse the playground JSON: accepts `{ config, diagram }` or a bare diagram. */
export function parsePreviewDoc(input: string): PreviewDoc {
  const raw = JSON.parse(input) as unknown;
  const isWrapped = !!raw && typeof raw === "object" && "diagram" in (raw as Record<string, unknown>);
  const diagramRaw = isWrapped ? (raw as Record<string, unknown>).diagram : raw;
  const configRaw = isWrapped ? ((raw as Record<string, unknown>).config as Partial<PreviewConfig>) : null;
  return { config: mergePreviewConfig(configRaw), diagram: deserialize(diagramRaw) };
}

export function serializePreviewDoc(doc: PreviewDoc): string {
  return JSON.stringify({ config: doc.config, diagram: doc.diagram }, null, 2);
}
