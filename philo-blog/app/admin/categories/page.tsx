import CategoriesClient from "./CategoriesClient";
import { createClient } from "@/lib/supabase/server";

type InitialCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
};

type CategoryQueryRow = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  created_at?: string | null;
  posts?: Array<{ count?: number | string | null }> | { count?: number | string | null } | null;
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <CategoriesClient initialCategories={[]} />;
  }

  const { data } = await supabase
    .from("categories")
    .select(`
      *,
      posts(count)
    `)
    .order("created_at", { ascending: false });

  const initialCategories: InitialCategory[] = ((data ?? []) as CategoryQueryRow[]).map((cat) => {
    const postsCount = Array.isArray(cat.posts)
      ? Number(cat.posts?.[0]?.count ?? 0)
      : Number(cat.posts?.count ?? 0);

    return {
      id: String(cat.id),
      name: String(cat.name ?? ""),
      slug: String(cat.slug ?? ""),
      description: cat.description ?? null,
      post_count: Number.isFinite(postsCount) ? postsCount : 0,
      created_at: String(cat.created_at ?? new Date().toISOString()),
    };
  });

  return <CategoriesClient initialCategories={initialCategories} />;
}
