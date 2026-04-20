import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { getPostBySlug } from "@/lib/queries/posts";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ArticleBlock =
  | { type: "paragraph"; content: string }
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; content: string };

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

function isLikelyImageUrl(url: string): boolean {
  const imageExtensions = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

  try {
    const parsedUrl = new URL(url);
    return imageExtensions.test(parsedUrl.pathname);
  } catch {
    return imageExtensions.test(url);
  }
}

function splitLongParagraph(paragraph: string): string[] {
  const normalized = paragraph.replace(/\s+/g, " ").trim();

  if (!normalized) return [];
  if (normalized.length < 420) return [normalized];

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return [normalized];
  }

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;

    if (next.length > 300 && current) {
      chunks.push(current.trim());
      current = sentence;
      continue;
    }

    current = next;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

function parseArticleContent(raw?: string | null): ArticleBlock[] {
  const normalized = raw?.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const hasStructuredSyntax = lines.some((line) =>
    /^\s*(###|##|>)\s*/.test(line) || /^\s*-\s+/.test(line),
  );

  const blocks: ArticleBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let quoteLines: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    const paragraph = paragraphLines.join(" ").replace(/\s+/g, " ").trim();
    paragraphLines = [];

    if (!paragraph) return;

    if (hasStructuredSyntax) {
      blocks.push({ type: "paragraph", content: paragraph });
      return;
    }

    splitLongParagraph(paragraph).forEach((chunk) => {
      blocks.push({ type: "paragraph", content: chunk });
    });
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: "ul", items: listItems });
    listItems = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) return;
    const quote = quoteLines.join(" ").replace(/\s+/g, " ").trim();
    quoteLines = [];
    if (!quote) return;
    blocks.push({ type: "blockquote", content: quote });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (/^###\s*/.test(line)) {
      flushParagraph();
      flushList();
      flushQuote();
      const heading = line.replace(/^###\s*/u, "").trim();
      if (heading) {
        if (heading.length <= 140) {
          blocks.push({ type: "h3", content: heading });
        } else {
          blocks.push({ type: "paragraph", content: heading });
        }
      }
      continue;
    }

    if (/^##\s*/.test(line)) {
      flushParagraph();
      flushList();
      flushQuote();
      const heading = line.replace(/^##\s*/u, "").trim();
      if (heading) {
        if (heading.length <= 140) {
          blocks.push({ type: "h2", content: heading });
        } else {
          blocks.push({ type: "paragraph", content: heading });
        }
      }
      continue;
    }

    if (/^-\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      const item = line.replace(/^-\s+/u, "").trim();
      if (item) {
        listItems.push(item);
      }
      continue;
    }

    if (/^>\s*/.test(line)) {
      flushParagraph();
      flushList();
      const quoteLine = line.replace(/^>\s*/u, "").trim();
      if (quoteLine) {
        if (quoteLine.length <= 320) {
          quoteLines.push(quoteLine);
        } else {
          paragraphLines.push(quoteLine);
        }
      }
      continue;
    }

    flushList();
    flushQuote();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks;
}

function estimateReadingTimeMinutes(rawContent: string): number {
  const words = rawContent
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  if (words === 0) return 1;

  // Average reading speed ~220 words/minute.
  return Math.max(1, Math.ceil(words / 220));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Мақала табылмады | ZERDE Blog",
    };
  }

  return {
    title: `${post.title} | ZERDE Blog`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const displayAuthor =
    post.author_name ||
    post.profiles?.full_name ||
    (post.profiles as { username?: string | null } | null)?.username ||
    "ZERDE";

  const blocks = parseArticleContent(post.content);
  const readingTimeMinutes = estimateReadingTimeMinutes(post.content ?? "");
  const hasSupplementalLinks = Boolean(post.file_url || post.source_url);
  const normalizedTitle = post.title.trim();
  const titleLength = normalizedTitle.length;
  const longestTitleWordLength = normalizedTitle
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, word.length), 0);

  const titleTypographyClass =
    titleLength > 110
      ? "text-[clamp(1.7rem,4.8vw,3rem)] leading-[1.1] tracking-[-0.01em]"
      : titleLength > 70
        ? "text-[clamp(2rem,5.4vw,3.6rem)] leading-[1.06] tracking-[-0.02em]"
        : "text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.02] tracking-[-0.03em]";

  const titleWrapClass =
    longestTitleWordLength >= 20
      ? "break-words [overflow-wrap:anywhere]"
      : "break-normal [overflow-wrap:normal]";

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="mx-auto w-full max-w-[78rem]">
        <div className="mx-auto w-full max-w-[720px] px-6">
          <nav
            aria-label="Breadcrumb"
            className="font-ui text-[length:var(--text-xs)] text-[color:var(--color-text-faint)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/posts">Home</Link>
              <span>→</span>
              {post.categories ? (
                <Link href={`/category/${post.categories.slug}`}>
                  {post.categories.name}
                </Link>
              ) : null}
              <span>→</span>
              <span className="text-[color:var(--color-text-muted)]">{post.title}</span>
            </div>
          </nav>

          <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-5)]">
            {post.categories ? (
              <span className="inline-flex w-fit items-center bg-[color:var(--color-primary)] px-3 py-1.5 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)]">
                {post.categories.name}
              </span>
            ) : null}

            <h1
              className={`max-w-full font-display ${titleTypographyClass} ${titleWrapClass} text-pretty text-[color:var(--color-text)]`}
            >
              {post.title}
            </h1>

            <div className="meta-row font-ui">
              <span>{displayAuthor}</span>
              <span>·</span>
              <span>{formatDate(post.published_at)}</span>
              <span>·</span>
              <span>{readingTimeMinutes} мин оқу</span>
              <span>·</span>
              <span>{post.views_count} views</span>
            </div>
          </div>
        </div>

        {post.cover_url && isLikelyImageUrl(post.cover_url) ? (
          <figure className="article-cover">
            <div className="article-cover-frame relative aspect-video w-full overflow-hidden bg-[color:var(--color-surface-2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
        ) : null}

        {blocks.length ? (
          <article className="article-prose">
            {blocks.map((block, index) => {
              switch (block.type) {
                case "h2":
                  return <h2 key={index}>{block.content}</h2>;
                case "h3":
                  return <h3 key={index}>{block.content}</h3>;
                case "ul":
                  return (
                    <ul key={index}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  );
                case "blockquote":
                  return <blockquote key={index}>{block.content}</blockquote>;
                default:
                  return <p key={index}>{block.content}</p>;
              }
            })}
          </article>
        ) : null}

        {hasSupplementalLinks ? (
          <section className="article-supplemental">
            <h2 className="font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
              Қосымша материалдар
            </h2>
            <div className="article-supplemental-actions mt-4 flex flex-wrap gap-3">
              {post.file_url ? (
                <a
                  href={post.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 font-ui text-[length:var(--text-sm)] font-semibold text-[color:var(--color-text)] no-underline transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  <Download size={16} />
                  Мақаланы жүктеу
                </a>
              ) : null}

              {post.source_url ? (
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 font-ui text-[length:var(--text-sm)] font-medium text-[color:var(--color-text-muted)] no-underline transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  Дереккөзге өту
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

      </div>
    </section>
  );
}
