import type { Metadata } from "next";
import * as React from "react";

import {
  Card,
  Eyebrow,
  HandUnderline,
  Icon,
  Portrait,
  Section,
  StickyNote,
  type IconSource,
} from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { BucharestBand } from "@/components/sections/BucharestBand";
import { SnowboardBand } from "@/components/sections/SnowboardBand";
import { socialLinks } from "@/lib/nav";

import assistantIcon from "@/assets/icons/assistant.svg";
import chartIcon from "@/assets/icons/chart.svg";
import funnelIcon from "@/assets/icons/funnel.svg";
import lightbulbIcon from "@/assets/icons/lightbulb.svg";
import mailIcon from "@/assets/icons/mail.svg";
import peopleIcon from "@/assets/icons/people.svg";
import refreshIcon from "@/assets/icons/refresh.svg";
import sendIcon from "@/assets/icons/send.svg";
import targetIcon from "@/assets/icons/target.svg";
import workflowIcon from "@/assets/icons/workflow.svg";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cristi Șatcovschi, automation engineer and workflow architect in Bucharest. I wire your tools into seamless, AI-powered systems with n8n, Trigger.dev, Python and Node.js.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

const pin = (color: string) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const codeGlyph = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 8 5 12l4 4" />
    <path d="M15 8l4 4-4 4" />
  </svg>
);

const linkedinGlyph = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7 10v7" />
    <path d="M7 7v.01" />
    <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
    <path d="M11 17v-7" />
  </svg>
);

/* ---------- Data (copy ported verbatim, conversational variant) ---------- */

const howIWork: { n: string; icon: IconSource; title: string; body: string }[] = [
  {
    n: "01",
    icon: targetIcon,
    title: "Workflow audit",
    body: "We map your current tools and find exactly where time, leads and money are leaking out.",
  },
  {
    n: "02",
    icon: lightbulbIcon,
    title: "Architecture & design",
    body: "I design the pipeline before writing a line, nodes, fallbacks and integrations, mapped end to end.",
  },
  {
    n: "03",
    icon: refreshIcon,
    title: "Build & test",
    body: "I build layer by layer, then feed it bad data and dropped connections on purpose, so the live version doesn't flinch.",
  },
  {
    n: "04",
    icon: peopleIcon,
    title: "Handoff & maintenance",
    body: "I hand you the keys with clear docs, then keep it tuned as your tools and volume change.",
  },
];

type StackCard = { icon: React.ReactNode; title: string; tags: string[]; body: string };
const stack: StackCard[] = [
  {
    icon: <Icon src={workflowIcon} color="var(--orange)" size={22} />,
    title: "Orchestration",
    tags: ["n8n", "Trigger.dev", "Zapier / Make"],
    body: "The backbone, long-running, fault-tolerant workflows that route and retry on their own.",
  },
  {
    icon: codeGlyph,
    title: "Languages",
    tags: ["Python", "Node.js", "TypeScript"],
    body: "Custom scripts for the logic no off-the-shelf node covers, error handling included.",
  },
  {
    icon: <Icon src={assistantIcon} color="var(--orange)" size={22} />,
    title: "AI ecosystem",
    tags: ["OpenAI API", "LangChain", "Pinecone", "Chroma"],
    body: "Context-aware assistants and RAG agents grounded in your own data, not made-up answers.",
  },
];

