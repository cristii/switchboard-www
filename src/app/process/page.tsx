import type { Metadata } from "next";
import * as React from "react";

import {
  Card,
  Eyebrow,
  HandUnderline,
  Icon,
  Section,
  type IconSource,
} from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";

import checkIcon from "@/assets/icons/check.svg";
import funnelIcon from "@/assets/icons/funnel.svg";
import peopleIcon from "@/assets/icons/people.svg";
import refreshIcon from "@/assets/icons/refresh.svg";
import targetIcon from "@/assets/icons/target.svg";
import workflowIcon from "@/assets/icons/workflow.svg";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How we work together, every engagement runs like one of the automations we build: Discover, Build, Test, Handoff, Maintain. A clear sequence from first call to a system you own.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";
const ERROR_RED = "#C12A2A";

/* ---------- n8n-style node glyphs (inline, ported from Process.dc.html) ---------- */

const glyphProps = {
  width: 46,
  height: 46,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const webhookGlyph = (
  <svg {...glyphProps} stroke="var(--ink)">
    <path d="M13 2 4 14h7l-1 8 10-13h-7z" />
  </svg>
);
const switchGlyph = (
  <svg {...glyphProps} stroke="var(--ink)">
    <path d="M3 12h5" />
    <path d="M8 12c5 0 4-6 9-6" />
    <path d="M8 12c5 0 4 6 9 6" />
    <circle cx="18" cy="6" r="1.6" />
    <circle cx="18" cy="18" r="1.6" />
  </svg>
);
const errorGlyph = (
  <svg {...glyphProps} stroke={ERROR_RED}>
    <path d="M12 3 22 20H2z" />
    <path d="M12 9v5" />
    <circle cx="12" cy="17.3" r=".5" fill={ERROR_RED} stroke="none" />
  </svg>
);
const setGlyph = (
  <svg {...glyphProps} width={40} height={40} stroke="var(--ink)">
    <line x1="5" y1="7" x2="19" y2="7" />
    <circle cx="9" cy="7" r="2.2" />
    <line x1="5" y1="14" x2="19" y2="14" />
    <circle cx="15" cy="14" r="2.2" />
  </svg>
);
const pushGlyph = (
  <svg {...glyphProps} width={40} height={40} stroke="var(--ink)">
    <path d="M3 11l18-8-8 18-2.5-7.5z" />
  </svg>
);
const scheduleGlyph = (
  <span className="relative grid place-items-center">
    <svg width="92" height="92" viewBox="0 0 92 92" fill="none" className="absolute" aria-hidden="true">
      <circle
        cx="46"
        cy="46"
        r="42"
        stroke="color-mix(in srgb, var(--orange) 45%, transparent)"
        strokeWidth="2"
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
    </svg>
    <svg {...glyphProps} width={48} height={48} stroke="var(--ink)">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  </span>
);
const lockGlyph = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

/* ---------- Data (copy ported verbatim) ---------- */

type Row = { kind: string; icon: IconSource; color: string; text: string };

interface Step {
  n: string;
  numColor: string;
  eyebrow: string;
  eyebrowTone?: "orange" | "amber";
  title: string;
  body: React.ReactNode;
  tone: "default" | "alt" | "dark";
  node: React.ReactNode;
  rows?: Row[];
}

const steps: Step[] = [
  {
    n: "01",
    numColor: "var(--orange)",
    eyebrow: "Discovery · the trigger",
    title: "Every system starts by listening.",
    body: "A webhook sits quietly until something happens, then fires. Discovery is the same: before we build anything, we listen. We map your current tools, find where work is getting stuck, and agree on exactly what success looks like.",
    tone: "default",
    node: <NodeCard glyph={webhookGlyph} label="Webhook" />,
    rows: [
      {
        kind: "What happens",
        icon: targetIcon,
        color: "var(--orange)",
        text: "Discovery sessions, a map of your tech stack, and a clearly scoped project.",
      },
      {
        kind: "The output",
        icon: checkIcon,
        color: "var(--green)",
        text: "A clear blueprint of the system we're about to build, no surprises.",
      },
    ],
  },
  {
    n: "02",
    numColor: "var(--orange)",
    eyebrow: "Build & feedback · the switch",
    title: "We build it, and adjust as we go.",
    body: "A switch node sends work down whichever path fits the moment. Our build phase works the same way: we develop layer by layer, then branch based on your feedback. Business needs shift, regular check-ins let us route around them instead of grinding to a halt.",
    tone: "alt",
    node: <NodeCard glyph={switchGlyph} label="Switch" />,
    rows: [
      {
        kind: "What happens",
        icon: refreshIcon,
        color: "var(--orange)",
        text: "Active development, weekly progress reviews, and quick iterative adjustments.",
      },
      {
        kind: "The output",
        icon: checkIcon,
        color: "var(--green)",
        text: "A working, end-to-end version of your automated system you can try.",
      },
    ],
  },
  {
    n: "03",
    numColor: "var(--amber)",
    eyebrow: "QA & testing · the error trigger",
    eyebrowTone: "amber",
    title: "We try to break it, on purpose.",
    body: (
      <>
        An error trigger is the safety net that catches a workflow the moment something goes wrong.
        Before going live, we deliberately feed your system bad data, dropped connections, and odd
        user behaviour, so when the real world throws a curveball, it&apos;s already handled.{" "}
        <span className="font-hand text-[1.18rem] text-amber">
          (the error trigger is us catching it first)
        </span>
      </>
    ),
    tone: "dark",
    node: <NodeCard glyph={errorGlyph} label="Error Trigger" />,
    rows: [
      {
        kind: "What happens",
        icon: funnelIcon,
        color: "var(--amber)",
        text: "Edge-case testing, load simulation, and fail-safe configuration.",
      },
      {
        kind: "The output",
        icon: checkIcon,
        color: "color-mix(in srgb, var(--green) 55%, var(--paper))",
        text: "A hardened, resilient system ready for live traffic.",
      },
    ],
  },
  {
    n: "04",
    numColor: "var(--orange)",
    eyebrow: "Handoff · set & push",
    title: "We hand you the keys.",
    body: "The last two nodes in any workflow set the final values and push them where they belong. Handoff is the same: we deploy to your live environment, lock it in, and make sure your team can run it without us. You finish this step owning a system, not renting one.",
    tone: "alt",
    node: (
      <div className="flex items-center">
        <NodeCard glyph={setGlyph} label="Set" size={132} dots="none" />
        <div className="h-[2px] w-[30px] bg-ink" />
        <div className="relative">
          <NodeCard glyph={pushGlyph} label="Push" size={132} dots="none" />
          <span className="absolute -right-[13px] -top-[13px] grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-ink bg-green">
            {lockGlyph}
          </span>
        </div>
      </div>
    ),
    rows: [
      {
        kind: "What happens",
        icon: peopleIcon,
        color: "var(--orange)",
        text: "Migration to your live environment, hands-on training, and clear documentation.",
      },
      {
        kind: "The output",
        icon: checkIcon,
        color: "var(--green)",
        text: "A fully operational system, under your control.",
      },
    ],
  },
];

const retainerTiers = [
  {
    tier: "Tier 1",
    tierColor: "var(--ink-soft)",
    name: "Basic Support & Monitoring",
    desc: "Best for smaller setups, simple lead capture or email automation.",
    features: ["Uptime monitoring", "Minor bug fixes", "General health checks"],
    featured: false,
  },
  {
    tier: "Tier 2",
    tierColor: "var(--orange)",
    name: "Growth & Systems Maintenance",
    desc: "For complex CRM routing, e-commerce syncs, or AI workflows.",
    features: ["Priority support", "Continuous optimization", "Architecture scaling as you grow"],
    featured: true,
  },
];

/* ---------- Sub-components ---------- */

function NodeCard({
  glyph,
  label,
  size = 150,
  dots = "both",
}: {
  glyph: React.ReactNode;
  label: string;
  size?: number;
  dots?: "both" | "top" | "none";
}) {
  const dot =
    "absolute left-1/2 h-[13px] w-[13px] -translate-x-1/2 rounded-full border-2 border-ink bg-ink";
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-ink bg-white shadow-raised"
      style={{ width: size, height: size }}
    >
      {(dots === "both" || dots === "top") && <span className={`${dot} -top-[7px]`} aria-hidden="true" />}
      {dots === "both" && <span className={`${dot} -bottom-[7px]`} aria-hidden="true" />}
      {glyph}
      <span className={`${display} text-[.8rem] font-bold uppercase tracking-[.05em] text-ink`}>
        {label}
      </span>
    </div>
  );
}

