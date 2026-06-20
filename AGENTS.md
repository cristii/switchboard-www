# AGENTS.md — Switchboard

Guidance for AI agents (Claude Code and others) working in this repository.

## What this repo is
Switchboard AI Systems is the brand of **Cristi Șatcovschi**, a freelancer selling **AI
chatbots and workflow automation** (n8n, Trigger.dev, similar). One codebase, two deploy
targets:
1. a **design-system component library** (React + TypeScript) in **Storybook** → **GitHub
   Pages** (live: https://cristii.github.io/switchboard-www/);
2. a **Next.js** marketing site (all pages below) → **Vercel**, consuming that library.

Roadmap: `PLAN.md`. Live status: `PROGRESS.md`. Design sources: `references/`.

## The golden rule: build from the design system
- Build UI from `src/components/ui` (the components shown in Storybook). Don't hand-roll
  branded markup the library already covers.
- If a component/variant is missing, **add it to the library with a story** (typed, on-brand,
  reusable — props in, no data coupling), then consume it.

## Tech & conventions (decided)
- **Next.js 14 + React 18**, App Router under `src/app`. Path alias `@/* → ./src/*`.
- **Styling = Tailwind (app) + the bespoke design system (components):**
  - Tailwind for **app layout and page sections** (`src/app`, `src/components/sections`).
  - The Tailwind theme is mapped to the **brand CSS variables** — single source of truth in
    `src/styles` — e.g. `colors.ink: "var(--ink)"`, `boxShadow.card: "var(--shadow-card)"`,
    `fontFamily.display: "var(--font-display)"`, `borderRadius.lg: "var(--r-lg)"`. Use brand
    classes (`bg-paper text-ink font-display shadow-card rounded-lg`) — never raw hex.
  - **`src/components/ui` MUST stay Tailwind-free** (inline styles + CSS-var tokens) so
    Storybook keeps building without Tailwind. Tailwind lives only in the Next app.
- **TypeScript** everywhere. Plain CSS tokens in `src/styles` are the source of truth;
  Tailwind mirrors them via CSS vars (no duplicated values).
- **Secrets are server-only** and lazily initialised so `next build` works with **no env**.
  Public values use `NEXT_PUBLIC_*`. Update `.env.example` when adding vars.
- `npm run build` = `next build` (Vercel). The GitHub Action calls `build-storybook` (gh-pages).

## Feature decisions
- **Hero chatbot — scripted only (for now).** A client `ChatWidget` with the canned Q&A
  ported from `references/landing-page.html` (its `fallback()` set). No AI backend, no
  `ANTHROPIC_API_KEY`. (Future option: `src/app/api/chat` → Claude server-side, keeping the
  scripted set as fallback.)
- **Booking — Cal.com.** "Book a 15-min call" CTAs open a Cal.com embed/popup using
  `NEXT_PUBLIC_CALCOM_LINK`.
- **Forms/leads — n8n.** Contact + lead forms POST to `src/app/api/lead/route.ts`, which
  forwards to `N8N_WEBHOOK_URL` (server-only). Validate input; degrade gracefully if absent.
- **Newsletter — Supabase.** The Daily Log signup posts to `src/app/api/newsletter/route.ts`
  → `subscribers` table (service-role key, lazy). Schema in `supabase/schema.sql`.
- **Blog — MDX in repo.** Posts in `content/blog/*.mdx` (frontmatter: title, date, tags,
  excerpt). Parse with `gray-matter`, render with `next-mdx-remote/rsc`. `/blog` lists,
  `/blog/[slug]` renders.
- **Analytics — Vercel Analytics.** `<Analytics/>` from `@vercel/analytics/react` in the root
  layout.

## Pages to build (all) — rebuild from `references/` with DS components + Tailwind; rewrite stale copy
| Route | Source (`references/…`) |
|---|---|
| `/` | `landing-page.html` |
| `/services` | `blog-pages/Services.dc.html` |
| `/pricing` | `blog-pages/Pricing.dc.html` |
| `/process` | `blog-pages/Process.dc.html` |
| `/about` | `blog-pages/About.dc.html` |
| `/contact` | `blog-pages/Contact.dc.html` (form → n8n) |
| `/work`, `/work/[slug]` | `blog-pages/Work.dc.html`, `Work Item.dc.html` |
| `/calculator` | `blog-pages/Calculator.dc.html` (client-side compute) |
| `/knowledge-base` | `blog-pages/Knowledge Base.dc.html` |
| `/blog`, `/blog/[slug]` | `blog-pages/The Daily Log.dc.html`, `Blog Post.dc.html` (MDX) |
| `/privacy`, `/terms` | `blog-pages/Privacy Policy.dc.html`, `Terms of Service.dc.html` |
| `not-found` (404) | `blog-pages/404.dc.html` |
| shared header / footer | landing header · `blog-pages/Site Footer.dc.html` |

## Brand & design rules (do not break)
Warm **"paper & ink"** aesthetic (full detail in `references/design-system/readme.md`):
- **Color:** recycled-paper backgrounds (`--paper` + two darker steps), pine **ink**
  `#15211F`, near-black `#11201E` dark bands, one **burnt-orange accent** `#B45309`; amber
  for eyebrows on dark, green for success. Use **tokens**, not raw hex.
- **Type:** Bricolage Grotesque (headings/UI), Inter (body), Caveat (hand + the ↳ glyph).
  Self-hosted, no CDN.
- **Shadows:** HARD, zero-blur offset blocks. **Never add blur** — the most easily-broken rule.
- **Borders/corners:** 1.5–2px solid ink outline; radii 9/14/18/20px.
- **Icons:** the bespoke line set in `src/assets/icons` (mask-tinted). **No third-party icon
  library. No emoji, ever.** No gradients as identity. Restrained motion; respect
  `prefers-reduced-motion`.

## Voice & copy
First-person singular, direct, anti-fluff, warm. Sentence case for body/headings; UPPERCASE
only for eyebrows/buttons/tags. Sell outcomes (leads, booked calls). Honest numbers only —
never invent stats or name clients. **The landing copy in `references/landing-page.html` is
out of date — rewrite it around AI chatbots + workflow automation on n8n/Trigger.dev**, and
refresh the About "tech stack" (drop stale items; lead with n8n, Trigger.dev + the build
stack: Next.js, Supabase, Claude/OpenAI).

## Env vars (server-only unless NEXT_PUBLIC_)
| var | used by | notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | newsletter | public |
| `SUPABASE_SERVICE_ROLE_KEY` | api/newsletter | secret, server only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | future client use | public |
| `N8N_WEBHOOK_URL` | api/lead | secret, server only |
| `NEXT_PUBLIC_CALCOM_LINK` | booking embed | public, e.g. `switchboard/15min` |

## Working agreements
- Develop on your assigned branch; clear commits; push often. Don't commit secrets.
- Keep `PROGRESS.md` honest; update a component's story when you add/change it.
- A `switchboard-design` skill manifest ships at `references/design-system/SKILL.md`.
