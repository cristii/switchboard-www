# Switchboard — Build Plan

## Context
Switchboard AI Systems (Cristi Șatcovschi) — a freelancer selling AI chatbots and
workflow-automation services (n8n, Trigger.dev, and similar). This repo delivers, from
one TypeScript codebase:
1. a **design-system component library** documented in **Storybook**, published to
   **GitHub Pages**; and
2. a **Next.js** marketing site (landing page + Daily Log blog) deployed to **Vercel**,
   consuming that library and using **Supabase** for the newsletter signup.

Design language ("paper & ink": recycled-paper background with faint grid + grain,
pine-green ink outlines, one burnt-orange accent, hand-drawn underlines, HARD blur-free
offset shadows; Bricolage Grotesque / Inter / Caveat) and the starting components come
from the provided archive, preserved in `references/`.

## Source inputs (`references/`)
- `references/design-system/` — CSS tokens, self-hosted woff2 fonts, bespoke line-icon
  SVGs, ESM React primitives (Button, Eyebrow, HandUnderline, Card, Badge, Pill, Stat,
  ChatBubble, StickyNote), brand guidelines, and a `switchboard-design` skill manifest.
- `references/landing-page.html` — current landing page (**copy is out of date**).
- `references/blog-pages/` — Daily Log blog + other page exports; the newsletter signup
  ("Get the blueprint in your inbox") lives on the Daily Log page.

## Target structure (single project)
    app/                     # Next.js App Router (Phase 2)
      api/chat/route.ts      #   hero assistant -> Anthropic (server-side) + fallback
      api/newsletter/route.ts#   newsletter -> Supabase (Phase 3)
    src/components/ui/       # DESIGN SYSTEM library + *.stories.tsx (Phase 1)
    src/styles/              # ported tokens (colors/typography/spacing)
    src/lib/                 # supabase client, chat system prompt
    .storybook/              # Storybook config -> GitHub Pages
    public/assets/           # fonts, icons, grain, logo, mark
    references/              # preserved source inputs
    supabase/schema.sql      # subscribers table + RLS (Phase 3)
    .github/workflows/       # build + deploy Storybook to gh-pages

## Phases
### Phase 0 — Docs & sources (this step)
PLAN.md, AGENTS.md, small README.md; preserve uploads in `references/`; push.

### Phase 1 — Design system + Storybook (next)
- Scaffold the TS project (Next.js App Router) and add Storybook.
- Port tokens to `src/styles`; self-host fonts; copy icons to `public/assets`.
- Implement primitives from `references/design-system` as typed components, each with a
  story covering every variant.
- GitHub Actions workflow builds Storybook and deploys to **gh-pages**.
- Done when: Storybook runs locally and publishes to GitHub Pages.

### Phase 2 — Next.js app on Vercel
- Build the landing page **from `src/components/ui`**, **rewriting the stale copy** to lead
  with AI chatbots + n8n/Trigger.dev automation.
- Hero assistant: move the Anthropic call **server-side** (`app/api/chat`), with the
  scripted answers as offline fallback; never call the API from the browser.
- Daily Log blog page + a reusable post template.
- Done when: `next build` passes with **no** env vars; deploys to Vercel.

### Phase 3 — Supabase newsletter
- `app/api/newsletter` inserts into a `subscribers` table (server-side key).
- `supabase/schema.sql` (table + RLS) and `.env.example`.
- Graceful degradation when env is absent.
- Done when: with env set, emails persist and duplicates are handled.

## Key decisions
- TypeScript everywhere; Next.js App Router.
- Plain CSS with design tokens (no Tailwind) — faithful and easy to edit.
- Self-hosted fonts (no CDN); bespoke icons only (no icon library).
- Secrets server-only and lazily initialised so builds succeed without them.
- Latest Claude model for the assistant (e.g. `claude-sonnet-4-6`), env-configurable.

## Open items
- Final updated landing-page copy.
- Which extra archive pages to port (Services, Pricing, About, Contact, Calculator,
  Knowledge Base, Work, legal, 404).
- Whether to later extract the library into its own npm package / monorepo.
- npm scope/name for the library (e.g. `@switchboard/ui`).
