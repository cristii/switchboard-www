import { NextResponse } from "next/server";

/**
 * Lead intake → n8n. The contact form POSTs here; we validate, then forward to
 * the `N8N_WEBHOOK_URL` webhook (server-only, read at request time so `next
 * build` works with no env). Degrades gracefully: with no webhook configured
 * the lead is accepted but not forwarded, so the UI never hard-fails.
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

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";

  if (!name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please add your name and a valid email." },
      { status: 422 },
    );
  }

  const webhook = process.env.N8N_WEBHOOK_URL;
  if (!webhook) {
    // No webhook configured (local/dev or unset env): accept without forwarding.
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        name,
        email,
        source: "switchboard-www/contact",
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Upstream error.", forwarded: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not reach the automation.", forwarded: false },
      { status: 502 },
    );
  }
}
