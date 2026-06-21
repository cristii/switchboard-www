import type { Metadata } from "next";
import * as React from "react";

import {
  Badge,
  Button,
  Eyebrow,
  FaqItem,
  HandUnderline,
  Icon,
  Section,
  type IconSource,
} from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { RotatingText } from "@/components/sections/RotatingText";

import assistantIcon from "@/assets/icons/assistant.svg";
import calendarIcon from "@/assets/icons/calendar.svg";
import chartIcon from "@/assets/icons/chart.svg";
import checkIcon from "@/assets/icons/check.svg";
import lightbulbIcon from "@/assets/icons/lightbulb.svg";
import mailIcon from "@/assets/icons/mail.svg";
import peopleIcon from "@/assets/icons/people.svg";
import refreshIcon from "@/assets/icons/refresh.svg";
import sendIcon from "@/assets/icons/send.svg";
import workflowIcon from "@/assets/icons/workflow.svg";

export const metadata: Metadata = {
  title: "Services",
  description:
    "An automation agency for home services, e-commerce and SaaS, automated sales workflows, AI assistants and back-office systems, built and handed over fully yours.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

/* ---------- Data (copy ported verbatim from Services.dc.html) ---------- */

const rotatorWords = [
  "missed calls answered.",
  "quotes followed up.",
  "invoices sent on time.",
  "tickets triaged by AI.",
  "leads booked while you sleep.",
  "reviews collected on autopilot.",
];

const outcomeChips: { icon: IconSource; color: string; value: string; label: string }[] = [
  { icon: sendIcon, color: "var(--orange)", value: "< 60s", label: "to first reply" },
  { icon: checkIcon, color: "var(--green)", value: "0 leads", label: "dropped" },
  { icon: refreshIcon, color: "var(--violet)", value: "5-min", label: "invoicing, automated" },
  { icon: assistantIcon, color: "var(--orange)", value: "24/7", label: "AI receptionist" },
];

const industries = [
  "Home services",
  "E-commerce",
  "Trades",
  "Media buyers",
  "SaaS",
  "Local business",
];

type FlowItem = { icon: IconSource; iconColor: string; text: string };

interface Pillar {
  num: string;
  accent: string;
  icon: IconSource;
  badge: { variant: "solid" | "green" | "violet" | "amber"; text: string };
  title: string;
  focus: string;
  body: string;
  features: string[];
  flow: { input: FlowItem; processing: FlowItem; output: FlowItem };
  flip?: boolean;
}

const pillars: Pillar[] = [
  {
    num: "01",
    accent: "var(--orange)",
    icon: sendIcon,
    badge: { variant: "solid", text: "For trades · ad buyers" },
    title: "Intelligent Lead Routing & Sales",
    focus: "Focus · speed-to-lead",
    body: "The moment an enquiry lands, the clock starts. We make sure you answer first, every lead routed, alerted and followed up before your competitor has even checked their phone.",
    features: [
      "Instant SMS lead alerts",
      "Automated quote follow-ups",
      "CRM lead synchronization",
      "Calendar scheduling & reminders",
    ],
    flow: {
      input: { icon: mailIcon, iconColor: "var(--ink)", text: "New enquiry arrives" },
      processing: { icon: sendIcon, iconColor: "var(--orange)", text: "Alert sent & lead routed" },
      output: { icon: calendarIcon, iconColor: "var(--green)", text: "Job booked on your calendar" },
    },
  },
  {
    num: "02",
    accent: "var(--green)",
    icon: refreshIcon,
    badge: { variant: "green", text: "For small biz · trades" },
    title: "Back-Office & Operations",
    focus: "Focus · time saved",
    body: "The admin that eats your evenings, invoicing, renewals, chasing reviews, runs itself in the background. You stop being your own data-entry clerk and get your nights back.",
    features: [
      "Automated invoicing (QuickBooks / Xero)",
      "Inventory & stock sync",
      "Recurring contract renewals",
      "Automated review & testimonial requests",
    ],
    flow: {
      input: { icon: checkIcon, iconColor: "var(--ink)", text: "Job marked complete" },
      processing: { icon: refreshIcon, iconColor: "var(--green)", text: "Invoice + review request fire" },
      output: { icon: chartIcon, iconColor: "var(--green)", text: "Paid & 5-star rated" },
    },
    flip: true,
  },
  {
    num: "03",
    accent: "var(--violet)",
    icon: assistantIcon,
    badge: { variant: "violet", text: "For everyone" },
    title: "AI-Powered Customer Experience",
    focus: "Focus · scale without hiring",
    body: "An assistant that never sleeps answers your customers, reads their documents, and raises a ticket before anything slips, so a small team feels like a big one, around the clock.",
    features: [
      "AI receptionist for FAQs & bookings",
      "Automated document triage (reads PDFs & invoices)",
      "Proactive support ticketing",
      "24/7 first-response",
    ],
    flow: {
      input: { icon: mailIcon, iconColor: "var(--ink)", text: "Customer message or document" },
      processing: { icon: assistantIcon, iconColor: "var(--violet)", text: "AI reads & classifies it" },
      output: { icon: checkIcon, iconColor: "var(--green)", text: "Answered, or escalated with context" },
    },
  },
  {
    num: "04",
    accent: "var(--tint-amber-fg)",
    icon: workflowIcon,
    badge: { variant: "amber", text: "For SaaS · high-volume" },
    title: "Operations Assurance & Infrastructure",
    focus: "Focus · reliability at scale",
    body: "When volume spikes, nothing drops. We build the monitoring, failover and dashboards that keep a busy system honest, so growth never turns into outages.",
    features: [
      "Dedicated uptime monitoring",
      "API failover & retry logic",
      "High-volume queue management",
      "Custom dashboards & reporting",
    ],
    flow: {
      input: { icon: chartIcon, iconColor: "var(--ink)", text: "Traffic surge hits" },
      processing: { icon: workflowIcon, iconColor: "var(--tint-amber-fg)", text: "Queued, monitored, retried" },
      output: { icon: checkIcon, iconColor: "var(--green)", text: "Processed, nothing dropped" },
    },
    flip: true,
  },
];

const whyCards: { accent: string; iconColor: string; icon: IconSource; title: string; body: string }[] = [
  {
    accent: "var(--green)",
    iconColor: "color-mix(in srgb, var(--green) 55%, var(--paper))",
    icon: checkIcon,
    title: "We build it, we test it, we hand it over.",
    body: "You're never locked to us. The finished system is yours, documented, tested, with the keys handed over. Keep us on for support only if you want to.",
  },
  {
    accent: "var(--amber)",
    iconColor: "var(--amber)",
    icon: lightbulbIcon,
    title: "No black boxes.",
    body: "Everything we build is transparent and editable. No proprietary code you can't touch, no hostage situations, your team or your developer can read and extend all of it.",
  },
  {
    accent: "var(--orange)",
    iconColor: "color-mix(in srgb, var(--orange) 65%, var(--paper))",
    icon: refreshIcon,
    title: "Proactive monitoring.",
    body: "We watch for breaks before you feel them. When a third-party app changes, we fix the workflow, often before you've even noticed anything was off.",
  },
];

const faqs = [
  {
    q: "Do I need to be tech-savvy to use your services?",
    a: "Not at all. Everything runs through the tools you already use, a text message, your inbox, your calendar. We hand over something you operate with a tap, not a manual. The technical complexity stays on our side.",
  },
  {
    q: "What software do I need to pay for?",
    a: "Only the raw tools your system runs on, usually a few dollars a month for things like AI usage or your existing CRM. Our build fee is one-time, with no markup and no middleman subscriptions on top.",
  },
  {
    q: "Can you work with my existing developer?",
    a: "Absolutely. We document everything and hand over clean, editable systems your developer can read and extend. No black boxes, no turf wars, we're happy to brief them directly.",
  },
];

/* ---------- Flow-diagram helpers ---------- */

function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display} mb-2 text-[.64rem] font-bold uppercase tracking-[.1em] text-ink-soft`}>
      {children}
    </div>
  );
}

function FlowNode({
  item,
  highlight,
  accent,
}: {
  item: FlowItem;
  highlight?: boolean;
  accent?: string;
}) {
  return (
    <div
      className={`flex w-full items-center gap-[11px] rounded-[10px] bg-white px-[13px] py-[11px] ${
        highlight ? "shadow-raised" : "shadow-card"
      }`}
      style={{ border: highlight && accent ? `2px solid ${accent}` : "1.5px solid var(--ink)" }}
    >
      <Icon src={item.icon} color={item.iconColor} size={20} />
      <span className="text-[.9rem] font-semibold">{item.text}</span>
    </div>
  );
}

function FlowDiagram({ flow, accent }: { flow: Pillar["flow"]; accent: string }) {
  const arrow = (
    <div className="my-[6px] text-[1.3rem] leading-none" style={{ color: accent }}>
      ↓
    </div>
  );
  return (
    <div className="rounded-[14px] border border-ink bg-paper-2 px-5 py-[22px]">
      <div className="flex flex-col items-center">
        <FlowLabel>Input</FlowLabel>
        <FlowNode item={flow.input} />
        {arrow}
        <FlowLabel>Processing</FlowLabel>
        <FlowNode item={flow.processing} highlight accent={accent} />
        {arrow}
        <FlowLabel>Output</FlowLabel>
        <FlowNode item={flow.output} />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ServicesPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="48px">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="mb-[14px] flex items-center gap-[9px]">
              <Icon src={workflowIcon} color="var(--orange)" size={18} />
              <Eyebrow>What we do</Eyebrow>
            </div>
            <h1 className={`${heading} mb-2 max-w-[13em] text-hero text-ink`}>
              We don&apos;t sell software. We sell{" "}
              <span className="text-orange">
                <HandUnderline>work that&apos;s done.</HandUnderline>
              </span>
            </h1>
            <div
              className={`${display} mb-[6px] mt-[14px] flex flex-wrap items-baseline gap-[10px] text-[clamp(1.1rem,2vw,1.5rem)] font-bold tracking-[-.01em] text-ink-soft`}
            >
              <span>Picture your</span>
              <RotatingText words={rotatorWords} className="min-w-[9em] text-orange" />
            </div>
            <p className="mb-7 mt-[18px] max-w-[33em] text-lead text-ink-body">
              An automation agency for home services, e-commerce and SaaS teams. We build the
              automated sales workflows, AI assistants and back-office systems that recover the
              revenue and hours leaking out of your business, then hand them over, fully yours.
            </p>
            <div className="flex flex-wrap items-center gap-[14px]">
              <BookCall arrow>Book a Mapping Call</BookCall>
              <Button variant="ghost" href="/work">
                View Recent Work
              </Button>
            </div>
          </div>

          {/* floating outcome chips */}
          <div className="flex flex-wrap content-center justify-center gap-[14px]">
            {outcomeChips.map((c, i) => (
              <div
                key={c.value}
                className={`flex items-center gap-[10px] rounded-[12px] border border-ink bg-white px-4 py-[13px] shadow-card ${
                  i % 2 ? "mt-4" : ""
                }`}
              >
                <Icon src={c.icon} color={c.color} size={20} />
                <div>
                  <b className={`${display} text-[1.1rem] font-extrabold`}>{c.value}</b>
                  <div className="text-[.78rem] text-ink-soft">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ TESTIMONIAL + INDUSTRIES ============ */}
      <section className="overflow-hidden border-y border-black bg-dark text-on-dark">
        <div className="mx-auto max-w-content px-gutter pb-[30px] pt-11 text-center">
          <Icon
            src={assistantIcon}
            color="var(--amber)"
            size={30}
            style={{ display: "block", margin: "0 auto 14px" }}
          />
          <p
            className={`${display} mx-auto max-w-[20em] text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold leading-[1.2] tracking-[-.02em] text-on-dark`}
          >
            &ldquo;Switchboard turned our manual invoicing mess into a{" "}
            <span className="text-amber">5-minute automated task.</span>&rdquo;
          </p>
          <p
            className={`${display} mt-4 text-[.92rem] font-semibold uppercase tracking-[.04em] text-on-dark-muted`}
          >
            Operations Lead · home-services company
          </p>
          <p className="mt-2 font-hand text-[1.2rem] text-amber">
            ↳ sample testimonial, swap for your own
          </p>
        </div>
        <div className="border-t border-on-dark-line py-4">
          <div
            className={`${display} flex flex-wrap items-center justify-center text-[.86rem] font-bold uppercase tracking-[.16em] text-on-dark-muted`}
          >
            {industries.map((name, i) => (
              <React.Fragment key={name}>
                {i > 0 && <span className="px-3 text-orange">•</span>}
                {name}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PILLARS ============ */}
      <Section>
        <div className="text-center">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className={`${heading} mx-auto mt-3 max-w-[16em] text-[clamp(1.9rem,3.4vw,2.8rem)]`}>
            Four systems that quietly run your business.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[34em] text-lead text-ink-soft">
            Grouped by outcome, not by tool. Pick the bottleneck that&apos;s costing you the most,
            we&apos;ll build the system that closes it.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-7">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="relative overflow-hidden rounded-[18px] border border-ink bg-white p-7 shadow-card sm:p-10"
            >
              <div
                aria-hidden="true"
                className={`${display} pointer-events-none absolute right-6 top-1 text-[9rem] font-extrabold leading-none`}
                style={{ color: `color-mix(in srgb, ${p.accent} 8%, transparent)` }}
              >
                {p.num}
              </div>
              <div className="relative grid items-center gap-10 lg:grid-cols-2">
                {/* content */}
                <div className={p.flip ? "lg:order-2" : ""}>
                  <div className="mb-[14px] flex items-center gap-3">
                    <span
                      className="grid h-[46px] w-[46px] flex-none place-items-center rounded-[12px] border border-ink"
                      style={{ background: `color-mix(in srgb, ${p.accent} 12%, transparent)` }}
                    >
                      <Icon src={p.icon} color={p.accent} size={24} />
                    </span>
                    <Badge variant={p.badge.variant}>{p.badge.text}</Badge>
                  </div>
                  <h3 className={`${heading} mb-[6px] text-[1.7rem]`}>{p.title}</h3>
                  <div
                    className={`${display} mb-3 text-[.82rem] font-bold uppercase tracking-[.05em]`}
                    style={{ color: p.accent }}
                  >
                    {p.focus}
                  </div>
                  <p className="mb-5 max-w-[30em] text-base leading-[1.6] text-ink-body">{p.body}</p>
                  <div className="grid max-w-[30em] grid-cols-1 gap-3 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex gap-[9px] text-[.92rem]">
                        <Icon src={checkIcon} color={p.accent} size={18} style={{ marginTop: 1 }} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* flow */}
                <div className={p.flip ? "lg:order-1" : ""}>
                  <FlowDiagram flow={p.flow} accent={p.accent} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ SIGNATURE FLOW ============ */}
      <Section
        tone="alt"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
      >
        <div className="text-center">
          <Eyebrow>The systematic approach</Eyebrow>
          <h2 className={`${heading} mx-auto mb-2 mt-3 max-w-[16em] text-[clamp(1.8rem,3.2vw,2.6rem)]`}>
            One system, lead to booked, automatically.
          </h2>
          <p className="mx-auto mb-10 max-w-[34em] text-lead text-ink-soft">
            Every build follows the same shape: a clear input, smart processing, a clean output.
            Here&apos;s what happens the instant a new lead arrives.
          </p>

          <div className="mx-auto flex max-w-[920px] flex-col items-stretch justify-center gap-6 md:flex-row md:items-center md:gap-0">
            {/* node 1 */}
            <div className="flex-1">
              <FlowLabel>Input</FlowLabel>
              <div className="flex flex-col items-center gap-[10px] rounded-[14px] border border-ink bg-white px-[14px] py-5 shadow-card">
                <Icon src={mailIcon} color="var(--orange)" size={30} />
                <span className={`${display} text-[.96rem] font-bold`}>New lead</span>
              </div>
            </div>

            <Wire />

            {/* node 2 */}
            <div className="flex-1">
              <FlowLabel>Processing</FlowLabel>
              <div
                className="flex flex-col items-center gap-[10px] rounded-[14px] bg-white px-[14px] py-5 shadow-raised"
                style={{ border: "2px solid var(--orange)" }}
              >
                <Icon src={assistantIcon} color="var(--orange)" size={30} />
                <span className={`${display} text-[.96rem] font-bold`}>AI classification</span>
              </div>
            </div>

            <Wire />

            {/* node 3: dual output */}
            <div className="flex-1">
              <FlowLabel>Output</FlowLabel>
              <div className="flex flex-col gap-[10px]">
                <MiniCard icon={peopleIcon} text="CRM" />
                <MiniCard icon={calendarIcon} text="Calendar" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ WHY US ============ */}
      <Section tone="dark">
        <div className="mb-[42px] text-center">
          <Eyebrow tone="amber">Why Switchboard</Eyebrow>
          <h2 className={`${heading} mx-auto mt-3 max-w-[18em] text-[clamp(1.8rem,3.2vw,2.6rem)] text-on-dark`}>
            Hiring a freelancer feels risky. We built our whole model to remove that risk.
          </h2>
        </div>
        <div className="grid gap-[18px] md:grid-cols-3">
          {whyCards.map((c) => (
            <div
              key={c.title}
              className="rounded-[14px] border border-on-dark-line bg-[color-mix(in_srgb,var(--paper)_5%,transparent)] p-6"
            >
              <span
                className="mb-4 grid h-[46px] w-[46px] place-items-center rounded-[12px]"
                style={{
                  border: `1.5px solid ${c.accent}`,
                  background: `color-mix(in srgb, ${c.accent} 16%, transparent)`,
                }}
              >
                <Icon src={c.icon} color={c.iconColor} size={24} />
              </span>
              <h3 className={`${display} mb-2 text-[1.2rem] font-bold text-on-dark`}>{c.title}</h3>
              <p className="text-[.95rem] leading-[1.6] text-on-dark-strong">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <Section width="820px">
        <div className="mb-[34px] text-center">
          <Eyebrow>Before you book</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            The questions researchers actually ask.
          </h2>
        </div>
        <div className="flex flex-col">
          {faqs.map((f) => (
            <FaqItem key={f.q} question={f.q}>
              {f.a}
            </FaqItem>
          ))}
        </div>
      </Section>

      {/* ============ FINAL CTA ============ */}
      <Section tone="ink" innerStyle={{ textAlign: "center" }}>
        <h2
          className={`${heading} mx-auto max-w-[15em] text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.06] text-paper`}
        >
          Still researching? <span className="text-orange">Let&apos;s map it out together.</span>
        </h2>
        <p className="mx-auto mb-[30px] mt-[18px] max-w-[32em] text-lead leading-[1.6] text-on-dark-strong">
          No pitch, no pressure, just fifteen minutes to see exactly which system would move the
          needle for your business.
        </p>
        <div className="flex flex-wrap justify-center gap-[14px]">
          <BookCall arrow>Book a Mapping Call</BookCall>
          <Button variant="light" href="/work" arrow>
            View Recent Work
          </Button>
        </div>
      </Section>
    </>
  );
}

/* ---------- Signature-flow sub-components ---------- */

function Wire() {
  return (
    <div
      className="relative mx-1 mt-6 hidden h-[2px] w-16 flex-none md:block"
      style={{
        background:
          "repeating-linear-gradient(90deg, color-mix(in srgb, var(--ink) 35%, transparent) 0 7px, transparent 7px 14px)",
      }}
    >
      <span className="absolute -right-[6px] top-1/2 -translate-y-1/2 text-[1.1rem] text-orange">
        ▶
      </span>
    </div>
  );
}

function MiniCard({ icon, text }: { icon: IconSource; text: string }) {
  return (
    <div className="flex items-center justify-center gap-[9px] rounded-[12px] border border-ink bg-white px-3 py-[13px] shadow-card">
      <Icon src={icon} color="var(--green)" size={20} />
      <span className={`${display} text-[.88rem] font-bold`}>{text}</span>
    </div>
  );
}
