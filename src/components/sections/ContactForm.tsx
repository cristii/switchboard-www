"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";

const INFRA = ["Airtable", "HubSpot", "Stripe", "Notion", "Shopify", "Custom DB", "Google Workspace", "Other"];
const STACK = ["Node.js / TypeScript", "Python", "No-Code / n8n", "Unsure"];
const BUDGETS = [
  "$800 – $1,500 · a focused build",
  "$1,500 – $4,000 · multi-workflow system",
  "$4,000 – $10,000 · custom infrastructure",
  "$10,000+ · ongoing platform work",
];

const builtWith: { label: string; dot: string }[] = [
  { label: "n8n", dot: "#EA4B71" },
  { label: "Trigger.dev", dot: "#7C66DC" },
  { label: "Node.js", dot: "#3F7A4E" },
  { label: "Python", dot: "#B45309" },
];

const label = "block font-display text-[.74rem] font-bold uppercase tracking-[.05em] text-ink-soft mb-[6px]";
const field =
  "w-full box-border rounded-[9px] border border-ink px-3 py-[11px] font-body text-[.92rem] text-ink outline-none transition-shadow focus:border-orange focus:shadow-[0_0_0_3px_rgba(180,83,9,0.14)]";

function chip(active: boolean) {
  return `inline-flex items-center gap-[7px] rounded-[9px] border px-[13px] py-2 text-[.86rem] font-semibold transition-colors ${
    active
      ? "border-orange-deep bg-orange text-white shadow-[2px_2px_0_var(--ink)]"
      : "border-ink bg-white text-ink hover:border-orange"
  }`;
}

const successSteps = [
  "Project specs received & logged",
  "Scope drafted & pushed to CRM via n8n webhook",
  "Calendar invite sent to your inbox",
];

const Check = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * The contact "classic way" project-spec form. Validates name + email, POSTs to
 * /api/lead (which forwards to the n8n webhook, degrading gracefully with no
 * env), then plays the "automation firing" success sequence, a live preview of
 * the workflow a client is buying.
 */
export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [infra, setInfra] = React.useState<string[]>([]);
  const [stack, setStack] = React.useState("");
  const [bottleneck, setBottleneck] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [err, setErr] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [steps, setSteps] = React.useState(0);

  const toggleInfra = (x: string) =>
    setInfra((cur) => (cur.includes(x) ? cur.filter((v) => v !== x) : [...cur, x]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErr("Please add your name and email so the automation has somewhere to reply.");
      return;
    }
    setErr("");
    setSubmitted(true);
    setSteps(0);
    [1, 2, 3].forEach((n) => window.setTimeout(() => setSteps(n), 750 * n));

    // Forward to n8n; the success sequence is illustrative, so don't block on it.
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, infra, stack, bottleneck, budget }),
    }).catch(() => {});
  };

  if (submitted) {
    return (
      <div className="flex min-h-[600px] flex-col justify-center rounded-lg border-strong border-ink bg-white p-8 shadow-pop">
        <div className="mb-[30px] flex flex-col items-center text-center">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-green shadow-[5px_5px_0_rgba(var(--shadow-ink),0.14)]">
            <Check size={38} />
          </span>
          <h3 className="mb-[6px] mt-[18px] font-display text-[1.5rem] font-extrabold tracking-tight">
            Specs received, automation firing.
          </h3>
          <p className="m-0 max-w-[24em] text-[.96rem] text-ink-soft">
            No 48-hour wait. Watch the same workflow I&apos;d build for you run live:
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[30em] flex-col gap-3">
          {successSteps.map((text, i) =>
            steps >= i + 1 ? (
              <div
                key={text}
                className="flex items-center gap-[13px] rounded-[12px] border border-ink bg-paper px-4 py-[14px] shadow-card"
              >
                <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-green">
                  <Check />
                </span>
                <span className="text-[.94rem] font-medium">{text}</span>
              </div>
            ) : null,
          )}
          {steps < 3 && (
            <div className="flex items-center gap-[13px] rounded-[12px] border border-dashed border-[color-mix(in_srgb,var(--ink)_40%,transparent)] bg-white px-4 py-[14px]">
              <span className="h-[26px] w-[26px] flex-none animate-spin rounded-full border-[2.5px] border-[color-mix(in_srgb,var(--ink)_25%,transparent)] border-t-orange" />
              <span className="text-[.94rem] font-medium text-ink-soft">Running workflow…</span>
            </div>
          )}
        </div>

        {steps >= 3 && (
          <div className="mt-7 text-center">
            <p className="mb-[18px] font-hand text-[1.4rem] text-orange">
              ↳ all of that in under 60 seconds, that&apos;s the system you&apos;re buying.
            </p>
            <BookCall size="lg" arrow>
              Lock in your call slot
            </BookCall>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border-strong border-ink bg-white p-6 shadow-pop"
      noValidate
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cf-name">
            Name
          </label>
          <input
            id="cf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="cf-email">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={field}
          />
        </div>
      </div>

      <div className="mt-5">
        <span className={label}>What tools do you currently use?</span>
        <div className="flex flex-wrap gap-2">
          {INFRA.map((opt) => (
            <button key={opt} type="button" onClick={() => toggleInfra(opt)} className={chip(infra.includes(opt))}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="cf-bottleneck">
          What manual process is costing you the most time?
        </label>
        <textarea
          id="cf-bottleneck"
          rows={3}
          value={bottleneck}
          onChange={(e) => setBottleneck(e.target.value)}
          placeholder="e.g. We re-key every Stripe order into HubSpot by hand…"
          className={`${field} resize-y`}
        />
      </div>

      <div className="mt-5">
        <span className={label}>Preferred ecosystem</span>
        <div className="flex flex-wrap gap-2">
          {STACK.map((opt) => (
            <button key={opt} type="button" onClick={() => setStack(opt)} className={chip(stack === opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="cf-budget">
          Budget range
        </label>
        <select
          id="cf-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={`${field} cursor-pointer bg-white`}
        >
          <option value="">Select a range, builds start at $800</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {err && <p className="mt-[14px] text-[.86rem] font-medium text-[#C12A2A]">{err}</p>}

      <Button type="submit" arrow style={{ width: "100%", marginTop: 22, minHeight: 52 }}>
        Send project specs
      </Button>

      <div className="mt-5 border-t border-[color-mix(in_srgb,var(--ink)_12%,transparent)] pt-[18px]">
        <div className="mb-[10px] text-center font-display text-[.66rem] font-bold uppercase tracking-[.12em] text-ink-soft">
          Built with
        </div>
        <div className="flex flex-wrap justify-center gap-[9px]">
          {builtWith.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-[7px] rounded-[20px] border border-ink bg-paper px-[13px] py-[6px] font-display text-[.82rem] font-bold"
            >
              <span className="h-[9px] w-[9px] rounded-full" style={{ background: b.dot }} />
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}

export default ContactForm;
