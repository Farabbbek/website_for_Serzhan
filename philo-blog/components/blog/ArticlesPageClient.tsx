"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/types/blog";

const ALL_CATEGORIES = "Барлығы";

function formatDate(dateValue: string): string {
  const parsed = new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const year = parsed.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

function resolveAuthor(post: Post): string {
  return (
    post.author_name?.trim() ||
    post.profiles?.full_name?.trim() ||
    post.profiles?.username?.trim() ||
    "Редакция"
  );
}

function resolveExcerpt(post: Post, maxLength = 220): string {
  const source = (post.excerpt || post.content || "")
    .replace(/\s+/g, " ")
    .replace(/(Оқиға күні|Тіл|Автор|Жылы|Пән|Түрі|РесурстарJSON):\s*[^.\n]+/gi, "")
    .trim();

  if (!source) {
    return "Толық мәтінді ашып оқыңыз.";
  }

  if (source.length <= maxLength) {
    return source;
  }

  return `${source.slice(0, maxLength - 1).trimEnd()}…`;
}

function resolveCategory(post: Post): string {
  return post.categories?.name?.trim() || "МАҚАЛАЛАР";
}

type ArticlesPageClientProps = {
  posts: Post[];
  pageTitle?: string;
  pageSubtitle?: string;
  sectionTitle?: string;
  showFilters?: boolean;
  compactCards?: boolean;
  stretchSparseGrid?: boolean;
};

export default function ArticlesPageClient({
  posts,
  pageTitle = "МАҚАЛАЛАР",
  pageSubtitle = "Философия, ғылым және мәдениет туралы зерттеу жұмыстары",
  sectionTitle = "БАРЛЫҚ МАҚАЛАЛАР",
  showFilters = true,
  compactCards = false,
  stretchSparseGrid = true,
}: ArticlesPageClientProps) {
  const featuredPost = posts[0] ?? null;
  const remainingPosts = useMemo(() => posts.slice(1), [posts]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        remainingPosts
          .map((post) => post.categories?.name?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    );

    return [ALL_CATEGORIES, ...uniqueCategories];
  }, [remainingPosts]);

  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) {
      return remainingPosts;
    }

    return remainingPosts.filter((post) => (post.categories?.name || "") === activeCategory);
  }, [activeCategory, remainingPosts]);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">{pageSubtitle}</p>
      </div>

      {featuredPost ? (
        <article className="featured-article">
          <Link
            href={`/posts/${featuredPost.slug}`}
            className="featured-article-image"
            aria-label={`${featuredPost.title} мақаласын ашу`}
            prefetch
          >
            {featuredPost.cover_url ? (
              <img src={featuredPost.cover_url} alt={featuredPost.title} loading="lazy" />
            ) : (
              <div className="featured-article-placeholder" aria-hidden="true">
                <span>ZERDE</span>
              </div>
            )}
          </Link>

          <div className="featured-article-body">
            <span className="featured-article-tag">{resolveCategory(featuredPost)}</span>
            <h2 className="featured-article-title">{featuredPost.title}</h2>
            <p className="featured-article-excerpt">{resolveExcerpt(featuredPost, 260)}</p>
            <div className="featured-article-meta">
              <span>{resolveAuthor(featuredPost)}</span>
              <span>{formatDate(featuredPost.published_at)}</span>
            </div>
            <Link href={`/posts/${featuredPost.slug}`} className="featured-article-link" prefetch>
              Оқу →
            </Link>
          </div>
        </article>
      ) : null}

      <div className="section-header">
        <h2 className="section-title">{sectionTitle}</h2>
        <span className="section-count">{posts.length} мақала</span>
      </div>

      {showFilters && categories.length > 1 ? (
        <div className="article-filters" aria-label="Санат сүзгілері">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                className={`filter-tab${isActive ? " active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">✍️</span>
          <h3>Мақалалар жоқ</h3>
          <p>Жақын арада мақалалар қосылады</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state empty-state-sm">
          <h3>Бұл санатта мақалалар жоқ</h3>
          <p>Басқа санатты таңдап көріңіз</p>
        </div>
      ) : (
        <div
          className={`articles-grid${compactCards ? " articles-grid-compact" : ""}`}
          data-count={stretchSparseGrid ? String(filteredPosts.length) : undefined}
        >
          {filteredPosts.map((post) => {
            const categoryLabel = resolveCategory(post);

            return (
              <article key={post.id} className="article-card">
                <Link
                  href={`/posts/${post.slug}`}
                  className="article-card-thumb"
                  aria-label={`${post.title} мақаласын ашу`}
                  prefetch
                >
                  {post.cover_url ? (
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="article-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="article-card-no-cover" aria-hidden="true">
                      <span>{post.title?.charAt(0) || "Z"}</span>
                    </div>
                  )}

                  <span className="article-card-category">{categoryLabel}</span>
                </Link>

                <div className="article-card-body">
                  <h3 className="article-card-title">
                    <Link href={`/posts/${post.slug}`} prefetch>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="article-card-excerpt">{resolveExcerpt(post, 170)}</p>
                  <div className="article-card-meta">
                    <span className="article-card-author">{resolveAuthor(post)}</span>
                    <span className="article-card-date">{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
