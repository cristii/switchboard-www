-- Switchboard — newsletter subscribers
-- Run this in the Supabase SQL editor (or `supabase db push`). The newsletter
-- API (src/app/api/newsletter/route.ts) writes here with the service-role key.

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text,
  created_at  timestamptz not null default now()
);

-- Case-insensitive uniqueness, so Foo@x.com and foo@x.com can't both subscribe.
-- The API also lowercases before insert; this index is the real guard and is
-- what surfaces the "already subscribed" (23505) path.
create unique index if not exists subscribers_email_lower_idx
  on public.subscribers (lower(email));

-- RLS on with NO policies: the table is reachable only through the service-role
-- key (which bypasses RLS) used server-side in the API route. The public anon
-- key can neither read nor write it.
alter table public.subscribers enable row level security;
