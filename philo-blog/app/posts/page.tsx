import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/lib/queries/posts";

export const metadata: Metadata = {
  title: "Журнал | ZERDE Blog",
  description:
    "Philo Blog журналының барлық мақалалары, эсселері және редакциялық материалдары.",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="flex flex-col gap-(--space-8)">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            marginBottom: 8,
          }}
        >
          ЖУРНАЛ
        </h1>

        <p
          className="max-w-[60ch]"
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-text-muted)",
            marginBottom: 40,
          }}
        >
          Философия, цифрлық мәдениет, этика және редакциялық ой туралы барлық
          жарияланған материалдар бір жерде жинақталды.
        </p>

        {posts.length === 0 ? (
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--color-text-muted)",
            }}
          >
            Жарияланған мақалалар әзірге табылмады.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-(--space-8) md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
