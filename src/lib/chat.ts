// Scripted demo assistant for the hero ChatWidget.
//
// Per AGENTS.md the hero bot is *scripted only* for now (no AI backend, no
// API key). This is the keyword-matched `fallback()` set ported verbatim from
// references/landing-page.html, plus the greeting and quick replies. A future
// upgrade can route to a Claude server route and keep this as the fallback.

export const chatGreeting =
  "Hi — I'm a live demo assistant. I can answer questions about what Switchboard builds, tell you what it costs, and help you book a call. What would you like to know?";

export interface QuickReply {
  /** Button label shown in the widget. */
  label: string;
  /** Message sent when the chip is tapped. */
  query: string;
}

export const quickReplies: QuickReply[] = [
  { label: "What can you build?", query: "What can you build for my business?" },
  { label: "How much does it cost?", query: "How much does it cost?" },
  { label: "Get a free demo", query: "Can I get a free demo for my own site?" },
  { label: "Book a call", query: "I'd like to book a call." },
];

/** Keyword-matched scripted reply (the landing page's `fallback()`). */
export function scriptedReply(input: string): string {
  const q = input.toLowerCase();
  if (/price|cost|how much|€|euro|pricing/.test(q))
    return "Builds start at €399 for a Website Assistant, €799 for a Booking Assistant, and from €1499 for a full Automation System. There's an optional €99/mo Care plan to keep it sharp. Want a free demo to see which fits?";
  if (/demo|try|free|show/.test(q))
    return "Happy to! I build a free working demo on your own site before you commit anything. Send your website and I'll show you what your assistant could answer and book.";
  if (/book|call|talk|meeting|appointment/.test(q))
    return "Let's set up a free 15-minute call — use the “Book a 15-min call” button up top, or send your website and I'll prep a demo first.";
  if (/build|do|make|offer|service|what can/.test(q))
    return "I build website assistants that answer questions, qualify leads and book calls — from a simple FAQ bot up to a full CRM + automation system. What does your business do?";
  if (/work|website|install|existing|platform/.test(q))
    return "It usually installs with a single script tag, so it works on most existing websites without a rebuild. What platform is your site on?";
  if (/make.*up|hallucinat|wrong|accurate|true/.test(q))
    return "It only answers from the knowledge I train it on, and says so (then hands off to a human) when it doesn't know — no guessing. Want to see that in a free demo?";
  return "Good question! I can tell you what Switchboard builds, what it costs, or set up a free demo on your site. Which would help most?";
}
