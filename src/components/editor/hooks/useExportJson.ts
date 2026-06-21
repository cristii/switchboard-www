"use client";

// Download the current diagram as versioned JSON (schema.serialize → file).

import { useCallback } from "react";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { toJSON } from "../state/schema";

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useExportJson() {
  return useCallback(() => {
    const diagram = useWorkflowStore.getState().exportDiagram();
    download(toJSON(diagram), "diagram.json", "application/json");
  }, []);
}
