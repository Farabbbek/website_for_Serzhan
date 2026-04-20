import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";
import { getServerMessages } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Props = {
  params: Promise<{ slug: string }>;
};

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

type MaterialResource = {
  label: string;
  url: string;
};

function parseMaterialResources(
  content: string,
  fallbackUrl: string | null,
  fallbackLabel: string,
): MaterialResource[] {
  const resourcesLine = content
    .split("\n")
    .find((line) => line.trim().startsWith("РесурстарJSON: "));

  if (resourcesLine) {
    const rawJson = resourcesLine.replace("РесурстарJSON: ", "").trim();

    try {
      const parsed = JSON.parse(rawJson);

      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((item) => {
            if (!item || typeof item !== "object") return null;

            const entry = item as Partial<MaterialResource>;
            const url = typeof entry.url === "string" ? entry.url.trim() : "";
            const label = typeof entry.label === "string" ? entry.label.trim() : "";

            if (!url) return null;

            return {
              label: label || fallbackLabel,
              url,
            };
          })
          .filter((item): item is MaterialResource => item !== null);

        if (normalized.length > 0) return normalized;
      }
    } catch {
      // Ignore malformed JSON and use fallback below.
    }
  }

  if (!fallbackUrl) return [];

  return [
    {
      label: fallbackLabel,
      url: fallbackUrl,
    },
  ];
}

function parseMaterialBody(content: string): string {
  return content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (trimmed.startsWith("Автор: ")) return false;
      if (trimmed.startsWith("Жылы: ")) return false;
      if (trimmed.startsWith("Пән: ")) return false;
      if (trimmed.startsWith("Түрі: ")) return false;
      if (trimmed.startsWith("РесурстарJSON: ")) return false;
      return true;
    })
    .join("\n")
    .trim();
}

export default async function MaterialDetailPage({ params }: Props) {
  const { slug } = await params;
  const { locale, m } = await getServerMessages();
  const supabase = await createClient();
  const detailCopy = {
    kk: {
      back: "← Материалдар",
      fallbackLabel: "Материал",
      fallbackItem: "Материал",
    },
    ru: {
      back: "← Материалы",
      fallbackLabel: "Материал",
      fallbackItem: "Материал",
    },
    en: {
      back: "← Materials",
      fallbackLabel: "Material",
      fallbackItem: "Material",
    },
  }[locale];
  const levelLabels: Record<string, string> = {
    all: m.materials.all,
    bachelor: m.materials.bachelor,
    master: m.materials.master,
    phd: m.materials.phd,
  };

  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("posts")
    .select("*,categories(*)")
    .in("type", ["material", "materials"])
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  const post = data as PostRow | null;
  if (!post) {
    notFound();
  }

  const subject = post.content
    ?.split("\n")
    .find((line) => line.startsWith("Пән: "))
    ?.replace("Пән: ", "");
  const resources = parseMaterialResources(post.content ?? "", post.file_url, detailCopy.fallbackLabel);
  const bodyContent = parseMaterialBody(post.content ?? "");

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <article className="mx-auto max-w-[760px]">
        <Link href="/materials" className="text-[13px] text-[color:var(--color-text-muted)] no-underline">
          {detailCopy.back}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#05966915] px-3 py-1.5 text-[12px] font-semibold text-[#059669]">
            <BookOpen size={14} />
            {levelLabels[post.level ?? "all"] ?? m.materials.all}
          </span>
          {subject ? (
            <span className="rounded-full bg-[color:var(--color-surface-offset)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-text-muted)]">
              {subject}
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight text-[color:var(--color-text)]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-5 text-[18px] leading-8 text-[color:var(--color-text-muted)]">
            {post.excerpt}
          </p>
        ) : null}
        {post.cover_url ? (
          <div className="mt-6 overflow-hidden rounded-[10px] border border-[color:var(--color-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_url} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : null}
        {resources.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {resources.map((resource, index) => (
              <a
                key={`${resource.url}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#059669] px-4 py-3 text-[13px] font-semibold text-white no-underline"
              >
                {resource.label || `${detailCopy.fallbackItem} ${index + 1}`} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        ) : null}
        {bodyContent ? (
          <div className="article-prose mt-8">
            {bodyContent
              .split("\n\n")
              .filter(Boolean)
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        ) : null}
      </article>
    </section>
  );
}
