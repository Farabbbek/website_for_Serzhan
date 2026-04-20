/*
  SETUP INSTRUCTIONS:
  1. Go to Supabase Dashboard -> Storage
  2. Create new bucket: name = "media", Public = true
  3. Go to SQL Editor
  4. Run the policies in this file

  OR: run `npx supabase db push` if using local Supabase CLI
*/

-- Create 'media' bucket if not exists (run in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Allow everyone to read/view files (public bucket)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Ensure posts table has custom author_name field for article author display
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name text;

-- Allow authenticated users to insert posts as themselves
CREATE POLICY "Authenticated users can insert posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Allow authenticated users to update their own posts
CREATE POLICY "Authenticated users can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Allow authenticated users to delete their own posts
CREATE POLICY "Authenticated users can delete own posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Fix posts.type check constraint to support material content type.
-- Run this block in Supabase SQL Editor if you see:
-- "new row for relation \"posts\" violates check constraint \"posts_type_check\""
DO $$
DECLARE
  allowed_types text;
BEGIN
  SELECT string_agg(quote_literal(t), ', ')
  INTO allowed_types
  FROM (
    SELECT DISTINCT type AS t
    FROM public.posts
    WHERE type IS NOT NULL
    UNION
    SELECT 'article'
    UNION
    SELECT 'news'
    UNION
    SELECT 'podcast'
    UNION
    SELECT 'material'
    UNION
    SELECT 'materials'
  ) types;

  EXECUTE 'ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_type_check';
  EXECUTE
    'ALTER TABLE public.posts ADD CONSTRAINT posts_type_check CHECK (type IS NULL OR type IN (' || allowed_types || '))';
END
$$;
