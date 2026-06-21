import { Button, Eyebrow, Section, StickyNote } from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";

const heading = "font-display font-extrabold tracking-tight";

/**
 * The shared "Loved this workflow?" hire-me band used across the Daily Log and
 * each blog post (ported from those sources).
 */
export function HireMeBand() {
  return (
    <Section tone="dark" py="60px">
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow tone="amber">Loved this workflow?</Eyebrow>
          <h2 className={`${heading} mt-[14px] max-w-[13em] text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.06] text-on-dark`}>
            Don&apos;t want to maintain it yourself?
          </h2>
          <p className="mb-[26px] mt-[18px] max-w-[34em] text-lead leading-[1.6] text-on-dark-strong">
            I build enterprise-grade automation infrastructure for teams so your engineers can focus
            on core product, production n8n pipelines, Trigger.dev jobs and custom AI chatbots, fully
            owned and documented.
          </p>
          <div className="flex flex-wrap gap-[14px]">
            <Button href="/services">Check out my freelance services</Button>
            <BookCall variant="light" arrow>
              Schedule a discovery call
            </BookCall>
          </div>
        </div>
        <div className="flex justify-end">
          <StickyNote title="What you'd get" rotate={2.5} style={{ maxWidth: 260 }}>
            <ul className="m-0 list-none p-0 text-[1.18rem] leading-[1.85]">
              <li>→ production-ready pipelines</li>
              <li>→ error handling baked in</li>
              <li>→ docs your team can read</li>
              <li>→ a 15-min sprint to scope it</li>
            </ul>
          </StickyNote>
        </div>
      </div>
    </Section>
  );
}

export default HireMeBand;
