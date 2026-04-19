import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { getPostBySlug, getPosts } from "@/lib/queries/posts";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Мақала табылмады | ZERDE Blog",
    };
  }

  return {
    title: `${post.title} | ZERDE Blog`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPostsRaw = await getPosts({
    category: post.categories?.slug,
    limit: 4,
  });

  const relatedPosts = relatedPostsRaw
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="mx-auto w-full max-w-[65ch]">
        <nav
          aria-label="Breadcrumb"
          className="font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-faint)]"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/posts">Home</Link>
            <span>→</span>
            {post.categories ? (
              <Link href={`/category/${post.categories.slug}`}>
                {post.categories.name}
              </Link>
            ) : null}
            <span>→</span>
            <span className="text-[color:var(--color-text-muted)]">{post.title}</span>
          </div>
        </nav>

        <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          {post.categories ? (
            <span className="inline-flex w-fit items-center bg-[color:var(--color-primary)] px-3 py-1.5 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)]">
              {post.categories.name}
            </span>
          ) : null}

          <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.08] text-[color:var(--color-text)]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-muted)]">
            <span>{post.profiles?.full_name ?? "Редакция"}</span>
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{post.views_count} views</span>
          </div>
        </div>

        {post.cover_url ? (
          <figure className="mt-[var(--space-8)]">
            <div className="relative aspect-video w-full overflow-hidden bg-[color:var(--color-surface-2)]">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                sizes="(max-width: 1280px) 100vw, 65ch"
                className="object-cover"
                priority
              />
            </div>
          </figure>
        ) : null}

        <article className="article-prose mt-[var(--space-8)]">
          {post.content
            ?.split("\n\n")
            .filter(Boolean)
            .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </article>

        <section className="mt-[var(--space-10)] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-[var(--space-6)]">
          <h2 className="font-display text-[length:var(--text-lg)] text-[color:var(--color-text)]">
            {post.profiles?.full_name ?? "Редакция"}
          </h2>
          <Link
            href="/category/maqalalar"
            className="mt-[var(--space-4)] inline-flex font-ui text-[length:var(--text-sm)] font-semibold text-[color:var(--color-primary)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary-hover)]"
          >
            Барлық мақалалары →
          </Link>
        </section>

        <section className="mt-[var(--space-12)]">
          <div className="flex items-center gap-[var(--space-4)]">
            <h2 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
              ҰҚСАС МАҚАЛАЛАР
            </h2>
            <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
          </div>

          {relatedPosts.length ? (
            <div className="mt-[var(--space-6)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} variant="compact" />
              ))}
            </div>
          ) : (
            <p className="mt-[var(--space-6)] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
              Ұқсас мақалалар әзірге табылмады.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
