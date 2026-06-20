// Knowledge-base content — the single source for /knowledge-base.
// Ported from "Knowledge Base.dc.html": five rich "marquee" articles plus the
// generated set (Overview / Key points / Example) built from intro + points +
// code. Bodies are modelled as typed blocks and rendered with React (no raw
// HTML), so everything stays on-brand and Tailwind-free in the data layer.

export type Tier = "Learn" | "Reference" | "Guide";

export type Block =
  | { t: "h"; id: string; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "callout"; kind: "tip" | "warn" | "note"; label: string; text: string }
  | { t: "code"; file: string; code: string }
  | { t: "tabs"; tabs: { label: string; file: string; code: string }[] };

export interface Artifact {
  name: string;
  type: string;
  desc: string;
}

export interface Article {
  id: string;
  tier: Tier;
  group: string;
  read: string;
  title: string;
  lead: string;
  blocks: Block[];
  artifact?: Artifact;
}

export interface NavEntry {
  id?: string;
  label?: string;
  subhead?: string;
}

export interface NavGroup {
  title: string;
  items: NavEntry[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Learn",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "core-concepts", label: "Core concepts" },
      { id: "installation", label: "Installation & environment" },
      { subhead: "Quickstart" },
      { id: "quickstart-n8n", label: "Your first n8n webhook" },
      { id: "quickstart-trigger", label: "Scaling AI agents with Trigger.dev" },
      { subhead: "Design patterns" },
      { id: "idempotency", label: "Idempotency in workflows" },
      { id: "rate-limits", label: "Handling rate limits" },
    ],
  },
  {
    title: "Reference",
    items: [
      { subhead: "n8n" },
      { id: "n8n-standard", label: "Nodes (standard)" },
      { id: "n8n-custom", label: "Nodes (custom)" },
      { id: "n8n-expressions", label: "Expressions & JSON transforms" },
      { subhead: "Trigger.dev" },
      { id: "trigger-workflows", label: "Workflows & tasks" },
      { subhead: "Blueprints" },
      { id: "bp-slack-notion-llm", label: "AI & LLMs" },
      { id: "bp-api", label: "API integrations" },
      { id: "bp-data", label: "Data transformation" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "guide-billing", label: "Payments & billing" },
      { id: "guide-crm", label: "Operational CRM" },
      { id: "guide-support", label: "Customer support" },
      { id: "guide-errors", label: "Error handling & monitoring" },
      { id: "guide-scaling", label: "Scaling to high-throughput" },
    ],
  },
];

/* ---- shared code snippets (plain; rendered in a terminal-framed card) ---- */
const CODE = {
  webhookTs: `export const webhook = defineEndpoint({
  id: "lead-intake",
  run: async (req, io) => {
    const lead = parse(req.body);      // validate first
    await io.runTask("sync-crm", () => push(lead));
    return { status: 200 };            // ack fast
  },
});`,
  webhookJson: `{
  "method": "POST",
  "url": "https://api.switchboard.dev/lead-intake",
  "headers": { "x-signature": "{{ hmac }}" },
  "body": { "email": "jane@acme.co", "source": "meta-ads" }
}`,
  redis: `const key = "evt:" + event.id;
if (await redis.set(key, 1, "NX", "EX", 86400) === null)
  return io.logger.info("duplicate — skipped");`,
  split: `// Item Lists → "Split Out" — no Code node needed
fieldToSplitOut: "body.data",
include:         "id, email, status"`,
  trigger: `client.defineJob({
  id: "agent-run",
  concurrencyLimit: 5,        // cap parallel agents
  run: async (payload, io) => {
    await io.runTask("think", () => agent.invoke(payload));
  },
});`,
  hmac: `const ok = crypto
  .createHmac("sha256", secret)
  .update(raw)
  .digest("hex") === sig;   // constant-time in prod`,
};

