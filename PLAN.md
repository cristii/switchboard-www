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
- **2.0 Scaffold:** Next 14 + Tailwind (theme→CSS vars), `globals.css`, root layout (+ Vercel
  Analytics), `@/*` alias. Verify `next build` + `build-storybook` + `typecheck` green.
- **2.1 Shell & SEO:** `SiteHeader`, `SiteFooter` (from `Site Footer.dc.html`), metadata,
  brand-mark favicon, `not-found` (404). Add shared pieces to the library with stories.
- **2.2 Landing (`/`):** rebuild from components + Tailwind; **rewrite copy** (AI chatbots +
  n8n/Trigger.dev); scripted `ChatWidget` (client) ported from the landing `fallback()`;
  Cal.com booking CTAs.
- **2.3 Marketing:** `/services` `/pricing` `/process` `/about` `/contact` (contact form →
  `/api/lead` → n8n).
- **2.4 Utility:** `/calculator` (client compute), `/knowledge-base`, `/work` + `/work/[slug]`,
  `/privacy`, `/terms`.
- **2.5 Blog:** `/blog` + `/blog/[slug]` from `content/blog` MDX; Daily Log newsletter signup.
- Done when: `next build` passes with no env vars; deployed to Vercel.

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
