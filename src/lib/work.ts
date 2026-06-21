// Work / case-study data, the single source for /work and /work/[slug].
// Copy ported verbatim from Work.dc.html and Work Item.dc.html. Only the
// "Outreach System" has a full case study in the source; the rest carry their
// list copy (no invented facts, see AGENTS.md), and their detail page renders
// the shared hero + outcome + "built with" + CTA.

import type { IconSource } from "@/components/ui";

import assistantIcon from "@/assets/icons/assistant.svg";
import calendarIcon from "@/assets/icons/calendar.svg";
import checkIcon from "@/assets/icons/check.svg";
import lightbulbIcon from "@/assets/icons/lightbulb.svg";
import mailIcon from "@/assets/icons/mail.svg";
import peopleIcon from "@/assets/icons/people.svg";
import refreshIcon from "@/assets/icons/refresh.svg";
import sendIcon from "@/assets/icons/send.svg";
import storefrontIcon from "@/assets/icons/storefront.svg";
import targetIcon from "@/assets/icons/target.svg";

export type BadgeVariant = "neutral" | "green" | "amber" | "violet" | "solid";

export interface BuiltWith {
  label: string;
  variant: BadgeVariant;
}

export interface WorkGroup {
  id: "A" | "B" | "C";
  eyebrow: string;
  title: string;
  desc: string;
  category: string;
}

export const workGroups: WorkGroup[] = [
  {
    id: "A",
    eyebrow: "01 · Get found, get leads",
    title: "More leads in the door",
    desc: "Fill the top of your funnel and answer everyone the moment they raise a hand.",
    category: "Lead generation",
  },
  {
    id: "B",
    eyebrow: "02 · Convert & onboard",
    title: "Win the client and keep them",
    desc: "Turn interest into booked, paid, well-looked-after customers, without the manual chase.",
    category: "Convert & onboard",
  },
  {
    id: "C",
    eyebrow: "03 · Authority & repeat business",
    title: "Stay top-of-mind and trusted",
    desc: "Show up every day and let happy customers sell the next one for you.",
    category: "Authority & retention",
  },
];

export interface CaseStudyStep {
  n: string;
  icon: IconSource;
  title: string;
  body: string;
}

export interface CaseStudy {
  /** Hero lead paragraph, split so the page can hand-underline the tail. */
  lead: { pre: string; hand: string };
  /** The featured "what it does for you" line. */
  whatItDoes: string;
  problem: { title: string; body: string };
  stepsIntro: string;
  steps: CaseStudyStep[];
  email: {
    from: string;
    time: string;
    subject: string;
    intro: string;
    highlight: string;
    body: string[];
    note: string;
    aside: string;
  };
  outcomeTitle: string;
  outcomeStats: { value: string; label: string }[];
  technical: { body: string; codeName: string; code: string };
}

export interface WorkItem {
  slug: string;
  group: WorkGroup["id"];
  title: string;
  icon: IconSource;
  blurb: string;
  outcome: string;
  builtWith: BuiltWith[];
  caseStudy?: CaseStudy;
}

