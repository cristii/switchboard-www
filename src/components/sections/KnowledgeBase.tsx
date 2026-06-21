"use client";

import * as React from "react";
import { Badge, Icon } from "@/components/ui";
import {
  getArticle,
  navGroups,
  order,
  searchIndex,
  type Article,
  type Block,
} from "@/lib/kb";

import lightbulbIcon from "@/assets/icons/lightbulb.svg";
import workflowIcon from "@/assets/icons/workflow.svg";
import funnelIcon from "@/assets/icons/funnel.svg";
import linkIcon from "@/assets/icons/link.svg";

const display = "font-display";
const ERROR_RED = "#C12A2A";

const SearchGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
);

/* ---- block renderers ---- */

function CodeCard({ file, code }: { file: string; code: string }) {
  return (
    <div className="my-[18px] overflow-hidden rounded-[12px] border border-ink shadow-card">
      <div className="flex items-center gap-[7px] border-b border-[#14161b] bg-[#21252b] px-[13px] py-[9px]">
        <span className="h-[11px] w-[11px] rounded-full bg-[#e06c75]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#e5c07b]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#98c379]" />
        <span className="ml-2 font-mono text-[.72rem] text-[#9da5b4]">{file}</span>
      </div>
      <pre className="m-0 overflow-x-auto bg-[#282c34] px-[17px] py-[15px] font-mono text-[.82rem] leading-[1.7] text-[#abb2bf]">
        {code}
      </pre>
    </div>
  );
}

function Callout({ kind, label, text }: { kind: "tip" | "warn" | "note"; label: string; text: string }) {
  const color = kind === "tip" ? "var(--green)" : kind === "warn" ? ERROR_RED : "var(--orange)";
  return (
    <blockquote
      className="my-5 rounded-[10px] border border-ink bg-white px-[18px] py-[14px] text-[.94rem] leading-[1.6]"
      style={{ borderLeftWidth: 5, borderLeftColor: color }}
    >
      <span className={`${display} mb-[5px] block text-[.72rem] font-bold uppercase tracking-[.06em]`} style={{ color }}>
        {label}
      </span>
      <span className="text-ink-body">{text}</span>
    </blockquote>
  );
}

