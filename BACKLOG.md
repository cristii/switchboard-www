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
