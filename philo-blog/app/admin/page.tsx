import type { Metadata } from "next";
import { mockPosts } from "@/lib/queries/mockPosts";

export const metadata: Metadata = {
  title: "Dashboard | Admin Panel",
  description: "Philo Blog әкімшілік панелінің негізгі бақылау тақтасы.",
};

const statCards = [
  { label: "Мақалалар", value: String(mockPosts.length) },
  { label: "Оқылымдар", value: String(mockPosts.reduce((sum, post) => sum + post.views_count, 0)) },
  { label: "Соңғы жарияланым", value: mockPosts[0]?.published_at ?? "—" },
];

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-3)]">
        <h1 className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
          Dashboard
        </h1>
        <p className="max-w-[56ch] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
          Редакция ағымын, жарияланған материалдар санын және соңғы белсенділікті осы жерден бақылай аласыз.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <article
            key={card.label}
            className="border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-[var(--space-6)]"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <p className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--color-text-faint)]">
              {card.label}
            </p>
            <p className="mt-[var(--space-3)] font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
