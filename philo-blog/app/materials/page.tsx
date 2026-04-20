import Link from "next/link";
import { Download } from "lucide-react";
import { FileTypeBadge } from "@/components/ui/FileTypeBadge";
import { getServerMessages } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { getMaterialType } from "@/lib/utils/getMaterialType";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
};

function parseContentValue(content: string, key: string): string | null {
  const line = content
    .split("\n")
    .find((item) => item.trim().startsWith(`${key}:`));

  if (!line) return null;

  const value = line.replace(`${key}:`, "").trim();
  return value || null;
}

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

function resolveDescription(excerpt: string | null, content: string, fallback: string): string {
  const cleanedExcerpt = excerpt?.trim();
  if (cleanedExcerpt) return cleanedExcerpt;

  const body = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.includes(":"))
    .join(" ")
    .trim();

  if (!body) {
    return fallback;
  }

  return body.length > 180 ? `${body.slice(0, 179).trimEnd()}…` : body;
}

export default async function MaterialsPage() {
  const { m } = await getServerMessages();
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
    return (
      <section className="py-[clamp(var(--space-12),6vw,var(--space-24))] materials-library">
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📂</span>
          <h3>{m.materials.noItems}</h3>
          <p>{m.materials.noItemsSoon}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))] materials-library">
      <div className="page-header">
        <h1 className="page-title">{m.materials.pageTitle}</h1>
        <p className="page-subtitle">{m.materials.subtitle}</p>
      </div>

      <div className="materials-grid">
        {posts.map((post) => {
          const subject = parseContentValue(post.content ?? "", "Пән");
          const authorFromContent = parseContentValue(post.content ?? "", "Автор");
          const author = authorFromContent || post.author_name || m.common.editorial;
          const resourceUrl = getPrimaryMaterialResourceUrl(post.content ?? "", post.file_url);
          const materialMeta = getMaterialType(resourceUrl ?? "");
          const description = resolveDescription(post.excerpt, post.content ?? "", m.materials.noDescription);
          const localizedLevelLabels: Record<string, string> = {
            all: m.materials.all,
            bachelor: m.materials.bachelor,
            master: m.materials.master,
            phd: m.materials.phd,
          };

          return (
            <article key={post.id} className="material-card">
              <div className="material-thumb-wrap">
                {post.cover_url ? (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="material-thumb-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="material-thumb-placeholder" aria-hidden="true">
                    <span className="material-thumb-icon">{materialMeta.icon}</span>
                    <span className="material-thumb-filetype">{materialMeta.label}</span>
                  </div>
                )}

                <div className="material-thumb-overlay" />

                <FileTypeBadge fileUrl={resourceUrl ?? ""} />
                <span className="material-category-badge">{m.materials.materialBadge}</span>
              </div>

              <div className="material-card-body">
                <div className="material-card-tags">
                  <span className="material-card-tag">
                    {localizedLevelLabels[post.level ?? "all"] ?? m.materials.all}
                  </span>
                  {subject ? <span className="material-card-tag">{subject}</span> : null}
                </div>

                <Link href={`/materials/${post.slug}`} className="material-card-title-link" prefetch>
                  <h3 className="material-card-title">{post.title}</h3>
                </Link>

                <p className="material-card-desc">{description}</p>

                <div className="material-card-footer">
                  <span className="material-card-author">{author}</span>

                  {resourceUrl ? (
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-download-btn"
                      download
                    >
                      <Download />
                      {m.common.download}
                    </a>
                  ) : (
                    <Link href={`/materials/${post.slug}`} className="material-download-btn" prefetch>
                      <Download />
                      {m.common.view}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
