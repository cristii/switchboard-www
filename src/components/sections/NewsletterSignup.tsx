"use client";

import * as React from "react";
import { Button, Card, Icon, type CardProps } from "@/components/ui";
import checkIcon from "@/assets/icons/check.svg";

type Status = "idle" | "loading" | "done" | "duplicate" | "error";

export interface NewsletterSignupProps {
  heading: string;
  sub: string;
  /** Optional hand-written note under the form. */
  note?: string;
  tone?: CardProps["tone"];
  style?: React.CSSProperties;
  /** Attribution tag stored with the signup. @default "daily-log" */
  source?: string;
}

/**
 * The Daily Log subscribe card. POSTs to /api/newsletter (Supabase) and shows
 * loading / success / already-subscribed / error states. Degrades gracefully,
 * with no Supabase env the API still returns ok, so the UI confirms.
 */
export function NewsletterSignup({
  heading,
  sub,
  note,
  tone = "white",
  style,
  source = "daily-log",
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean };
      if (res.ok && json.ok) setStatus(json.duplicate ? "duplicate" : "done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const settled = status === "done" || status === "duplicate";

  return (
    <Card tone={tone} style={style}>
      <div className="mb-1 font-display text-[1.1rem] font-bold tracking-[-.01em]">{heading}</div>
      <p className="mb-4 text-[.9rem] text-ink-soft">{sub}</p>
      {settled ? (
        <div className="flex items-center gap-[10px] py-[6px]">
          <Icon src={checkIcon} color="var(--green)" size={20} />
          <span className="text-[.98rem] text-ink">
            {status === "duplicate"
              ? "You're already on the list, the next blueprint lands tomorrow at 7am."
              : "You're in. The first blueprint lands tomorrow at 7am."}
          </span>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="flex flex-wrap items-stretch gap-[10px]">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email address"
              disabled={status === "loading"}
              className="min-w-[220px] flex-1 rounded-[9px] border border-ink bg-white px-[14px] py-3 font-body text-[.96rem] text-ink outline-none focus:border-orange disabled:opacity-60"
            />
            <Button type="submit" arrow disabled={status === "loading"}>
              {status === "loading" ? "Subscribing…" : "Subscribe daily"}
            </Button>
          </div>
          {status === "error" && (
            <p className="mt-[10px] text-[.86rem] font-medium text-[#C12A2A]">
              Something went wrong, please try again, or email me directly.
            </p>
          )}
        </form>
      )}
      {note && <p className="mt-[14px] font-hand text-[1.15rem] text-ink">{note}</p>}
    </Card>
  );
}

export default NewsletterSignup;
