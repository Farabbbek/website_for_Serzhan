import type { Metadata } from "next";
import Link from "next/link";
import UnauthorizedToast from "@/components/ui/UnauthorizedToast";
import { getPosts } from "@/lib/queries/posts";
import type { Post } from "@/types/blog";

type HomePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

type ContentTypeBadge = {
  label: string;
  background: string;
  color: string;
};

export const metadata: Metadata = {
  title: "ZERDE Blog",
  description: "Соңғы қосылған жарияланымдар.",
};

function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

function resolvePostHref(post: Post): string {
  const normalizedType = (post.type ?? "").toLowerCase();

  if (normalizedType === "podcast") return `/podcasts/${post.slug}`;
  if (normalizedType === "news") return `/news/${post.slug}`;
  if (normalizedType === "material" || normalizedType === "materials") {
    return `/materials/${post.slug}`;
  }

  return `/posts/${post.slug}`;
}

function resolveCategoryLabel(post: Post): string {
  if (post.categories?.name) return post.categories.name;

  const normalizedType = (post.type ?? "").toLowerCase();
  if (normalizedType === "podcast") return "ПОДКАСТТАР";
  if (normalizedType === "news") return "ЖАҢАЛЫҚТАР";
  if (normalizedType === "material" || normalizedType === "materials") {
    return "МАТЕРИАЛДАР";
  }

  return "МАҚАЛАЛАР";
}

function getContentTypeBadge(type: string | null | undefined): ContentTypeBadge | null {
  const normalized = (type ?? "").toLowerCase();

  switch (normalized) {
    case "podcast":
      return {
        label: "ПОДКАСТ",
        background: "var(--color-primary)",
        color: "white",
      };
    case "news":
      return {
        label: "ЖАҢАЛЫҚ",
        background: "var(--color-surface-offset)",
        color: "var(--color-text-muted)",
      };
    case "material":
    case "materials":
      return {
        label: "МАТЕРИАЛ",
        background: "var(--color-text)",
        color: "var(--color-bg)",
      };
    default:
      return null;
  }
}

function resolveAuthor(post: Post): string {
  return (
    post.author_name?.trim() ||
    post.profiles?.full_name?.trim() ||
    post.profiles?.username?.trim() ||
    "Редакция"
  );
}

