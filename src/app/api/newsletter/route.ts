import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Newsletter signup → Supabase `subscribers`. The Daily Log form POSTs here; we
 * validate the email, then insert with the service-role client (read at request
 * time so `next build` works with no env). Degrades gracefully: with no Supabase
 * configured the signup is accepted but not stored. A duplicate email returns
 * ok with `duplicate: true` rather than an error.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const source = typeof data.source === "string" ? data.source : "daily-log";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 422 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Not configured (local/dev or unset env): accept without storing.
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("subscribers").insert({ email, source });
  if (error) {
    // 23505 = unique_violation → already subscribed (not an error for the user).
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, stored: true, duplicate: true });
    }
    return NextResponse.json(
      { ok: false, error: "Could not save your subscription." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