export const workItems: WorkItem[] = [
  {
    slug: "outreach-system",
    group: "A",
    title: "Outreach System",
    icon: sendIcon,
    blurb:
      "Finds businesses that fit your offer, writes a personal opening line for each, and sends a warm email sequence that lands in the inbox, not the spam folder.",
    outcome: "A full pipeline of cold leads, contacted on autopilot.",
    builtWith: [
      { label: "n8n", variant: "amber" },
      { label: "Apify", variant: "neutral" },
      { label: "OpenAI", variant: "neutral" },
      { label: "SMTP", variant: "neutral" },
    ],
    caseStudy: {
      lead: {
        pre: "You're reading this because a cold email worked. This is the machine that wrote and sent it, and it can do the same for",
        hand: "your business.",
      },
      whatItDoes:
        "A predictable pipeline of new conversations every week, without you ever touching your inbox.",
      problem: {
        title: "Good outreach works. Doing it by hand is brutal.",
        body: "You research a business, find the right person, write something that doesn't sound like a template, send it, remember to follow up, then do it again a few hundred times. Most owners start strong, burn out in a week, and quietly stop. The leads were never the problem. The repetition was.",
      },
      stepsIntro: "Five steps, running on a loop while you do the actual work.",
      steps: [
        { n: "01", icon: storefrontIcon, title: "Find", body: "Pulls businesses that match your ideal customer from Google Maps and ad directories." },
        { n: "02", icon: peopleIcon, title: "Enrich", body: "Finds the right person and a real reason to reach out, recent reviews, their site, what they sell." },
        { n: "03", icon: lightbulbIcon, title: "Personalize", body: "Writes a genuine first line for each one. No \"Hi [first name]\" filler, an actual human-sounding opener." },
        { n: "04", icon: sendIcon, title: "Send", body: "Sends from a warmed-up inbox on a human schedule, so it lands in the inbox and stays out of spam." },
        { n: "05", icon: calendarIcon, title: "Book", body: "Watches for replies, handles the back-and-forth, and drops booked calls straight onto your calendar." },
      ],
      email: {
        from: "Cristi · Switchboard AI Systems",
        time: "9:02 AM",
        subject: "a quick idea for Bloom & Co",
        intro: "It reads like you wrote it. Because it's about them.",
        highlight:
          "Hi Sarah, saw Bloom & Co just passed 200 five-star reviews on Google. That's genuinely hard to do.",
        body: [
          "Quick thought: most of those happy customers never get asked at the right moment. I build a small system that asks automatically, and texts back anyone whose call you miss.",
          "Worth a 15-minute look? I can show it running on your own site.",
          "Cristi",
        ],
        note: "Every email opens with a real, specific detail, the highlighted line is written fresh for each business. No mail-merge tokens, no \"I came across your website.\" The kind of note you'd actually reply to.",
        aside: "↳ this is roughly the email that reached you.",
      },
      outcomeTitle: "Set it up once. It works every day after that.",
      outcomeStats: [
        { value: "Every day", label: "Fresh, personalized emails going out, fully hands-off" },
        { value: "Zero", label: "Replies dropped, every one is tracked and followed up" },
        { value: "Inbox", label: "Built for deliverability, warmup, SPF and DKIM done right" },
      ],
      technical: {
        body: "An n8n orchestration scrapes directories with Apify, enriches each record, then generates exactly one opener per lead with OpenAI, prompted to ground every sentence in real scraped facts and invent nothing. Sending runs through a warmed domain with per-inbox rate limits and jitter so it stays inboxed, and reply detection routes interested leads straight to booking. The whole run is idempotent, so no one is ever emailed twice.",
        codeName: "personalize-and-send.ts",
        code: `// one opener per lead, grounded only in real, scraped facts
const opener = await openai.responses.create({
  model: "gpt-4o-mini",
  input: personalizePrompt(lead), // no invented facts
});

await mailer.send({
  to: lead.email,
  subject: \`a quick idea for \${lead.company}\`,
  body: render(opener.output_text, lead),
  throttleMs: jitter(90_000, 30_000), // human-paced
});`,
      },
    },
  },
  {
    slug: "speed-to-lead-responder",
    group: "A",
    title: "Speed-to-Lead Responder",
    icon: targetIcon,
    blurb:
      "The second someone fills in a form or replies to your Meta or Google ad, they get an instant, personal text and email, plus a link to book a time.",
    outcome: "Every new lead answered in under a minute, day or night.",
    builtWith: [
      { label: "Trigger.dev", variant: "violet" },
      { label: "Twilio", variant: "neutral" },
      { label: "Calendar API", variant: "neutral" },
    ],
  },
  {
    slug: "homepage-chatbot",
    group: "A",
    title: "Homepage Chatbot",
    icon: assistantIcon,
    blurb:
      "A friendly assistant on your website that answers visitor questions, figures out what they need, and books a call, trained only on your real business, so it never makes things up.",
    outcome: "Your website sells and books while you're busy elsewhere.",
    builtWith: [
      { label: "LangChain", variant: "green" },
      { label: "Pinecone", variant: "neutral" },
      { label: "Web widget", variant: "neutral" },
    ],
  },
  {
    slug: "client-onboarding-automation",
    group: "B",
    title: "Client Onboarding Automation",
    icon: checkIcon,
    blurb:
      "A new client says yes once, then the contract, invoice, intake form, shared folder and welcome emails all fire off in the right order, by themselves.",
    outcome: "Day-one paperwork done in minutes, not an afternoon.",
    builtWith: [
      { label: "n8n", variant: "amber" },
      { label: "Stripe", variant: "neutral" },
      { label: "DocuSign", variant: "neutral" },
      { label: "Notion", variant: "neutral" },
    ],
  },
  {
    slug: "appointment-reminders",
    group: "B",
    title: "Appointment Reminders & No-Show Rescue",
    icon: calendarIcon,
    blurb:
      "Automatic reminders before every booking, and a gentle re-book nudge the moment someone doesn't turn up, so the slot doesn't go to waste.",
    outcome: "Fewer empty slots and far fewer no-shows.",
    builtWith: [
      { label: "Trigger.dev", variant: "violet" },
      { label: "Twilio", variant: "neutral" },
      { label: "Calendar API", variant: "neutral" },
    ],
  },
  {
    slug: "missed-call-text-back",
    group: "B",
    title: "Missed-Call Text-Back",
    icon: mailIcon,
    blurb:
      'When you can\'t pick up, the caller instantly gets a friendly text, "Sorry we missed you, how can we help?", so a busy moment never turns into a lost customer.',
    outcome: "No missed call ever turns into a lost lead again.",
    builtWith: [
      { label: "n8n", variant: "amber" },
      { label: "Twilio", variant: "neutral" },
    ],
  },
  {
    slug: "review-reputation-engine",
    group: "C",
    title: "Review & Reputation Engine",
    icon: storefrontIcon,
    blurb:
      "After a happy job, the customer automatically gets a perfectly-timed nudge to leave a Google review, with a one-tap link that makes it effortless.",
    outcome: "A steady stream of 5-star reviews that win the next customer.",
    builtWith: [
      { label: "n8n", variant: "amber" },
      { label: "Google API", variant: "neutral" },
      { label: "Twilio", variant: "neutral" },
    ],
  },
  {
    slug: "daily-newsletter",
    group: "C",
    title: "Daily High-SNR Newsletter",
    icon: lightbulbIcon,
    blurb:
      "A short, genuinely useful email to your list every single day, drafted, formatted and scheduled from your notes and sources, ready for a quick review.",
    outcome: "Stay top-of-mind daily without writing from scratch.",
    builtWith: [
      { label: "Trigger.dev", variant: "violet" },
      { label: "OpenAI", variant: "neutral" },
      { label: "ESP API", variant: "neutral" },
    ],
  },
  {
    slug: "newsletter-repurposing-engine",
    group: "C",
    title: "Newsletter Repurposing Engine",
    icon: refreshIcon,
    blurb:
      "Each newsletter is automatically reshaped into LinkedIn, X and Instagram posts, same idea, written natively for each platform and queued to publish.",
    outcome: "One piece of writing becomes a week of social content.",
    builtWith: [
      { label: "n8n", variant: "amber" },
      { label: "OpenAI", variant: "neutral" },
      { label: "Buffer", variant: "neutral" },
    ],
  },
];

export function getWorkItem(slug: string): WorkItem | undefined {
  return workItems.find((w) => w.slug === slug);
}

export function categoryFor(group: WorkItem["group"]): string {
  return workGroups.find((g) => g.id === group)?.category ?? "Automation";
}
