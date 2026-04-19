import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/lib/queries/posts";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug.toUpperCase()} | ZERDE Blog`,
    description: "Санат бойынша жарияланған мақалалар.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const posts = await getPosts({ category: slug });
  const categoryTitle = posts[0]?.categories?.name ?? slug.toUpperCase();

  return (
    <div className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <section className="bg-[color:var(--color-primary)] px-[var(--space-6)] py-[clamp(var(--space-10),5vw,var(--space-16))] text-[color:var(--color-text-inverse)]">
        <div className="mx-auto flex max-w-[var(--content-width)] flex-col gap-[var(--space-4)]">
          <p className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-inverse)]/80">
            Санат
          </p>
          <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.08] text-[color:var(--color-text-inverse)]">
            {categoryTitle}
          </h1>
        </div>
      </section>

      <section className="pt-[var(--space-10)]">
        {posts.length === 0 ? (
          <p className="font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
            Бұл санатта жарияланған мақалалар әзірге жоқ.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
