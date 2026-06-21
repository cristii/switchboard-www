"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, Eyebrow, Icon, type BadgeProps } from "@/components/ui";
import type { PostMeta } from "@/lib/blog";
import calendarIcon from "@/assets/icons/calendar.svg";

const display = "font-display";
const PAGE = 4;

// Inlined (client-safe), must not import the fs-backed blog lib value side.
const blogFilters = ["All", "n8n", "Trigger.dev", "LangChain", "Node.js"];

function tagVariant(tag: string): BadgeProps["variant"] {
  if (tag === "n8n") return "amber";
  if (tag === "Trigger.dev") return "violet";
  if (tag === "LangChain") return "green";
  return "neutral";
}

export function BlogArchive({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = React.useState("All");
  const [shown, setShown] = React.useState(PAGE);

  const visible = posts.filter((p) => filter === "All" || p.tags.includes(filter));
  const slice = visible.slice(0, shown);
  const hasMore = shown < visible.length;

  const choose = (f: string) => {
    setFilter(f);
    setShown(PAGE);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Eyebrow>Filter</Eyebrow>
        <div className="flex flex-wrap gap-[9px]">
          {blogFilters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => choose(f)}
                className={`${display} cursor-pointer rounded-[9px] border-[1.5px] px-[15px] py-[7px] text-[.78rem] font-bold uppercase tracking-[.04em] transition-colors ${
                  on ? "border-orange bg-orange text-white" : "border-ink bg-transparent text-ink hover:border-orange"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <h2 className={`${display} mb-7 text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight`}>
        Latest system architectures
      </h2>

      <div className="flex max-w-[880px] flex-col gap-[18px]">
        {slice.map((p) => (
          <article key={p.slug} className="rounded border border-ink bg-white p-[22px] shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-[14px]">
              <span className={`${display} inline-flex items-center gap-[7px] text-[.74rem] font-bold uppercase tracking-[.06em] text-orange`}>
                <Icon src={calendarIcon} color="var(--orange)" size={15} />
                {p.dateLabel}
              </span>
              <div className="flex flex-wrap gap-[7px]">
                {p.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant={tagVariant(t)}>
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <h3 className={`${display} mt-[13px] text-[1.34rem] font-bold leading-[1.18] tracking-[-.01em]`}>
              {p.title}
            </h3>
            <p className="mt-2 max-w-[46em] text-[.95rem] text-ink-soft">{p.excerpt}</p>
            <Link
              href={`/blog/${p.slug}`}
              className={`${display} mt-4 inline-flex items-center gap-[6px] border-b-2 border-orange pb-[2px] text-[.8rem] font-bold uppercase tracking-[.02em] text-orange no-underline`}
            >
              Read the blueprint →
            </Link>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="mt-[30px] flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className={`${display} cursor-pointer rounded-[10px] border-2 border-ink bg-paper px-[1.6em] py-[.85em] text-[.86rem] font-bold uppercase tracking-[.02em] text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-[2px]`}
          >
            Load more blueprints
          </button>
        </div>
      )}
      {!hasMore && visible.length > 0 && (
        <p className="mt-6 text-center font-hand text-[1.3rem] text-ink-soft">
          ↳ that&apos;s the whole archive, a new one lands every morning
        </p>
      )}
      {visible.length === 0 && (
        <p className="mt-2 font-hand text-[1.3rem] text-ink-soft">
          ↳ no blueprints under that tag yet, check back tomorrow
        </p>
      )}
    </>
  );
}

export default BlogArchive;
