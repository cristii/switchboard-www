# Progress — Switchboard

Living checklist so work can resume in a fresh session. Update + commit often.
See `PLAN.md` for the overall roadmap and `AGENTS.md` for conventions.

**Phase 1 (design system + Storybook): ✅ done.** Phase 2 (Next.js app) in progress below.

## Goal
Implement the Switchboard design system from `references/design-system/` as a typed
React component library documented in **Storybook**, published to **GitHub Pages**.

## Status legend
✅ done · 🚧 in progress · ⬜ todo

## Scaffold
- ✅ `package.json` (React 18 + Storybook 8 + Vite + TS)
- ✅ `tsconfig.json`, `.gitignore`, `src/vite-env.d.ts`
- ✅ `.storybook/main.ts` (react-vite, relative base for gh-pages subpath)
- ✅ `.storybook/preview.tsx` (token CSS imports, paper canvas, backgrounds, sort)
- ✅ Brand assets copied to `src/assets/` (fonts, icons, grain, logo, mark)
- ✅ Tokens ported to `src/styles/` (colors, typography, spacing, fonts) + `global.css`
- ✅ Local `npm install` + `npm run build-storybook` verified green

## Components (`src/components/ui/`)
Ported from `references/design-system/components/`. Each gets a `.tsx` + `.stories.tsx`.
- ✅ Button (Core)
- ✅ Eyebrow (Core)
- ✅ HandUnderline (Core)
- ✅ Badge (Core)
- ✅ Pill (Core)
- ✅ Card (Surfaces)
- ✅ StickyNote (Surfaces)
- ✅ Stat (Data)
- ✅ ChatBubble (Chat)
- ✅ `index.ts` barrel export (all 9 components + prop types)

## Foundation stories (`src/stories/`)
- ✅ Colors (paper / ink / accent / supporting / tag tints)
- ✅ Typography (display / body / hand + scale)
- ✅ Spacing & Layout (8px scale, radii, borders)
- ✅ Shadows (hard offset blocks)
- ✅ Icons (the bespoke line-icon set, glob-imported + mask-tinted)
- ✅ Introduction (brand overview, MDX docs page)
- ✅ Production build verified to use relative asset paths (gh-pages subpath safe)

## Deploy
- ✅ `.github/workflows/storybook.yml` — build + publish to `gh-pages` branch
  (peaceiris/actions-gh-pages; runs on push to main + the working branch)
- ✅ First Action run green; `gh-pages` branch published (index.html / iframe.html
  verified HTTP 200 via raw.githubusercontent.com)
- ⬜ **Manual one-time step (repo owner):** GitHub → Settings → Pages →
  Build and deployment → Source: **Deploy from a branch** → Branch: **gh-pages** `/(root)`
- ⬜ Once Pages is enabled, the site is live at
  `https://cristii.github.io/switchboard-www/`

## Notes / decisions
- Single repo; Storybook uses the React+Vite builder (components are framework-agnostic
  React, so Next.js can import them directly in Phase 2).
- Assets referenced through the bundler (relative `url()` / glob), not `public/`, so they
  resolve under the gh-pages subpath.
- `Button` carries `"use client"` (it has hover handlers); the rest are presentational.

## Phase 2 — Next.js app (Vercel)
Build ONE unit at a time; after each is green (`next build` + `typecheck`, and
`build-storybook` stays green), commit, push, tick it off here. Port copy verbatim.

- ✅ **2.0 Scaffold** — Next 14 + React 18 (App Router, `@/*` alias); Tailwind theme
  mapped to the brand CSS-var tokens (`tailwind.config.ts`); `src/app/globals.css`
  (token imports → `@tailwind` layers → paper canvas); root `layout.tsx` with
  `<Analytics/>` + base metadata; minimal placeholder home using DS + Tailwind.
  Verified green: `next build`, `typecheck` (`tsc --noEmit`), `build-storybook`.
