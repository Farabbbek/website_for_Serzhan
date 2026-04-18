import type { Metadata } from "next";
import { getPostsByCategorySlug, mockCategories } from "@/lib/queries/mockPosts";

export const metadata: Metadata = {
  title: "Категориялар | Admin Panel",
  description: "Philo Blog әкімшілік панеліндегі категорияларды басқару беті.",
};

export default function AdminCategoriesPage() {
  return (
    <section className="flex flex-col gap-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-3)]">
        <h1 className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
          Категориялар
        </h1>
        <p className="max-w-[56ch] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
          Әр бөлімнің редакциялық сипаттамасы мен мақалалар санын осы жерден шолуға болады.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2 xl:grid-cols-3">
        {mockCategories.map((category) => (
          <article
            key={category.slug}
            className="border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-[var(--space-6)]"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <p className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
              {category.slug}
            </p>
            <h2 className="mt-[var(--space-3)] font-display text-[length:var(--text-lg)] text-[color:var(--color-text)]">
              {category.name}
            </h2>
            <p className="mt-[var(--space-3)] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
              {category.description}
            </p>
            <p className="mt-[var(--space-4)] font-ui text-[length:var(--text-sm)] uppercase tracking-[0.12em] text-[color:var(--color-text-faint)]">
              {getPostsByCategorySlug(category.slug).length} мақала
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
