import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import UnauthorizedToast from "@/components/ui/UnauthorizedToast";
import { getPosts } from "@/lib/queries/posts";

type HomePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: "ZERDE Blog",
  description: "Соңғы қосылған жарияланымдар.",
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { error } = await searchParams;
  const showUnauthorizedToast = error === "unauthorized";
  const posts = await getPosts({ limit: 5 });

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      {showUnauthorizedToast ? (
        <UnauthorizedToast message="Бұл бетке кіруге рұқсатыңыз жоқ" />
      ) : null}

      <div className="flex items-center gap-[var(--space-4)]">
        <h1 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
          СОҢҒЫ ҚОСЫЛҒАНДАР
        </h1>
        <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
      </div>

      {posts.length === 0 ? (
        <p className="mt-[var(--space-8)] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
          Жарияланымдар әзірге табылмады.
        </p>
      ) : (
        <div className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      )}
    </section>
  );
}
