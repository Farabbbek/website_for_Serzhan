import Link from "next/link";
import { Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
  season?: number | string | null;
  episode?: number | string | null;
};

export default async function PodcastsPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("posts")
        .select("*,categories(*)")
        .eq("type", "podcast")
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
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/podcasts/${post.slug}`}
            style={{
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              textDecoration: "none",
              overflow: "hidden",
              display: "block",
              transition: "border-color 180ms ease",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                background: "var(--color-surface-offset)",
                borderRadius: "10px 10px 0 0",
                overflow: "hidden",
              }}
            >
              {post.cover_url ? (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1816, #2d2a27)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(197,64,26,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play size={20} color="white" style={{ marginLeft: 2 }} />
                  </div>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(197,64,26,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.26)",
                  }}
                >
                  <Play size={20} color="white" style={{ marginLeft: 2 }} />
                </div>
              </div>
              {post.duration ? (
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.75)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: 6,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {post.duration}
                </span>
              ) : null}
            </div>

            <div style={{ padding: 14 }}>
              {post.season || post.episode ? (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-primary)",
                    marginBottom: 6,
                  }}
                >
                  {post.season ? `С${post.season}` : ""}
                  {post.episode ? ` · Е${post.episode}` : ""}
                </div>
              ) : null}

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "var(--color-text)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.title}
              </h2>

              {post.excerpt ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 6,
                    lineHeight: 1.45,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.excerpt}
                </p>
              ) : null}

              <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                {post.guests ? (
                  <span style={{ fontSize: 11, color: "var(--color-text-faint)" }}>
                    👤 {post.guests}
                  </span>
                ) : null}
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "var(--color-text-faint)",
                  }}
                >
                  {new Date(post.created_at).toLocaleDateString("kk-KZ")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
