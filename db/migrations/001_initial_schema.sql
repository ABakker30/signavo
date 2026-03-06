-- Signavo V1 Database Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- ============================================
-- ACCOUNTS
-- ============================================
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  location text not null default 'Hampton Roads, VA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.accounts enable row level security;

create policy "Users can view own account"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Users can update own account"
  on public.accounts for update
  using (auth.uid() = user_id);

create policy "Users can insert own account"
  on public.accounts for insert
  with check (auth.uid() = user_id);

-- ============================================
-- BRAND PROFILES
-- ============================================
create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  website_url text,
  positioning text,
  tone text check (tone in ('professional', 'friendly', 'premium', 'direct')),
  audience_focus text check (audience_focus in ('buyers', 'sellers', 'relocation', 'investors')),
  assistant_intro text,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(account_id)
);

alter table public.brand_profiles enable row level security;

create policy "Users can view own brand profile"
  on public.brand_profiles for select
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can update own brand profile"
  on public.brand_profiles for update
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can insert own brand profile"
  on public.brand_profiles for insert
  with check (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

-- ============================================
-- CAMPAIGNS
-- ============================================
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  title text,
  status text not null default 'draft' check (status in ('draft', 'ready_to_finalize', 'published', 'failed')),
  input_type text check (input_type in ('pdf', 'url', 'image', 'text')),
  input_data text,
  slides jsonb,
  caption text,
  landing_page_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create policy "Users can view own campaigns"
  on public.campaigns for select
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can insert own campaigns"
  on public.campaigns for insert
  with check (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can update own campaigns"
  on public.campaigns for update
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

-- ============================================
-- LANDING PAGES
-- ============================================
create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  slug text not null unique,
  headline text,
  narrative text,
  cta_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.landing_pages enable row level security;

-- Landing pages are public (anyone can view published pages)
create policy "Anyone can view landing pages"
  on public.landing_pages for select
  using (true);

create policy "Users can insert own landing pages"
  on public.landing_pages for insert
  with check (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

create policy "Users can update own landing pages"
  on public.landing_pages for update
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- ============================================
-- LEADS
-- ============================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  email text not null,
  context text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Leads can be inserted by anyone (from public landing pages)
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

create policy "Users can view leads from own landing pages"
  on public.leads for select
  using (
    landing_page_id in (
      select lp.id from public.landing_pages lp
      join public.campaigns c on lp.campaign_id = c.id
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- ============================================
-- SUPPORT THREADS
-- ============================================
create table if not exists public.support_threads (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.support_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.support_threads enable row level security;
alter table public.support_messages enable row level security;

create policy "Users can view own support threads"
  on public.support_threads for select
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can insert own support threads"
  on public.support_threads for insert
  with check (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can view own support messages"
  on public.support_messages for select
  using (
    thread_id in (
      select st.id from public.support_threads st
      join public.accounts a on st.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

create policy "Users can insert own support messages"
  on public.support_messages for insert
  with check (
    thread_id in (
      select st.id from public.support_threads st
      join public.accounts a on st.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- ============================================
-- AUTO-CREATE ACCOUNT ON SIGNUP
-- ============================================
-- This function automatically creates an account when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.accounts (user_id, business_name, location)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    'Hampton Roads, VA'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: run after new user is created in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- AUTO-CREATE BRAND PROFILE WHEN ACCOUNT IS CREATED
-- ============================================
create or replace function public.handle_new_account()
returns trigger as $$
begin
  insert into public.brand_profiles (account_id, status)
  values (new.id, 'not_started');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_account_created on public.accounts;
create trigger on_account_created
  after insert on public.accounts
  for each row execute procedure public.handle_new_account();
