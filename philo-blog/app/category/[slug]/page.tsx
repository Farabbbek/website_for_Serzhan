import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import {
  getCategoryMetaBySlug,
  getPostsByCategorySlug,
  mockCategories,
} from "@/lib/queries/mockPosts";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

const POSTS_PER_PAGE = 6;

function parsePage(page?: string) {
  const value = Number(page);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

export async function generateStaticParams() {
  return mockCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryMetaBySlug(slug);

  if (!category) {
    return {
      title: "Санат табылмады | Philo Blog",
    };
  }

  return {
    title: `${category.name} | Philo Blog`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const category = getCategoryMetaBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategorySlug(slug);
  const currentPage = parsePage(page);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const previousHref =
    safePage > 1
      ? `/category/${slug}${safePage - 1 === 1 ? "" : `?page=${safePage - 1}`}`
      : null;
  const nextHref =
    safePage < totalPages ? `/category/${slug}?page=${safePage + 1}` : null;

  return (
    <div className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <section className="bg-[color:var(--color-primary)] px-[var(--space-6)] py-[clamp(var(--space-10),5vw,var(--space-16))] text-[color:var(--color-text-inverse)]">
        <div className="mx-auto flex max-w-[var(--content-width)] flex-col gap-[var(--space-4)]">
          <p className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-inverse)]/80">
            Санат
          </p>
          <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.08] text-[color:var(--color-text-inverse)]">
            {category.name}
          </h1>
          <p className="max-w-[46rem] font-body text-[length:var(--text-base)] leading-8 text-[color:var(--color-text-inverse)]/88">
            {category.description}
          </p>
        </div>
      </section>

      <section className="pt-[var(--space-10)]">
        <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <PostCard key={post.id} post={post} variant="default" />
          ))}
        </div>

        <nav
          aria-label="Pagination"
          className="mt-[var(--space-12)] flex flex-wrap items-center justify-center gap-4"
        >
          {previousHref ? (
            <Link href={previousHref} className="button-ghost no-underline">
              ← Алдыңғы
            </Link>
          ) : (
            <span className="button-ghost cursor-default opacity-50">← Алдыңғы</span>
          )}

          <span className="font-ui text-[length:var(--text-sm)] uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            {safePage} / {totalPages}
          </span>

          {nextHref ? (
            <Link href={nextHref} className="button-ghost no-underline">
              Келесі →
            </Link>
          ) : (
            <span className="button-ghost cursor-default opacity-50">Келесі →</span>
          )}
        </nav>
      </section>
    </div>
  );
}
