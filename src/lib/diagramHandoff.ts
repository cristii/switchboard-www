// One-shot localStorage handoff for passing a diagram scene from the /diagram-library
// cards to the editor (/isometric-editor) or the playground (/diagram-preview).
// The reader clears the key, so a refresh doesn't re-load a stale scene. The scene
// is a PreviewDoc ({ config, diagram }) — the same format the playground + the
// editor "Copy JSON" use.

import { parsePreviewDoc, serializePreviewDoc, type PreviewDoc } from "@/components/editor/preview/previewConfig";

const KEY = "sb-diagram-handoff";

export function writeHandoff(doc: PreviewDoc): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, serializePreviewDoc(doc));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/** Read + clear the pending handoff (one-shot). */
export function readHandoff(): PreviewDoc | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    window.localStorage.removeItem(KEY);
    return parsePreviewDoc(raw);
  } catch {
    return null;
  }
}
