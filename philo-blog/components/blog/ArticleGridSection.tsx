"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PostCard } from "@/components/blog/PostCard";
import { mockPosts } from "@/lib/queries/mockPosts";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const filters = [
  { label: "БАРЛЫҒЫ", value: "all" },
  { label: "МАҚАЛАЛАР", value: "maqalalar" },
  { label: "ЦИФРОВИЗАЦИЯ", value: "cifr" },
  { label: "ЭТИКА", value: "etika" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

const rowMotion = {
  initial: prefersReducedMotion ? false : { opacity: 0, y: 24 },
  whileInView: prefersReducedMotion ? undefined : { opacity: 1, y: 0 },
  animate: prefersReducedMotion ? { opacity: 1, y: 0 } : undefined,
  viewport: { once: true, amount: 0.2 },
  transition: prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export function ArticleGridSection() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredPosts = useMemo(() => {
    const pool = mockPosts.slice(4, 10);

    if (activeFilter === "all") {
      return pool;
    }

    return pool.filter((post) => post.categories?.slug === activeFilter);
  }, [activeFilter]);

  return (
    <section
      aria-labelledby="latest-articles-heading"
      className="py-[clamp(var(--space-12),6vw,var(--space-24))]"
    >
      <div className="flex items-center gap-[var(--space-4)]">
        <h2
          id="latest-articles-heading"
          className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]"
        >
          СОҢҒЫ МАҚАЛАЛАР
        </h2>
        <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
      </div>

      <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-10)]">
        <motion.div
          {...rowMotion}
          className="view-fade-in grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-[2fr_1fr]"
        >
          <PostCard post={mockPosts[0]} variant="featured" />
          <PostCard post={mockPosts[1]} variant="default" />
        </motion.div>

        <motion.div
          {...rowMotion}
          className="view-fade-in grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3"
        >
          {mockPosts.slice(2, 5).map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </motion.div>

        <motion.div
          {...rowMotion}
          className="view-fade-in flex flex-wrap items-center gap-3 border-y border-[color:var(--color-divider)] py-[var(--space-4)]"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`font-ui inline-flex min-h-11 items-center rounded-full border px-4 py-2.5 text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]"
                    : "border-[var(--color-border)] text-[color:var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[color:var(--color-primary)]"
                }`}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          key={activeFilter}
          {...rowMotion}
          className="view-fade-in grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPosts.map((post) => (
            <PostCard key={`${activeFilter}-${post.id}`} post={post} variant="default" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
