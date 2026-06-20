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
- ⬜ 2.2 Landing `/` — sections + scripted `ChatWidget` + Cal.com CTAs.
- ⬜ 2.3 `/services` · ⬜ 2.4 `/pricing` · ⬜ 2.5 `/process` · ⬜ 2.6 `/about`
- ⬜ 2.7 `/contact` (n8n) · ⬜ 2.8 `/work` + `/work/[slug]` · ⬜ 2.9 `/calculator`
- ⬜ 2.10 `/knowledge-base` · ⬜ 2.11 `/blog` + `/blog/[slug]` (MDX) · ⬜ 2.12 `/privacy` + `/terms`

## Phase 2 notes / decisions
- `jsx` switched to `preserve` and `@/*` paths added for Next; `vite/client` types
  still load via `src/vite-env.d.ts`, so Storybook/Vite keep building.
- Tailwind scans only `src/app` + `src/components/sections` + `content` — never
  `src/components/ui`, which stays Tailwind-free (Storybook-safe).
- `next build` succeeds with **no env** (no secrets touched yet).

## Next (later phases)
- Phase 3: Supabase newsletter (`api/newsletter` → `subscribers`, wire Daily Log form).
