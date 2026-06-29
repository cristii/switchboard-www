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
import { ProcessIsoPreview } from "@/components/sections/ProcessIsoPreview";
import { processFlowDiagram, processStepDiagrams } from "@/components/editor/catalog/presets";

// Editor-scoped tokens so --editor-* resolve for the embedded isometric previews.
import "@/components/editor/theme/editor-tokens.css";

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
    node: <ProcessIsoPreview diagram={processStepDiagrams["01"]} />,
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
    node: <ProcessIsoPreview diagram={processStepDiagrams["02"]} />,
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
    node: <ProcessIsoPreview diagram={processStepDiagrams["03"]} />,
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
    node: <ProcessIsoPreview diagram={processStepDiagrams["04"]} />,
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

        <ProcessIsoPreview diagram={processFlowDiagram} variant="flow" />

        <p className="m-0 mt-7 inline-flex flex-col items-center font-hand text-[1.3rem] text-ink-soft">
          ↓ follow the wires
        </p>
      </Section>

      {/* ============ STEPS 1–4 ============ */}
      {steps.map((s) => {
        const onDark = s.tone === "dark";
        return (
          <Section
            key={s.n}
            id={`step-${s.n}`}
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
      <Section id="step-05" style={{ borderTop: "1.5px solid var(--ink)" }}>
        <div className="grid items-center gap-12 lg:grid-cols-[40%_60%]">
          <div className="flex justify-center">
            <ProcessIsoPreview diagram={processStepDiagrams["05"]} />
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
