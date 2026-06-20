"use client";

import * as React from "react";
import { Icon, type IconSource } from "@/components/ui";

import assistantIcon from "@/assets/icons/assistant.svg";
import checkIcon from "@/assets/icons/check.svg";
import lightbulbIcon from "@/assets/icons/lightbulb.svg";
import linkIcon from "@/assets/icons/link.svg";
import mailIcon from "@/assets/icons/mail.svg";
import peopleIcon from "@/assets/icons/people.svg";
import refreshIcon from "@/assets/icons/refresh.svg";
import sendIcon from "@/assets/icons/send.svg";
import storefrontIcon from "@/assets/icons/storefront.svg";
import targetIcon from "@/assets/icons/target.svg";
import workflowIcon from "@/assets/icons/workflow.svg";

type AppKey = "gmail" | "shopify" | "airtable" | "slack" | "openai";
type Model = "mini" | "4o" | "opus";
type TokenLen = "short" | "medium" | "long";
type Hosting = "vps" | "cloud";
type ToolKey = "crm" | "email" | "api";

interface CalcState {
  apps: Record<AppKey, boolean>;
  executions: number;
  hosting: Hosting;
  messages: number;
  tokenLen: TokenLen;
  model: Model;
  memory: boolean;
  tools: Record<ToolKey, boolean>;
  preset: string | null;
}

const EXEC_RATE = 0.0005;
const MODEL_PRICE: Record<Model, number> = { mini: 0.003, "4o": 0.01, opus: 0.03 };
const TOK: Record<TokenLen, number> = { short: 100, medium: 300, long: 800 };

const APP_META: Record<AppKey, { name: string; icon: IconSource; color: string; low: number; high: number }> = {
  gmail: { name: "Gmail", icon: mailIcon, color: "var(--orange)", low: 0, high: 0 },
  shopify: { name: "Shopify", icon: storefrontIcon, color: "var(--green)", low: 5, high: 8 },
  airtable: { name: "Airtable", icon: workflowIcon, color: "var(--orange)", low: 3, high: 5 },
  slack: { name: "Slack", icon: sendIcon, color: "var(--orange)", low: 0, high: 0 },
  openai: { name: "OpenAI", icon: assistantIcon, color: "var(--violet)", low: 0, high: 0 },
};

