-- Migration 003: Global Architecture - Generic Core + Vertical Packs
-- Run this in Supabase SQL Editor after migration 002

-- ============================================
-- VERTICAL CONFIGS
-- Stores industry/region/language configurations.
-- V1 has one entry: real_estate_hampton_roads_en
-- ============================================
create table if not exists public.vertical_configs (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  industry_type text not null,
  default_region text,
  default_country_code text not null default 'US',
  default_language text not null default 'en',

  -- Brand onboarding config
  known_for_options jsonb not null default '[]',
  tone_options jsonb not null default '[]',
  audience_options jsonb not null default '[]',

  -- Campaign config
  suggestion_templates jsonb not null default '[]',
  cta_templates jsonb not null default '[]',
  campaign_templates jsonb not null default '[]',

  -- UI config
  terminology jsonb not null default '{}',
  example_outputs jsonb not null default '{}',

  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vertical_configs enable row level security;

create policy "Anyone can read active vertical configs"
  on public.vertical_configs for select
  using (active = true);

-- ============================================
-- SEED: V1 vertical config
-- ============================================
insert into public.vertical_configs (
  key, label, industry_type,
  default_region, default_country_code, default_language,
  known_for_options, tone_options, audience_options,
  suggestion_templates, cta_templates, terminology
) values (
  'real_estate_hampton_roads_en',
  'Real Estate - Hampton Roads, VA',
  'REAL_ESTATE',
  'Hampton Roads, VA',
  'US',
  'en',

  '[
    {"value": "TRUSTED_ADVISOR", "label": "Trusted advisor"},
    {"value": "MARKET_EXPERT", "label": "Market expert"},
    {"value": "NEIGHBORHOOD_SPECIALIST", "label": "Neighborhood specialist"},
    {"value": "RESULTS_DRIVEN", "label": "Results-driven seller"},
    {"value": "RELATIONSHIP_BUILDER", "label": "Relationship builder"}
  ]'::jsonb,

  '[
    {"value": "professional", "label": "Professional"},
    {"value": "friendly", "label": "Friendly"},
    {"value": "premium", "label": "Premium"},
    {"value": "direct", "label": "Direct"}
  ]'::jsonb,

  '[
    {"value": "buyers", "label": "Buyers"},
    {"value": "sellers", "label": "Sellers"},
    {"value": "military_relocation", "label": "Military relocation"},
    {"value": "investors", "label": "Investors"}
  ]'::jsonb,

  '[
    {"type": "WEEKLY", "title": "Weekly Market Update", "description": "Share what''s happening in the local market this week."},
    {"type": "SIGNAL", "title": "Rate Change Commentary", "description": "Interest rates shifted recently. A timely update positions you as a knowledgeable resource."},
    {"type": "SIGNAL", "title": "Seasonal Activity Update", "description": "Seasonal activity is picking up. Share insights that help your audience feel confident."}
  ]'::jsonb,

  '[
    {"label": "Thinking about buying?", "context": "buyer"},
    {"label": "Considering selling?", "context": "seller"},
    {"label": "Curious how this applies to your area?", "context": "general"}
  ]'::jsonb,

  '{
    "campaign": "market update",
    "campaigns": "market updates",
    "audience_singular": "client",
    "audience_plural": "clients",
    "location_label": "Hampton Roads",
    "industry_label": "Real Estate"
  }'::jsonb
)
on conflict (key) do nothing;

-- ============================================
-- ACCOUNTS: add global fields
-- ============================================
alter table public.accounts
  add column if not exists country_code text not null default 'US',
  add column if not exists ui_language text not null default 'en',
  add column if not exists market_region text,
  add column if not exists vertical_config_key text references public.vertical_configs(key) default 'real_estate_hampton_roads_en';

-- ============================================
-- UPDATE TRIGGER: use vertical config defaults
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.accounts (
    user_id, business_name, location,
    industry_type, city, region, status,
    country_code, ui_language, market_region,
    vertical_config_key
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    coalesce(new.raw_user_meta_data->>'location', 'Hampton Roads, VA'),
    coalesce(new.raw_user_meta_data->>'industry_type', 'REAL_ESTATE'),
    coalesce(new.raw_user_meta_data->>'city', null),
    coalesce(new.raw_user_meta_data->>'region', 'VA'),
    'ACTIVE',
    coalesce(new.raw_user_meta_data->>'country_code', 'US'),
    coalesce(new.raw_user_meta_data->>'ui_language', 'en'),
    coalesce(new.raw_user_meta_data->>'market_region', null),
    coalesce(new.raw_user_meta_data->>'vertical_config_key', 'real_estate_hampton_roads_en')
  );
  return new;
end;
$$ language plpgsql security definer;
