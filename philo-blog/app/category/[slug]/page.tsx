import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/queries/posts";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug.toUpperCase()} | ZERDE Blog`,
    description: "Санат бойынша жарияланған мақалалар.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const posts = await getPosts({ category: slug });
  const categoryTitle = posts[0]?.categories?.name ?? slug.toUpperCase();

  const articlePosts = posts.filter((post) => {
    const normalizedType = (post.type ?? "").toLowerCase();
    return !["podcast", "news", "material", "materials"].includes(normalizedType);
  });

  const featuredPost = articlePosts[0] ?? null;
  const remainingPosts = articlePosts.slice(1);

  const formatDate = (value: string) => {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString("kk-KZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const resolveAuthor = (authorName: string | null | undefined, profileName: string | null | undefined) => {
    return authorName?.trim() || profileName?.trim() || "Редакция";
  };

  const resolveExcerpt = (excerpt: string | null | undefined, content: string | undefined, maxLength = 180) => {
    const source = (excerpt || content || "").replace(/\s+/g, " ").trim();

    if (!source) {
      return "Толық мәтінді ашып оқыңыз.";
    }

    if (source.length <= maxLength) {
      return source;
    }

    return `${source.slice(0, maxLength - 1).trimEnd()}…`;
  };

  const estimateReadingTime = (content: string | undefined, excerpt: string | null | undefined) => {
    const source = (content || excerpt || "").replace(/\s+/g, " ").trim();
    const words = source ? source.split(" ").length : 0;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} мин оқу`;
  };

  const categoryLabel = categoryTitle.toUpperCase();

  return (
    <section className="category-articles-page">
      <header className="category-hero" aria-labelledby="category-title">
        <h1 id="category-title" className="category-hero-title">МАҚАЛАЛАР</h1>
        <p className="category-hero-subtitle">Редакциялық эсселер мен сын-пікірлер</p>
        <div className="category-hero-divider" aria-hidden="true" />
      </header>

      {featuredPost ? (
        <article className="category-featured fade-in-rise" style={{ animationDelay: "0ms" }}>
          <Link href={`/posts/${featuredPost.slug}`} className="category-featured-media" prefetch>
            {featuredPost.cover_url ? (
              <img
                src={featuredPost.cover_url}
                alt={featuredPost.title}
                className="category-featured-image"
                loading="lazy"
              />
            ) : (
              <div className="category-featured-placeholder" aria-hidden="true">
                <span>{featuredPost.title?.charAt(0) || "Z"}</span>
              </div>
            )}
            <span className="category-badge">{categoryLabel}</span>
          </Link>

          <div className="category-featured-body">
            <h2 className="category-featured-title">
              <Link href={`/posts/${featuredPost.slug}`} prefetch>{featuredPost.title}</Link>
            </h2>
            <p className="category-featured-excerpt">
              {resolveExcerpt(featuredPost.excerpt, featuredPost.content, 260)}
            </p>
            <div className="category-featured-meta">
              <span>{formatDate(featuredPost.published_at)}</span>
              <span>{estimateReadingTime(featuredPost.content, featuredPost.excerpt)}</span>
              <span>{categoryLabel}</span>
            </div>
          </div>
        </article>
      ) : null}

      <div className="category-list-header">
        <h2 className="category-list-title">САНАТТАҒЫ МАҚАЛАЛАР</h2>
        <span className="category-list-count">{articlePosts.length} мақала</span>
      </div>

      {articlePosts.length === 0 ? (
        <div className="category-empty-state">
          <span className="category-empty-icon" aria-hidden="true">✍️</span>
          <h3>Әзірге мақалалар жоқ</h3>
          <p>Бұл бөлім жақын арада жаңа материалдармен толығады.</p>
          <Link href="/" className="category-empty-link" prefetch>
            Басты бетке оралу
          </Link>
        </div>
      ) : remainingPosts.length === 0 ? (
        <div className="category-empty-state">
          <h3>Бұл санатта әзірге бір ғана мақала бар</h3>
          <p>Көп ұзамай жаңа жарияланымдар қосылады.</p>
        </div>
      ) : (
        <div className="category-articles-grid">
          {remainingPosts.map((post, index) => (
            <article
              key={post.id}
              className="category-article-card fade-in-rise"
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
            >
              <Link href={`/posts/${post.slug}`} className="category-article-thumb" prefetch>
                {post.cover_url ? (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="category-article-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="category-article-placeholder" aria-hidden="true">
                    <span>{post.title?.charAt(0) || "Z"}</span>
                  </div>
                )}
                <span className="category-badge">{categoryLabel}</span>
              </Link>

              <div className="category-article-body">
                <h3 className="category-article-title">
                  <Link href={`/posts/${post.slug}`} prefetch>{post.title}</Link>
                </h3>
                <p className="category-article-excerpt">
                  {resolveExcerpt(post.excerpt, post.content, 170)}
                </p>
                <div className="category-article-meta">
                  <span>{formatDate(post.published_at)}</span>
                  <span>{estimateReadingTime(post.content, post.excerpt)}</span>
                  <span>{resolveAuthor(post.author_name, post.profiles?.full_name)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