- ✅ **2.1 Shell & SEO** — `SiteHeader` + `SiteFooter` (`src/components/sections`,
  ported from the landing header + `Site Footer.dc.html`); shared nav map
  (`src/lib/nav.ts`); new library piece **`Logo`** (Tailwind-free, inherits colour,
  with a story); root metadata (Open Graph / Twitter / robots, env-driven
  `metadataBase`); brand-mark favicon (`src/app/icon.svg`); `not-found` from
  `404.dc.html` (broken-connection illustration). Added `on-dark` tint tokens
  (`colors.css` + Tailwind) for the footer. Green: `next build`, `typecheck`,
  `build-storybook`.
- ✅ **2.2 Landing `/`** — all sections ported verbatim from `landing-page.html`
  (hero, proof, audiences, services, sample builds, process, pricing, about, FAQ,
  footer CTA) via DS components + Tailwind. New library pieces (Tailwind-free, each
  with a story): `Section`, `Tick`, `ServiceCard`, `ProcessStep`, `PricingPlan`,
  `FaqItem`, `VideoPlaceholder`, `Portrait`. Scripted `ChatWidget` (client) +
  `src/lib/chat.ts` (the `fallback()` set, greeting, quick replies). `BookCall`
  CTA (Cal.com via `NEXT_PUBLIC_CALCOM_LINK`, falls back to `/contact`); header CTA
  now uses it. Smooth-scroll + anchor offset in `globals.css`. Green: `next build`,
  `typecheck`, `build-storybook`.
- ✅ **2.3 `/services`** — all sections ported verbatim from `Services.dc.html`
  (hero with rotating outcome line + floating outcome chips, dark testimonial +
  industries band, four capability **pillars** each with an input→processing→output
  flow diagram, the signature lead→booked flow, "why Switchboard", FAQ, final CTA).
  New library piece **`Icon`** (Tailwind-free, mask-tinted from `src/assets/icons`,
  `src` accepts a Vite URL string *or* a Next static import — works in both
  bundlers; with a story). New app-level client `RotatingText` (hero rotator,
  respects `prefers-reduced-motion`). Reused `Section` / `Eyebrow` / `HandUnderline`
  / `Badge` / `FaqItem` / `Button` + `BookCall`. Green: `next build`, `typecheck`,
  `build-storybook`.
- ✅ **2.4 `/pricing`** — ported verbatim from `Pricing.dc.html`: centered hero,
  audience pivot (3 `Card`s), the three-tier pricing table (`Card` `tone="sunken"`
  + the featured `Card` with the "Most Popular" `Badge`, lifted on desktop), a
  3-step "how it works" row, the dark risk-reversal guarantee, FAQ (`FaqItem`),
  and the final CTA. All booking CTAs go through `BookCall`; checks use `Icon`
  (green / orange). No new library pieces. Green: `next build`, `typecheck`,
  `build-storybook`.
- ✅ **2.5 `/process`** — ported from `Process.dc.html`: the five "built like a
  workflow" steps (Discover/Build/Test/Handoff/Maintain) as an alternating
  two-column layout — bespoke n8n-style **node** visuals (inline SVG glyphs:
  webhook, switch, error trigger, set+push with lock badge, schedule) beside the
  step copy + "what happens / the output" rows; step 5 carries the two retainer
  `Card`s (Tier 2 featured). Reused `Card` / `Eyebrow` / `HandUnderline` / `Icon`
  + `BookCall`. The heavy scroll-spy/packet animations were dropped (static port,
  per the 2.2/2.3 precedent); the one hover-dependent aside was reworded. No new
  library pieces. Green: `next build`, `typecheck`, `build-storybook`.
- ✅ **2.6 `/about`** — ported from `About.dc.html` (default "conversational"
  variant): hero with `Portrait` + "that's me" tag + fact chips, "off the clock"
  with a `StickyNote`, the four-step "how I work" `Card`s, the 3-card tech-stack
  matrix, the dark "inside Switchboard" builds grid, the GitHub side-projects grid
  (all → `socialLinks.github`), and the dark contact band (email / Telegram /
  LinkedIn / location from `src/lib/nav`). Reused `Card` / `StickyNote` / `Portrait`
  / `Eyebrow` / `HandUnderline` / `Icon` + `BookCall`. The operations-tone variant
  and scroll reveals were dropped. No new library pieces. Green: `next build`,
  `typecheck`, `build-storybook`.
