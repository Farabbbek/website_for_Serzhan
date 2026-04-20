import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getServerMessages } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("kk-KZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function NewsPage() {
  const { m } = await getServerMessages();
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("posts")
        .select("*,categories(*)")
        .eq("type", "news")
        .eq("status", "published")
        .order("created_at", { ascending: false })
    : { data: [] };
  const posts = ((data as PostRow[] | null) ?? []);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="grid grid-cols-1 gap-5">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition-colors hover:border-[#2563eb]"
          >
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                {formatDate(post.published_at ?? post.created_at)}
              </p>
              <Link
                href={`/news/${post.slug}`}
                className="font-display text-[24px] font-bold leading-tight text-[color:var(--color-text)] no-underline transition-colors hover:text-[#2563eb]"
              >
                {post.title}
              </Link>
              {post.excerpt ? (
                <p className="max-w-[72ch] text-[15px] leading-7 text-[color:var(--color-text-muted)]">
                  {post.excerpt}
                </p>
              ) : null}
              {post.source_url ? (
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-[#2563eb] no-underline"
                >
                  {m.news.source} <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
