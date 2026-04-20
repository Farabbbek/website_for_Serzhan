-- Run these in Supabase SQL Editor -> Query
-- These indexes speed up all post/category queries

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_category_id
  ON public.posts(category_id);

CREATE INDEX IF NOT EXISTS idx_posts_created_at
  ON public.posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_status
  ON public.posts(status);

CREATE INDEX IF NOT EXISTS idx_posts_slug
  ON public.posts(slug);

-- Categories index
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug
  ON public.categories(slug);