interface BuildCard {
  n: string;
  icon: IconSource;
  title: string;
  body: React.ReactNode;
  channels?: string[];
}
const builds: BuildCard[] = [
  {
    n: "01",
    icon: assistantIcon,
    title: "n8n Chatbot Factory",
    body: "A modular n8n “factory” that spins up reusable chatbots across channels. Shared nodes handle routing, memory and message processing; channel nodes handle delivery. A lead-gen variant qualifies users and pushes them into sales funnels.",
    channels: ["Instagram", "WhatsApp", "Telegram", "Facebook", "Web chat"],
  },
  {
    n: "02",
    icon: chartIcon,
    title: "Freelancer Billing System",
    body: (
      <>
        Generates invoices across three service tiers, <b className="text-amber">$800</b>,{" "}
        <b className="text-amber">$1,500</b> and <b className="text-amber">$4,000</b>, applying the
        right rules for each: upfront percentages, milestone billing and optional retainers. Tracks
        payments, outstanding balances and hourly support time automatically.
      </>
    ),
  },
  {
    n: "03",
    icon: peopleIcon,
    title: "Client Onboarding",
    body: "Fires the moment a new client is added: builds a structured Google Drive folder with project files, agreements and working docs, then logs the client in a tracking sheet for progress, payments and status updates.",
  },
  {
    n: "04",
    icon: funnelIcon,
    title: "Transcript → Project Builder",
    body: "Turns raw meeting transcripts into structured project data, extracting tasks, requirements and deliverables, then generating the matching Drive folders, task lists and documentation. Client calls become project plans with zero manual planning.",
  },
  {
    n: "05",
    icon: targetIcon,
    title: "Referral Chatbot, Scout + Lead",
    body: "Manages referral-based lead gen: users submit potential clients after first contact, each referral moves through a tracked pipeline, and scouts get live updates on lead progress and conversions.",
  },
];

const repos = [
  { name: "SwitchBoard", lang: "JavaScript", body: "The automation + AI chatbot platform this very site runs on." },
  { name: "AutoMagic", lang: "TypeScript", body: "Open-source virtual-assistant ops platform: client work, tasks, billing, support and AI agents across web, mobile and desktop." },
  { name: "Dis", lang: "Rust", body: "An operating system built from a tiny no_std x86_64 kernel up toward 2D screens and eventually spatial workspaces." },
  { name: "kino", lang: "Rust", body: "A Bevy + Rust physics fighting / simulation game inspired by Toribash." },
  { name: "Cytoshift", lang: "Rust", body: "A 3D game about piloting medical nanobots inside living cells, repair membranes, fight bacteria, protect the nucleus." },
  { name: "Sketchy", lang: "Kotlin", body: "An Android whiteboard for fast technical diagrams, architecture maps and low-fi UI wireframes." },
  { name: "Nuromorfx", lang: "Rust", body: "An interactive memristor sandbox for learning-by-doing with neuromorphic circuits and solver diagnostics." },
  { name: "codie", lang: "Python", body: "A local-first terminal app for developers: coding practice, AI-style interviews and spaced-repetition flashcards." },
  { name: "Benchy", lang: "TypeScript", body: "A terminal benchmark runner with an OpenTUI React interface, live run logs and JSONL persistence." },
];

const contactRows: { icon: React.ReactNode; label: string; value: string; href?: string }[] = [
  { icon: <Icon src={mailIcon} color="var(--amber)" size={22} />, label: "Email", value: "cristi.satcovschi@gmail.com", href: socialLinks.email },
  { icon: <Icon src={sendIcon} color="var(--amber)" size={22} />, label: "Telegram", value: "@cristi_42", href: socialLinks.telegram },
  { icon: linkedinGlyph("var(--amber)"), label: "LinkedIn", value: "in/cristi-șatcovschi", href: socialLinks.linkedin },
  { icon: pin("var(--amber)"), label: "Based in", value: "Bucharest, Romania" },
];

/* ---------- Reusable bits ---------- */

const factChip =
  "inline-flex items-center gap-2 rounded-[20px] border border-ink bg-white px-[15px] py-[7px] text-[.86rem] font-medium shadow-[3px_3px_0_rgba(21,33,31,0.08)]";

const stackTag = "rounded-[9px] border border-ink bg-paper px-[13px] py-[6px] text-[.9rem] font-semibold";

