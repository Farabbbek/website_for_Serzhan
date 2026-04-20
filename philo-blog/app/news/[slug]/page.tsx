import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getServerMessages } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Props = {
  params: Promise<{ slug: string }>;
};

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

function formatDate(value: string | null, locale: "kk" | "ru" | "en") {
  if (!value) return "";
  const intlLocale = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const { locale, m } = await getServerMessages();
  const supabase = await createClient();
  const detailCopy = {
    kk: { back: "← Жаңалықтар" },
    ru: { back: "← Новости" },
    en: { back: "← News" },
  }[locale];

  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("posts")
    .select("*,categories(*)")
    .eq("type", "news")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  const post = data as PostRow | null;
  if (!post) {
    notFound();
  }

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <article className="mx-auto max-w-[760px]">
        <Link href="/news" className="text-[13px] text-[color:var(--color-text-muted)] no-underline">
          {detailCopy.back}
        </Link>
        <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
          {formatDate(post.published_at ?? post.created_at, locale)}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight text-[color:var(--color-text)]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-5 text-[18px] leading-8 text-[color:var(--color-text-muted)]">
            {post.excerpt}
          </p>
        ) : null}
        {post.source_url ? (
          <a
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2563eb] no-underline"
          >
            {m.news.source} <ExternalLink size={14} />
          </a>
        ) : null}
        <div className="article-prose mt-8">
          {post.content
            ?.split("\n\n")
            .filter(Boolean)
            .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </section>
  );
}
