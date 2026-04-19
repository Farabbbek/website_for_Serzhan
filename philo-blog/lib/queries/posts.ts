import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/types/blog";

type GetPostsOptions = {
  category?: string;
  type?: string;
  limit?: number;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  type: string | null;
  status: string | null;
  lang: string | null;
  views: number | null;
  published_at: string | null;
  category_id: string | null;
  author_id: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

function mapPost(
  row: PostRow,
  categoriesById: Map<string, CategoryRow>,
  profilesById: Map<string, ProfileRow>,
): Post {
  const category = row.category_id ? categoriesById.get(row.category_id) : null;
  const profile = row.author_id ? profilesById.get(row.author_id) : null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content,
    cover_url: row.cover_url,
    published_at: row.published_at ?? new Date().toISOString(),
    views_count: row.views ?? 0,
    type: row.type,
    status: row.status,
    lang: row.lang,
    categories: category
      ? {
          name: category.name,
          slug: category.slug,
        }
      : null,
    profiles: profile
      ? {
          full_name: profile.full_name ?? "Редакция",
          avatar_url: profile.avatar_url,
        }
      : null,
  };
}

async function hydratePosts(posts: PostRow[]) {
  const supabase = await getSupabaseServerClient();

  if (!supabase || posts.length === 0) {
    return posts.map((post) => mapPost(post, new Map(), new Map()));
  }

  const categoryIds = Array.from(
    new Set(posts.map((post) => post.category_id).filter(Boolean) as string[]),
  );
  const authorIds = Array.from(
    new Set(posts.map((post) => post.author_id).filter(Boolean) as string[]),
  );

  const [categoriesResult, profilesResult] = await Promise.all([
    categoryIds.length
      ? supabase
          .from("categories")
          .select("id,name,slug")
          .in("id", categoryIds)
      : Promise.resolve({ data: [] as CategoryRow[], error: null }),
    authorIds.length
      ? supabase
          .from("profiles")
          .select("id,full_name,avatar_url")
          .in("id", authorIds)
      : Promise.resolve({ data: [] as ProfileRow[], error: null }),
  ]);

  const categoriesById = new Map(
    ((categoriesResult.data as CategoryRow[] | null) ?? []).map((category) => [
      category.id,
      category,
    ]),
  );
  const profilesById = new Map(
    ((profilesResult.data as ProfileRow[] | null) ?? []).map((profile) => [
      profile.id,
      profile,
    ]),
  );

  return posts.map((post) => mapPost(post, categoriesById, profilesById));
}

export async function getPosts({
  category,
  type,
  limit,
}: GetPostsOptions = {}): Promise<Post[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("posts")
    .select(
      "id,title,slug,excerpt,content,cover_url,type,status,lang,views,published_at,category_id,author_id",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getPosts] Supabase error:", error.message);
    return [];
  }

  let rows = (data as PostRow[] | null) ?? [];

  if (category) {
    const { data: categoryRows, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .limit(1);

    if (categoryError || !categoryRows?.length) {
      return [];
    }

    const categoryId = categoryRows[0].id;
    rows = rows.filter((row) => row.category_id === categoryId);
  }

  return hydratePosts(rows);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,title,slug,excerpt,content,cover_url,type,status,lang,views,published_at,category_id,author_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[getPostBySlug] Supabase error:", error.message);
    }
    return null;
  }

  const hydrated = await hydratePosts([data as PostRow]);
  return hydrated[0] ?? null;
}