function Tabs({ tabs }: { tabs: { label: string; file: string; code: string }[] }) {
  const [active, setActive] = React.useState(0);
  return (
    <div className="mt-[18px]">
      <div className="flex flex-wrap gap-1">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={`${display} -mb-[1.5px] rounded-t-[9px] border border-b-0 border-ink px-[14px] py-[7px] text-[.76rem] font-bold uppercase tracking-[.03em] ${
              i === active ? "bg-[#21252b] text-white" : "bg-paper-2 text-ink-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="[&>div]:mt-0 [&_.cc]:rounded-tl-none">
        <CodeCard file={tabs[active].file} code={tabs[active].code} />
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "h":
      return (
        <h2 id={block.id} className={`${display} mb-[14px] mt-[38px] scroll-mt-[90px] text-[1.5rem] font-extrabold tracking-tight`}>
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mb-4 text-ink-body">{block.text}</p>;
    case "ul":
      return (
        <ul className="mb-[18px] list-disc pl-[22px]">
          {block.items.map((it) => (
            <li key={it} className="my-[6px] text-ink-body">
              {it}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout kind={block.kind} label={block.label} text={block.text} />;
    case "code":
      return <CodeCard file={block.file} code={block.code} />;
    case "tabs":
      return <Tabs tabs={block.tabs} />;
    default:
      return null;
  }
}

/* ---- home + article ---- */

const homeCards: { id: string; icon: typeof lightbulbIcon; color: string; tint: string; title: string; body: string; links: { id: string; label: string }[] }[] = [
  {
    id: "introduction",
    icon: lightbulbIcon,
    color: "var(--orange)",
    tint: "color-mix(in srgb, var(--orange) 10%, transparent)",
    title: "Learn",
    body: "Concepts and quickstarts, why event-driven, and how to ship your first workflow.",
    links: [
      { id: "core-concepts", label: "Core concepts" },
      { id: "quickstart-n8n", label: "Your first n8n webhook" },
      { id: "idempotency", label: "Idempotency in workflows" },
    ],
  },
  {
    id: "n8n-standard",
    icon: workflowIcon,
    color: "var(--green)",
    tint: "color-mix(in srgb, var(--green) 12%, transparent)",
    title: "Reference",
    body: "Factual, skimmable node-by-node docs and a searchable blueprint library.",
    links: [
      { id: "n8n-standard", label: "n8n nodes (standard)" },
      { id: "trigger-workflows", label: "Trigger.dev workflows" },
      { id: "n8n-expressions", label: "Expressions & JSON" },
    ],
  },
  {
    id: "guide-crm",
    icon: funnelIcon,
    color: "var(--violet)",
    tint: "color-mix(in srgb, var(--violet) 13%, transparent)",
    title: "Guides",
    body: "End-to-end recipes organized by business outcome, billing, CRM, support.",
    links: [
      { id: "guide-billing", label: "Payments & billing" },
      { id: "guide-crm", label: "Operational CRM" },
      { id: "guide-support", label: "Customer support" },
    ],
  },
];

const blueprints: { id: string; badges: { label: string; variant: "violet" | "amber" | "green" | "neutral" }[]; title: string; body: string }[] = [
  { id: "bp-slack-notion-llm", badges: [{ label: "AI", variant: "violet" }, { label: "JSON", variant: "neutral" }], title: "Slack → Notion → LLM", body: "Summarize Slack threads with an LLM and file them in Notion automatically." },
  { id: "bp-api", badges: [{ label: "n8n", variant: "amber" }, { label: "Webhooks", variant: "neutral" }], title: "Resilient API sync", body: "Two-way sync between any REST API and your database with retries built in." },
  { id: "bp-data", badges: [{ label: "Transform", variant: "green" }, { label: "JSON", variant: "neutral" }], title: "Flatten nested payloads", body: "Reshape messy nested webhook bodies into clean flat database rows." },
];

export function KnowledgeBase() {
  const [id, setId] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const article = id ? getArticle(id) : null;
  const go = (next: string | null) => {
    setId(next);
    setSearchOpen(false);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        setQuery("");
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const q = query.trim().toLowerCase();
  const results = q
    ? searchIndex.filter((r) => (r.title + " " + r.snippet + " " + r.tier).toLowerCase().includes(q))
    : searchIndex.slice(0, 6);

  const idx = article ? order.indexOf(article.id) : -1;
  const prev = idx > 0 ? getArticle(order[idx - 1]) : undefined;
  const next = idx >= 0 && idx < order.length - 1 ? getArticle(order[idx + 1]) : undefined;

  const searchButton = (big?: boolean) => (
    <button
      type="button"
      onClick={() => {
        setSearchOpen(true);
        setQuery("");
      }}
      className={`flex w-full items-center gap-[10px] rounded-[10px] border border-ink bg-white px-3 text-ink-soft ${
        big ? "h-[52px] max-w-[560px] border-2 text-base shadow-card" : "h-[40px] max-w-[460px] text-[.9rem]"
      }`}
    >
      <SearchGlyph size={big ? 19 : 16} />
      <span className="flex-1 text-left">{big ? "Try “webhook”, “timeout”, “idempotency”…" : "Search the docs…"}</span>
      <kbd className="rounded-[5px] border-[1.5px] border-ink bg-paper px-[6px] py-[1px] font-mono text-[.68rem] text-ink shadow-[1px_1px_0_rgba(21,33,31,0.2)]">
        ⌘K
      </kbd>
    </button>
  );

  return (
    <div className="mx-auto grid max-w-content items-start gap-0 px-gutter lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="border-b border-ink py-5 lg:sticky lg:top-[78px] lg:h-[calc(100vh-90px)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:pr-4">
        <nav>
          {navGroups.map((g) => (
            <div key={g.title} className="mb-3">
              <div className={`${display} px-3 py-[7px] text-[.72rem] font-bold uppercase tracking-[.1em] text-ink`}>
                {g.title}
              </div>
              {g.items.map((it, i) =>
                it.subhead ? (
                  <div key={`sh-${i}`} className={`${display} px-3 pb-[3px] pt-[10px] text-[.68rem] font-semibold uppercase tracking-[.06em] text-ink-soft`}>
                    {it.subhead}
                  </div>
                ) : (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => go(it.id!)}
                    className={`my-[1px] block w-full rounded-[8px] border-l-2 px-3 py-[6px] text-left text-[.875rem] leading-[1.35] transition-colors ${
                      id === it.id
                        ? "border-orange bg-[color-mix(in_srgb,var(--orange)_9%,transparent)] font-semibold text-orange"
                        : "border-transparent text-ink-body hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] hover:text-ink"
                    }`}
                  >
                    {it.label}
                  </button>
                ),
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0 py-10 lg:pl-[clamp(20px,4vw,56px)]">
        {!article ? (
          <Home cards={homeCards} blueprints={blueprints} go={go} searchButton={searchButton} />
        ) : (
          <ArticleView article={article} go={go} prev={prev} next={next} />
        )}
      </main>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-[rgba(17,32,30,.45)] px-5 pb-5 pt-[14vh] backdrop-blur-[3px]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-[620px] overflow-hidden rounded-[16px] border border-ink bg-paper shadow-[10px_10px_0_rgba(21,33,31,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-ink bg-white px-[18px] py-4 text-ink-soft">
              <SearchGlyph size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search webhook, timeout, idempotency…"
                className="flex-1 border-none bg-transparent text-[1.05rem] text-ink outline-none"
              />
              <kbd className="rounded-[5px] border-[1.5px] border-ink bg-paper px-[6px] py-[1px] font-mono text-[.68rem] text-ink">
                esc
              </kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-[10px]">
              <div className={`${display} px-2 pb-2 pt-[6px] text-[.68rem] font-bold uppercase tracking-[.07em] text-ink-soft`}>
                {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Suggested"}
              </div>
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => go(r.id)}
                  className="flex w-full flex-col gap-[3px] rounded-[10px] border border-transparent px-4 py-3 text-left hover:border-orange hover:bg-[color-mix(in_srgb,var(--orange)_8%,transparent)]"
                >
                  <span className={`${display} text-[.96rem] font-bold text-ink`}>{r.title}</span>
                  <span className="text-[.82rem] text-ink-soft">
                    {r.tier} · {r.snippet}
                  </span>
                </button>
              ))}
              {q && results.length === 0 && (
                <div className="px-3 py-[22px] font-hand text-[1.3rem] text-ink-soft">
                  ↳ nothing under that term, try “webhook” or “retry”
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Home({
  cards,
  blueprints: bps,
  go,
  searchButton,
}: {
  cards: typeof homeCards;
  blueprints: typeof blueprints;
  go: (id: string | null) => void;
  searchButton: (big?: boolean) => React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-[9px]">
        <Icon src={lightbulbIcon} color="var(--orange)" size={17} />
        <span className={`${display} text-eyebrow font-bold uppercase tracking-eyebrow text-orange`}>
          Documentation
        </span>
      </div>
      <h1 className={`${display} mb-[14px] max-w-[16em] text-[clamp(2.1rem,4vw,3.1rem)] font-extrabold leading-[1.05] tracking-tight`}>
        Build automations that <span className="text-orange">don&apos;t break.</span>
      </h1>
      <p className="mb-[26px] max-w-[36em] text-lead text-ink-body">
        Production patterns, engine references and copy-paste blueprints for n8n, Trigger.dev and AI
        workflows, written by the team that ships them for clients.
      </p>
      <div className="mb-12">{searchButton(true)}</div>

      <div className="mb-12 grid gap-[18px] md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-[14px] border border-ink bg-white p-[22px] shadow-card">
            <span className="mb-[14px] inline-flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-ink" style={{ background: card.tint }}>
              <Icon src={card.icon} color={card.color} size={22} />
            </span>
            <h3 className={`${display} mb-[6px] text-[1.2rem] font-extrabold tracking-[-.01em]`}>{card.title}</h3>
            <p className="mb-[14px] text-[.9rem] leading-[1.5] text-ink-soft">{card.body}</p>
            <div className="flex flex-col gap-[7px]">
              {card.links.map((l) => (
                <button key={l.id} type="button" onClick={() => go(l.id)} className="text-left text-[.86rem] text-ink transition-colors hover:text-orange">
                  → {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className={`${display} mb-1 text-[1.5rem] font-extrabold tracking-tight`}>Popular blueprints</h2>
      <p className="mb-[18px] text-[.95rem] text-ink-soft">
        Pre-built templates with documented schemas and downloadable source.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {bps.map((b) => (
          <button key={b.id} type="button" onClick={() => go(b.id)} className="rounded-[14px] border border-ink bg-white p-[18px_20px] text-left shadow-card transition-transform hover:-translate-y-[3px]">
            <div className="mb-[10px] flex gap-[7px]">
              {b.badges.map((bd) => (
                <Badge key={bd.label} variant={bd.variant}>
                  {bd.label}
                </Badge>
              ))}
            </div>
            <h3 className={`${display} mb-[5px] text-[1.04rem] font-bold tracking-[-.01em]`}>{b.title}</h3>
            <p className="m-0 text-[.86rem] leading-[1.5] text-ink-soft">{b.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function downloadArtifact(name: string, type: string) {
  const text = `Switchboard, ${name}\n${"=".repeat(40)}\n\nThis is a demo ${type} artifact placeholder.\nBook a call for the production workflow → Switchboard AI Systems\n`;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name.replace(/[^a-z0-9.\-]+/gi, "-");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function ArticleView({
  article,
  go,
  prev,
  next,
}: {
  article: Article;
  go: (id: string | null) => void;
  prev?: Article;
  next?: Article;
}) {
  return (
    <div className="max-w-[760px]">
      <div className={`${display} mb-[14px] flex items-center gap-2 text-[.78rem] font-semibold uppercase tracking-[.05em] text-ink-soft`}>
        <button type="button" onClick={() => go(null)} className="text-ink-soft hover:text-ink">
          Docs
        </button>
        <span>/</span>
        <span className="text-orange">{article.group}</span>
      </div>
      <h1 className={`${display} mb-3 text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-tight`}>
        {article.title}
      </h1>
      <div className="mb-2 flex items-center gap-3">
        <Badge variant="solid">{article.tier}</Badge>
        <span className="text-[.84rem] text-ink-soft">{article.read}</span>
      </div>
      <p className="my-[14px] text-[1.15rem] leading-[1.6] text-ink-soft">{article.lead}</p>
      <div className="my-5 h-[1.5px] bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]" />

      <div>
        {article.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>

      {article.artifact && (
        <div className="my-8 rounded-[14px] border border-black bg-dark px-6 py-[22px] text-on-dark shadow-[6px_6px_0_rgba(21,33,31,0.15)]">
          <div className={`${display} mb-2 flex items-center gap-2 text-[.72rem] font-bold uppercase tracking-[.06em] text-amber`}>
            <Icon src={linkIcon} color="var(--amber)" size={16} />
            The artifact
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[1rem] text-on-dark">{article.artifact.name}</div>
              <div className="mt-[3px] text-[.86rem] text-on-dark-muted">{article.artifact.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => downloadArtifact(article.artifact!.name, article.artifact!.type)}
              className={`${display} inline-flex items-center gap-2 rounded-[10px] border-2 border-orange-deep bg-orange px-[1.2em] py-[.7em] text-[.82rem] font-bold uppercase tracking-[.02em] text-white shadow-[3px_3px_0_#000]`}
            >
              Download {article.artifact.type} →
            </button>
          </div>
        </div>
      )}

      <div className="mt-[38px] flex flex-wrap gap-[14px] border-t border-[color-mix(in_srgb,var(--ink)_14%,transparent)] pt-6">
        {prev && (
          <button
            type="button"
            onClick={() => go(prev.id)}
            className="min-w-[200px] flex-1 rounded-[12px] border border-ink bg-white p-[14px_18px] text-left shadow-card transition-colors hover:border-orange"
          >
            <div className={`${display} text-[.72rem] font-bold uppercase tracking-[.05em] text-ink-soft`}>← Previous</div>
            <div className={`${display} mt-1 text-[1rem] font-bold text-orange`}>{prev.title}</div>
          </button>
        )}
        {next && (
          <button
            type="button"
            onClick={() => go(next.id)}
            className="min-w-[200px] flex-1 rounded-[12px] border border-ink bg-white p-[14px_18px] text-right shadow-card transition-colors hover:border-orange"
          >
            <div className={`${display} text-[.72rem] font-bold uppercase tracking-[.05em] text-ink-soft`}>Next →</div>
            <div className={`${display} mt-1 text-[1rem] font-bold text-orange`}>{next.title}</div>
          </button>
        )}
      </div>
    </div>
  );
}

export default KnowledgeBase;
