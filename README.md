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
