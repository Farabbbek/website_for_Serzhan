"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Post } from "@/types/blog";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type PostCardProps = {
  post: Post;
  variant?: "default" | "featured" | "compact";
};

function formatPublishedDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  // To prevent hydration mismatch, format strictly using UTC,
  // or return a fixed format DD.MM.YYYY string
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

function CoverImage({
  coverUrl,
  title,
  featured = false,
}: {
  coverUrl: string | null;
  title: string;
  featured?: boolean;
}) {
  if (!coverUrl) {
    return (
      <div
        className={clsx(
          "relative overflow-hidden bg-[color:var(--color-surface-2)]",
          featured ? "aspect-video w-full" : "aspect-video w-full",
        )}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(197,64,26,0.12),transparent_55%,rgba(92,92,46,0.12))]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-divider)]" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-[color:var(--color-surface-2)]",
        featured ? "aspect-video w-full" : "aspect-video w-full",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={title}
        width={900}
        height={506}
        loading="lazy"
        className="h-full w-full object-cover grayscale transition duration-150 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
      />
    </div>
  );
}

function CategoryBadge({
  name,
  compact = false,
}: {
  name: string | null | undefined;
  compact?: boolean;
}) {
  if (!name) {
    return null;
  }

  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center justify-center bg-[color:var(--color-primary)] font-ui uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)]",
        compact ? "px-2 py-1 text-[length:var(--text-xs)]" : "px-3 py-1.5 text-[length:var(--text-xs)]",
      )}
    >
      {name}
    </span>
  );
}

export function PostCard({
  post,
  variant = "default",
}: PostCardProps) {
  const publishedDate = formatPublishedDate(post.published_at);
  const authorName =
    post.author_name?.trim() ||
    post.profiles?.full_name ||
    post.profiles?.username ||
    "Редакция";

  if (variant === "compact") {
    return (
      <Link href={`/posts/${post.slug}`} prefetch className="group block no-underline">
        <motion.article
          whileHover={prefersReducedMotion ? undefined : { y: -3 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 30 }
          }
          className="card-hover-effect card-reveal border-b border-[color:var(--color-divider)] py-[var(--space-4)]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <CategoryBadge name={post.categories?.name} compact />
            <h3 className="min-w-0 flex-1 font-display text-[length:var(--text-base)] leading-snug text-[color:var(--color-text)] line-clamp-1 transition-colors duration-150 group-hover:text-[color:var(--color-primary)]">
              {post.title}
            </h3>
            <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              {publishedDate}
            </span>
          </div>
          <div className="mt-[var(--space-3)] h-px w-0 bg-[color:var(--color-primary)] transition-[width] duration-200 ease-out group-hover:w-full" />
        </motion.article>
      </Link>
    );
  }

  const isFeatured = variant === "featured";

  return (
    <Link href={`/posts/${post.slug}`} prefetch className="group block no-underline">
      <motion.article
        whileHover={prefersReducedMotion ? undefined : { y: -3 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 30 }
        }
        className="card-hover-effect card-reveal border-b border-[color:var(--color-divider)] pb-[var(--space-5)]"
      >
        <CoverImage coverUrl={post.cover_url} title={post.title} featured={isFeatured} />

        <div
          className={clsx(
            "flex flex-col",
            isFeatured ? "gap-[var(--space-4)] pt-[var(--space-5)]" : "gap-[var(--space-3)] pt-[var(--space-4)]",
          )}
        >
          <CategoryBadge name={post.categories?.name} />

          <h3
            className={clsx(
              "font-display text-[color:var(--color-text)] transition-colors duration-150 group-hover:text-[color:var(--color-primary)]",
              isFeatured
                ? "text-[length:var(--text-xl)] leading-[1.12] line-clamp-2"
                : "text-[length:var(--text-lg)] leading-[1.18] line-clamp-2",
            )}
          >
            {post.title}
          </h3>

          <p
            className={clsx(
              "font-body text-[color:var(--color-text-muted)]",
              isFeatured
                ? "line-clamp-3 text-[length:var(--text-base)] leading-8"
                : "line-clamp-3 text-[length:var(--text-sm)] leading-7",
            )}
          >
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between gap-4 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
            <span className="truncate">{authorName}</span>
            <span className="shrink-0">{publishedDate}</span>
          </div>

          <div className="h-px w-0 bg-[color:var(--color-primary)] transition-[width] duration-200 ease-out group-hover:w-full" />
        </div>
      </motion.article>
    </Link>
  );
}
