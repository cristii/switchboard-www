import type { Metadata } from "next";

import { Eyebrow, HandUnderline, Icon, Section } from "@/components/ui";
import { ChatWidget } from "@/components/sections/ChatWidget";
import { ContactForm } from "@/components/sections/ContactForm";
import { socialLinks } from "@/lib/nav";

import sendIcon from "@/assets/icons/send.svg";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Two ways to start — both automated. Talk to the AI intake agent for an instant scope and ballpark price, or send your project specs the classic way. You'll hear back fast.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

function ColumnLabel({ tone, children }: { tone: "orange" | "muted"; children: React.ReactNode }) {
  const color = tone === "orange" ? "var(--orange)" : "var(--ink-soft)";
  return (
    <div
      className={`${display} mb-2 inline-flex items-center gap-2 text-[.72rem] font-bold uppercase tracking-[.14em]`}
      style={{ color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {children}
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="56px" innerStyle={{ textAlign: "center" }}>
        <div className="mb-[14px] inline-flex items-center gap-[9px]">
          <Icon src={sendIcon} color="var(--orange)" size={18} />
          <Eyebrow>Get in touch</Eyebrow>
        </div>
        <h1 className={`${heading} mx-auto max-w-[14em] text-hero text-ink`}>
          Two ways to start.{" "}
          <span className="text-orange">
            <HandUnderline>Both are automated.</HandUnderline>
          </span>
        </h1>
        <p className="mx-auto mt-[22px] max-w-[34em] text-lead text-ink-body">
          Talk to my AI intake agent for an instant scope and ballpark price — or fill out the form
          the classic way. Either route, you&apos;ll hear back automatically within 60 seconds.
        </p>
      </Section>

      {/* ============ TWO COLUMNS ============ */}
      <Section py="34px">
        <div className="grid items-start gap-[26px] lg:grid-cols-2">
          {/* AI agent */}
          <div>
            <div className="mb-4">
              <ColumnLabel tone="orange">The fast track</ColumnLabel>
              <h2 className={`${display} m-0 text-[1.34rem] font-extrabold tracking-[-.01em]`}>
                Want an instant estimate? Talk to my AI agent.
              </h2>
            </div>
            <ChatWidget
              variant="intake"
              title="Switchboard Intake Agent"
              status="Online · replies in seconds"
              placeholder="Describe what's eating your time…"
              heightClass="h-[600px]"
              id="intake"
              foot={
                <>
                  Scripted demo · real scopes are pushed to CRM via{" "}
                  <b className="text-ink">n8n</b> webhook
                </>
              }
            />
          </div>

          {/* classic form */}
          <div>
            <div className="mb-4">
              <ColumnLabel tone="muted">The classic way</ColumnLabel>
              <h2 className={`${display} m-0 text-[1.34rem] font-extrabold tracking-[-.01em]`}>
                Prefer the classic way? Drop your project specs below.
              </h2>
            </div>
            <ContactForm />
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-[40em] text-center text-[.96rem] text-ink-soft">
          Old-school is fine too — reach me directly at{" "}
          <a
            href={socialLinks.email}
            className="border-b-2 border-[color-mix(in_srgb,var(--orange)_35%,transparent)] font-semibold text-orange no-underline"
          >
            cristi.satcovschi@gmail.com
          </a>{" "}
          or on Telegram{" "}
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-2 border-[color-mix(in_srgb,var(--orange)_35%,transparent)] font-semibold text-orange no-underline"
          >
            @cristi_42
          </a>
          .
        </p>
      </Section>
    </>
  );
}
