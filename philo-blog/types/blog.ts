export type Category = {
  name: string;
  slug: string;
};

export type CategoryMeta = Category & {
  description: string;
};

export type Profile = {
  full_name: string;
  avatar_url: string | null;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string | null;
  published_at: string;
  views_count: number;
  categories: Category | null;
  profiles: Profile | null;
};

export type ArticlePost = Post & {
  hero_caption: string;
  tags: string[];
  bio: string;
  content: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};
