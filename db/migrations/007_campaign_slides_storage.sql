-- Migration 007: Campaign slides storage bucket + rendered_slides column
-- Run this in Supabase SQL Editor after migration 006

-- Add rendered_slides column to campaigns
alter table public.campaigns
  add column if not exists rendered_slides jsonb;

-- Create storage bucket for rendered campaign slides
insert into storage.buckets (id, name, public)
values ('campaign-slides', 'campaign-slides', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload rendered slides
create policy "Users can upload campaign slides"
  on storage.objects for insert
  with check (
    bucket_id = 'campaign-slides'
    and auth.role() = 'authenticated'
  );

-- Allow public read access to campaign slides
create policy "Public campaign slide access"
  on storage.objects for select
  using (bucket_id = 'campaign-slides');

-- Allow users to update their slides
create policy "Users can update campaign slides"
  on storage.objects for update
  using (
    bucket_id = 'campaign-slides'
    and auth.role() = 'authenticated'
  );
