import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Eyebrow, HandUnderline, Icon, Pill, Section, Stat } from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { workGroups, workItems, type WorkItem } from "@/lib/work";

import checkIcon from "@/assets/icons/check.svg";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected automations I've built and run for small businesses, lead capture, instant replies, onboarding, reviews and content, working quietly in the background.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <div className="flex flex-col rounded border border-ink bg-white p-[22px] shadow-card">
      <span className="inline-flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[11px] border border-ink bg-tint-amber-bg">
        <Icon src={item.icon} color="var(--orange)" size={24} />
      </span>
      <h3 className={`${display} mt-[15px] text-[1.22rem] font-bold tracking-[-.01em]`}>
        {item.title}
      </h3>
      <p className="mt-2 text-[.95rem] leading-[1.5] text-ink-soft">{item.blurb}</p>
      <div className="mt-[14px] flex items-start gap-[9px]">
        <Icon src={checkIcon} color="var(--orange)" size={18} style={{ marginTop: 2 }} />
        <span className="text-[.96rem] font-semibold text-ink">{item.outcome}</span>
      </div>
      <div className="mt-auto pt-4">
        <span className={`${display} text-[.62rem] font-semibold uppercase tracking-[.14em] text-ink-soft`}>
          Built with
        </span>
        <div className="mt-[9px] flex flex-wrap gap-[6px]">
          {item.builtWith.map((b) => (
            <Badge key={b.label} variant={b.variant}>
              {b.label}
            </Badge>
          ))}
        </div>
      </div>
      <Link
        href={`/work/${item.slug}`}
        className={`${display} mt-4 inline-flex items-center gap-[6px] self-start border-b-2 border-orange pb-[2px] text-[.78rem] font-bold uppercase tracking-[.02em] text-orange no-underline`}
      >
        See the build →
      </Link>
    </div>
  );
}

export default function WorkPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="48px">
        <Eyebrow>Selected work</Eyebrow>
        <h1 className={`${heading} mt-3 max-w-[15em] text-hero text-ink`}>
          Automations that do the boring work, {" "}
          <span className="text-orange">
            <HandUnderline>so you don&apos;t.</HandUnderline>
          </span>
        </h1>
        <p className="mb-4 mt-[22px] max-w-[40em] text-lead text-ink-body">
          Every project below is a system I&apos;ve built and run for small businesses. They work
          quietly in the background, bringing in leads, answering people instantly, and cutting out
          the copy-paste. Find the one that sounds like your bottleneck.
        </p>
        <p className="m-0 font-hand text-[1.3rem] text-ink">
          ↳ not technical? just read the <b>bold line</b> on each card, that&apos;s what it does for
          your business.
        </p>
      </Section>

      {/* ============ PROOF BAND ============ */}
      <Section tone="dark" py="40px" style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          <Stat onDark value="24/7" label="Your systems keep working long after you've logged off" />
          <Stat onDark value="<1 min" label="From a new lead landing to their first personal reply" />
          <Stat onDark value="0" label="Hours lost to manual copy-paste once it's set up" />
        </div>
      </Section>

      {/* ============ GROUPS ============ */}
      <Section py="58px">
        {workGroups.map((group, gi) => (
          <div key={group.id} className={gi > 0 ? "mt-[54px]" : ""}>
            <div className="mb-6">
              <Eyebrow>{group.eyebrow}</Eyebrow>
              <h2 className={`${heading} mb-[6px] mt-3 text-[clamp(1.6rem,2.6vw,2.1rem)]`}>
                {group.title}
              </h2>
              <p className="m-0 max-w-[40em] text-base text-ink-soft">{group.desc}</p>
            </div>
            <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {workItems
                .filter((w) => w.group === group.id)
                .map((item) => (
                  <WorkCard key={item.slug} item={item} />
                ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ============ CLOSING CTA ============ */}
      <Section tone="ink" py="58px" style={{ borderTop: "1.5px solid #000" }}>
        <div className="flex flex-wrap items-center justify-between gap-9">
          <div className="max-w-[34em]">
            <Eyebrow tone="amber">Not sure which one you need?</Eyebrow>
            <h2 className={`${heading} mt-[14px] text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.06] text-on-dark`}>
              Tell me where you&apos;re losing time or leads.
            </h2>
            <p className="mt-4 text-lead leading-[1.6] text-on-dark-strong">
              I&apos;ll build a working demo of the right automation, on your own site, for free,
              before you decide anything. No deck, no jargon, just the thing running.
            </p>
            <div className="mt-[18px] flex flex-wrap items-center gap-[10px]">
              <Pill onDark active>
                Your bottleneck
              </Pill>
              <span className="text-orange">→</span>
              <Pill onDark>A free demo</Pill>
              <span className="text-orange">→</span>
              <Pill onDark>A system that runs</Pill>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <BookCall arrow>Start with a free demo</BookCall>
            <BookCall variant="light" arrow>
              Book a 15-min call
            </BookCall>
          </div>
        </div>
      </Section>
    </>
  );
}
