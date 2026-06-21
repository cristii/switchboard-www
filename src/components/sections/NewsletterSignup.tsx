"use client";

import * as React from "react";
import { Button, Card, Icon, type CardProps } from "@/components/ui";
import checkIcon from "@/assets/icons/check.svg";

export interface NewsletterSignupProps {
  heading: string;
  sub: string;
  /** Optional hand-written note under the form. */
  note?: string;
  tone?: CardProps["tone"];
  style?: React.CSSProperties;
}

/**
 * The Daily Log subscribe card. Shows a success state on submit. The real POST
 * to /api/newsletter (Supabase) is wired in Phase 3 — for now it confirms
 * optimistically so the UI is complete.
 */
export function NewsletterSignup({ heading, sub, note, tone = "white", style }: NewsletterSignupProps) {
  const [done, setDone] = React.useState(false);
  return (
    <Card tone={tone} style={style}>
      <div className="mb-1 font-display text-[1.1rem] font-bold tracking-[-.01em]">{heading}</div>
      <p className="mb-4 text-[.9rem] text-ink-soft">{sub}</p>
      {done ? (
        <div className="flex items-center gap-[10px] py-[6px]">
          <Icon src={checkIcon} color="var(--green)" size={20} />
          <span className="text-[.98rem] text-ink">
            You&apos;re in. The first blueprint lands tomorrow at 7am.
          </span>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <div className="flex flex-wrap items-stretch gap-[10px]">
            <input
              type="email"
              required
              placeholder="you@company.com"
              aria-label="Email address"
              className="min-w-[220px] flex-1 rounded-[9px] border border-ink bg-white px-[14px] py-3 font-body text-[.96rem] text-ink outline-none focus:border-orange"
            />
            <Button type="submit" arrow>
              Subscribe daily
            </Button>
          </div>
        </form>
      )}
      {note && <p className="mt-[14px] font-hand text-[1.15rem] text-ink">{note}</p>}
    </Card>
  );
}

export default NewsletterSignup;
