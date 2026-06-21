import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { Toolbar } from "./Toolbar";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { mvpSampleDiagram } from "../sampleDiagram";
import type { CameraApi } from "../scene/CameraControls";
import type { EditorTheme } from "../state/types";

// The toolbar in isolation (no canvas). Camera buttons are wired to a no-op api;
// undo/redo + theme toggle work against the store.

const meta: Meta = { title: "Editor/Panels/Toolbar" };
export default meta;

function Demo({ initialTheme }: { initialTheme: EditorTheme }) {
  const apiRef = useRef<CameraApi>({
    reset: () => {},
    fit: () => {},
    zoomIn: () => {},
    zoomOut: () => {},
    capturePng: () => null,
  });
  const [theme, setTheme] = useState<EditorTheme>(initialTheme);

  useEffect(() => {
    useWorkflowStore.getState().loadDiagram(mvpSampleDiagram);
  }, []);

  return (
    <div
      data-editor-theme={theme}
      style={{
        width: 560,
        border: "1.5px solid var(--editor-border-soft)",
        borderRadius: "var(--r-lg, 18px)",
        overflow: "hidden",
        background: "var(--editor-bg)",
      }}
    >
      <Toolbar
        apiRef={apiRef}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      />
    </div>
  );
}

export const Light: StoryObj = { render: () => <Demo initialTheme="light" /> };
export const Dark: StoryObj = { render: () => <Demo initialTheme="dark" /> };
