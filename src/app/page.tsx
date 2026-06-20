import { Button, Eyebrow } from "@/components/ui";

/**
 * Placeholder home for Phase 2.0 — confirms the Next.js + Tailwind scaffold
 * renders the brand canvas and consumes the Storybook design system. The real
 * landing page is built section-by-section in Phase 2.2 (see PLAN.md).
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center gap-5 px-gutter py-section text-center">
      <Eyebrow>Switchboard AI Systems</Eyebrow>

      <h1 className="font-display text-hero font-extrabold text-ink">
        Building, one section at a time.
      </h1>

      <p className="max-w-xl font-body text-lead text-ink-body">
        The scaffold is live: Next.js&nbsp;14 and Tailwind mapped to the brand tokens,
        consuming the design system from Storybook. Pages land next.
      </p>

      <Button href="https://cristii.github.io/switchboard-www/" arrow>
        View the design system
      </Button>
    </main>
  );
}
