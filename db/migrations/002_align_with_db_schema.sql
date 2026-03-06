-- Migration 002: Align database with DB_SCHEMA.md
-- Run this in Supabase SQL Editor after migration 001

-- ============================================
-- ACCOUNTS: add missing columns
-- ============================================
alter table public.accounts
  add column if not exists industry_type text not null default 'REAL_ESTATE',
  add column if not exists city text,
  add column if not exists region text default 'VA',
  add column if not exists postal_code text,
  add column if not exists website_url text,
  add column if not exists status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'SUSPENDED'));

-- ============================================
-- BRAND PROFILES: add missing columns
-- ============================================
alter table public.brand_profiles
  add column if not exists known_for text
    check (known_for in ('TRUSTED_ADVISOR', 'MARKET_EXPERT', 'NEIGHBORHOOD_SPECIALIST', 'RESULTS_DRIVEN', 'RELATIONSHIP_BUILDER')),
  add column if not exists website_analysis_summary text;

-- ============================================
-- CAMPAIGNS: add missing columns
-- ============================================
alter table public.campaigns
  add column if not exists raw_input_text text,
  add column if not exists source_url text,
  add column if not exists location_focus text,
  add column if not exists campaign_language text not null default 'en',
  add column if not exists draft_caption text,
  add column if not exists final_caption text,
  add column if not exists published_slug text,
  add column if not exists published_at timestamptz;

-- ============================================
-- CAMPAIGN INPUTS (new table)
-- ============================================
create table if not exists public.campaign_inputs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  input_type text check (input_type in ('pdf', 'url', 'image', 'text')),
  storage_path text,
  source_url text,
  raw_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaign_inputs enable row level security;

create policy "Users can view own campaign inputs"
  on public.campaign_inputs for select
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

create policy "Users can insert own campaign inputs"
  on public.campaign_inputs for insert
  with check (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- ============================================
-- CAMPAIGN SLIDES (new table)
-- ============================================
create table if not exists public.campaign_slides (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  slide_index integer not null,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'FINAL')),
  headline text,
  body text,
  footer_text text,
  layout_type text,
  rendered_image_url text,
  slide_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaign_slides enable row level security;

create policy "Users can view own campaign slides"
  on public.campaign_slides for select
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

create policy "Users can insert own campaign slides"
  on public.campaign_slides for insert
  with check (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

create policy "Users can update own campaign slides"
  on public.campaign_slides for update
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.accounts a on c.account_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- ============================================
-- LANDING PAGES: add missing columns
-- ============================================
alter table public.landing_pages
  add column if not exists summary text,
  add column if not exists content_json jsonb,
  add column if not exists assistant_enabled boolean not null default true,
  add column if not exists published boolean not null default false;

-- ============================================
-- SUGGESTIONS (new table)
-- ============================================
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  type text not null check (type in ('WEEKLY', 'SIGNAL')),
  title text not null,
  description text,
  status text not null default 'NEW' check (status in ('NEW', 'DISMISSED', 'USED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;

create policy "Users can view own suggestions"
  on public.suggestions for select
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

create policy "Users can update own suggestions"
  on public.suggestions for update
  using (
    account_id in (select id from public.accounts where user_id = auth.uid())
  );

-- ============================================
-- ASSISTANT THREADS (new table)
-- ============================================
create table if not exists public.assistant_threads (
  id uuid primary key default gen_random_uuid(),
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  visitor_token text,
  thread_type text not null default 'PUBLIC_LEAD' check (thread_type in ('PUBLIC_LEAD', 'SUPPORT')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assistant_threads enable row level security;

-- Public: anyone can create assistant threads on published landing pages
create policy "Anyone can insert assistant threads"
  on public.assistant_threads for insert
  with check (true);

create policy "Anyone can view own assistant threads by token"
  on public.assistant_threads for select
  using (true);

-- ============================================
-- ASSISTANT MESSAGES (new table)
-- ============================================
create table if not exists public.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.assistant_threads(id) on delete cascade,
  role text not null check (role in ('USER', 'ASSISTANT', 'SYSTEM')),
  message_text text not null,
  created_at timestamptz not null default now()
);

alter table public.assistant_messages enable row level security;

create policy "Anyone can insert assistant messages"
  on public.assistant_messages for insert
  with check (true);

create policy "Anyone can view assistant messages"
  on public.assistant_messages for select
  using (true);

-- ============================================
-- LEADS: add missing columns
-- ============================================
alter table public.leads
  add column if not exists account_id uuid references public.accounts(id),
  add column if not exists campaign_id uuid references public.campaigns(id),
  add column if not exists source_thread_id uuid references public.assistant_threads(id),
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists lead_type text default 'UNKNOWN' check (lead_type in ('BUYER', 'SELLER', 'UNKNOWN')),
  add column if not exists urgency_level text default 'LOW' check (urgency_level in ('LOW', 'MEDIUM', 'HIGH')),
  add column if not exists notes text,
  add column if not exists updated_at timestamptz default now();

-- ============================================
-- SUPPORT THREADS: add ESCALATED status
-- ============================================
alter table public.support_threads
  drop constraint if exists support_threads_status_check;
alter table public.support_threads
  add constraint support_threads_status_check
    check (status in ('open', 'resolved', 'escalated', 'OPEN', 'RESOLVED', 'ESCALATED'));

-- ============================================
-- UPDATE TRIGGER: auto-create account with new fields
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.accounts (user_id, business_name, location, industry_type, city, region, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    'Hampton Roads, VA',
    'REAL_ESTATE',
    'Hampton Roads',
    'VA',
    'ACTIVE'
  );
  return new;
end;
$$ language plpgsql security definer;
