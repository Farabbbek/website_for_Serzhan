import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Мақалалар | Admin Panel",
  description: "Philo Blog әкімшілік панеліндегі мақалалар тізімі.",
};

type ContentType = "article" | "news" | "podcast" | "material";
type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string } | null;
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

const typeMeta: Record<
  ContentType,
  { label: string; accent: string; filterLabel: string }
> = {
  article: { label: "Мақала", accent: "#C5401A", filterLabel: "Мақала" },
  news: { label: "Жаңалық", accent: "#2563eb", filterLabel: "Жаңалық" },
  podcast: { label: "Подкаст", accent: "#7c3aed", filterLabel: "Подкаст" },
  material: { label: "Материал", accent: "#059669", filterLabel: "Материал" },
};

const filters: Array<{ value: "all" | ContentType; label: string; href: string }> = [
  { value: "all", label: "Барлығы", href: "/admin/posts" },
  { value: "article", label: "Мақала", href: "/admin/posts?type=article" },
  { value: "news", label: "Жаңалық", href: "/admin/posts?type=news" },
  { value: "podcast", label: "Подкаст", href: "/admin/posts?type=podcast" },
  { value: "material", label: "Материал", href: "/admin/posts?type=material" },
];

function isContentType(value: string | undefined): value is ContentType {
  return value === "article" || value === "news" || value === "podcast" || value === "material";
}

function normalizeContentType(value: string | null | undefined): ContentType {
  if (value === "materials") return "material";

  const candidate = value ?? undefined;
  return isContentType(candidate) ? candidate : "article";
}

function TypeBadge({ type }: { type: string | null }) {
  const postType = normalizeContentType(type);
  const meta = typeMeta[postType];

  return (
    <span
      style={{
        fontSize: "10px",
        padding: "2px 7px",
        borderRadius: "999px",
        fontWeight: 600,
        background: `${meta.accent}15`,
        color: meta.accent,
      }}
    >
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const normalized = (status ?? "draft").toLowerCase();
  const isPublished = normalized === "published";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: isPublished ? "rgba(5,150,105,0.12)" : "rgba(234,179,8,0.15)",
        color: isPublished ? "#059669" : "#a16207",
      }}
    >
      {isPublished ? "Жарияланды" : "Қолжазба"}
    </span>
  );
}

function resolvePublicHref(post: PostRow) {
  const postType = normalizeContentType(post.type);

  if (postType === "news") return `/news/${post.slug}`;
  if (postType === "podcast") return `/podcasts/${post.slug}`;
  if (postType === "material") return `/materials/${post.slug}`;
  return `/posts/${post.slug}`;
}

export default async function AdminPostsPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const activeType = isContentType(type) ? type : "all";
  const supabase = await createClient();

  let query = supabase
    ? supabase
        .from("posts")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })
    : null;

  if (query && activeType !== "all") {
    query =
      activeType === "material"
        ? query.in("type", ["material", "materials"])
        : query.eq("type", activeType);
  }

  const { data: posts } = query ? await query : { data: [] };
  const validPosts = (posts as PostRow[] | null) ?? [];

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            Мақалалар
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
            {validPosts.length} материал табылды
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "var(--color-primary)",
            color: "white",
            borderRadius: 7,
            fontSize: 13,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          + Жаңа мақала
        </Link>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {filters.map((filter) => {
          const active = activeType === filter.value;

          return (
            <Link
              key={filter.value}
              href={filter.href}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: "1px solid var(--color-border)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 180ms",
                textDecoration: "none",
                background: active ? "var(--color-text)" : "var(--color-surface)",
                color: active ? "var(--color-bg)" : "var(--color-text-muted)",
                borderColor: active ? "var(--color-text)" : "var(--color-border)",
              }}
              className={active ? "" : "admin-post-filter"}
              aria-current={active ? "page" : undefined}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          width: "100%",
          borderRadius: 10,
          border: "1px solid var(--color-border)",
          overflowX: "auto",
          background: "var(--color-bg)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 90 }} />
          </colgroup>
          <thead style={{ background: "var(--color-surface)" }}>
            <tr>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Тақырып
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Тип
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Статус
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Оқылым
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Күні
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                Әрекет
              </th>
            </tr>
          </thead>
          <tbody>
            {validPosts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div style={{ padding: "48px 0", textAlign: "center" }}>
                    <FileText size={32} style={{ color: "var(--color-text-faint)", margin: "0 auto 12px" }} />
                    <p style={{ color: "var(--color-text-muted)", fontSize: 14, margin: 0 }}>Мақалалар жоқ</p>
                    <Link
                      href="/admin/posts/new"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 12,
                        padding: "8px 16px",
                        background: "var(--color-primary)",
                        color: "white",
                        borderRadius: 7,
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      + Жаңа мақала
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              validPosts.map((post) => {
                const createdAt = post.created_at ?? post.published_at ?? new Date().toISOString();
                const publicHref = resolvePublicHref(post);

                return (
                  <tr key={post.id} className="admin-post-row">
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600 }}>{post.title}</span>
                        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{publicHref}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      <TypeBadge type={post.type} />
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      <StatusBadge status={post.status} />
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      {post.views ?? 0}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      {new Date(createdAt).toLocaleDateString("kk-KZ")}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 13,
                        color: "var(--color-text)",
                      }}
                    >
                      <PostRowActions
                        postId={post.id}
                        viewHref={publicHref}
                        editHref={`/admin/posts/${post.id}/edit`}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
