import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client (service-role key — bypasses RLS), created
 * lazily and cached. Returns `null` when the env isn't set, so `next build` and
 * local dev work with no Supabase configured and the newsletter API degrades
 * gracefully. Never import this from a client component — the service-role key
 * must stay server-side.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
