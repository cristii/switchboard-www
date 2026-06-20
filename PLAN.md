# Switchboard — Build Plan

## Context
Switchboard AI Systems (Cristi Șatcovschi) — a freelancer selling AI chatbots and workflow
automation (n8n, Trigger.dev). From one TypeScript codebase:
1. a **design-system library** in **Storybook** → **GitHub Pages** (live); and
2. a **Next.js** marketing site (all pages) → **Vercel**, consuming the library, styled with
   **Tailwind** (theme mapped to the brand tokens), with an MDX blog, a Supabase newsletter,
   n8n lead forms, Cal.com booking, and a scripted hero chatbot.

Design language: warm "paper & ink" (see `references/design-system/readme.md`).

## Source inputs (`references/`)
- `design-system/` — tokens, fonts, icons, the primitives, brand guidelines, `SKILL.md`.
- `landing-page.html` — current landing page (copy out of date → rewrite).
- `blog-pages/` — Daily Log + all other page exports (the build sources for every route).

## Stack & architecture (decided)
- **Next 14 + React 18**, App Router (`src/app`), `@/*` alias.
- **Tailwind** for app layout/sections; theme mapped to brand **CSS variables** (source of
  truth = `src/styles`). `src/components/ui` stays **Tailwind-free** (Storybook-safe).
- **MDX blog** (`content/blog`) via `gray-matter` + `next-mdx-remote/rsc`.
- **Vercel Analytics**; secrets server-only + lazy.

## Target structure
    content/blog/*.mdx          blog posts (frontmatter)
    src/app/                    App Router: pages + api
      api/newsletter/route.ts     → Supabase `subscribers`
      api/lead/route.ts           → n8n webhook
      layout.tsx                  root: fonts, <Analytics/>
      globals.css                 @tailwind layers + token imports
      (one folder per route below)
    src/components/ui/          design-system library (+ stories) — shared, Tailwind-free
    src/components/sections/    app-only section components (Tailwind)
    src/styles/                 tokens + paper canvas (source of truth)
    src/lib/                    supabase client, scripted chat answers, cal config
    tailwind.config.ts          theme → CSS vars; postcss.config.js
    supabase/schema.sql         subscribers + RLS
    .storybook/                 Storybook → gh-pages

## Phases
### Phase 0 ✅ — Docs & sources
### Phase 1 ✅ — Design system + Storybook (live on GitHub Pages)
### Phase 2 — Next.js app (Vercel)
**Workflow: build ONE unit at a time. After each builds green (`next build` + `typecheck`),
commit and push before starting the next, and tick it off in `PROGRESS.md`.** Rebuild each page
from its `references/` source using `src/components/ui` + Tailwind; rewrite stale copy; add any
new reusable component to the **library with a story** first. Icons: reuse the bespoke set
(`src/assets/icons`) + the inline SVGs already in the source pages — broader coverage (Lucide) is
backlogged, see `BACKLOG.md`.

- **2.0 Scaffold** — Next 14 + Tailwind (theme → CSS vars), `globals.css`, root `layout.tsx`
  (+ `<Analytics/>`), `@/*` alias, minimal placeholder home. Verify `next build` +
  `build-storybook` + `typecheck`. → **push**
- **2.1 Shell & SEO** — `SiteHeader`, `SiteFooter` (`Site Footer.dc.html`), `metadata`,
  brand-mark favicon, `not-found` (`404.dc.html`). New library pieces get stories. → **push**
- **2.2 Landing `/`** (`landing-page.html`) — all sections via DS components + Tailwind;
  **rewrite copy** (AI chatbots + n8n/Trigger.dev); scripted `ChatWidget` (client) ported from the
  landing `fallback()`; Cal.com CTAs. Add `Section`, `Tick`, `ServiceCard`, `ProcessStep`,
  `PricingPlan`, `FaqItem`, `VideoPlaceholder`, `Portrait` to the library as needed. → **push**
- **2.3 `/services`** (`Services.dc.html`). → **push**
- **2.4 `/pricing`** (`Pricing.dc.html`) — reuse `Card`(featured)/`Badge`. → **push**
- **2.5 `/process`** (`Process.dc.html`). → **push**
- **2.6 `/about`** (`About.dc.html`) — reuse `StickyNote`/`Stat`; refresh tech stack. → **push**
- **2.7 `/contact`** (`Contact.dc.html`) — form → `src/app/api/lead/route.ts` → `N8N_WEBHOOK_URL`
  (lazy, graceful). → **push**
- **2.8 `/work` + `/work/[slug]`** (`Work.dc.html`, `Work Item.dc.html`). → **push**
- **2.9 `/calculator`** (`Calculator.dc.html`) — client-side compute. → **push**
- **2.10 `/knowledge-base`** (`Knowledge Base.dc.html`) — client filter/search. → **push**
- **2.11 `/blog` + `/blog/[slug]`** (`The Daily Log.dc.html`, `Blog Post.dc.html`) — MDX from
  `content/blog` (`gray-matter` + `next-mdx-remote/rsc`); Daily Log newsletter signup UI (wired in
  Phase 3). → **push**
- **2.12 `/privacy` + `/terms`** (`Privacy Policy.dc.html`, `Terms of Service.dc.html`). → **push**
- Done when: every route builds; `next build` passes with no env; deployed to Vercel.

### Phase 3 — Supabase newsletter
- `api/newsletter` → `subscribers` (service-role, lazy); `supabase/schema.sql`; wire the Daily
  Log form (success / duplicate / error); graceful degradation with no env.

## Routes → sources
(Same table as `AGENTS.md` → "Pages to build".)

## Env vars
| var | used by | notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | newsletter | URL+anon public, service-role secret |
| `N8N_WEBHOOK_URL` | contact/lead forms | secret |
| `NEXT_PUBLIC_CALCOM_LINK` | booking | public |

## Key decisions
- Next 14 + React 18 (match Storybook 8 / React 18).
- Tailwind (app) + bespoke DS (components, Tailwind-free); tokens single-sourced via CSS vars.
- Scripted chatbot now (Claude server route = future upgrade).
- All pages in scope · MDX blog · Cal.com booking · n8n lead forms · Supabase newsletter ·
  Vercel Analytics.

## Open items
- Final copy (Cristi). Real env values: Cal.com link, n8n webhook URL, Supabase creds.
- Optional later: upgrade chatbot to Claude; `@tailwindcss/typography` for blog prose;
  Next 15 / React 19 bump.
- **Backlog:** see `BACKLOG.md` (e.g., Lucide icon library — deferred).
