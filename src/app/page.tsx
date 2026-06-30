import {
  Badge,
  Button,
  Eyebrow,
  FaqItem,
  HandUnderline,
  PricingPlan,
  Portrait,
  ProcessStep,
  Section,
  ServiceCard,
  Stat,
  StickyNote,
  Tick,
  VideoPlaceholder,
  Pill,
} from "@/components/ui";
import { BookCall } from "@/components/sections/BookCall";
import { ChatWidget } from "@/components/sections/ChatWidget";

const secondaryLink =
  "font-display text-[.82rem] font-bold uppercase tracking-button text-ink border-b-2 border-orange pb-[2px] no-underline transition-colors hover:text-orange";

const heading = "font-display font-extrabold tracking-tight";

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="54px">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <Eyebrow>AI chatbots · automation · results</Eyebrow>
            <h1 className={`${heading} mt-[14px] text-hero text-ink`}>
              Don&apos;t read
              <br />
              about my service.
              <br />
              <span className="text-orange">
                <HandUnderline>Chat with it.</HandUnderline>
              </span>
            </h1>
            <p className="mt-[22px] max-w-[30em] text-lead text-ink-body">
              This is the exact assistant I build for small businesses. Ask it anything: it
              answers instantly, works out whether you&apos;re a fit, and books a call on the spot.
              No forms, no waiting.
            </p>

            <div className="mt-[18px] flex flex-wrap gap-x-[26px] gap-y-[18px] text-[.92rem] font-semibold">
              <Tick tone="orange">Answers instantly</Tick>
              <Tick tone="orange">Qualifies leads</Tick>
              <Tick tone="orange">Books calls</Tick>
            </div>

            <div className="mt-[26px] flex flex-wrap items-center gap-[18px]">
              <Button href="#chat">Try the chatbot → ask it anything</Button>
              <a href="#footcta" className={secondaryLink}>
                Book a 15-min call
              </a>
            </div>
            <p className="mt-4 font-hand text-[1.2rem] text-ink">
              ↳ it&apos;s live, type a real question
            </p>
          </div>

          <ChatWidget />
        </div>
      </Section>

      <hr className="m-0 border-0 border-t border-ink" />

      {/* ============ PROOF BAND ============ */}
      <Section tone="dark" py="44px">
        <div className="mb-[30px] flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <Eyebrow tone="amber">Why &quot;results&quot; isn&apos;t just a word</Eyebrow>
            <h2 className={`${heading} mt-2 max-w-[14em] text-[clamp(1.5rem,2.6vw,2.1rem)]`}>
              The assistant earns its keep in the first month.
            </h2>
          </div>
        </div>
        <div className="mb-[34px] grid gap-[22px] sm:grid-cols-3">
          <Stat onDark value={"<5s"} label="Average time to answer a visitor, day or night" />
          <Stat onDark value="3×" label="More qualified enquiries vs. a static contact form" />
          <Stat onDark value="10 min" label="From your site to a working demo you can try" />
        </div>
        <div className="grid gap-[18px] md:grid-cols-2">
          {[
            {
              quote:
                "Visitors used to bounce when no one replied. Now the assistant answers at 11pm and the booked calls are already qualified by the time they reach me.",
            },
            {
              quote:
                "Setup was a single script tag. Within a week it was handling the questions my inbox used to drown in, and routing the serious leads to my calendar.",
            },
          ].map((q, i) => (
            <div
              key={i}
              className="rounded border border-on-dark-line-2 bg-[color-mix(in_srgb,var(--paper)_6%,transparent)] p-5"
            >
              <p className="text-base leading-[1.5]">&quot;{q.quote}&quot;</p>
              <div className="mt-3 text-[.82rem] text-on-dark-muted">
                <b className="font-display font-semibold text-on-dark">Sample testimonial</b>, swap
                in a real client quote here
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ AUDIENCES ============ */}
      <Section id="services-top">
        <Eyebrow>Built for businesses that want more leads</Eyebrow>
        <p className="mt-[22px] max-w-[30em] text-ink-soft">
          Every unanswered question on your site is a lead walking to a competitor. Here&apos;s
          who I build for.
        </p>
        <div className="mt-9 grid gap-[26px] md:grid-cols-3">
          {[
            {
              icon: (
                <path d="M6 16l4-8h20l4 8M6 16v18h28V16M6 16h28M14 34V24h6v10M24 24h6v6h-6z" />
              ),
              title: "Local service businesses",
              body: "Missed calls and the same FAQs over and over cost you time and bookings.",
              pull: "It answers and books, so you don't.",
            },
            {
              icon: (
                <>
                  <circle cx="14" cy="13" r="5" />
                  <circle cx="27" cy="15" r="4" />
                  <path d="M5 33c0-6 4-9 9-9s9 3 9 9M22 33c0-4 3-7 6-7s6 2 6 6" />
                </>
              ),
              title: "Agencies",
              body: "Clients keep asking for AI features. You need a reliable partner who can actually deliver.",
              pull: "I build it. You scale it.",
            },
            {
              icon: (
                <>
                  <path d="M6 8h4l3 18h18l3-12H11" />
                  <circle cx="16" cy="32" r="2.2" />
                  <circle cx="30" cy="32" r="2.2" />
                </>
              ),
              title: "Ecommerce & service sites",
              body: "Shoppers research before they buy or contact you, and leave when they get stuck.",
              pull: "It guides them and captures more leads.",
            },
          ].map((a) => (
            <div key={a.title} className="border-t-2 border-ink pt-[18px]">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                stroke="var(--ink)"
                strokeWidth={1.8}
                strokeLinejoin="round"
                className="mb-3 h-10 w-10"
              >
                {a.icon}
              </svg>
              <h3 className="mb-2 font-display text-[1.12rem] font-bold">{a.title}</h3>
              <p className="mb-2 text-[.92rem] text-ink-soft">{a.body}</p>
              <div className="font-hand text-[1.18rem] font-semibold leading-snug text-orange">
                {a.pull}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ SERVICES ============ */}
      <Section tone="alt" id="services">
        <div className="grid items-start gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <Eyebrow>My services</Eyebrow>
            <h2 className={`${heading} mt-[14px] text-[clamp(1.9rem,3vw,2.5rem)]`}>
              Systems that quietly run your business.
            </h2>
            <p className="mt-4 max-w-[24em] text-ink-soft">
              Grouped by outcome, not by tool: the automated sales workflows, AI assistants and
              back-office systems that recover the revenue and hours leaking out of your business,
              then hand them over, fully yours.
            </p>
            <a href="/services" className={`${secondaryLink} mt-5 inline-block`}>
              See all services →
            </a>
          </div>
          <div className="grid gap-[18px]">
            <ServiceCard
              number="01"
              icon={
                <svg viewBox="0 0 34 34" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinejoin="round" className="h-[34px] w-[34px]">
                  <rect x="6" y="10" width="22" height="15" rx="3" />
                  <path d="M17 10V6M13 4.5h8" />
                  <circle cx="12.5" cy="17" r="1.6" fill="var(--orange)" stroke="none" />
                  <circle cx="21.5" cy="17" r="1.6" fill="var(--orange)" stroke="none" />
                  <path d="M12 29l3-4M22 29l-3-4" />
                </svg>
              }
              title="Intelligent Lead Routing & Sales"
            >
              The moment an enquiry lands, it&apos;s routed, you&apos;re alerted, and follow-ups
              fire before your competitor has checked their phone.
            </ServiceCard>
            <ServiceCard
              number="02"
              icon={
                <svg viewBox="0 0 34 34" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinejoin="round" className="h-[34px] w-[34px]">
                  <path d="M5 7h24l-9 11v9l-6 3v-12z" />
                </svg>
              }
              title="Back-Office & Operations"
            >
              Invoicing, renewals and review requests run themselves in the background, so you stop
              being your own data-entry clerk and get your evenings back.
            </ServiceCard>
            <ServiceCard
              number="03"
              icon={
                <svg viewBox="0 0 34 34" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinejoin="round" className="h-[34px] w-[34px]">
                  <rect x="4" y="13" width="9" height="8" rx="2" />
                  <rect x="21" y="13" width="9" height="8" rx="2" />
                  <path d="M13 17h8M9 13V9h16v4" />
                </svg>
              }
              title="AI-Powered Customer Experience"
            >
              An assistant that never sleeps answers your customers, reads their documents, and
              raises a ticket before anything slips.
            </ServiceCard>
          </div>
        </div>
      </Section>

      {/* ============ SAMPLE BUILDS ============ */}
      <Section id="work">
        <div className="max-w-[34em]">
          <Eyebrow>See it in action</Eyebrow>
          <h2 className={`${heading} mt-[14px] text-[clamp(1.8rem,3vw,2.4rem)]`}>
            Three sample builds. Three levels of complexity.
          </h2>
          <p className="mt-[14px] text-ink-soft">
            These are demo builds I made to show the range, from a simple FAQ bot to a full
            automation engine. Each walkthrough is short. Real client work is shared privately
            on a call.
          </p>
        </div>

        <div className="mt-[30px] grid items-start gap-[30px] lg:grid-cols-[1.6fr_1fr]">
          <VideoPlaceholder
            label="Sample build · FAQ Chatbot"
            duration="2:00 highlight"
            title="90-second highlight"
            caption="The fastest way to see what an assistant actually does"
          />
          <div className="rounded border border-line bg-paper-2 p-[22px]">
            <h3 className="mb-[14px] text-[1.05rem] font-bold">What you&apos;ll see</h3>
            <ul className="grid gap-[10px] text-[.9rem]">
              {[
                "A realistic build brief",
                "Website + chatbot implementation",
                "The lead-capture logic",
                "Calendar handoff",
                "The owner dashboard",
              ].map((item) => (
                <li key={item}>
                  <Tick size={16} top>
                    {item}
                  </Tick>
                </li>
              ))}
            </ul>
            <p className="mt-[10px] font-hand text-[1.25rem] leading-snug text-orange">
              ↳ Prefer the long version? Full 10-min builds below.
            </p>
          </div>
        </div>

        <div className="mt-[26px] grid gap-4 md:grid-cols-3">
          {[
            {
              variant: "green" as const,
              tag: "Beginner",
              title: "Dental Studio: FAQ bot",
              body: "A simple assistant that answers visitor questions and captures contact details.",
            },
            {
              variant: "amber" as const,
              tag: "Intermediate",
              title: "Home Renovations: booking",
              body: "Qualifies the lead, collects project details, and books a call automatically.",
            },
            {
              variant: "violet" as const,
              tag: "Advanced",
              title: "Solar Solutions: automation",
              body: "CRM + n8n system that routes leads, follows up, and reports on results.",
            },
          ].map((b) => (
            <div key={b.title} className="rounded border border-line bg-paper p-4">
              <Badge variant={b.variant} style={{ marginBottom: 10 }}>
                {b.tag}
              </Badge>
              <h4 className="mb-1 font-display text-base font-bold">{b.title}</h4>
              <p className="text-[.85rem] text-ink-soft">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-5 rounded bg-dark px-[26px] py-5 text-on-dark">
          <div className="flex items-center gap-[13px] text-[1.05rem] font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-none">
              <path d="M12 3a6 6 0 0 1 6 6c0 3-2 4-2 7H8c0-3-2-4-2-7a6 6 0 0 1 6-6zM9 20h6M10 22h4" />
            </svg>
            <span>
              Want one of these built for <b>your</b> website?
            </span>
          </div>
          <Button href="#footcta" arrow>
            Start with a free demo
          </Button>
        </div>
      </Section>

      {/* ============ PROCESS ============ */}
      <Section tone="alt" id="process">
        <Eyebrow>How the implementation works</Eyebrow>
        <div className="mt-9 grid gap-x-[14px] gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              n: "01",
              icon: (
                <>
                  <rect x="5" y="9" width="28" height="20" rx="2" />
                  <path d="M5 12l14 9 14-9" />
                </>
              ),
              title: "Discovery",
              body: "I map your tools and find where time, leads and money are leaking.",
            },
            {
              n: "02",
              icon: (
                <>
                  <circle cx="16" cy="16" r="9" />
                  <path d="M22.5 22.5L31 31M12 16h8M16 12v8" />
                </>
              ),
              title: "Build & feedback",
              body: "I build layer by layer, then branch on your feedback as we go.",
            },
            {
              n: "03",
              icon: (
                <>
                  <rect x="8" y="11" width="22" height="15" rx="3" />
                  <path d="M19 11V7M15 5h8" />
                  <circle cx="14" cy="18" r="1.6" fill="var(--ink)" stroke="none" />
                  <circle cx="24" cy="18" r="1.6" fill="var(--ink)" stroke="none" />
                </>
              ),
              title: "QA & testing",
              body: "I feed it bad data and dropped connections on purpose, so the live version holds.",
            },
            {
              n: "04",
              icon: (
                <>
                  <rect x="6" y="8" width="26" height="17" rx="2" />
                  <path d="M14 31h10M19 25v6" />
                </>
              ),
              title: "Handoff",
              body: "I deploy to your environment, lock it in, and hand you the keys with docs.",
            },
            {
              n: "05",
              icon: (
                <>
                  <path d="M8 30V18M16 30V10M24 30V20M32 30V14" />
                  <path d="M6 30h28" />
                </>
              ),
              title: "Maintenance",
              body: "Optional retainers keep it tuned as your tools and volume change.",
            },
          ].map((s, i, arr) => (
            <ProcessStep
              key={s.n}
              number={s.n}
              arrow={i < arr.length - 1}
              title={s.title}
              icon={
                <svg viewBox="0 0 38 38" fill="none" stroke="var(--ink)" strokeWidth={1.7} strokeLinejoin="round" className="h-[38px] w-[38px]">
                  {s.icon}
                </svg>
              }
            >
              {s.body}
            </ProcessStep>
          ))}
        </div>
        <div className="mt-[30px] flex items-center gap-4 rounded border border-ink bg-paper px-6 py-5 shadow-card">
          <svg viewBox="0 0 34 34" fill="none" stroke="var(--orange)" strokeWidth={1.8} className="h-[34px] w-[34px] flex-none">
            <circle cx="17" cy="17" r="13" />
            <circle cx="17" cy="17" r="7" />
            <circle cx="17" cy="17" r="1.5" fill="var(--orange)" />
          </svg>
          <b className="font-display text-[1.1rem] font-bold">
            Every engagement runs like one of the automations I build: discover, build, test, hand
            off, maintain.
          </b>
        </div>
      </Section>

      {/* ============ PRICING ============ */}
      <Section id="pricing">
        <Eyebrow>Engagement options</Eyebrow>
        <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>
          Transparent pricing. Start small, scale when it works.
        </h2>
        <div className="mt-9 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          <PricingPlan
            icon={
              <svg viewBox="0 0 30 30" fill="none" stroke="var(--ink)" strokeWidth={1.7} strokeLinejoin="round" className="h-[30px] w-[30px]">
                <rect x="5" y="8" width="20" height="13" rx="3" />
                <path d="M15 8V5M12 3.5h6" />
              </svg>
            }
            name="The Foundation"
            desc="Quick lead capture and an end to manual data entry."
            price="$800"
            terms="one-time · 1–3 core workflows"
            features={["Instant lead alerts", "CRM & ad-platform sync", "Basic AI auto-responder"]}
            best="Best for getting started"
          />
          <PricingPlan
            featured
            icon={
              <svg viewBox="0 0 30 30" fill="none" stroke="var(--orange)" strokeWidth={1.7} strokeLinejoin="round" className="h-[30px] w-[30px]">
                <rect x="5" y="5" width="20" height="20" rx="3" />
                <path d="M10 12h10M10 16h7M9 21l3-2 3 2" />
              </svg>
            }
            name="The Growth Engine"
            desc="Automated follow-ups and a back-office that runs itself."
            price="$1,500"
            terms="one-time · 4–7 workflows"
            features={["Multi-step follow-ups", "Standard AI chatbot", "Auto-invoicing & reviews"]}
            best="Most popular"
          />
          <PricingPlan
            icon={
              <svg viewBox="0 0 30 30" fill="none" stroke="var(--ink)" strokeWidth={1.7} strokeLinejoin="round" className="h-[30px] w-[30px]">
                <circle cx="9" cy="9" r="4" />
                <circle cx="21" cy="21" r="4" />
                <path d="M13 9h5a3 3 0 0 1 3 3v5M17 21h-5a3 3 0 0 1-3-3v-5" />
              </svg>
            }
            name="Custom Infrastructure"
            desc="High-volume routing and advanced autonomous agents."
            price="$4,000"
            priceSuffix="+"
            terms="custom scope · 8+ workflows"
            features={["High-volume queueing", "Custom dashboards", "Custom RAG AI agents"]}
            best="Best for scaling teams"
          />
        </div>
        <p className="mt-5 text-center text-[.92rem] text-ink-soft">
          <b className="text-ink">Not sure which fits?</b> I&apos;ll build you a working demo on
          your own site, free, before you decide anything.{" "}
          <a href="/pricing" className={secondaryLink}>
            See full pricing →
          </a>
        </p>
      </Section>

      {/* ============ ABOUT ============ */}
      <Section tone="alt" id="about">
        <Eyebrow>About me</Eyebrow>
        <div className="mt-[30px] grid items-start gap-11 lg:grid-cols-[.8fr_1.2fr]">
          <Portrait src="/cristi-satcovschi.jpg" alt="Cristi Șatcovschi" />
          <div>
            <h2 className={`${heading} text-[clamp(1.6rem,2.6vw,2.2rem)]`}>
              I&apos;m Cristi Șatcovschi.
            </h2>
            <span className="my-[14px] inline-flex items-baseline gap-2 rounded-[8px] bg-orange px-3 py-[5px] font-display font-bold text-white">
              <b className="text-[1.3rem]">40+</b> systems shipped
            </span>
            <p className="mb-3 max-w-[34em] text-ink-body">
              I&apos;m an automation engineer and workflow architect. I help startups and agencies
              kill the manual grunt work by wiring their favourite tools into seamless, AI-powered
              systems you can actually run without me.
            </p>
            <a href="/about" className={`${secondaryLink} inline-block`}>
              More about me →
            </a>
            <div className="mt-[22px] grid gap-6 sm:grid-cols-[1.3fr_1fr]">
              <ul className="grid gap-[14px]">
                {[
                  { icon: <path d="M3 12h7l2-4 3 8 2-4h4" />, text: "A workflow audit to find where time and leads leak" },
                  { icon: <path d="M4 5h16v11H8l-4 4z" />, text: "Architecture and build, with error handling baked in" },
                  { icon: <path d="M4 20V8M11 20V4M18 20v-8" />, text: "Handoff with clear docs, then optional monitoring" },
                ].map((b, i) => (
                  <li key={i} className="flex gap-[11px] text-[.9rem]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} strokeLinejoin="round" className="mt-[2px] h-[22px] w-[22px] flex-none">
                      {b.icon}
                    </svg>
                    {b.text}
                  </li>
                ))}
              </ul>
              <StickyNote title="Tech stack">
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    fontFamily: "var(--font-hand, 'Caveat', cursive)",
                    fontSize: "1.18rem",
                    lineHeight: 1.55,
                  }}
                >
                  {["n8n", "Trigger.dev", "Python", "Node.js / TS", "OpenAI", "LangChain"].map(
                    (t) => (
                      <li key={t}>– {t}</li>
                    ),
                  )}
                </ul>
              </StickyNote>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <Section tone="alt" id="faq">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className={`${heading} mt-3 text-[clamp(1.8rem,3vw,2.4rem)]`}>Questions, answered.</h2>
        <div className="mt-[30px] grid gap-x-10 md:grid-cols-2">
          {[
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
          ].map((item) => (
            <FaqItem key={item.q} question={item.q}>
              {item.a}
            </FaqItem>
          ))}
        </div>
        <a href="/faq" className={`${secondaryLink} mt-8 inline-block`}>
          See all FAQs →
        </a>
      </Section>

      {/* ============ FOOTER CTA ============ */}
      <Section tone="ink" id="footcta" py="40px">
        <div className="flex flex-wrap items-center justify-between gap-[30px]">
          <div>
            <h2 className={`${heading} text-[clamp(1.6rem,3vw,2.3rem)] text-on-dark`}>
              Don&apos;t read another section.
              <br />
              <span className="text-orange">Try the assistant.</span>
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-[10px]">
              <Pill onDark active>
                Conversation
              </Pill>
              <span className="text-orange">→</span>
              <Pill onDark>Qualified lead</Pill>
              <span className="text-orange">→</span>
              <Pill onDark>Booked call</Pill>
            </div>
            <p className="mt-[10px] font-hand text-[1.15rem] text-on-dark-muted">
              ↳ that&apos;s the whole system.
            </p>
          </div>
          <p className="max-w-[18em] text-[.92rem] text-on-dark-muted">
            Send me your website and I&apos;ll show you exactly what your chatbot could answer,
            qualify and book.
          </p>
          <div className="flex flex-col gap-[10px]">
            <Button href="#chat" arrow>
              Try the chatbot
            </Button>
            <BookCall variant="light" arrow>
              Book a 15-min call
            </BookCall>
          </div>
        </div>
      </Section>
    </>
  );
}