/* ---- five rich "marquee" articles ---- */
const marquee: Article[] = [
  {
    id: "introduction",
    tier: "Learn",
    group: "Learn",
    read: "3 min read",
    title: "Introduction",
    lead: "How this knowledge base is organized, and the fastest path from a question to working code.",
    blocks: [
      { t: "h", id: "overview", text: "Overview" },
      { t: "p", text: "This is the engineering reference behind every system we ship. It covers n8n, Trigger.dev, and the AI workflows that sit on top of them — written for technical people who want the exact pattern, not a sales pitch." },
      { t: "callout", kind: "tip", label: "Start here", text: "New to event-driven automation? Read Core concepts, then build your first n8n webhook." },
      { t: "h", id: "three-tiers", text: "The three tiers" },
      { t: "p", text: "Everything is grouped so you can move from understanding to copy-paste in seconds:" },
      { t: "ul", items: [
        "Learn — concepts and quickstarts. Why a pattern exists.",
        "Reference — strictly factual, skimmable node and API docs, plus the blueprint library.",
        "Guides — end-to-end recipes organized by business outcome.",
      ] },
      { t: "h", id: "conventions", text: "Conventions" },
      { t: "p", text: "Code blocks are copy-ready. Where an engine offers two approaches, we show them as tabs (for example a JavaScript Node vs a raw JSON / HTTP Request). Blueprints always ship with a downloadable artifact and a documented schema." },
    ],
  },
  {
    id: "core-concepts",
    tier: "Learn",
    group: "Learn",
    read: "6 min read",
    title: "Core concepts: event-driven architecture",
    lead: "Why reliable automation is built on events and queues — not cron jobs and hope.",
    blocks: [
      { t: "h", id: "overview", text: "Overview" },
      { t: "p", text: "An event-driven system reacts the instant something happens — a form submit, a payment, a new row — instead of asking “anything new yet?” on a timer. That single shift removes most of the latency and waste in a workflow." },
      { t: "h", id: "events", text: "Events vs. polling" },
      { t: "p", text: "Polling burns API quota and adds delay equal to your interval. A webhook delivers the payload the moment the event occurs." },
      { t: "callout", kind: "warn", label: "Watch out", text: "Webhooks can be delivered more than once, out of order, or replayed by an attacker. Plan for it — see Idempotency." },
      { t: "h", id: "queues", text: "Queues & retries" },
      { t: "p", text: "Wrap any outbound call in a task so a slow or failing third party retries on its own instead of taking down the whole run." },
      { t: "code", file: "worker.ts", code: CODE.trigger },
      { t: "h", id: "idem", text: "Idempotency" },
      { t: "p", text: "Because delivery is “at least once”, every handler must be safe to run twice. The cheapest guard is a single key in a fast store." },
      { t: "code", file: "idempotency.ts", code: CODE.redis },
    ],
  },
  {
    id: "quickstart-n8n",
    tier: "Learn",
    group: "Learn",
    read: "8 min read",
    title: "Your first production-grade n8n webhook",
    lead: "Stand up a webhook that captures leads, validates the payload, and survives bad input — in about ten minutes.",
    artifact: { name: "lead-intake.n8n.json", type: "JSON", desc: "Importable n8n workflow — webhook + validation + CRM sync." },
    blocks: [
      { t: "h", id: "overview", text: "Overview" },
      { t: "p", text: "A “hello world” webhook is easy. A production one acknowledges fast, validates input, and never double-processes. We will build all three." },
      { t: "callout", kind: "note", label: "Prerequisites", text: "An n8n instance (cloud or self-hosted) and a CRM or Slack destination. No coding required for the base flow." },
      { t: "h", id: "setup", text: "Set up the node" },
      { t: "p", text: "Drop a Webhook trigger node and set the method to POST. Acknowledge immediately and do the real work in a follow-up task so the sender never times out." },
      { t: "tabs", tabs: [
        { label: "JavaScript Node", file: "webhook.ts", code: CODE.webhookTs },
        { label: "JSON / HTTP Request", file: "request.json", code: CODE.webhookJson },
      ] },
      { t: "h", id: "validate", text: "Validate the payload" },
      { t: "p", text: "Never trust an inbound body. Reject anything missing required fields before it touches your CRM, and verify the signature header so forged calls bounce at the door." },
      { t: "code", file: "verify.ts", code: CODE.hmac },
      { t: "h", id: "errors", text: "Handle errors" },
      { t: "p", text: "Attach an Error Trigger so a failed run pings you in Slack instead of failing silently. Pair it with the idempotency guard below so retries are safe." },
      { t: "code", file: "guard.ts", code: CODE.redis },
      { t: "callout", kind: "tip", label: "Ship it", text: "Import the artifact below, point the destination node at your CRM, and you have a working lead-intake pipeline." },
      { t: "h", id: "next", text: "Next steps" },
      { t: "ul", items: ["Make the handler idempotent", "Add rate-limit handling", "Browse the API integration blueprint"] },
    ],
  },
  {
    id: "idempotency",
    tier: "Learn",
    group: "Learn",
    read: "5 min read",
    title: "Idempotency in workflows",
    lead: "A one-line guard that stops duplicate webhook deliveries from firing a second run.",
    blocks: [
      { t: "h", id: "overview", text: "Overview" },
      { t: "p", text: "Idempotent means “running it twice has the same effect as running it once.” Since webhook delivery is at-least-once, this is not optional — it is the difference between one invoice and three." },
      { t: "h", id: "guard", text: "The guard" },
      { t: "p", text: "Record each event id the first time you see it. If the key already exists, skip." },
      { t: "code", file: "idempotency.ts", code: CODE.redis },
      { t: "h", id: "key", text: "Choosing a key" },
      { t: "p", text: "Use the provider’s event id when one exists. If not, hash the stable fields of the payload — never the timestamp." },
      { t: "callout", kind: "warn", label: "Common mistake", text: "A TTL that is shorter than the provider’s retry window lets a late retry slip through. Match or exceed it (24h is a safe default)." },
      { t: "h", id: "pitfalls", text: "Pitfalls" },
      { t: "ul", items: [
        "Setting the key after the side effect instead of before.",
        "Using a per-instance in-memory set that resets on deploy.",
        "Forgetting that two different events can share a payload — include the type in the key.",
      ] },
    ],
  },
  {
    id: "bp-slack-notion-llm",
    tier: "Reference",
    group: "Blueprints",
    read: "Blueprint",
    title: "Blueprint: Slack → Notion → LLM",
    lead: "Summarize a Slack thread with an LLM and file the result in Notion — fully automated, with graceful failure.",
    artifact: { name: "slack-notion-llm.json", type: "JSON", desc: "Importable workflow with the LLM + Notion nodes pre-wired." },
    blocks: [
      { t: "h", id: "overview", text: "What it does" },
      { t: "p", text: "When a thread is tagged in Slack, this blueprint pulls the messages, asks an LLM for a structured summary, and creates a Notion page in the right database — no human in the loop." },
      { t: "h", id: "arch", text: "Architecture" },
      { t: "ul", items: [
        "Trigger — Slack event for the reaction/tag.",
        "Transform — flatten the thread into clean text.",
        "LLM — summarize with a fixed schema prompt.",
        "Output — create the Notion page; on failure, post back to Slack.",
      ] },
      { t: "code", file: "transform.node", code: CODE.split },
      { t: "h", id: "schema", text: "Schema" },
      { t: "p", text: "Documented inputs and outputs so you can swap pieces safely." },
      { t: "ul", items: [
        "input.channel — Slack channel id (required)",
        "input.thread_ts — thread timestamp (required)",
        "output.notion_page_id — created page id",
        "output.summary — string, ≤ 280 chars",
      ] },
      { t: "h", id: "edge", text: "Edge cases" },
      { t: "callout", kind: "warn", label: "Fails gracefully", text: "If the LLM returns malformed JSON or Notion is down, the run posts the raw summary back into the Slack thread instead of dropping it — nothing is ever lost." },
      { t: "ul", items: ["Empty thread → skips, logs a notice.", "Rate-limited by Notion → retries with backoff."] },
    ],
  },
];

