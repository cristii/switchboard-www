import type { Metadata } from "next";
import * as React from "react";

import {
  Badge,
  Card,
  Eyebrow,
  FaqItem,
  HandUnderline,
  Icon,
  Section,
  type IconSource,
} from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";

import calendarIcon from "@/assets/icons/calendar.svg";
import chartIcon from "@/assets/icons/chart.svg";
import checkIcon from "@/assets/icons/check.svg";
import linkIcon from "@/assets/icons/link.svg";
import workflowIcon from "@/assets/icons/workflow.svg";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, one-time pricing for done-for-you automation and AI chatbots. The Foundation, The Growth Engine and Custom Infrastructure, we build it, test it, and hand you the keys.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

/* ---------- Data (copy ported verbatim from Pricing.dc.html) ---------- */

const audiences: { icon: IconSource; title: string; body: string }[] = [
  {
    icon: calendarIcon,
    title: "Home Services & Trades",
    body: "Never miss a job while you're in the field. Instantly capture leads, deploy AI receptionists to answer pricing questions, and automate your quote follow-ups so your schedule stays full.",
  },
  {
    icon: chartIcon,
    title: "E-commerce & Media Buyers",
    body: "Scale your return on ad spend without breaking your systems. Sync Meta lead ads instantly, trigger abandoned-cart recovery, and let AI agents handle first-tier customer support on their own.",
  },
  {
    icon: linkIcon,
    title: "Small Business & SaaS",
    body: "Eliminate manual data entry. Connect your disjointed software, automate user onboarding, and build a hands-free back-office that scales as your revenue grows.",
  },
];

interface Tier {
  name: string;
  price: string;
  priceNote?: string;
  desc: string;
  scope: string;
  features: { text: string; accent?: boolean }[];
  upfront: string;
  cta: string;
  featured?: boolean;
}

const tiers: Tier[] = [
  {
    name: "The Foundation",
    price: "$800",
    priceNote: "one-time",
    desc: "Best for quick lead capture and stopping manual data entry.",
    scope: "Scope · 1–3 core workflows",
    features: [
      { text: "Instant SMS & Slack lead alerts" },
      { text: "Direct CRM & ad-platform syncing" },
      { text: "Automated “received” replies" },
      { text: "Basic AI auto-responder, instant smart replies to web forms" },
    ],
    upfront: "25% upfront to schedule.",
    cta: "Map My Automation",
  },
  {
    name: "The Growth Engine",
    price: "$1,500",
    priceNote: "one-time",
    desc: "Best for automating follow-ups and scaling your back-office.",
    scope: "Scope · 4–7 multi-step workflows",
    features: [
      { text: "Everything in The Foundation, plus:", accent: true },
      { text: "Multi-step follow-up sequences" },
      { text: "Smart lead routing & conditional logic" },
      { text: "Standard AI chatbot, answers FAQs & books appointments" },
      { text: "Auto-invoicing & review generation" },
    ],
    upfront: "50% upfront, 50% on go-live. Includes 30 days of active monitoring.",
    cta: "Map My Automation",
    featured: true,
  },
  {
    name: "Custom Infrastructure",
    price: "$4,000+",
    desc: "Best for high-volume routing and advanced autonomous agents.",
    scope: "Scope · 8+ workflows",
    features: [
      { text: "Everything in The Growth Engine, plus:", accent: true },
      { text: "High-volume request routing & queueing" },
      { text: "Advanced data transformations & clean-up" },
      { text: "Custom dashboards & client portals" },
      { text: "Custom RAG AI agents, trained on your business data & catalogs" },
    ],
    upfront: "Paid discovery phase required. Includes 30 days of active monitoring.",
    cta: "Request an Audit",
  },
];

const steps = [
  {
    n: "01",
    title: "Map the mess",
    body: "We get on a short call to map out exactly where you're losing time or dropping leads.",
  },
  {
    n: "02",
    title: "The build",
    body: "We connect your tools, write the logic, and train your AI. You don't have to learn a single new piece of software.",
  },
  {
    n: "03",
    title: "The handover",
    body: "We test it with live data, hand you the keys, and watch your business run faster.",
  },
];

