# Switchboard

Website and design system for **Switchboard AI Systems** — AI chatbots and workflow
automation (n8n, Trigger.dev) by Cristi Șatcovschi.

This repo will contain:
- a **design-system component library** in **Storybook** (published to GitHub Pages), and
- a **Next.js** marketing site (landing page + Daily Log blog) on **Vercel**, with a
  **Supabase**-backed newsletter.

🚧 Work in progress. See **[PLAN.md](./PLAN.md)** for the roadmap, **[PROGRESS.md](./PROGRESS.md)**
for current status, and **[AGENTS.md](./AGENTS.md)** for contributor/agent guidelines.
Source design references live in **[`references/`](./references)**.

## Design system (Storybook)

The brand components and foundations live in `src/components/ui` and `src/stories`.

```bash
npm install
npm run storybook        # dev at http://localhost:6006
npm run build-storybook  # static build → storybook-static/
```

Every push builds Storybook and publishes it to the **`gh-pages`** branch. To make the
preview live, enable it once: **Settings → Pages → Build and deployment → Source:
"Deploy from a branch" → Branch: `gh-pages` `/(root)`**. It then serves at
**https://cristii.github.io/switchboard-www/**.

## Marketing site (Next.js)

The Next.js 14 App Router site lives in `src/app`, consuming the design system from
`src/components/ui`. Tailwind handles app layout/sections, with its theme mapped to the
brand CSS-var tokens in `src/styles` (the single source of truth — never raw hex).

```bash
npm install
npm run dev        # dev at http://localhost:3000
npm run build      # production build (next build) — runs on Vercel
npm run typecheck  # tsc --noEmit
```

`next build` works with no environment variables set; integrations (Supabase, n8n,
Cal.com) degrade gracefully when unconfigured. See `.env.example` for the full list.

## Isometric diagram editor

A 2.5D isometric **workflow + architecture diagram** editor (React Three Fiber / three.js),
used to author the diagrams embedded across `/services`, `/process`, `/about` and `/work`.
three.js is code-split (dynamic `import`, `ssr: false`) so it never ships on other routes;
embedded diagrams render once to a static snapshot for performance, follow the site's
light/dark toggle (the dark scenes use the `signalDark` theme), and connect nodes with
iso-orthogonal "signal trace" elbows routed under the floating platforms.

The editor is a full tool: multi-select (shift-click / marquee), copy/paste/duplicate,
alt-drag clone, grid snap + smart alignment guides, drag-and-drop from the palette,
inline rename, context menus, autosave with session restore, a keyboard-shortcut sheet
(`?`), and touch-first mobile ergonomics. See
[`docs/editor/audit_improvement_plan.md`](./docs/editor/audit_improvement_plan.md) for the
audit + phased implementation record.

Three routes:

| Route | What it is |
|---|---|
| **`/isometric-editor`** | The full editor — palette, inspector, theme manager, and a toolbar (undo/redo, zoom/fit/reset, link nodes, grid/shadows, **Copy JSON**, Export JSON/PNG). Built Tailwind-free with inline styles + `--editor-*` CSS vars so it stays self-contained and on-brand. |
| **`/diagram-preview`** | A read-only playground: edit a `{ config, diagram }` JSON document and see it render live, with quick toggles for grid/shadows/labels/camera/theme. |
| **`/diagram-library`** | Browsable galleries of ready-made **templates** and the **node components** they're built from (shadcn/Tailwind-Pro style). Right-click (or long-press on mobile) any card to **Open in editor**, **Copy JSON**, **Copy PNG**, **Copy embed code**, or **Open in playground**. |

**Round-trip format.** Scenes serialize to a single `PreviewDoc` = `{ config, diagram }`
(`config` carries the theme, grid/shadow/label flags and the framed camera; `diagram` carries
nodes/edges). The library, the editor's **Copy JSON**, and the playground all share this format.

**Authoring loop.** Open a library card in the editor → tweak camera/grid/theme/nodes →
**Copy JSON** → paste it back into the library source (`src/lib/diagramLibrary.ts`) or the
playground. Opening a card hands the scene to the editor/playground via a one-shot
`localStorage` handoff (`src/lib/diagramHandoff.ts`).

Detailed specs live under [`docs/`](./docs): the editor architecture in
[`docs/editor`](./docs/editor), theming in [`docs/themes`](./docs/themes), the preview/embed
format in [`docs/preview`](./docs/preview), and node/label/path references in
[`docs/nodes`](./docs/nodes), [`docs/labels`](./docs/labels) and [`docs/paths`](./docs/paths).

## Skills

Loadable skill files live under [`references/`](./references). Each is a
`SKILL.md` with YAML frontmatter that an agent (e.g. Claude Code) can load on
request to get expert, file-anchored context about a subsystem.

- **`references/design-system/SKILL.md`** — brand guidelines, tokens, fonts,
  assets, and UI-kit components for designing on-brand interfaces.
- **`references/isometric-editor/SKILL.md`** — a complete mental model of the
  Isometric Workflow Editor (`src/components/editor`): architecture, data model,
  scene/rendering, isometric & camera math, state/undo, edge routing, theming,
  the node catalog, and extension points. Load it before working on the
  `/isometric-editor` feature.

Load a skill by telling the agent to load it by name (e.g. "load the
isometric-editor skill") or via its slash command.
