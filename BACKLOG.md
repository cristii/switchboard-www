# Backlog — deferred ideas

Not scheduled. Promote an item into `PLAN.md` when it's picked up.

## Icon library — Lucide (`lucide-react`)
**Deferred.** The bespoke set is only 18 icons; a full multi-page site will want more. The
bespoke SVGs are already Lucide/Feather-style (24×24, `currentColor`, round caps, ~1.8 stroke),
so **Lucide** is an exact visual match — tree-shakeable, TS-typed, shadcn's default, and the
maintained successor to Feather (286, unmaintained). 1,655 icons.

If/when adopted:
- Add `lucide-react` to **dependencies** (shared by Storybook + Next).
- Brand wrapper `src/components/ui/Icon.tsx` enforcing brand defaults (lucide-react has no global
  config provider); export from `src/components/ui/index.ts`. Tailwind-free → Storybook-safe;
  tints via `currentColor`.
      export interface IconProps extends LucideProps { as: LucideIcon }
      export function Icon({ as: As, size = 18, strokeWidth = 1.8, ...rest }: IconProps) {
        return <As size={size} strokeWidth={strokeWidth} {...rest} />;
      }
- Stories: `src/components/ui/Icon.stories.tsx` (curated set, ink + orange) and a `Button`
  `WithIcon` story — `Button` already accepts `icon`/`iconRight` nodes.
- Amend the `AGENTS.md` "Icons" rule (currently "No third-party icon library") to allow Lucide
  via the wrapper; keep the bespoke SVGs for their spots; no emoji.
- Verify `build-storybook` + `typecheck`; push.

## Mobile nav menu (hamburger)
**Deferred.** `SiteHeader` hides the primary nav below `md` (matching the reference exports,
which do the same), leaving only the logo + booking CTA on small screens. Add a proper mobile
menu — a hamburger toggling a sheet/drawer with the `primaryNav` links (and likely the footer
sections) — as a client component. Respect `prefers-reduced-motion`; trap focus; close on route
change.

## Cal.com — inline modal embed
**Deferred.** `BookCall` (`src/components/sections/BookCall.tsx`) currently opens the Cal.com
booking page in a new tab via `NEXT_PUBLIC_CALCOM_LINK` (falling back to `/contact` when unset).
Upgrade to the inline modal embed with `@calcom/embed-react` (`getCalApi` + `data-cal-link`) for
an on-page popup, keeping the new-tab/`/contact` path as the no-JS / no-env fallback.

## Sample-build video embeds
**Deferred.** `VideoPlaceholder` is a static poster. When real footage exists, wire the play
disc to a real embed (YouTube/Vimeo/MP4 lightbox), and use it for `/work` walkthroughs too.

## Copy rewrite — site-wide
**Deferred (do not rewrite copy now).** For Phase 2, port the existing copy from each source file
verbatim. Later, rewrite the marketing copy around AI chatbots + workflow automation on
n8n/Trigger.dev (the Daily Log blog already reflects this), and refresh the About "tech stack"
(drop stale items; lead with n8n, Trigger.dev + the build stack). Keep the brand voice
(first-person, anti-fluff, no emoji); honest numbers only. Cristi finalizes wording.
