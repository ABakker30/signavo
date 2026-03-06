-- Migration 005: Add headshot URL to brand profiles
-- Run this in Supabase SQL Editor after migration 004

alter table public.brand_profiles
  add column if not exists headshot_url text;

-- Create storage bucket for headshots (if not exists)
insert into storage.buckets (id, name, public)
values ('headshots', 'headshots', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload headshots
create policy "Users can upload headshots"
  on storage.objects for insert
  with check (
    bucket_id = 'headshots'
    and auth.role() = 'authenticated'
  );

-- Allow public read access to headshots
create policy "Public headshot access"
  on storage.objects for select
  using (bucket_id = 'headshots');

-- Allow users to update their own headshots
create policy "Users can update headshots"
  on storage.objects for update
  using (
    bucket_id = 'headshots'
    and auth.role() = 'authenticated'
  );

-- Allow users to delete their own headshots
create policy "Users can delete headshots"
  on storage.objects for delete
  using (
    bucket_id = 'headshots'
    and auth.role() = 'authenticated'
  );