/* ---- generated articles (Overview / Key points / Example) ---- */
interface Gen {
  id: string;
  tier: Tier;
  group: string;
  read: string;
  title: string;
  lead: string;
  intro: string[];
  points: string[];
  code?: { file: string; code: string };
  artifact?: Artifact;
}

const generated: Gen[] = [
  { id: "installation", tier: "Learn", group: "Learn", read: "4 min read", title: "Installation & environment", lead: "Get an n8n and Trigger.dev environment running locally before you ship anything.", intro: ["Run both engines locally so you can test workflows against real payloads before touching production.", "Keep secrets in environment variables — never inside a node — so the same workflow JSON moves cleanly between staging and live."], points: ["Use Docker for a reproducible n8n instance.", "Separate staging and production credentials.", "Store webhook signing secrets as environment variables."], code: { file: "worker.ts", code: CODE.trigger } },
  { id: "quickstart-trigger", tier: "Learn", group: "Learn", read: "7 min read", title: "Scaling AI agents with Trigger.dev", lead: "Run many AI agents in parallel without melting your rate limits or your bill.", intro: ["Trigger.dev gives long-running AI tasks durable execution and built-in concurrency control — the two things a raw API loop lacks.", "Cap concurrency so a burst of work queues instead of hammering the model provider all at once."], points: ["Set a concurrencyLimit to bound parallel agents.", "Wrap each model call in a task for automatic retries.", "Stream tokens back to the client over SSE for instant feel."], code: { file: "agent.ts", code: CODE.trigger } },
  { id: "rate-limits", tier: "Learn", group: "Learn", read: "5 min read", title: "Handling rate limits in third-party APIs", lead: "Throttle a burst of items through an API without tripping its limit — no external queue required.", intro: ["Most third-party limits are per-second or per-minute. Spacing your calls keeps you under the ceiling without dropping work.", "When you do get a 429, respect the Retry-After header instead of retrying blindly."], points: ["Add a wait between items to stay under the per-second cap.", "Read and honor Retry-After on 429 responses.", "Back off exponentially, then give up after a sane ceiling."], code: { file: "guard.ts", code: CODE.redis } },
  { id: "n8n-standard", tier: "Reference", group: "n8n", read: "Reference", title: "n8n Nodes (standard)", lead: "Best-practice notes for the standard nodes you will reach for in almost every workflow.", intro: ["These are the nodes shipped with n8n. The notes below cover the gotchas that bite people in production.", "Prefer visual nodes over the Code node wherever possible — they are easier to hand off to a client."], points: ["Split Out — loop arrays without a Code node.", "Set — shape and rename fields explicitly.", "IF / Switch — branch on conditions; keep paths labelled.", "HTTP Request — your escape hatch for any REST API."], code: { file: "split-out.node", code: CODE.split } },
  { id: "n8n-custom", tier: "Reference", group: "n8n", read: "Reference", title: "n8n Nodes (custom)", lead: "When the standard set is not enough, a small custom node keeps logic out of brittle Code nodes.", intro: ["Custom nodes package reusable logic with a clean UI so non-technical operators can configure it safely.", "Keep them small and single-purpose — one node, one job."], points: ["Declare typed inputs so misuse fails loudly.", "Version your node package alongside the workflow.", "Document outputs the same way you would an API."], code: { file: "node.ts", code: CODE.webhookTs } },
  { id: "n8n-expressions", tier: "Reference", group: "n8n", read: "Reference", title: "Expressions & JSON transforms", lead: "The expression syntax and JSON-path patterns that handle 90% of data reshaping.", intro: ["n8n expressions let you reference any upstream field inline. Combined with Split Out and Set, they replace most Code nodes.", "Reach for JSON-path to pluck nested values without writing JavaScript."], points: ["Reference upstream data with the json accessor.", "Use Split Out for arrays, Set for renames.", "Validate shape early so bad data fails fast."], code: { file: "expression.txt", code: CODE.split } },
  { id: "trigger-workflows", tier: "Reference", group: "Trigger.dev", read: "Reference", title: "Trigger.dev workflows & tasks", lead: "Task management, concurrency, and TypeScript patterns for durable jobs.", intro: ["A Trigger.dev job is durable: if it crashes mid-run it resumes, not restarts. Model each external call as its own task to get that guarantee per step.", "TypeScript types on your payload catch mistakes before they ever run."], points: ["One runTask per external side effect.", "Set concurrencyLimit to protect downstreams.", "Type the payload to catch errors at build time."], code: { file: "job.ts", code: CODE.trigger } },
  { id: "bp-api", tier: "Reference", group: "Blueprints", read: "Blueprint", title: "Blueprint: Resilient API sync", lead: "Two-way sync between any REST API and your database, with retries and idempotency built in.", artifact: { name: "api-sync.json", type: "JSON", desc: "Importable workflow with retry + idempotency wiring." }, intro: ["This blueprint keeps a remote API and your database in sync in both directions without dropping or duplicating records.", "Every write is idempotent and every fetch retries on transient failure."], points: ["Signature verification on inbound webhooks.", "Idempotency key on every write.", "Exponential backoff on 429 / 5xx."], code: { file: "verify.ts", code: CODE.hmac } },
  { id: "bp-data", tier: "Reference", group: "Blueprints", read: "Blueprint", title: "Blueprint: Flatten nested payloads", lead: "Reshape messy nested webhook bodies into clean, flat database rows.", artifact: { name: "flatten-payload.json", type: "JSON", desc: "Reusable Set + Split Out workflow for nested JSON." }, intro: ["Webhook bodies from CRMs and ad platforms are deeply nested. Your database wants flat columns.", "This blueprint maps nested fields to a flat schema with a single reusable Set node."], points: ["Split Out to expand arrays into items.", "Set to map nested paths to flat columns.", "Document the resulting schema for downstream nodes."], code: { file: "split-out.node", code: CODE.split } },
  { id: "guide-billing", tier: "Guide", group: "Guides", read: "Recipe", title: "Payments & billing automation", lead: "Automate subscription logic, invoices, and revenue-recognition syncs end to end.", intro: ["Billing events are high-stakes: a duplicate charge or a missed invoice is a customer problem. Idempotency is mandatory here.", "This recipe wires payment webhooks to your ledger and accounting tool with safe retries."], points: ["Verify every payment webhook signature.", "Make ledger writes idempotent by event id.", "Reconcile nightly to catch any gaps."], code: { file: "guard.ts", code: CODE.redis } },
  { id: "guide-crm", tier: "Guide", group: "Guides", read: "Recipe", title: "Operational CRM automation", lead: "Lead scoring, data enrichment, and contact synchronization that runs itself.", intro: ["Sales teams lose deals to slow follow-up and stale data. This recipe captures, enriches, and routes leads the moment they arrive.", "Enrichment and scoring happen before the lead ever lands in a rep’s queue."], points: ["Instant capture from forms and ad platforms.", "Enrich with a third-party data source.", "Score and route to the right owner automatically."], code: { file: "lead-intake.ts", code: CODE.webhookTs } },
  { id: "guide-support", tier: "Guide", group: "Guides", read: "Recipe", title: "Customer support automation", lead: "AI-driven ticket triage and automated resolution for first-tier requests.", intro: ["Most support volume is repetitive. An AI agent can triage, tag, and resolve tier-one tickets, escalating only what truly needs a human.", "The agent reads your knowledge base so answers stay accurate and on-brand."], points: ["Auto-classify and tag incoming tickets.", "Draft or send replies for common questions.", "Escalate edge cases with full context attached."], code: { file: "agent.ts", code: CODE.trigger } },
  { id: "guide-errors", tier: "Guide", group: "Guides", read: "Recipe", title: "Error handling & monitoring", lead: "Catch failures before your client does, and know exactly what broke.", intro: ["A silent failure is worse than a loud one. Every production workflow needs an error path and an alert.", "Pair an Error Trigger with structured logging so you can see what failed and why in seconds."], points: ["Attach an Error Trigger to every workflow.", "Alert to Slack with the failing payload.", "Log structured context, not just a stack trace."], code: { file: "guard.ts", code: CODE.redis } },
  { id: "guide-scaling", tier: "Guide", group: "Guides", read: "Recipe", title: "Scaling to high-throughput", lead: "Keep a workflow fast and stable as volume grows from hundreds to millions of events.", intro: ["What works at 100 events a day falls over at 100,000. Queues, concurrency caps, and idempotency are what carry you across that gap.", "Push heavy work into durable tasks so a spike queues instead of crashing."], points: ["Queue inbound events; process at a controlled rate.", "Cap concurrency on every downstream call.", "Make every step idempotent and retry-safe."], code: { file: "worker.ts", code: CODE.trigger } },
];

