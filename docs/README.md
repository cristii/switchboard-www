# Isometric Workflow Editor — Documentation

Docs for the editor in `src/components/editor/` (live at `/isometric-editor`), its read-only
preview (`/diagram-preview`), and the roadmap for themes, in-canvas text, pluggable paths and models.

**Start here:** [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — the staged (4-step) plan and
the `ThemeSpec` / routing / linking architecture.

## Index

### editor/
- [`isometric_workflow_editor_description.md`](./editor/isometric_workflow_editor_description.md) —
  the authoritative technical + design spec (architecture, data model, brand rules, §-references
  used throughout the code).
- [`isometric_workflow_editor_progress.md`](./editor/isometric_workflow_editor_progress.md) — phase
  checklist + live status of what's built.

### themes/
- [`isometric_workflow_editor_theming_guide.md`](./themes/isometric_workflow_editor_theming_guide.md)
  — the `ThemeSpec` model + how to adjust camera, lighting, colour, shadows, backdrop, text, and
  create/load themes (§0 is the current entry point).
- [`CREATING_THEMES.md`](./themes/CREATING_THEMES.md) — short tutorial: manager → localStorage →
  export → commit; per-node/edge overrides; preview theme field.
- [`THEME_PROMPT.md`](./themes/THEME_PROMPT.md) — copy-paste prompt to generate a `ThemeSpec` with an
  LLM (incl. the AWS look as a worked example).

### nodes/
- [`isometric_workflow_editor_3d_model_prompts.md`](./nodes/isometric_workflow_editor_3d_model_prompts.md)
  — per-kind 3D-model generation prompts (premium minimalist, glTF/GLB).
- `ADDING_NODE_TYPES.md` *(Step 1)* — add a node kind (catalog + shape + glyph).
- `BLENDER_MODELING.md` *(Step 1)* — model nodes in Blender + simple textures, export GLB.

### paths/
- `PATH_ALGORITHMS.md` *(Step 1/3)* — switch / author routing (path-trajectory) algorithms.

### preview/
- [`isometric_workflow_editor_preview_mode.md`](./preview/isometric_workflow_editor_preview_mode.md)
  — read-only embeddable preview (Phase 1 done) + scroll/keyframe plan (Phase 2).

> Moved docs keep their original filenames so existing references in code comments stay valid; new
> docs use short names. Items marked *(Step N)* are produced as that step of the implementation plan.
