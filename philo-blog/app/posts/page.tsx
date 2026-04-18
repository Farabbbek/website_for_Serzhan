import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { mockPosts } from "@/lib/queries/mockPosts";

export const metadata: Metadata = {
  title: "Журнал | ZERDE Blog",
  description:
    "Philo Blog журналының барлық мақалалары, эсселері және редакциялық материалдары.",
};

export default function PostsPage() {
  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="flex flex-col gap-[var(--space-8)]">
        <div className="flex items-center gap-[var(--space-4)]">
          <h1 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
            ЖУРНАЛ
          </h1>
          <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
        </div>

        <p className="max-w-[60ch] font-body text-[length:var(--text-base)] leading-8 text-[color:var(--color-text-muted)]">
          Философия, цифрлық мәдениет, этика және редакциялық ой туралы барлық
          жарияланған материалдар бір жерде жинақталды.
        </p>

        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