function genBlocks(g: Gen): Block[] {
  const blocks: Block[] = [{ t: "h", id: "overview", text: "Overview" }];
  g.intro.forEach((p) => blocks.push({ t: "p", text: p }));
  blocks.push({ t: "h", id: "key-points", text: "Key points" });
  blocks.push({ t: "ul", items: g.points });
  if (g.code) {
    blocks.push({ t: "h", id: "example", text: "Example" });
    blocks.push({ t: "code", file: g.code.file, code: g.code.code });
  }
  return blocks;
}

const generatedArticles: Article[] = generated.map((g) => ({
  id: g.id,
  tier: g.tier,
  group: g.group,
  read: g.read,
  title: g.title,
  lead: g.lead,
  blocks: genBlocks(g),
  artifact: g.artifact,
}));

/** Display order, matching the source ORDER (drives prev/next + search). */
export const order = [
  "introduction", "core-concepts", "installation", "quickstart-n8n", "quickstart-trigger",
  "idempotency", "rate-limits", "n8n-standard", "n8n-custom", "n8n-expressions",
  "trigger-workflows", "bp-slack-notion-llm", "bp-api", "bp-data", "guide-billing",
  "guide-crm", "guide-support", "guide-errors", "guide-scaling",
];

const byId: Record<string, Article> = {};
[...marquee, ...generatedArticles].forEach((a) => (byId[a.id] = a));

export const articles = order.map((id) => byId[id]).filter(Boolean);

export function getArticle(id: string): Article | undefined {
  return byId[id];
}

export interface SearchEntry {
  id: string;
  title: string;
  tier: string;
  snippet: string;
}

export const searchIndex: SearchEntry[] = order
  .map((id) => byId[id])
  .filter(Boolean)
  .map((a) => ({ id: a.id, title: a.title, tier: a.group, snippet: a.lead }));
