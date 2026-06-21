import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Badge, Card, Eyebrow, Icon, Section, type BadgeProps } from "@/components/ui";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { HireMeBand } from "@/components/sections/HireMeBand";
import { getAllPosts, getPost } from "@/lib/blog";

import calendarIcon from "@/assets/icons/calendar.svg";
import checkIcon from "@/assets/icons/check.svg";

const display = "font-display";
const heading = "font-display font-extrabold tracking-tight";

function tagVariant(tag: string): BadgeProps["variant"] {
  if (tag === "n8n") return "amber";
  if (tag === "Trigger.dev") return "violet";
  if (tag === "LangChain") return "green";
  return "neutral";
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

const mdxComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className={`${heading} mb-0 mt-[38px] scroll-mt-[90px] text-[1.5rem]`}>{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className={`${display} mb-2 mt-[26px] text-[1.2rem] font-bold`}>{children}</h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mt-[14px] text-[1.1rem] leading-[1.72] text-ink-body">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mt-4 flex list-none flex-col gap-[11px] p-0">{children}</ul>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="flex items-start gap-[11px]">
      <Icon src={checkIcon} color="var(--green)" size={19} style={{ marginTop: 3 }} />
      <span className="text-[1.05rem] leading-[1.6] text-ink-body">{children}</span>
    </li>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a
      href={href}
      className="border-b border-[color-mix(in_srgb,var(--orange)_40%,transparent)] text-orange no-underline hover:border-orange"
    >
      {children}
    </a>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-bold text-ink">{children}</strong>
  ),
  code: ({ className, children }: { className?: string; children?: ReactNode }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded-[5px] border border-line bg-paper-3 px-[6px] py-[1px] font-mono text-[.92em] text-ink">
        {children}
      </code>
    ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="my-5 overflow-x-auto rounded-[10px] border border-ink bg-[#282c34] px-[18px] py-4 font-mono text-[.83rem] leading-[1.75] text-[#abb2bf] shadow-card">
      {children}
    </pre>
  ),
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Section width="760px" py="46px">
        <Link
          href="/blog"
          className={`${display} mb-[22px] inline-flex items-center gap-[7px] text-[.78rem] font-bold uppercase tracking-[.04em] text-ink-soft no-underline`}
        >
          ← Back to the Daily Log
        </Link>

        <div className={`${display} mb-[14px] flex flex-wrap items-center gap-[14px] text-[.74rem] font-bold uppercase tracking-[.06em]`}>
          <span className="inline-flex items-center gap-[7px] text-orange">
            <Icon src={calendarIcon} color="var(--orange)" size={15} />
            {post.dateLabel}
          </span>
          {post.read && <span className="font-semibold text-ink-soft">· {post.read}</span>}
        </div>

        <h1 className={`${heading} text-[clamp(2rem,4vw,3rem)] leading-[1.06]`}>{post.title}</h1>

        <div className="mt-5 flex flex-wrap gap-[7px]">
          {post.tags.map((t) => (
            <Badge key={t} variant={tagVariant(t)}>
              {t}
            </Badge>
          ))}
        </div>

        <div className="mb-1 mt-[26px] flex items-center gap-[11px] border-t border-ink pt-6">
          <span className={`${display} grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink bg-paper-3 text-[.9rem] font-extrabold`}>
            C
          </span>
          <span className="text-[.92rem] leading-[1.35]">
            <b className={display}>Cristi Șatcovschi</b>
            <br />
            <span className="text-ink-soft">I build automation infrastructure for small teams.</span>
          </span>
        </div>

        <div className="mt-2">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <div className="mt-10">
          <NewsletterSignup
            tone="paper"
            source="blog-post"
            heading="Get one of these every morning"
            sub="One production-ready automation pattern in your inbox daily. Under 250 words, no fluff."
          />
        </div>
      </Section>

      <HireMeBand />

      {/* More blueprints */}
      <Section
        tone="alt"
        py="52px"
        style={{ borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}
      >
        <Eyebrow>Keep reading</Eyebrow>
        <h2 className={`${heading} mb-[26px] mt-3 text-[clamp(1.5rem,2.4vw,2rem)]`}>More blueprints</h2>
        <div className="grid gap-[18px] md:grid-cols-3">
          {others.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block text-ink no-underline">
              <Card tone="white" style={{ height: "100%" }}>
                <span className={`${display} text-[.72rem] font-bold uppercase tracking-[.06em] text-orange`}>
                  {p.dateLabel}
                </span>
                <h3 className={`${display} mt-[9px] text-[1.12rem] font-bold leading-[1.2] tracking-[-.01em]`}>
                  {p.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-[6px]">
                  {p.tags.slice(0, 2).map((t) => (
                    <Badge key={t} variant={tagVariant(t)}>
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
