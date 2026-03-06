-- Migration 006: Add campaign language preference to accounts
-- Run this in Supabase SQL Editor after migration 005

alter table public.accounts
  add column if not exists campaign_language text not null default 'en';
