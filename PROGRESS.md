# Progress — Phase 1: Design system + Storybook

Living checklist so work can resume in a fresh session. Update + commit often.
See `PLAN.md` for the overall roadmap and `AGENTS.md` for conventions.

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
- ⬜ Eyebrow (Core)
- ⬜ HandUnderline (Core)
- ⬜ Badge (Core)
- ⬜ Pill (Core)
- ⬜ Card (Surfaces)
- ⬜ StickyNote (Surfaces)
- ⬜ Stat (Data)
- ⬜ ChatBubble (Chat)
- 🚧 `index.ts` barrel export (Button only so far)

## Foundation stories (`src/stories/foundations/`)
- ⬜ Colors (paper / ink / accent / supporting / tag tints)
- ⬜ Typography (display / body / hand + scale)
- ⬜ Spacing & Layout (8px scale, radii, borders)
- ⬜ Shadows (hard offset blocks)
- ⬜ Icons (the bespoke line-icon set)
- ⬜ Introduction (brand overview)

## Deploy
- ⬜ `.github/workflows/storybook.yml` — build + publish to `gh-pages` branch
- ⬜ **Manual one-time step (repo owner):** GitHub → Settings → Pages →
  Build and deployment → Source: **Deploy from a branch** → Branch: **gh-pages** `/(root)`
- ⬜ Confirm the Action run is green and the site renders at
  `https://cristii.github.io/switchboard-www/`

## Notes / decisions
- Single repo; Storybook uses the React+Vite builder (components are framework-agnostic
  React, so Next.js can import them directly in Phase 2).
- Assets referenced through the bundler (relative `url()` / glob), not `public/`, so they
  resolve under the gh-pages subpath.
- `Button` carries `"use client"` (it has hover handlers); the rest are presentational.

## Next (later phases)
- Phase 2: scaffold the Next.js app, build the landing page from these components
  (rewrite stale copy), server-side chatbot route.
- Phase 3: Supabase newsletter.
