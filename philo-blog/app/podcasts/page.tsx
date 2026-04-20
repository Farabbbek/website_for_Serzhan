import PodcastsPageClient from "@/components/blog/PodcastsPageClient";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
  season?: number | string | null;
  episode?: number | string | null;
};

export default async function PodcastsPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("posts")
        .select("*,categories(*)")
        .eq("type", "podcast")
        .eq("status", "published")
        .order("created_at", { ascending: false })
    : { data: [] };
  const posts = ((data as PostRow[] | null) ?? []);

  if (posts.length === 0) {
    return (
      <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
        <p className="home-empty">Подкасттар әзірге табылмады.</p>
      </section>
    );
  }

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <PodcastsPageClient
        posts={posts.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          cover_url: post.cover_url,
          audio_url: post.audio_url,
          author_name: post.author_name,
          guests: post.guests,
          created_at: post.created_at,
          published_at: post.published_at,
        }))}
      />
    </section>
  );
}
