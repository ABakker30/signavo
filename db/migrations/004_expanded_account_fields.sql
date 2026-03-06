-- Migration 004: Expanded Account Fields
-- Run this in Supabase SQL Editor after migration 003

-- ============================================
-- ACCOUNTS: add address + business detail fields
-- ============================================
alter table public.accounts
  add column if not exists street_address text,
  add column if not exists address_line_2 text,
  add column if not exists country text not null default 'US',
  add column if not exists business_phone text,
  add column if not exists business_email text,
  add column if not exists license_number text,
  add column if not exists years_in_business integer,
  add column if not exists tagline text;