const INITIAL: CalcState = {
  apps: { gmail: false, shopify: false, airtable: false, slack: false, openai: false },
  executions: 10000,
  hosting: "vps",
  messages: 2000,
  tokenLen: "medium",
  model: "mini",
  memory: false,
  tools: { crm: false, email: false, api: false },
  preset: null,
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const money = (n: number) => "$" + Math.round(n);
const execTier = (e: number) => (e <= 5000 ? 0 : e <= 25000 ? 1 : 2);

const posToExec = (p: number) => {
  const e = 1000 * Math.pow(10, p / 50);
  return e < 10000 ? Math.round(e / 100) * 100 : Math.round(e / 1000) * 1000;
};
const execToPos = (e: number) => Math.max(0, Math.min(100, 50 * Math.log10(e / 1000)));
const posToMsg = (p: number) => {
  const m = 100 * Math.pow(10, p / 50);
  return m < 1000 ? Math.round(m / 50) * 50 : Math.round(m / 100) * 100;
};
const msgToPos = (m: number) => Math.max(0, Math.min(100, 50 * Math.log10(m / 100)));

function compute(s: CalcState) {
  const tier = execTier(s.executions);
  const hostTable: Record<Hosting, [number, number][]> = {
    vps: [[10, 15], [20, 30], [30, 40]],
    cloud: [[20, 25], [30, 40], [45, 60]],
  };
  const tierName = ["Starter tier", "Growth tier", "Scale tier"][tier];
  const [hLow, hHigh] = hostTable[s.hosting][tier];

  const ec = s.executions * EXEC_RATE;
  const execLow = ec * 0.8;
  const execHigh = ec * 1.2;

  let intLow = 0;
  let intHigh = 0;
  (Object.keys(s.apps) as AppKey[]).forEach((k) => {
    if (s.apps[k] && k !== "openai") {
      intLow += APP_META[k].low;
      intHigh += APP_META[k].high;
    }
  });

  const ai = s.apps.openai;
  const tpm = TOK[s.tokenLen];
  const totalTokens = ai ? s.messages * tpm * 2 : 0;
  const aiBase = ai ? (totalTokens / 1000) * MODEL_PRICE[s.model] : 0;
  const aiLow = aiBase * 0.85;
  const aiHigh = aiBase * 1.3;

  const memLow = ai && s.memory ? 8 : 0;
  const memHigh = ai && s.memory ? 12 : 0;
  let toolsN = 0;
  if (ai) (Object.keys(s.tools) as ToolKey[]).forEach((t) => s.tools[t] && toolsN++);
  const toolLow = toolsN * 1;
  const toolHigh = toolsN * 2.5;

  const low = hLow + execLow + intLow + aiLow + memLow + toolLow;
  const high = hHigh + execHigh + intHigh + aiHigh + memHigh + toolHigh;

  return { tier, tierName, hLow, hHigh, execLow, execHigh, intLow, intHigh, ai, totalTokens, aiLow, aiHigh, memLow, memHigh, toolLow, toolHigh, toolsN, low, high };
}

function complexity(s: CalcState) {
  let n = 0;
  (Object.keys(s.apps) as AppKey[]).forEach((k) => s.apps[k] && (n += 12));
  if (s.apps.openai) n += 18;
  if (s.apps.openai && s.memory) n += 14;
  if (s.apps.openai) (Object.keys(s.tools) as ToolKey[]).forEach((t) => s.tools[t] && (n += 8));
  n += execTier(s.executions) * 7;
  n = Math.max(8, Math.min(100, n));
  if (n > 62) return { pct: n, label: "Complex", color: "#C12A2A" };
  if (n > 34) return { pct: n, label: "Moderate", color: "var(--orange)" };
  return { pct: n, label: "Simple", color: "var(--green)" };
}

interface FlowNode {
  key: string;
  label: string;
  sub: string;
  icon: IconSource;
  accent: string;
  cost: string;
  costMuted: boolean;
  heavy: boolean;
}

function buildNodes(s: CalcState, c: ReturnType<typeof compute>): FlowNode[] {
  const nodes: FlowNode[] = [];
  nodes.push({ key: "trigger", label: "Trigger", sub: s.apps.openai ? "Chat widget" : "Webhook", icon: targetIcon, accent: "var(--ink)", cost: "free", costMuted: true, heavy: false });
  (["gmail", "shopify", "airtable", "slack"] as AppKey[]).forEach((k) => {
    if (s.apps[k]) {
      const m = APP_META[k];
      const cost = m.high === 0 ? "free" : "$" + m.low + (m.high !== m.low ? "–" + m.high : "");
      nodes.push({ key: k, label: m.name, sub: "Integration", icon: m.icon, accent: m.color, cost, costMuted: m.high === 0, heavy: false });
    }
  });
  if (s.apps.openai) {
    const mLabel = { mini: "GPT-4o mini", "4o": "GPT-4o", opus: "Claude Opus" }[s.model];
    const heavy = s.model === "opus" || s.messages >= 5000;
    nodes.push({ key: "llm", label: mLabel, sub: "AI model", icon: assistantIcon, accent: "var(--violet)", cost: money(c.aiLow) + "–" + money(c.aiHigh), costMuted: false, heavy });
    if (s.memory) nodes.push({ key: "mem", label: "Memory", sub: "Remembers conversations", icon: refreshIcon, accent: "var(--violet)", cost: money(c.memLow) + "–" + money(c.memHigh), costMuted: false, heavy: false });
    if (s.tools.crm) nodes.push({ key: "crm", label: "CRM lookup", sub: "Tool", icon: peopleIcon, accent: "var(--green)", cost: "usage", costMuted: true, heavy: false });
    if (s.tools.email) nodes.push({ key: "email", label: "Email sender", sub: "Tool", icon: mailIcon, accent: "var(--green)", cost: "usage", costMuted: true, heavy: false });
    if (s.tools.api) nodes.push({ key: "api", label: "API call", sub: "Tool", icon: linkIcon, accent: "var(--green)", cost: "usage", costMuted: true, heavy: false });
  }
  nodes.push({ key: "out", label: s.apps.openai ? "Response" : "Done", sub: "Output", icon: checkIcon, accent: "var(--green)", cost: "", costMuted: true, heavy: false });
  return nodes;
}

function tipFor(s: CalcState, c: ReturnType<typeof compute>) {
  if (s.apps.openai && s.model === "opus") return "Most clients start with GPT-4o mini and upgrade later — that alone saves about 70% on AI cost.";
  if (execTier(s.executions) === 2) return "Batch your executions where you can — grouping runs can cut billable executions by ~30% for the same work.";
  if (s.apps.openai && s.memory && s.messages >= 5000) return "A high message volume with full memory gets pricey — trimming the memory window keeps quality with a smaller bill.";
  if (c.high < 35) return "This is a lean setup — exactly where most clients start before layering on AI and follow-ups.";
  return "Every number here is the raw infrastructure cost. Our build fee is one-time — no recurring agency markup on top.";
}

const PRESETS: Record<string, Partial<CalcState>> = {
  chatbot: { apps: { gmail: false, shopify: false, airtable: false, slack: false, openai: true }, memory: true, model: "mini", messages: 2000, tokenLen: "medium", tools: { crm: true, email: false, api: false }, executions: 8000 },
  leadgen: { apps: { gmail: true, shopify: false, airtable: true, slack: true, openai: false }, executions: 5000 },
  ecommerce: { apps: { gmail: true, shopify: true, airtable: true, slack: false, openai: false }, executions: 25000 },
  content: { apps: { gmail: false, shopify: false, airtable: true, slack: true, openai: true }, model: "4o", tokenLen: "long", messages: 1000, executions: 12000 },
};

const display = "font-display";

function Toggle({ on, onClick, scale = 1 }: { on: boolean; onClick: () => void; scale?: number }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="relative h-[26px] w-[46px] flex-none rounded-[20px] border border-ink transition-colors"
      style={{ background: on ? "var(--orange)" : "var(--paper-2)", transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      <span
        className="absolute top-[1.5px] h-[19px] w-[19px] rounded-full transition-transform"
        style={{ left: 2, background: on ? "#fff" : "var(--ink)", transform: on ? "translateX(20px)" : "none" }}
      />
    </button>
  );
}

const presetLabels: { key: string; label: string }[] = [
  { key: "chatbot", label: "AI Chatbot" },
  { key: "leadgen", label: "Lead generation" },
  { key: "ecommerce", label: "E-commerce sync" },
  { key: "content", label: "Content pipeline" },
];

const appLabels: { key: AppKey; label: string }[] = [
  { key: "gmail", label: "Gmail" },
  { key: "shopify", label: "Shopify" },
  { key: "airtable", label: "Airtable" },
  { key: "slack", label: "Slack" },
  { key: "openai", label: "OpenAI" },
];

export function Calculator() {
  const [s, setS] = React.useState<CalcState>(INITIAL);
  const update = (patch: Partial<CalcState>) => setS((cur) => ({ ...cur, ...patch }));

  const c = compute(s);
  const cx = complexity(s);
  const nodes = buildNodes(s, c);

  const integrations = (Object.keys(s.apps) as AppKey[])
    .filter((k) => s.apps[k])
    .map((k) => {
      const m = APP_META[k];
      const cost = k === "openai" ? "usage-based" : m.high === 0 ? "free" : "$" + m.low + (m.high !== m.low ? "–$" + m.high : "");
      return { key: k, name: m.name, icon: m.icon, color: m.color, cost };
    });

  const breakdown: { label: string; value: string }[] = [
    { label: "Hosting", value: `$${Math.round(c.hLow)}–$${Math.round(c.hHigh)}` },
    { label: "Executions", value: `$${Math.round(c.execLow)}–$${Math.round(c.execHigh)}` },
  ];
  if (c.intHigh > 0) breakdown.push({ label: "Integration APIs", value: `$${Math.round(c.intLow)}–$${Math.round(c.intHigh)}` });
  if (s.apps.openai) breakdown.push({ label: "AI usage", value: `$${Math.round(c.aiLow)}–$${Math.round(c.aiHigh)}` });
  if (s.apps.openai && s.memory) breakdown.push({ label: "Memory (vector DB)", value: `$${Math.round(c.memLow)}–$${Math.round(c.memHigh)}` });

  const hostTierLabel = (s.hosting === "vps" ? "VPS · " : "Cloud · ") + ["Starter", "Growth", "Scale"][c.tier] + " tier";

  const applyPreset = (p: string) => setS({ ...INITIAL, ...PRESETS[p], preset: p });

  const toggleApp = (k: AppKey) => setS((cur) => ({ ...cur, apps: { ...cur.apps, [k]: !cur.apps[k] }, preset: null }));
  const toggleTool = (t: ToolKey) => setS((cur) => ({ ...cur, tools: { ...cur.tools, [t]: !cur.tools[t] } }));

  const download = () => {
    const apps = (Object.keys(s.apps) as AppKey[]).filter((k) => s.apps[k]).map((k) => APP_META[k].name).join(", ") || "none";
    const lines = [
      "SWITCHBOARD — AUTOMATION COST ESTIMATE",
      "======================================",
      "",
      "Executions / month: " + fmt(s.executions),
      "Integrations: " + apps,
      "Hosting: " + (s.hosting === "vps" ? "Self-hosted VPS" : "n8n Cloud") + " (" + c.tierName + ")",
    ];
    if (s.apps.openai) {
      lines.push("AI model: " + s.model + " | messages/mo: " + fmt(s.messages) + " | length: " + s.tokenLen + " | memory: " + (s.memory ? "on" : "off"));
      lines.push("Est. tokens/mo: ~" + fmt(c.totalTokens));
    }
    lines.push("", "ESTIMATED MONTHLY COST: $" + Math.round(c.low) + " – $" + Math.round(c.high), "", "Hosting: $" + Math.round(c.hLow) + "–$" + Math.round(c.hHigh), "Executions: $" + Math.round(c.execLow) + "–$" + Math.round(c.execHigh));
    if (c.intHigh) lines.push("Integrations: $" + Math.round(c.intLow) + "–$" + Math.round(c.intHigh));
    if (s.apps.openai) lines.push("AI usage: $" + Math.round(c.aiLow) + "–$" + Math.round(c.aiHigh));
    lines.push("", "Estimate only. Book a call for an exact quote → Switchboard AI Systems");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "switchboard-estimate.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const sectionLabel = `${display} text-[.78rem] font-extrabold uppercase tracking-[.06em] text-ink`;
  const rangeStyle = { accentColor: "var(--orange)" } as React.CSSProperties;
  const modelCard = (sel: boolean) =>
    `min-w-0 flex-1 cursor-pointer rounded-[11px] bg-white p-[11px] text-left shadow-[2px_2px_0_rgba(21,33,31,0.1)] transition-transform hover:-translate-y-[1px] ${sel ? "border-2 border-orange shadow-[3px_3px_0_var(--orange)]" : "border border-ink"}`;
  const pillOpt = (sel: boolean) =>
    `${display} rounded-[9px] border px-3 py-2 text-[.8rem] font-bold transition-colors ${sel ? "border-ink bg-ink text-on-dark" : "border-ink bg-white text-ink-soft"}`;

  return (
    <>
      {/* Presets */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className={`${display} text-[.74rem] font-bold uppercase tracking-[.06em] text-ink-soft`}>
          Quick start:
        </span>
        {presetLabels.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.key)}
            className={`${display} rounded-[10px] border-2 border-ink px-[15px] py-[10px] text-[.82rem] font-bold shadow-[3px_3px_0_rgba(21,33,31,0.18)] transition-transform hover:-translate-y-[2px] ${
              s.preset === p.key ? "bg-ink text-on-dark shadow-[3px_3px_0_var(--orange)]" : "bg-paper text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        {/* LEFT: workflow builder */}
        <div className="min-h-[560px] rounded-[18px] border border-ink bg-white p-6 shadow-card">
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className={`${display} text-[1.15rem] font-extrabold tracking-[-.01em]`}>Your workflow</div>
              <div className="text-[.84rem] text-ink-soft">Tap an app to add it to the flow.</div>
            </div>
            <div className="min-w-[200px]">
              <div className={`${display} mb-[5px] flex justify-between text-[.68rem] font-bold uppercase tracking-[.05em] text-ink-soft`}>
                <span>Complexity</span>
                <span style={{ color: cx.color }}>{cx.label}</span>
              </div>
              <div className="h-[9px] overflow-hidden rounded-[6px] border border-ink bg-paper-2">
                <div className="h-full transition-all" style={{ width: `${cx.pct}%`, background: cx.color }} />
              </div>
            </div>
          </div>

          {/* app chips */}
          <div className="mb-6 flex flex-wrap gap-[10px]">
            {appLabels.map((a) => {
              const on = s.apps[a.key];
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleApp(a.key)}
                  className={`${display} inline-flex items-center gap-2 rounded-[10px] border px-[13px] py-[9px] text-[.82rem] font-bold shadow-[2px_2px_0_rgba(21,33,31,0.12)] transition-transform hover:-translate-y-[1px] ${
                    on ? "border-orange-deep bg-orange text-white shadow-[2px_2px_0_var(--ink)]" : "border-ink bg-white text-ink"
                  }`}
                >
                  <Icon src={APP_META[a.key].icon} color={on ? "#fff" : "var(--ink)"} size={18} />
                  {a.label}
                </button>
              );
            })}
          </div>

          {/* node canvas */}
          <div className="flex flex-col items-center py-2">
            {nodes.map((n, i) => (
              <div key={n.key} className="flex w-full max-w-[330px] flex-col items-center">
                {i > 0 && (
                  <div
                    className="mx-auto h-[26px] w-[2px]"
                    style={{ background: "repeating-linear-gradient(180deg, color-mix(in srgb, var(--ink) 30%, transparent) 0 6px, transparent 6px 12px)" }}
                  />
                )}
                <div
                  className="flex w-full items-center gap-[13px] rounded-[13px] border border-ink bg-white px-[15px] py-[13px] shadow-raised"
                  style={{ borderLeft: `5px solid ${n.accent}` }}
                >
                  <Icon src={n.icon} color={n.accent} size={24} />
                  <div className="min-w-0 flex-1">
                    <div className={`${display} text-[.98rem] font-bold leading-[1.2] tracking-[-.01em]`}>{n.label}</div>
                    <div className="text-[.76rem] text-ink-soft">{n.sub}</div>
                  </div>
                  {n.cost && (
                    <span className="whitespace-nowrap font-mono text-[.78rem] font-semibold" style={{ color: n.costMuted ? "var(--ink-soft)" : n.accent }}>
                      {n.cost}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: cost panel */}
        <div className="overflow-hidden rounded-[18px] border border-ink bg-white shadow-raised lg:sticky lg:top-[86px]">
          {/* Usage */}
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_12%,transparent)] px-[22px] py-5">
            <div className={`${sectionLabel} mb-[14px]`}>Usage</div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[.86rem] text-ink-soft">Executions / month</span>
              <span className={`${display} text-[1.05rem] font-extrabold text-orange`}>{fmt(s.executions)}</span>
            </div>
            <input type="range" min={0} max={100} step={1} value={Math.round(execToPos(s.executions))} onChange={(e) => update({ executions: posToExec(+e.target.value), preset: null })} className="w-full" style={rangeStyle} />
            <div className={`${display} mt-[6px] flex justify-between text-[.7rem] font-semibold text-ink-soft`}>
              <span>1k</span>
              <span>10k</span>
              <span>100k</span>
            </div>
          </div>

          {/* Integrations */}
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_12%,transparent)] px-[22px] py-5">
            <div className={`${sectionLabel} mb-3`}>Integrations</div>
            {integrations.length > 0 ? (
              integrations.map((ig) => (
                <div key={ig.key} className="flex items-center justify-between py-[5px] text-[.9rem]">
                  <span className="inline-flex items-center gap-[9px]">
                    <Icon src={ig.icon} color={ig.color} size={16} />
                    {ig.name}
                  </span>
                  <span className="font-mono text-[.82rem] text-ink-soft">{ig.cost}</span>
                </div>
              ))
            ) : (
              <div className="font-hand text-[1.15rem] text-ink-soft">↳ add an app on the left to begin</div>
            )}
          </div>

          {/* AI usage */}
          {s.apps.openai && (
            <div
              className="border-b border-[color-mix(in_srgb,var(--ink)_12%,transparent)] px-[22px] py-5"
              style={{ background: "color-mix(in srgb, var(--violet) 5%, transparent)" }}
            >
              <div className={`${display} mb-[14px] text-[.78rem] font-extrabold uppercase tracking-[.06em]`} style={{ color: "var(--violet)" }}>
                AI usage
              </div>
              <div className="mb-[7px] flex items-baseline justify-between">
                <span className="text-[.86rem] text-ink-soft">Messages / month</span>
                <span className={`${display} text-[1rem] font-extrabold`} style={{ color: "var(--violet)" }}>{fmt(s.messages)}</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={Math.round(msgToPos(s.messages))} onChange={(e) => update({ messages: posToMsg(+e.target.value), preset: null })} className="w-full" style={{ accentColor: "var(--violet)" }} />
              <div className={`${display} mb-4 mt-[6px] flex justify-between text-[.7rem] font-semibold text-ink-soft`}>
                <span>100</span>
                <span>1k</span>
                <span>10k</span>
              </div>

              <div className="mb-[7px] text-[.82rem] text-ink-soft">Response length</div>
              <div className="mb-4 flex gap-[7px]">
                {(["short", "medium", "long"] as TokenLen[]).map((t) => (
                  <button key={t} type="button" onClick={() => update({ tokenLen: t })} className={pillOpt(s.tokenLen === t)}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="mb-2 text-[.82rem] text-ink-soft">Model</div>
              <div className="mb-4 flex gap-2">
                {([
                  { k: "mini", name: "GPT-4o mini", note: "$0.003 / 1k · fast" },
                  { k: "4o", name: "GPT-4o", note: "$0.01 / 1k · balanced" },
                  { k: "opus", name: "Claude Opus", note: "$0.03 / 1k · premium" },
                ] as { k: Model; name: string; note: string }[]).map((m) => (
                  <button key={m.k} type="button" onClick={() => update({ model: m.k })} className={modelCard(s.model === m.k)}>
                    <div className={`${display} text-[.84rem] font-extrabold`}>{m.name}</div>
                    <div className="mt-[2px] text-[.72rem] text-ink-soft">{m.note}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[color-mix(in_srgb,var(--ink)_10%,transparent)] py-[10px]">
                <span className="text-[.9rem]">Conversation memory</span>
                <Toggle on={s.memory} onClick={() => update({ memory: !s.memory })} />
              </div>

              <div className="my-2 text-[.82rem] text-ink-soft">Assistant can also…</div>
              <div className="flex flex-col gap-2">
                {([
                  { k: "crm", label: "Look up CRM data", icon: peopleIcon },
                  { k: "email", label: "Send emails", icon: mailIcon },
                  { k: "api", label: "Call other apps", icon: linkIcon },
                ] as { k: ToolKey; label: string; icon: IconSource }[]).map((t) => (
                  <div key={t.k} className="flex items-center justify-between text-[.88rem]">
                    <span className="inline-flex items-center gap-2">
                      <Icon src={t.icon} color="var(--violet)" size={16} />
                      {t.label}
                    </span>
                    <Toggle on={s.tools[t.k]} onClick={() => toggleTool(t.k)} scale={0.82} />
                  </div>
                ))}
              </div>

              <div className="mt-[14px] flex items-baseline justify-between border-t border-[color-mix(in_srgb,var(--ink)_10%,transparent)] pt-[10px] text-[.84rem]">
                <span className="text-ink-soft">≈ {fmt(c.totalTokens)} tokens / mo</span>
                <span className="font-mono font-semibold" style={{ color: "var(--violet)" }}>
                  {money(c.aiLow)}–{money(c.aiHigh)}
                </span>
              </div>
            </div>
          )}

          {/* Hosting */}
          <div className="border-b border-[color-mix(in_srgb,var(--ink)_12%,transparent)] px-[22px] py-5">
            <div className={`${sectionLabel} mb-3`}>Hosting</div>
            <div className="mb-[10px] flex gap-2">
              {([
                { k: "vps", name: "Self-hosted VPS", note: "Cheapest · you own it" },
                { k: "cloud", name: "n8n Cloud", note: "Managed · zero setup" },
              ] as { k: Hosting; name: string; note: string }[]).map((h) => (
                <button key={h.k} type="button" onClick={() => update({ hosting: h.k })} className={modelCard(s.hosting === h.k)}>
                  <div className={`${display} text-[.86rem] font-extrabold`}>{h.name}</div>
                  <div className="mt-[2px] text-[.72rem] text-ink-soft">{h.note}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-[.84rem] text-ink-soft">
              <span>{hostTierLabel}</span>
              <span className="font-mono font-semibold text-ink">${Math.round(c.hLow)}–${Math.round(c.hHigh)}</span>
            </div>
          </div>

          {/* Result */}
          <div className="bg-dark px-[22px] py-[22px] text-on-dark">
            <div className={`${display} mb-[6px] text-[.72rem] font-bold uppercase tracking-[.07em] text-amber`}>
              Estimated monthly cost
            </div>
            <div className={`${display} flex items-baseline gap-[6px] font-extrabold leading-none tracking-[-.02em]`}>
              <span className="text-[2.9rem]">${Math.round(c.low)}</span>
              <span className="text-[1.6rem] text-on-dark-muted">–</span>
              <span className="text-[2.9rem]">${Math.round(c.high)}</span>
            </div>
            <div className="mt-[14px] flex flex-col gap-[5px]">
              {breakdown.map((b) => (
                <div key={b.label} className="flex justify-between text-[.84rem] text-on-dark-strong">
                  <span>{b.label}</span>
                  <span className="font-mono text-on-dark">{b.value}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-[14px] flex items-start gap-[9px] rounded-[10px] p-[11px_13px]"
              style={{ background: "color-mix(in srgb, var(--amber) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--amber) 30%, transparent)" }}
            >
              <Icon src={lightbulbIcon} color="var(--amber)" size={17} style={{ marginTop: 1 }} />
              <span className="text-[.84rem] leading-[1.45] text-[#F2E6C4]">{tipFor(s, c)}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-[10px] px-[22px] py-5">
            <div className={`${display} mb-[2px] text-center text-[1.02rem] font-extrabold tracking-[-.01em]`}>
              Want me to build this for you?
            </div>
            <a
              href="/contact"
              className={`${display} flex min-h-[50px] items-center justify-center gap-[.5em] rounded-[10px] border-2 border-orange-deep bg-orange text-[.95rem] font-bold uppercase tracking-[.02em] text-white no-underline shadow-[3px_3px_0_var(--ink)]`}
            >
              Book a call →
            </a>
            <div className="flex gap-[10px]">
              <a
                href="/contact"
                className={`${display} flex min-h-[46px] flex-1 items-center justify-center rounded-[10px] border-2 border-ink bg-paper text-[.84rem] font-bold uppercase tracking-[.02em] text-ink no-underline shadow-[3px_3px_0_rgba(21,33,31,0.18)]`}
              >
                Get exact quote
              </a>
              <button
                type="button"
                onClick={download}
                className={`${display} flex min-h-[46px] flex-1 items-center justify-center gap-[6px] rounded-[10px] border-2 border-ink bg-white text-[.84rem] font-bold uppercase tracking-[.02em] text-ink shadow-[3px_3px_0_rgba(21,33,31,0.18)]`}
              >
                Download
              </button>
            </div>
            <p className="m-0 text-center text-[.76rem] text-ink-soft">
              Estimate only · used by freelancers &amp; small businesses
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculator;