function StepRow({ row, onDark }: { row: Row; onDark: boolean }) {
  return (
    <div className="flex gap-[13px]">
      <Icon src={row.icon} color={row.color} size={20} style={{ marginTop: 2 }} />
      <div>
        <div
          className={`${display} mb-[3px] text-[.78rem] font-bold uppercase tracking-[.05em] ${
            onDark ? "text-on-dark-muted" : "text-ink-soft"
          }`}
        >
          {row.kind}
        </div>
        <p className={`m-0 text-[.98rem] ${onDark ? "text-on-dark-strong" : "text-ink-body"}`}>
          {row.text}
        </p>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function ProcessPage() {
  return (
    <>
      {/* ============ INTRO ============ */}
      <Section id="top" py="56px" innerStyle={{ textAlign: "center" }}>
        <div className="mb-[14px] inline-flex items-center gap-[9px]">
          <Icon src={workflowIcon} color="var(--orange)" size={18} />
          <Eyebrow>How we work together</Eyebrow>
        </div>
        <h1 className={`${heading} mx-auto max-w-[15em] text-hero text-ink`}>
          Your project, built like a{" "}
          <span className="text-orange">
            <HandUnderline>workflow.</HandUnderline>
          </span>
        </h1>
        <p className="mx-auto mb-[26px] mt-6 max-w-[34em] text-lead text-ink-body">
          Every engagement runs like one of the automations we build for you, a clear sequence of
          connected steps, each handing clean results to the next. Follow the path from first call to
          a system you own.
        </p>
        <p className="m-0 inline-flex flex-col items-center font-hand text-[1.3rem] text-ink-soft">
          ↓ follow the wires
        </p>
      </Section>

      {/* ============ STEPS 1–4 ============ */}
      {steps.map((s) => {
        const onDark = s.tone === "dark";
        return (
          <Section
            key={s.n}
            tone={s.tone}
            style={{ borderTop: `1.5px solid ${onDark ? "#000" : "var(--ink)"}` }}
          >
            <div className="grid items-center gap-12 lg:grid-cols-[40%_60%]">
              <div className="flex justify-center">{s.node}</div>
              <div>
                <div className="mb-[10px] flex items-center gap-[10px]">
                  <span className={`${display} text-base font-extrabold`} style={{ color: s.numColor }}>
                    {s.n}
                  </span>
                  <Eyebrow tone={s.eyebrowTone}>{s.eyebrow}</Eyebrow>
                </div>
                <h2
                  className={`${heading} mb-4 max-w-[14em] text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.08] ${
                    onDark ? "text-on-dark" : "text-ink"
                  }`}
                >
                  {s.title}
                </h2>
                <p
                  className={`mb-[26px] max-w-[32em] text-[1.06rem] leading-[1.6] ${
                    onDark ? "text-on-dark-strong" : "text-ink-body"
                  }`}
                >
                  {s.body}
                </p>
                <div className="flex max-w-[30em] flex-col gap-[18px]">
                  {s.rows?.map((row) => (
                    <StepRow key={row.kind} row={row} onDark={onDark} />
                  ))}
                </div>
              </div>
            </div>
          </Section>
        );
      })}

      {/* ============ STEP 5, Retainer ============ */}
      <Section style={{ borderTop: "1.5px solid var(--ink)" }}>
        <div className="grid items-center gap-12 lg:grid-cols-[40%_60%]">
          <div className="flex justify-center">
            <NodeCard glyph={scheduleGlyph} label="Schedule" dots="top" />
          </div>
          <div>
            <div className="mb-[10px] flex items-center gap-[10px]">
              <span className={`${display} text-base font-extrabold text-orange`}>05</span>
              <Eyebrow>Retainer · the schedule trigger</Eyebrow>
            </div>
            <h2 className={`${heading} mb-4 max-w-[14em] text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.08]`}>
              We keep it running on a schedule.
            </h2>
            <p className="mb-[26px] max-w-[32em] text-[1.06rem] leading-[1.6] text-ink-body">
              A schedule trigger wakes up at set intervals and does its job without being asked. An
              automated system is a living thing, rules change, the apps you connect to update, your
              volume grows. Optional retainers keep everything tuned and humming in the background.
            </p>
            <div className="grid max-w-[38em] gap-4 sm:grid-cols-2">
              {retainerTiers.map((t) => (
                <Card key={t.tier} tone="white" featured={t.featured} style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    className={`${display} text-[.74rem] font-bold uppercase tracking-[.05em]`}
                    style={{ color: t.tierColor }}
                  >
                    {t.tier}
                  </div>
                  <h3 className={`${display} mb-2 mt-[5px] text-[1.16rem] font-bold tracking-[-.01em]`}>
                    {t.name}
                  </h3>
                  <p className="mb-3 text-[.9rem] leading-[1.5] text-ink-soft">{t.desc}</p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-[9px] text-[.88rem] leading-[1.35]">
                        <Icon src={checkIcon} color="var(--green)" size={16} style={{ marginTop: 1 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============ CLOSING CTA ============ */}
      <Section tone="ink" py="60px" innerStyle={{ textAlign: "center" }} style={{ borderTop: "1.5px solid #000" }}>
        <h2
          className={`${heading} mx-auto max-w-[15em] text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.06] text-on-dark`}
        >
          That&apos;s the whole workflow.
          <br />
          <span className="text-orange">Yours starts with one call.</span>
        </h2>
        <p className="mx-auto mb-7 mt-[18px] max-w-[32em] text-lead leading-[1.6] text-on-dark-strong">
          Fifteen minutes to map where your time is leaking, then we trigger step one.
        </p>
        <BookCall size="lg" arrow>
          Book a discovery call
        </BookCall>
      </Section>
    </>
  );
}
