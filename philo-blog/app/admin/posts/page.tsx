import type { Metadata } from "next";
import Link from "next/link";
import { mockPosts } from "@/lib/queries/mockPosts";

export const metadata: Metadata = {
  title: "Мақалалар | Admin Panel",
  description: "Philo Blog әкімшілік панеліндегі мақалалар тізімі.",
};

export default function AdminPostsPage() {
  return (
    <section className="flex flex-col gap-[var(--space-8)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-[var(--space-3)]">
          <h1 className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
            Мақалалар
          </h1>
          <p className="font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
            Қазір редакция қорында {mockPosts.length} материал бар.
          </p>
        </div>

        <Link href="/admin/posts/new" className="button-ink no-underline">
          Жаңа мақала
        </Link>
      </div>

      <div
        className="overflow-hidden border border-[color:var(--color-divider)] bg-[color:var(--color-surface)]"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(8rem,1fr)_minmax(7rem,auto)] gap-4 border-b border-[color:var(--color-divider)] px-[var(--space-6)] py-[var(--space-4)] font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
          <span>Тақырып</span>
          <span>Санат</span>
          <span>Күні</span>
        </div>

        <div className="divide-y divide-[color:var(--color-divider)]">
          {mockPosts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-1 gap-3 px-[var(--space-6)] py-[var(--space-5)] md:grid-cols-[minmax(0,2fr)_minmax(8rem,1fr)_minmax(7rem,auto)] md:items-center"
            >
              <div className="min-w-0">
                <p className="font-display text-[length:var(--text-md)] text-[color:var(--color-text)]">
                  {post.title}
                </p>
                <p className="mt-2 font-ui text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]">
                  /posts/{post.slug}
                </p>
              </div>
              <p className="font-ui text-[length:var(--text-sm)] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
                {post.categories?.name}
              </p>
              <p className="font-ui text-[length:var(--text-sm)] text-[color:var(--color-text-faint)]">
                {post.published_at}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
