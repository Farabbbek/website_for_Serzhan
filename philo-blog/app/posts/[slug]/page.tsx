import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { notFound } from "next/navigation";
import { ArticlePageShell } from "@/components/blog/ArticlePageShell";
import { PostCard } from "@/components/blog/PostCard";
import {
  getMockArticleBySlug,
  getRelatedMockPosts,
  mockPosts,
} from "@/lib/queries/mockPosts";
import type { TocItem } from "@/types/blog";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;

    return extractText(element.props.children);
  }

  return "";
}

function buildToc(source: string): TocItem[] {
  const lines = source.split("\n");

  return lines.flatMap((line) => {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());

    if (!match) {
      return [];
    }

    const level = match[1].length as 2 | 3;
    const text = match[2].trim();

    return [
      {
        id: slugify(text),
        text,
        level,
      },
    ];
  });
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

function estimateReadTime(source: string) {
  const wordCount = source.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));

  return `${minutes} мин оқу`;
}

export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getMockArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const toc = buildToc(article.content);
  const relatedPosts = getRelatedMockPosts(article.slug, 3);
  const readTime = estimateReadTime(article.content);

  const { content } = await compileMDX({
    source: article.content,
    components: {
      p: ({ children }) => <p>{children}</p>,
      h2: ({ children }) => {
        const text = extractText(children);
        const id = slugify(text);

        return <h2 id={id}>{children}</h2>;
      },
      h3: ({ children }) => {
        const text = extractText(children);
        const id = slugify(text);

        return <h3 id={id}>{children}</h3>;
      },
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      code: ({ children }) => <code>{children}</code>,
      pre: ({ children }) => <pre>{children}</pre>,
      a: ({ href = "#", children }) => <Link href={href}>{children}</Link>,
      ul: ({ children }) => <ul>{children}</ul>,
      ol: ({ children }) => <ol>{children}</ol>,
      li: ({ children }) => <li>{children}</li>,
    },
  });

  return (
    <ArticlePageShell title={article.title} toc={toc}>
      <div className="mx-auto w-full max-w-[65ch]">
        <nav
          aria-label="Breadcrumb"
          className="font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-faint)]"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">Home</Link>
            <span>→</span>
            <Link href={`/category/${article.categories?.slug ?? "maqalalar"}`}>
              {article.categories?.name ?? "Философия"}
            </Link>
            <span>→</span>
            <span className="text-[color:var(--color-text-muted)]">
              {article.title}
            </span>
          </div>
        </nav>

        <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
          <span className="inline-flex w-fit items-center bg-[color:var(--color-primary)] px-3 py-1.5 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)]">
            {article.categories?.name}
          </span>

          <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.08] text-[color:var(--color-text)]">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-muted)]">
            <div className="flex items-center gap-3">
              {article.profiles?.avatar_url ? (
                <Image
                  src={article.profiles.avatar_url}
                  alt={article.profiles.full_name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-8 w-8 rounded-full bg-[color:var(--color-surface-2)]"
                />
              )}
              <span>{article.profiles?.full_name ?? "Редакция"}</span>
            </div>
            <span>·</span>
            <span>{formatDate(article.published_at)}</span>
            <span>·</span>
            <span>{article.views_count} views</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>
        </div>

        <figure className="mt-[var(--space-8)]">
          <div className="relative aspect-video w-full overflow-hidden bg-[color:var(--color-surface-2)]">
            {article.cover_url ? (
              <Image
                src={article.cover_url}
                alt={article.title}
                width={1600}
                height={900}
                priority
                fetchPriority="high"
                sizes="(max-width: 1280px) 100vw, 65ch"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <figcaption className="mt-[var(--space-3)] font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-faint)]">
            {article.hero_caption}
          </figcaption>
        </figure>

        <article className="article-prose mt-[var(--space-8)]">{content}</article>

        <section className="mt-[var(--space-10)] border-t border-[color:var(--color-divider)] pt-[var(--space-6)]">
          <div className="flex flex-wrap gap-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-2 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-[var(--space-10)] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-[var(--space-6)]">
          <div className="flex flex-col gap-[var(--space-5)] sm:flex-row sm:items-start">
            {article.profiles?.avatar_url ? (
              <Image
                src={article.profiles.avatar_url}
                alt={article.profiles.full_name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-[72px] w-[72px] rounded-full bg-[color:var(--color-surface-2)]"
              />
            )}

            <div className="flex-1">
              <h2 className="font-display text-[length:var(--text-lg)] text-[color:var(--color-text)]">
                {article.profiles?.full_name ?? "Редакция"}
              </h2>
              <p className="mt-[var(--space-3)] max-w-[60ch] font-body text-[length:var(--text-base)] leading-8 text-[color:var(--color-text-muted)]">
                {article.bio}
              </p>
              <Link
                href="/"
                className="mt-[var(--space-4)] inline-flex font-ui text-[length:var(--text-sm)] font-semibold text-[color:var(--color-primary)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary-hover)]"
              >
                Барлық мақалалары →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-[var(--space-12)]">
          <div className="flex items-center gap-[var(--space-4)]">
            <h2 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
              ҰҚСАС МАҚАЛАЛАР
            </h2>
            <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
          </div>

          <div className="mt-[var(--space-6)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </section>
      </div>
    </ArticlePageShell>
  );
}
