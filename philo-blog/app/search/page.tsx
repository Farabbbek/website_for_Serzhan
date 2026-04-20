import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { getServerMessages } from "@/lib/i18n/server";
import { mockCategories, searchMockPosts } from "@/lib/queries/mockPosts";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function normalizeQuery(query?: string) {
  return query?.trim() ?? "";
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale, m } = await getServerMessages();
  const { q } = await searchParams;
  const query = normalizeQuery(q);
  const description = {
    kk: query
      ? `ZERDE ішінен "${query}" сұрауы бойынша іздеу нәтижелері.`
      : "ZERDE материалдары бойынша іздеу беті.",
    ru: query
      ? `Результаты поиска по запросу "${query}" внутри ZERDE.`
      : "Страница поиска по материалам ZERDE.",
    en: query
      ? `Search results for "${query}" across ZERDE.`
      : "Search page for ZERDE materials.",
  }[locale];

  return {
    title: query
      ? `${m.search.pageTitle}: ${query} | ZERDE Blog`
      : `${m.search.pageTitle} | ZERDE Blog`,
    description,
  };
}

async function EmptyState() {
  const { m } = await getServerMessages();

  return (
    <div className="flex flex-col items-center justify-center gap-[var(--space-5)] py-[var(--space-20)] text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[color:var(--color-primary)]"
        aria-hidden="true"
      >
        <circle
          cx="51"
          cy="51"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          d="M71 71L96 96"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M40 51H62"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
          {m.search.noResults}
        </h2>
        <p className="max-w-[38rem] font-body text-[length:var(--text-base)] text-[color:var(--color-text-muted)]">
          {m.search.tryAnother}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {mockCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="button-ghost no-underline"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { m } = await getServerMessages();
  const { q } = await searchParams;
  const query = normalizeQuery(q);
  const results = searchMockPosts(query);
  const resultLabel = query || m.search.all;

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="flex flex-col gap-[var(--space-8)]">
        <form action="/search" className="w-full">
          <div className="flex w-full items-center gap-3 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-4">
            <label htmlFor="site-search" className="sr-only">
              {m.search.searchLabel}
            </label>
            <Search
              size={18}
              strokeWidth={1.8}
              className="shrink-0 text-[color:var(--color-text-faint)]"
            />
            <input
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder={m.search.placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent font-ui text-[length:var(--text-base)] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
            />
            {query ? (
              <Link
                href="/search"
                className="inline-flex min-h-11 items-center gap-2 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary)]"
              >
                <X size={14} />
                {m.search.clear}
              </Link>
            ) : null}
          </div>
        </form>

        <div className="flex items-center gap-[var(--space-4)]">
          <h1 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
            {m.search.resultsFor}: “{resultLabel}” ({results.length})
          </h1>
          <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        ) : (
          <>{await EmptyState()}</>
        )}
      </div>
    </section>
  );
}
