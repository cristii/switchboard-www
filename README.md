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
