import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

const levelLabels: Record<string, string> = {
  all: "Барлығы",
  bachelor: "Бакалавр",
  master: "Магистр",
  phd: "PhD",
};

function getPrimaryMaterialResourceUrl(content: string, fallbackUrl: string | null): string | null {
  const resourcesLine = content
    .split("\n")
    .find((line) => line.trim().startsWith("РесурстарJSON: "));

  if (resourcesLine) {
    const rawJson = resourcesLine.replace("РесурстарJSON: ", "").trim();

    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (!item || typeof item !== "object") continue;
          const maybeUrl = (item as { url?: unknown }).url;
          if (typeof maybeUrl === "string" && maybeUrl.trim()) {
            return maybeUrl.trim();
          }
        }
      }
    } catch {
      // Ignore malformed JSON and use fallback below.
    }
  }

  return fallbackUrl;
}

export default async function MaterialsPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("posts")
        .select("*,categories(*)")
        .in("type", ["material", "materials"])
        .eq("status", "published")
        .order("created_at", { ascending: false })
    : { data: [] };
  const posts = ((data as PostRow[] | null) ?? []);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((post) => {
          const subject = post.content
            ?.split("\n")
            .find((line) => line.startsWith("Пән: "))
            ?.replace("Пән: ", "");
          const resourceUrl = getPrimaryMaterialResourceUrl(post.content ?? "", post.file_url);

          return (
            <article
              key={post.id}
              className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition-colors hover:border-[#059669]"
            >
              <div className="flex flex-col gap-4">
                {post.cover_url ? (
                  <div className="overflow-hidden rounded-[8px] border border-[color:var(--color-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover_url} alt={post.title} className="aspect-[16/9] w-full object-cover" />
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-[#05966915] px-3 py-1 text-[11px] font-semibold text-[#059669]">
                    {levelLabels[post.level ?? "all"] ?? "Барлығы"}
                  </span>
                  {subject ? (
                    <span className="inline-flex rounded-full bg-[color:var(--color-surface-offset)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-text-muted)]">
                      {subject}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/materials/${post.slug}`}
                  className="font-display text-[24px] font-bold leading-tight text-[color:var(--color-text)] no-underline transition-colors hover:text-[#059669]"
                >
                  {post.title}
                </Link>
                {post.excerpt ? (
                  <p className="text-[14px] leading-7 text-[color:var(--color-text-muted)]">
                    {post.excerpt}
                  </p>
                ) : null}
                {resourceUrl ? (
                  <a
                    href={resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-[#059669] no-underline"
                  >
                    Көру / жүктеу <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