- ✅ **2.7 `/contact`** — ported from `Contact.dc.html`: hero + two columns — the
  scripted **AI intake agent** (reused `ChatWidget`, now prop-driven via a
  `variant="intake"` persona in `src/lib/chat.ts`) and the **project-spec form**
  (`ContactForm`, client). The form validates name + email and POSTs to the new
  **`src/app/api/lead/route.ts`**, which forwards to `N8N_WEBHOOK_URL`
  (server-only, read at request time → builds with no env; degrades gracefully /
  502 on upstream error), then plays the "automation firing" success sequence.
  A server→client function prop isn't allowed, so `ChatWidget` selects its reply
  fn internally from `variant`. "Live AI" footer reworded to "scripted demo"
  (honest — AGENTS). `/api/lead` is the only dynamic route. Green: `next build`,
  `typecheck`, `build-storybook`.
- ✅ **2.8 `/work` + `/work/[slug]`** — ported from `Work.dc.html` + `Work Item.dc.html`.
  New data module `src/lib/work.ts` (9 automations in 3 groups; the full "Outreach
  System" case study — problem, 5 steps, sample email, outcome stats, "how it's
  wired" + code; the other 8 carry their list copy, no invented facts). `/work`:
  hero, dark proof `Stat` band, the three grouped card grids, closing CTA. `/work/[slug]`:
  `generateStaticParams` (all 9 prerendered) + `generateMetadata`, shared hero +
  "what it does" `Card`, the rich case-study sections when present, "more
  automations", CTA. Reused `Card`/`Badge`/`Stat`/`Pill`/`Icon`/`Eyebrow`/`HandUnderline`
  + `BookCall`; code block uses the default `font-mono` (no CDN). Green: `next build`,
  `typecheck`, `build-storybook`.
- ✅ **2.9 `/calculator`** — ported from `Calculator.dc.html`. New client component
  `src/components/sections/Calculator.tsx` ports the full compute model (executions
  log-slider, integration costs, AI usage — model/length/memory/tools, hosting
  tiers, complexity meter, live workflow nodes, breakdown + smart tip, presets,
  and a client-side text download). Thin server page with hero. Built from `Icon`
  + Tailwind; ranges use `accent-color`, code/cost figures use `font-mono` (no CDN);
  AI accent uses `var(--violet)`. Count-up animation dropped (values update
  directly). Green: `next build`, `typecheck`, `build-storybook`.
- ✅ **2.10 `/knowledge-base`** — ported from `Knowledge Base.dc.html` as a docs app.
  New `src/lib/kb.ts` models the content as typed blocks (5 rich "marquee" articles
  + 14 generated Overview/Key-points/Example) rendered with React — no raw HTML.
  New client `KnowledgeBase` section: grouped sidebar nav, the docs home (category
  cards + popular blueprints), article view (breadcrumb, `Badge` tier, lead, blocks,
  code cards, callouts, a tab switcher, artifact download, prev/next), and a working
  **⌘K search overlay** filtering the index. Built from `Badge` + `Icon` + Tailwind;
  code uses `font-mono`. The right-hand TOC + scrollspy and the mobile drawer were
  dropped (sidebar stacks on mobile). Green: `next build`, `typecheck`, `build-storybook`.
- ⬜ 2.11 `/blog` + `/blog/[slug]` (MDX) · ⬜ 2.12 `/privacy` + `/terms`

## Phase 2 notes / decisions
- `jsx` switched to `preserve` and `@/*` paths added for Next; `vite/client` types
  still load via `src/vite-env.d.ts`, so Storybook/Vite keep building.
- Tailwind scans only `src/app` + `src/components/sections` + `content` — never
  `src/components/ui`, which stays Tailwind-free (Storybook-safe).
- `next build` succeeds with **no env** (no secrets touched yet).
- `Icon` (DS) mask-tints an SVG from `src/assets/icons`; its `src` accepts both a
  Vite URL string (Storybook glob, `?url`) and a Next static-import object, so the
  one component works in both bundlers. Pages import the icon files directly and
  pass them in (e.g. `import sendIcon from "@/assets/icons/send.svg"`).

## Next (later phases)
- Phase 3: Supabase newsletter (`api/newsletter` → `subscribers`, wire Daily Log form).
