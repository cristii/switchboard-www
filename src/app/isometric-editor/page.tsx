import type { Metadata } from "next";
import { EditorMount } from "./EditorMount";

// Editor-scoped design tokens (light + dark, scoped to [data-editor-theme]).
// Imported here so --editor-* resolve on this route; the rules only match the
// editor's themed root, so they don't affect the rest of the site.
import "../../components/editor/theme/editor-tokens.css";

export const metadata: Metadata = {
  title: "Isometric Workflow Editor (WIP)",
  description:
    "Experimental 2.5D isometric editor for visualising n8n workflows and automation architecture diagrams.",
  robots: { index: false, follow: false },
};

export default function IsometricEditorPage() {
  return <EditorMount />;
}