const darkCard =
  "rounded-[14px] border border-on-dark-line bg-[color-mix(in_srgb,var(--paper)_5%,transparent)] p-[22px]";

const contactCard =
  "flex items-center gap-[14px] rounded-[12px] border border-on-dark-line bg-[color-mix(in_srgb,var(--paper)_6%,transparent)] px-[18px] py-4 text-on-dark no-underline";

/* ---------- Page ---------- */

export default function AboutPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="56px">
        <div className="grid items-center gap-12 lg:grid-cols-[1.18fr_.82fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-[9px]">
              <Icon src={peopleIcon} color="var(--orange)" size={18} />
              <Eyebrow>The person behind the systems</Eyebrow>
            </div>
            <h1 className={`${heading} max-w-[13em] text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.06] text-ink`}>
              I build the digital backbone that lets your business{" "}
              <span className="text-orange">
                <HandUnderline>run on autopilot.</HandUnderline>
              </span>
            </h1>
            <p className="mt-[22px] max-w-[36em] text-[1.1rem] leading-[1.6] text-ink-body">
              Hi, I&apos;m <b>Cristi Șatcovschi</b>, an automation engineer and workflow architect.
              I help fast-growing startups and agencies kill the manual grunt work by wiring their
              favourite tools into seamless, AI-powered systems. If your team is stuck copy-pasting
              data, answering the same questions on repeat, or fighting broken software connections,
              I&apos;m the person you call.
            </p>
            <p className="mt-4 max-w-[36em] text-[1.1rem] leading-[1.6] text-ink-body">
              Using <b>n8n</b> and <b>Trigger.dev</b> alongside custom Python and Node.js, I build
              reliable backend infrastructure that handles the heavy lifting, so you can focus on
              strategy, closing deals, and scaling revenue.
            </p>

            <div className="mt-[26px] flex flex-wrap gap-[10px]">
              <span className={factChip}>
                {pin("var(--orange)")}
                Bucharest, Romania
              </span>
              <span className={factChip}>
                <Icon src={chartIcon} color="var(--orange)" size={15} />
                40+ systems shipped
              </span>
              <span className={factChip}>
                <Icon src={workflowIcon} color="var(--orange)" size={15} />
                n8n &amp; Trigger.dev specialist
              </span>
            </div>

            <div className="mt-[30px] flex flex-wrap items-center gap-4">
              <BookCall size="lg" arrow>
                Book a discovery call
              </BookCall>
              <span className="font-hand text-[1.28rem] text-ink">
                ↳ I think in workflows, and lose too many chess games online.
              </span>
            </div>
          </div>

          {/* portrait */}
          <div className="relative mx-auto w-full max-w-[340px]">
            <div
              className="absolute -right-2 -top-4 z-[3] rounded-[8px] border border-ink bg-amber px-3 py-[5px] font-hand text-[1.18rem] font-semibold shadow-[3px_3px_0_rgba(21,33,31,0.18)]"
              style={{ transform: "rotate(4deg)" }}
            >
              ↳ that&apos;s me
            </div>
            <Portrait src="/cristi-satcovschi.jpg" alt="Cristi Șatcovschi" ratio="4 / 4.7" />
          </div>
        </div>
      </Section>

      {/* ============ OFF THE CLOCK ============ */}
      <Section
        tone="alt"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
        py="58px"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_.8fr]">
          <div>
            <Eyebrow>Off the clock</Eyebrow>
            <h2 className={`${heading} my-3 text-[clamp(1.7rem,2.9vw,2.3rem)]`}>
              A builder who never really clocks out.
            </h2>
            <p className="mb-[14px] max-w-[34em] text-[1.06rem] leading-[1.6] text-ink-body">
              I&apos;m based in <b>Bucharest, Romania</b>, and I&apos;m wired to make systems run
              smoother, at work and at the chessboard. Chess is where I unwind; it&apos;s also where
              I&apos;m reminded that the best moves are usually the quiet, structural ones, not the
              flashy sacrifices.
            </p>
            <p className="max-w-[34em] text-[1.06rem] leading-[1.6] text-ink-body">
              When I&apos;m not automating someone&apos;s back-office, I&apos;m prototyping games, dev
              tools and even operating systems for the fun of it. It keeps the engineering sharp, and
              it means whatever weird stack your business runs on, I&apos;ve probably already broken
              something similar on purpose.
            </p>
          </div>
          <div className="flex justify-center">
            <StickyNote title="Off the clock" style={{ maxWidth: 260 }}>
              <ul className="m-0 list-none p-0 leading-[1.9]">
                <li>– chess (online &amp; over the board)</li>
                <li>– building Rust + Bevy games</li>
                <li>– tinkering with tiny operating systems</li>
                <li>– good coffee around Bucharest</li>
              </ul>
            </StickyNote>
          </div>
        </div>
      </Section>

      {/* ============ HOW I WORK ============ */}
      <Section>
        <div className="text-center">
          <Eyebrow>How I work</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            I don&apos;t build a script and disappear.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[42em] text-lead text-ink-soft">
            Every engagement runs through the same four steps, so you always know what&apos;s
            happening and where your system is headed.
          </p>
        </div>
        <div className="mt-11 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {howIWork.map((s) => (
            <Card key={s.n} tone="white" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div className="flex items-center justify-between">
                <span className={`${display} text-[1.9rem] font-extrabold leading-none text-orange`}>
                  {s.n}
                </span>
                <Icon src={s.icon} color="var(--ink)" size={24} />
              </div>
              <h3 className={`${display} mb-[7px] mt-[14px] text-[1.12rem] font-bold`}>{s.title}</h3>
              <p className="m-0 text-[.92rem] leading-[1.5] text-ink-soft">{s.body}</p>
            </Card>
          ))}
        </div>
        <p className="mt-[34px] text-center text-[.98rem] text-ink-soft">
          Want the full walkthrough?{" "}
          <a
            href="/process"
            className="border-b-2 border-[color-mix(in_srgb,var(--orange)_35%,transparent)] font-semibold text-orange no-underline"
          >
            See my process, built like a workflow →
          </a>
        </p>
      </Section>

      {/* ============ TECH STACK ============ */}
      <Section
        tone="alt"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
      >
        <div className="mb-[42px] text-center">
          <Eyebrow>The toolbox</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>My tech stack.</h2>
        </div>
        <div className="grid gap-[18px] md:grid-cols-3">
          {stack.map((c) => (
            <Card key={c.title} tone="white" style={{ height: "100%" }}>
              <div className="mb-[18px] flex items-center gap-[11px]">
                <span className="grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-ink bg-paper">
                  {c.icon}
                </span>
                <h3 className={`${display} m-0 text-[1.12rem] font-bold tracking-[-.01em]`}>{c.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className={stackTag}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[.9rem] leading-[1.5] text-ink-soft">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============ INSIDE SWITCHBOARD ============ */}
      <Section tone="dark" py="66px" style={{ borderTop: "1.5px solid #000" }}>
        <div className="mb-[42px] max-w-[40em]">
          <Eyebrow tone="amber">Inside Switchboard</Eyebrow>
          <h2 className={`${heading} mb-[14px] mt-3 text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.08] text-on-dark`}>
            A peek at the systems I build.
          </h2>
          <p className="m-0 text-[1.06rem] leading-[1.6] text-on-dark-strong">
            Not theory, these are the real, reusable automations running behind Switchboard projects
            right now.
          </p>
        </div>
        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {builds.map((b) => (
            <div key={b.n} className={darkCard}>
              <div className="mb-[13px] flex items-center gap-3">
                <span className={`${display} text-base font-extrabold text-amber`}>{b.n}</span>
                <Icon src={b.icon} color="var(--amber)" size={24} />
                <h3 className={`${display} m-0 text-[1.12rem] font-bold tracking-[-.01em] text-on-dark`}>
                  {b.title}
                </h3>
              </div>
              <p className={`text-[.94rem] leading-[1.55] text-on-dark-strong ${b.channels ? "mb-[14px]" : "m-0"}`}>
                {b.body}
              </p>
              {b.channels && (
                <div className="flex flex-wrap gap-[6px]">
                  {b.channels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded-[6px] border border-on-dark-line-2 px-[9px] py-[3px] text-[.72rem] font-semibold text-on-dark-muted"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ============ SIDE PROJECTS / GITHUB ============ */}
      <Section>
        <div className="text-center">
          <Eyebrow>When I&apos;m not automating</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            I can&apos;t stop building things.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[42em] text-lead text-ink-soft">
            Nights and weekends I prototype games, dev tools and operating systems, mostly in Rust
            and TypeScript. A small sample:
          </p>
        </div>
        <div className="mt-11 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {repos.map((r) => (
            <a
              key={r.name}
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 rounded-[14px] border border-ink bg-white p-[18px] text-ink no-underline shadow-card transition-transform hover:-translate-y-[2px]"
            >
              <div className="flex items-center justify-between gap-[10px]">
                <span className={`${display} text-[1.04rem] font-bold tracking-[-.01em]`}>{r.name}</span>
                <span className={`${display} inline-flex items-center gap-[6px] text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-soft`}>
                  <span className="h-2 w-2 rounded-full bg-ink" />
                  {r.lang}
                </span>
              </div>
              <p className="m-0 text-[.86rem] leading-[1.5] text-ink-soft">{r.body}</p>
            </a>
          ))}
        </div>
        <p className="mt-[34px] text-center text-[.98rem] text-ink-soft">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-2 border-[color-mix(in_srgb,var(--orange)_35%,transparent)] font-semibold text-orange no-underline"
          >
            20+ more repos on github.com/cristii →
          </a>
        </p>
      </Section>

      {/* ============ SNOWBOARDING / OFF THE CLOCK ============ */}
      <SnowboardBand />

      {/* ============ BUCHAREST / LOCAL ============ */}
      <BucharestBand />

      {/* ============ CONTACT / CTA ============ */}
      <Section tone="ink" id="contact" py="70px" style={{ borderTop: "1.5px solid #000" }}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Eyebrow tone="amber">Let&apos;s talk</Eyebrow>
            <h2 className={`${heading} mb-4 mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.06] text-on-dark`}>
              Tell me what&apos;s eating your team&apos;s time.
            </h2>
            <p className="mb-7 max-w-[32em] text-lead leading-[1.6] text-on-dark-strong">
              Book a free 15-minute mapping call and I&apos;ll show you exactly what we can automate
              next, no pushy sales pitch.
            </p>
            <BookCall size="lg" arrow>
              Book a discovery call
            </BookCall>
          </div>
          <div className="flex flex-col gap-3">
            {contactRows.map((row) =>
              row.href ? (
                <a
                  key={row.label}
                  href={row.href}
                  {...(row.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={contactCard}
                >
                  <span className="flex-none">{row.icon}</span>
                  <span className="flex flex-col gap-[2px]">
                    <span className={`${display} text-[.66rem] font-semibold uppercase tracking-[.14em] text-on-dark-muted`}>
                      {row.label}
                    </span>
                    <span className="text-[.98rem] text-on-dark">{row.value}</span>
                  </span>
                </a>
              ) : (
                <div key={row.label} className={contactCard}>
                  <span className="flex-none">{row.icon}</span>
                  <span className="flex flex-col gap-[2px]">
                    <span className={`${display} text-[.66rem] font-semibold uppercase tracking-[.14em] text-on-dark-muted`}>
                      {row.label}
                    </span>
                    <span className="text-[.98rem] text-on-dark">{row.value}</span>
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
