# AGENTS.md — Switchboard

Guidance for AI agents (Claude Code and others) working in this repository.

## What this repo is
Switchboard AI Systems is the brand of **Cristi Șatcovschi**, a freelancer selling
**AI chatbots and workflow-automation** services (n8n, Trigger.dev, and similar). From
one codebase the repo delivers:
1. a **design-system component library** (React + TypeScript) documented in **Storybook**
   and published to **GitHub Pages**; and
2. a **Next.js** marketing site (landing page + Daily Log blog) deployed to **Vercel**,
   consuming those components and using **Supabase** for the newsletter signup.

Roadmap: `PLAN.md`. Provided design sources: `references/` (design-system archive,
current landing page, blog pages).

## The golden rule: build from the design system
- **Always build UI from the component library** in `src/components/ui` (the same
  components shown in Storybook). Do **not** hand-roll bespoke styled markup in the app
  when a library component already covers it.
- **If a needed component or variant does not exist, add it to the library** with a
  Storybook story and TypeScript types, then consume it from the app — don't inline
  one-off components in `app/`. Extending the design system to fit the app is expected
  and encouraged; keep additions on-brand and reusable (props in, no data coupling).
- Every component variant is demonstrated by a story.

## Brand & design rules (do not break)
Warm **"paper & ink"** aesthetic (full detail in
`references/design-system/readme.md`):
- **Color:** recycled-paper backgrounds (`--paper #E9E8DF` + two darker steps), pine
  **ink** `#15211F` for text/borders, near-black `#11201E` dark bands, a single **burnt-
  orange accent** `#B45309`. Amber `#FBBF24` for eyebrows on dark; green `#3F7A4E` for
  success. Use **tokens**, not raw hexes, in app code.
- **Type:** **Bricolage Grotesque** (headings/UI, tight −0.02em, 700–800), **Inter**
  (body), **Caveat** (hand marginalia + the ↳ glyph). Self-hosted; no font CDN.
- **Shadows:** **HARD, zero-blur offset shadows** (solid ink/orange blocks). **Never add
  blur** — the most important and most easily-broken rule.
- **Borders/corners:** 1.5–2px solid ink outline on most surfaces; radii 9/14/18/20px.
- **Icons:** the bespoke line set in `references/design-system/assets/icons` (stroke
  ~1.7–1.8, round caps), tinted via CSS `mask`. **No third-party icon library.**
- **No emoji, ever.** No gradients as identity. Personality = Caveat, the ↳ glyph, and
  hand-drawn underlines.
- **Motion:** restrained; buttons lift on hover; respect `prefers-reduced-motion`.

## Voice & copy
- First-person singular ("I build it. You scale it."), direct, anti-fluff, warm.
- Sentence case for body/headings; UPPERCASE only for eyebrows/buttons/tags.
- Sell outcomes (leads, booked calls), not features. Honest numbers only — never invent
  statistics or name specific clients.
- **The landing copy in `references/landing-page.html` is out of date — rewrite it.**
  Lead with the real positioning: **AI chatbots + workflow automation on n8n,
  Trigger.dev and similar tools** (the Daily Log blog already reflects this).

## Tech & conventions
- **TypeScript** everywhere; Next.js **App Router**.
- **Plain CSS with design tokens** (no Tailwind). Tokens live in `src/styles` (ported
  from `references/design-system/tokens`).
- **Secrets are server-only** and lazily initialised so `next build` works with **no env
  vars**. Supabase **service-role** key and `ANTHROPIC_API_KEY` must never reach the
  client; public values use `NEXT_PUBLIC_*`. Update `.env.example` when adding vars.
- **Hero assistant:** call Anthropic from `app/api/chat` (server), never the browser;
  keep the scripted answers as offline fallback. Default to a current Claude model
  (e.g. `claude-sonnet-4-6`), env-configurable.
- **Newsletter:** POST to `app/api/newsletter`, insert into Supabase `subscribers`;
  degrade gracefully when Supabase env is absent.

## Deploy targets
- **Storybook → GitHub Pages** (the published component library).
- **Next.js app → Vercel.**

## Working agreements
- Develop on your assigned branch; clear commit messages; push. Don't commit secrets.
- Keep `PLAN.md` phases honest — check items off as they land.
- When you add or change a component, update its Storybook story.
- A `switchboard-design` skill manifest ships at
  `references/design-system/SKILL.md` and can be installed as a Claude Code skill.
