import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Card, Eyebrow, HandUnderline, Icon, Section, Stat } from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { categoryFor, getWorkItem, workItems } from "@/lib/work";

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

export function generateStaticParams() {
  return workItems.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getWorkItem(params.slug);
  if (!item) return {};
  return { title: item.title, description: item.blurb };
}

export default function WorkItemPage({ params }: { params: { slug: string } }) {
  const item = getWorkItem(params.slug);
  if (!item) notFound();

  const cs = item.caseStudy;
  const others = workItems.filter((w) => w.slug !== item.slug).slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <Section py="46px">
        <Link
          href="/work"
          className={`${display} mb-[22px] inline-flex items-center gap-[7px] text-[.78rem] font-bold uppercase tracking-[.04em] text-ink-soft no-underline`}
        >
          ← Back to work
        </Link>
        <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Eyebrow>Work · {categoryFor(item.group)}</Eyebrow>
            <h1 className={`${heading} mt-3 text-[clamp(2.3rem,4.6vw,3.6rem)] leading-[1.04]`}>
              {item.title}
            </h1>
            <p className="mt-5 max-w-[30em] text-[1.18rem] leading-[1.55] text-ink-body">
              {cs ? (
                <>
                  {cs.lead.pre}{" "}
                  <span className="text-orange">
                    <HandUnderline>{cs.lead.hand}</HandUnderline>
                  </span>
                </>
              ) : (
                item.blurb
              )}
            </p>
            <div className="mt-[22px] flex flex-wrap gap-[7px]">
              {item.builtWith.map((b) => (
                <Badge key={b.label} variant={b.variant}>
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>
          <Card tone="paper" featured>
            <span className={`${display} text-[.64rem] font-bold uppercase tracking-[.14em] text-orange`}>
              What it does for you
            </span>
            <p className={`${display} mt-3 text-[1.3rem] font-bold leading-[1.22] tracking-[-.01em] text-ink`}>
              {cs?.whatItDoes ?? item.outcome}
            </p>
          </Card>
        </div>
      </Section>

      {cs && (
        <>
          {/* ============ PROBLEM ============ */}
          <Section width="760px" py="24px">
            <Eyebrow>The problem</Eyebrow>
            <h2 className={`${heading} mt-3 text-[clamp(1.5rem,2.6vw,2rem)]`}>{cs.problem.title}</h2>
            <p className="mt-4 text-[1.1rem] leading-[1.7] text-ink-body">{cs.problem.body}</p>
          </Section>

          {/* ============ HOW IT WORKS ============ */}
          <Section
            tone="alt"
            style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
            py="54px"
          >
            <Eyebrow>How it works</Eyebrow>
            <h2 className={`${heading} mb-7 mt-3 max-w-[18em] text-[clamp(1.5rem,2.6vw,2rem)]`}>
              {cs.stepsIntro}
            </h2>
            <div className="grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(195px,1fr))]">
              {cs.steps.map((s) => (
                <Card key={s.n} tone="white" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="flex items-center justify-between">
                    <span className={`${display} text-[1.5rem] font-extrabold leading-none text-orange`}>
                      {s.n}
                    </span>
                    <span className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] border border-ink bg-tint-amber-bg">
                      <Icon src={s.icon} color="var(--orange)" size={18} />
                    </span>
                  </div>
                  <h3 className={`${display} mt-[13px] text-[1.05rem] font-bold`}>{s.title}</h3>
                  <p className="mt-[6px] text-[.9rem] leading-[1.5] text-ink-soft">{s.body}</p>
                </Card>
              ))}
            </div>
          </Section>

          {/* ============ WHAT GOES OUT ============ */}
          <Section py="58px">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <Eyebrow>What actually goes out</Eyebrow>
                <h2 className={`${heading} mt-3 max-w-[13em] text-[clamp(1.5rem,2.6vw,2rem)]`}>
                  {cs.email.intro}
                </h2>
                <p className="mt-4 text-[1.05rem] leading-[1.65] text-ink-body">{cs.email.note}</p>
                <p className="mt-[18px] font-hand text-[1.35rem] text-ink">{cs.email.aside}</p>
              </div>
              <Card tone="white">
                <div className="mb-[14px] border-b border-line pb-3">
                  <div className="flex justify-between text-[.82rem] text-ink-soft">
                    <span className={`${display} font-bold text-ink`}>{cs.email.from}</span>
                    <span>{cs.email.time}</span>
                  </div>
                  <div className="mt-[6px] text-[.92rem] text-ink">
                    <span className="text-ink-soft">Subject:</span> {cs.email.subject}
                  </div>
                </div>
                <div className="text-[.96rem] leading-[1.6] text-ink-body">
                  <p className="m-0 inline-block rounded-[6px] bg-tint-amber-bg px-[9px] py-[7px]">
                    {cs.email.highlight}
                  </p>
                  {cs.email.body.map((para, i) => (
                    <p key={i} className="mt-3">
                      {para}
                    </p>
                  ))}
                </div>
              </Card>
            </div>
          </Section>

          {/* ============ OUTCOME ============ */}
          <Section tone="dark" py="48px" style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}>
            <Eyebrow tone="amber">The outcome</Eyebrow>
            <h2 className={`${heading} mb-7 mt-3 max-w-[16em] text-[clamp(1.5rem,2.6vw,2rem)] text-on-dark`}>
              {cs.outcomeTitle}
            </h2>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
              {cs.outcomeStats.map((s) => (
                <Stat key={s.label} onDark value={s.value} label={s.label} />
              ))}
            </div>
          </Section>

          {/* ============ TECHNICAL ============ */}
          <Section width="880px" py="56px">
            <Eyebrow>For the technical folks</Eyebrow>
            <h2 className={`${heading} mt-3 text-[clamp(1.5rem,2.6vw,2rem)]`}>How it&apos;s wired</h2>
            <p className="mt-4 text-[1.05rem] leading-[1.7] text-ink-body">{cs.technical.body}</p>
            <div className="mt-[22px] overflow-hidden rounded-[10px] border border-ink shadow-card">
              <div className="flex items-center gap-[7px] border-b border-[#14161b] bg-[#21252b] px-[13px] py-[9px]">
                <span className="h-[11px] w-[11px] rounded-full bg-[#e06c75]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#e5c07b]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#98c379]" />
                <span className="ml-2 font-mono text-[.72rem] text-[#9da5b4]">{cs.technical.codeName}</span>
              </div>
              <pre className="m-0 overflow-x-auto bg-[#282c34] px-[18px] py-4 font-mono text-[.83rem] leading-[1.75] text-[#abb2bf]">
                {cs.technical.code}
              </pre>
            </div>
          </Section>
        </>
      )}

      {/* ============ MORE AUTOMATIONS ============ */}
      <Section
        tone="alt"
        py="52px"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
      >
        <Eyebrow>Keep exploring</Eyebrow>
        <h2 className={`${heading} mb-[26px] mt-3 text-[clamp(1.5rem,2.4vw,2rem)]`}>More automations</h2>
        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {others.map((o) => (
            <Link key={o.slug} href={`/work/${o.slug}`} className="block text-ink no-underline">
              <Card tone="white" style={{ height: "100%" }}>
                <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-ink bg-tint-amber-bg">
                  <Icon src={o.icon} color="var(--orange)" size={20} />
                </span>
                <h3 className={`${display} mt-[11px] text-[1.1rem] font-bold leading-[1.2]`}>{o.title}</h3>
                <p className="mt-[6px] text-[.9rem] leading-[1.45] text-ink-soft">{o.outcome}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <Section tone="ink" py="56px" style={{ borderTop: "1.5px solid #000" }}>
        <div className="flex flex-wrap items-center justify-between gap-9">
          <div className="max-w-[32em]">
            <Eyebrow tone="amber">Want one aimed at your market?</Eyebrow>
            <h2 className={`${heading} mt-[14px] text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.07] text-on-dark`}>
              Tell me who your best customer is.
            </h2>
            <p className="mt-4 text-lead leading-[1.6] text-on-dark-strong">
              I&apos;ll build a working slice of this — real businesses, real results — and show it
              to you before you commit to anything. Free.
            </p>
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
