import type { Metadata } from "next";

import { Eyebrow, HandUnderline, Icon, Section } from "@/components/ui";
import { BlogArchive } from "@/components/sections/BlogArchive";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { HireMeBand } from "@/components/sections/HireMeBand";
import { getAllPosts } from "@/lib/blog";

import workflowIcon from "@/assets/icons/workflow.svg";

export const metadata: Metadata = {
  title: "The Daily Log",
  description:
    "Short, technical deep-dives on n8n, Trigger.dev and reliable AI infrastructure — the exact patterns I ship for clients. A new blueprint every morning.",
};

const heading = "font-display font-extrabold tracking-tight";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="48px">
        <div className="mb-2 inline-flex items-center gap-[9px]">
          <Icon src={workflowIcon} color="var(--orange)" size={18} />
          <Eyebrow>The Daily Log · a new blueprint every morning</Eyebrow>
        </div>
        <h1 className={`${heading} mt-[6px] max-w-[15em] text-hero text-ink`}>
          Production-ready workflow automation{" "}
          <span className="text-orange">
            <HandUnderline>blueprints.</HandUnderline>
          </span>
        </h1>
        <p className="mb-[26px] mt-[22px] max-w-[38em] text-lead text-ink-body">
          Short, technical deep-dives on n8n, Trigger.dev and reliable AI infrastructure — the exact
          patterns I ship for clients. One lands in your inbox every morning; the whole archive lives
          here.
        </p>
        <NewsletterSignup
          heading="Get the blueprint in your inbox"
          sub="One workflow win a day. Under 250 words. No fluff."
          note="↳ unsubscribe in one click, no hard feelings"
          style={{ maxWidth: 620 }}
        />
      </Section>

      {/* ============ ARCHIVE ============ */}
      <Section
        tone="alt"
        py="48px"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
      >
        <BlogArchive posts={posts} />
      </Section>

      {/* ============ HIRE ME ============ */}
      <HireMeBand />
    </>
  );
}
