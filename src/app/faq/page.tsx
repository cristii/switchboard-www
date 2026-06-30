import type { Metadata } from "next";

import { Eyebrow, FaqItem, HandUnderline, Section } from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { socialLinks } from "@/lib/nav";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Everything people ask before a build, how the chatbot works, what it costs, and what working together looks like. In one place.",
};

const heading = "font-display font-extrabold tracking-tight";
const display = "font-display";

interface FaqGroup {
  id: string;
  title: string;
  items: { q: string; a: string }[];
}

const groups: FaqGroup[] = [
  {
    id: "general",
    title: "The assistant",
    items: [
      {
        q: "Will the chatbot make things up?",
        a: "No. It only answers from the knowledge I train it on (your services, FAQs and rules). When it doesn't know something, it says so and hands off to you instead of guessing.",
      },
      {
        q: "Can it book calls?",
        a: "Yes. The Booking Assistant and Automation System qualify the visitor and book straight into your calendar, so the calls you get are already warm.",
      },
      {
        q: "Do I need to manage the AI myself?",
        a: "Not unless you want to. Everything is set up for you, and the optional Care plan keeps it accurate and improving so you can stay hands-off.",
      },
      {
        q: "Can it work on my existing website?",
        a: "Almost always. Installation is usually one script tag, so it works on most platforms without rebuilding anything.",
      },
      {
        q: "Can I review the conversations?",
        a: "Yes. You get an owner dashboard showing what visitors asked, which leads were captured, and what got booked.",
      },
      {
        q: "How long does it take to set up?",
        a: "A simple assistant can be live within days. A full automation system depends on the integrations, and we'll agree a clear timeline up front.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & engagements",
    items: [
      {
        q: "I'm a local tradesman and don't know anything about tech. Will this work for me?",
        a: "Yes. You won't have to log into any complex software. I build systems that work through the tools you already use, like a simple text message when a new lead comes in, or an AI answering your website chat while you're driving.",
      },
      {
        q: "What's the difference between the AI chatbot in the Growth Engine and Custom Infrastructure tiers?",
        a: "The Growth Engine bot is a standard AI trained on a fixed set of FAQs (your pricing, hours and core services), designed to capture leads and book calls. The Custom Infrastructure bot is a far more advanced agent that can read thousands of your past support tickets or scan a massive product catalog to troubleshoot complex customer issues on its own.",
      },
      {
        q: "Are there ongoing monthly fees?",
        a: "No. My build fees are one-time. You're only responsible for the raw software costs of the tools you use, for example a few dollars a month for your AI usage, or your existing CRM subscription.",
      },
      {
        q: "How long does a build take?",
        a: "Foundation packages are typically deployed in under 7 days. Growth Engines take 2 to 3 weeks. Custom Infrastructure timelines are scoped during our discovery call.",
      },
    ],
  },
  {
    id: "working-together",
    title: "Working together",
    items: [
      {
        q: "Do I need to be tech-savvy to use your services?",
        a: "Not at all. Everything runs through the tools you already use: a text message, your inbox, your calendar. I hand over something you operate with a tap, not a manual. The technical complexity stays on my side.",
      },
      {
        q: "What software do I need to pay for?",
        a: "Only the raw tools your system runs on, usually a few dollars a month for things like AI usage or your existing CRM. My build fee is one-time, with no markup and no middleman subscriptions on top.",
      },
      {
        q: "Can you work with my existing developer?",
        a: "Absolutely. I document everything and hand over clean, editable systems your developer can read and extend. No black boxes, no turf wars, and I'm happy to brief them directly.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="52px" innerStyle={{ textAlign: "center" }}>
        <Eyebrow>FAQ</Eyebrow>
        <h1 className={`${heading} mx-auto mt-3 max-w-[14em] text-hero text-ink`}>
          Questions,{" "}
          <span className="text-orange">
            <HandUnderline>answered.</HandUnderline>
          </span>
        </h1>
        <p className="mx-auto mt-[18px] max-w-[34em] text-lead text-ink-body">
          Everything people ask before a build, in one place. Still stuck? The assistant on the
          home page answers in seconds, or email me directly.
        </p>
      </Section>

      {/* ============ GROUPS ============ */}
      <Section width="820px" py="20px">
        <div className="flex flex-col gap-12 pb-12">
          {groups.map((group) => (
            <div key={group.id}>
              <h2
                className={`${display} mb-4 border-b-2 border-ink pb-3 text-[1.4rem] font-extrabold tracking-tight`}
              >
                {group.title}
              </h2>
              <div className="flex flex-col">
                {group.items.map((item) => (
                  <FaqItem key={item.q} question={item.q}>
                    {item.a}
                  </FaqItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <Section tone="ink" py="56px" innerStyle={{ textAlign: "center" }} style={{ borderTop: "1.5px solid #000" }}>
        <h2 className={`${heading} mx-auto max-w-[15em] text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.06] text-on-dark`}>
          Still have a question?
        </h2>
        <p className="mx-auto mb-7 mt-4 max-w-[32em] text-lead leading-[1.6] text-on-dark-strong">
          Book a free 15-minute call and ask me anything, or send it over by email and I&apos;ll
          get back to you.
        </p>
        <div className="flex flex-wrap justify-center gap-[14px]">
          <BookCall arrow>Book a 15-min call</BookCall>
          <a
            href={socialLinks.email}
            className={`${display} inline-flex items-center justify-center rounded-[10px] border-2 border-on-dark bg-transparent px-[1.6em] py-[.85em] text-[.86rem] font-bold uppercase tracking-[.02em] text-on-dark no-underline`}
          >
            Email me
          </a>
        </div>
      </Section>
    </>
  );
}