function resolveExcerpt(post: Post, maxLength = 180): string {
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

function sortByPublishedAtDesc(a: Post, b: Post): number {
  const left = new Date(a.published_at).getTime();
  const right = new Date(b.published_at).getTime();

  return (Number.isNaN(right) ? 0 : right) - (Number.isNaN(left) ? 0 : left);
}

function uniquePostsById(posts: Post[]): Post[] {
  const seen = new Set<string>();
  const result: Post[] = [];

  for (const post of posts) {
    const key = String(post.id);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(post);
  }

  return result;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { error } = await searchParams;
  const showUnauthorizedToast = error === "unauthorized";
  const [allPosts, podcasts, materials, legacyMaterials] = await Promise.all([
    getPosts({ limit: 24 }),
    getPosts({ type: "podcast", limit: 3 }),
    getPosts({ type: "material", limit: 6 }),
    getPosts({ type: "materials", limit: 6 }),
  ]);

  const featuredPost = allPosts[0] ?? null;
  const recentPosts = allPosts
    .filter((post) => String(post.id) !== String(featuredPost?.id ?? ""))
    .slice(0, 6);

  const podcastPosts = podcasts.length
    ? podcasts
    : allPosts.filter((post) => (post.type ?? "").toLowerCase() === "podcast").slice(0, 3);

  const materialPosts = uniquePostsById([...materials, ...legacyMaterials])
    .sort(sortByPublishedAtDesc)
    .slice(0, 3);

  return (
    <section className="home-content">
      {showUnauthorizedToast ? (
        <UnauthorizedToast message="Бұл бетке кіруге рұқсатыңыз жоқ" />
      ) : null}

      {featuredPost ? (
        <article className="hero-card">
          <Link href={resolvePostHref(featuredPost)} className="hero-card-media" prefetch>
            {featuredPost.cover_url ? (
              <img
                src={featuredPost.cover_url}
                alt={featuredPost.title}
                className="hero-card-image"
              />
            ) : (
              <div className="hero-card-image hero-card-image-fallback" aria-hidden="true" />
            )}
          </Link>

          <div className="hero-card-body">
            <span className="hero-card-category">{resolveCategoryLabel(featuredPost)}</span>
            <Link href={resolvePostHref(featuredPost)} className="hero-card-title-link" prefetch>
              <h1 className="hero-card-title">{featuredPost.title}</h1>
            </Link>
            <p className="hero-card-excerpt">{resolveExcerpt(featuredPost, 240)}</p>
            <div className="hero-card-meta">
              {resolveAuthor(featuredPost)} · {formatPublishedDate(featuredPost.published_at)}
            </div>
            <Link href={resolvePostHref(featuredPost)} className="hero-card-read-more" prefetch>
              Оқу →
            </Link>
          </div>
        </article>
      ) : null}

      <section>
        <div className="section-header">
          <h2 className="section-title">СОҢҒЫ ҚОСЫЛҒАНДАР</h2>
        </div>

        {recentPosts.length === 0 ? (
          <p className="home-empty">Жарияланымдар әзірге табылмады.</p>
        ) : (
          <>
            <div className="posts-grid">
              {recentPosts.map((post) => {
                const contentTypeBadge = getContentTypeBadge(post.type);

                return (
                  <article key={post.id} className="post-card">
                    <Link href={resolvePostHref(post)} className="post-card-link" prefetch>
                      <div className="post-card-media-wrap">
                        {post.cover_url ? (
                          <img
                            src={post.cover_url}
                            alt={post.title}
                            className="post-card-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="post-card-image post-card-image-fallback" aria-hidden="true" />
                        )}

                        {contentTypeBadge ? (
                          <span
                            className="content-type-badge"
                            style={{
                              background: contentTypeBadge.background,
                              color: contentTypeBadge.color,
                            }}
                          >
                            {contentTypeBadge.label}
                          </span>
                        ) : null}
                      </div>

                      <span className="post-card-category">{resolveCategoryLabel(post)}</span>
                      <h3 className="post-card-title">{post.title}</h3>
                      <p className="post-card-excerpt">{resolveExcerpt(post)}</p>

                      <div className="post-card-meta">
                        <span>{resolveAuthor(post)}</span>
                        <span>{formatPublishedDate(post.published_at)}</span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="section-footer-link-wrap">
              <Link href="/category/maqalalar" className="section-link" prefetch>
                Барлығын көру →
              </Link>
            </div>
          </>
        )}
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">ПОДКАСТТАР</h2>
          <Link href="/podcasts" className="section-link" prefetch>
            Барлық подкасттар →
          </Link>
        </div>

        {podcastPosts.length === 0 ? (
          <p className="home-empty">Подкасттар әзірге табылмады.</p>
        ) : (
          <div>
            {podcastPosts.map((post, index) => (
              <Link key={post.id} href={resolvePostHref(post)} className="podcast-row" prefetch>
                <span className="podcast-index">{String(index + 1).padStart(2, "0")}</span>

                {post.cover_url ? (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="podcast-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="podcast-thumb podcast-thumb-fallback" aria-hidden="true" />
                )}

                <div>
                  <h3 className="podcast-title">{post.title}</h3>
                  <div className="podcast-meta">
                    {resolveAuthor(post)} · {formatPublishedDate(post.published_at)}
                  </div>
                </div>

                <span className="podcast-play-btn" aria-hidden="true">▶</span>
              </Link>
            ))}

            <div className="section-footer-link-wrap section-footer-link-wrap-left">
              <Link href="/podcasts" className="section-link" prefetch>
                Барлық подкасттар →
              </Link>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">МАТЕРИАЛДАР</h2>
          <Link href="/materials" className="section-link" prefetch>
            Барлық материалдар →
          </Link>
        </div>

        {materialPosts.length === 0 ? (
          <p className="home-empty">Материалдар әзірге табылмады.</p>
        ) : (
          <div className="materials-list">
            {materialPosts.map((post) => {
              const detailHref = resolvePostHref(post);
              const downloadHref = post.file_url || detailHref;
              const isDirectFile = Boolean(post.file_url);

              return (
                <article key={post.id} className="material-row">
                  <div className="material-icon" aria-hidden="true">PDF</div>

                  <div className="material-main">
                    <Link href={detailHref} className="material-title" prefetch>
                      {post.title}
                    </Link>
                    <div className="material-meta">
                      {resolveAuthor(post)} · {formatPublishedDate(post.published_at)}
                    </div>
                  </div>

                  {isDirectFile ? (
                    <a
                      href={downloadHref}
                      className="material-download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Жүктеу
                    </a>
                  ) : (
                    <Link href={downloadHref} className="material-download-btn" prefetch>
                      Жүктеу
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