const faqs = [
  {
    q: "I'm a local tradesman, I don't know anything about tech. Will this work for me?",
    a: "Yes. You won't have to log into any complex software. We build systems that work through the tools you already use, like a simple text message when a new lead comes in, or an AI answering your website chat while you're driving.",
  },
  {
    q: "What's the difference between the AI chatbot in Tier 2 and Tier 3?",
    a: "The Tier 2 bot is a standard AI trained on a fixed set of FAQs, your pricing, hours and core services, designed to capture leads and book calls. The Tier 3 bot is a far more advanced agent that can read thousands of your past support tickets or scan a massive product catalog to troubleshoot complex customer issues on its own.",
  },
  {
    q: "Are there ongoing monthly fees?",
    a: "No. Our build fees are one-time. You're only responsible for the raw software costs of the tools you use, for example, a few dollars a month for your AI usage, or your existing CRM subscription.",
  },
  {
    q: "How long does a build take?",
    a: "Foundation packages are typically deployed in under 7 days. Growth Engines take 2 to 3 weeks. Custom Infrastructure timelines are scoped during our discovery call.",
  },
];

const scopeDivider = "border-t border-[color-mix(in_srgb,var(--ink)_16%,transparent)]";

/* ---------- Page ---------- */

export default function PricingPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="56px" innerStyle={{ textAlign: "center" }}>
        <div className="mb-[14px] inline-flex items-center gap-[9px]">
          <Icon src={workflowIcon} color="var(--orange)" size={18} />
          <Eyebrow>Done-for-you automation &amp; AI</Eyebrow>
        </div>
        <h1 className={`${heading} mx-auto max-w-[15em] text-hero text-ink`}>
          Turn your bottlenecks into{" "}
          <span className="text-orange">
            <HandUnderline>automated revenue.</HandUnderline>
          </span>
        </h1>
        <p className="mx-auto mb-[30px] mt-6 max-w-[36em] text-lead text-ink-body">
          Custom automation and AI chatbots that plug leaky sales funnels, handle your back-office,
          and never take a day off. We build it, we connect it, and we maintain it, you just answer
          the phone when it rings.
        </p>
        <div className="flex flex-col items-center gap-3">
          <BookCall size="lg" arrow>
            Book a Quick Walkthrough
          </BookCall>
          <p className="m-0 font-hand text-[1.28rem] text-ink">
            ↳ free 15-minute discovery call, no pushy sales pitch
          </p>
        </div>
      </Section>

      {/* ============ AUDIENCE PIVOT ============ */}
      <Section
        tone="alt"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
        py="58px"
      >
        <div className="mb-[38px] text-center">
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            Built for the way you do business.
          </h2>
        </div>
        <div className="grid gap-[18px] md:grid-cols-3">
          {audiences.map((a) => (
            <Card key={a.title} tone="white" style={{ height: "100%" }}>
              <span className="mb-4 grid h-[46px] w-[46px] place-items-center rounded-[12px] border border-ink bg-paper">
                <Icon src={a.icon} color="var(--orange)" size={24} />
              </span>
              <h3 className={`${display} mb-[9px] text-[1.24rem] font-bold tracking-[-.01em]`}>
                {a.title}
              </h3>
              <p className="m-0 text-[.96rem] leading-[1.55] text-ink-soft">{a.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============ PRICING TABLE ============ */}
      <Section id="pricing">
        <div className="mb-[14px] text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.9rem,3.2vw,2.6rem)]`}>
            Transparent pricing. No hidden hourly fees.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[40em] text-lead text-ink-soft">
            Choose the system that fits your current volume. We build it, we test it, and we hand
            you the keys.
          </p>
        </div>

        <div className="mt-11 grid items-start gap-[18px] lg:grid-cols-[1fr_1.08fr_1fr]">
          {tiers.map((t) => (
            <div key={t.name} className={t.featured ? "lg:-translate-y-4" : ""}>
              <Card
                tone={t.featured ? "white" : "sunken"}
                featured={t.featured}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "28px 26px",
                  position: "relative",
                }}
              >
                {t.featured && (
                  <Badge
                    variant="solid"
                    style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)" }}
                  >
                    Most Popular
                  </Badge>
                )}
                <div className={`${display} text-[1.2rem] font-bold tracking-[-.01em]`}>{t.name}</div>
                <div className="mb-[2px] mt-[14px] flex items-baseline gap-2">
                  <span
                    className={`${display} font-extrabold leading-none text-orange ${
                      t.featured ? "text-[3.2rem]" : "text-[2.9rem]"
                    }`}
                  >
                    {t.price}
                  </span>
                  {t.priceNote && (
                    <span className="text-[.82rem] font-semibold text-ink-soft">{t.priceNote}</span>
                  )}
                </div>
                <p className="mt-2 text-[.95rem] leading-[1.5] text-ink-soft">{t.desc}</p>
                <div
                  className={`${display} ${scopeDivider} mb-3 mt-5 pt-[18px] text-[.8rem] font-bold uppercase tracking-[.05em] text-ink`}
                >
                  {t.scope}
                </div>
                <ul className="m-0 flex flex-1 list-none flex-col gap-[11px] p-0">
                  {t.features.map((f) => (
                    <li
                      key={f.text}
                      className={`flex gap-[10px] text-[.93rem] leading-[1.4] ${
                        f.accent ? "font-semibold" : ""
                      }`}
                    >
                      <Icon
                        src={checkIcon}
                        color={f.accent ? "var(--orange)" : "var(--green)"}
                        size={18}
                        style={{ marginTop: 1 }}
                      />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-4 mt-[18px] text-[.84rem] italic text-ink-soft">{t.upfront}</p>
                <BookCall
                  variant={t.featured ? "primary" : "ghost"}
                  size={t.featured ? "lg" : "md"}
                  arrow={t.featured}
                  style={{ width: "100%" }}
                >
                  {t.cta}
                </BookCall>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ HOW IT WORKS ============ */}
      <Section
        tone="alt"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
        py="58px"
      >
        <div className="mb-[42px] text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            From bottleneck to automated in 3 steps.
          </h2>
        </div>
        <div className="grid items-stretch gap-[18px] lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <Card tone="white" style={{ height: "100%" }}>
                <div className={`${display} text-[2rem] font-extrabold leading-none text-orange`}>
                  {s.n}
                </div>
                <h3 className={`${display} mb-[7px] mt-3 text-[1.16rem] font-bold`}>{s.title}</h3>
                <p className="m-0 text-[.93rem] leading-[1.5] text-ink-soft">{s.body}</p>
              </Card>
              {i < steps.length - 1 && (
                <div
                  className={`${display} hidden items-center justify-center text-[1.7rem] font-extrabold text-orange lg:flex`}
                >
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* ============ GUARANTEE ============ */}
      <Section tone="dark" py="56px">
        <div className="mx-auto flex max-w-[54em] flex-wrap items-start gap-[26px]">
          <span
            className="grid h-[60px] w-[60px] flex-none place-items-center rounded-[14px]"
            style={{
              border: "1.5px solid var(--green)",
              background: "color-mix(in srgb, var(--green) 16%, transparent)",
            }}
          >
            <Icon
              src={checkIcon}
              color="color-mix(in srgb, var(--green) 55%, var(--paper))"
              size={30}
            />
          </span>
          <div className="min-w-[260px] flex-1">
            <Eyebrow tone="amber">Risk reversal</Eyebrow>
            <h2 className={`${heading} mb-[14px] mt-3 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.08] text-on-dark`}>
              The &ldquo;We Build It, You Run It&rdquo; Guarantee
            </h2>
            <p className="m-0 text-lead leading-[1.6] text-on-dark-strong">
              You&apos;re hiring us to eliminate technical headaches, not create new ones. Every
              Growth Engine and Custom Infrastructure build includes{" "}
              <b className="text-amber">30 days of active monitoring</b>. If a third-party app
              changes its code or a connection breaks in your first month, we fix the workflow for
              free.
            </p>
          </div>
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <Section width="820px">
        <div className="mb-[36px] text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
            Frequently asked questions.
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
      <Section tone="ink" id="book" py="64px" innerStyle={{ textAlign: "center" }}>
        <h2
          className={`${heading} mx-auto max-w-[16em] text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.06] text-on-dark`}
        >
          Stop paying yourself to do <span className="text-orange">data entry.</span>
        </h2>
        <p className="mx-auto mb-[30px] mt-5 max-w-[34em] text-lead leading-[1.6] text-on-dark-strong">
          Book a free 15-minute mapping call. We&apos;ll show you exactly how much time and money you
          can buy back.
        </p>
        <BookCall size="lg" arrow>
          Book My Free Walkthrough
        </BookCall>
        <p className="mt-[22px] font-hand text-[1.3rem] text-amber">
          ↳ no pushy sales pitch, just a map of what&apos;s possible
        </p>
      </Section>
    </>
  );
}
