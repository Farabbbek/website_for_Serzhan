"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play, X } from "lucide-react";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { getPodcastPlatform, type PodcastMeta } from "@/lib/utils/getPodcastPlatform";

type PodcastCardItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  audio_url: string | null;
  author_name: string | null;
  guests: string | null;
  created_at: string;
  published_at: string | null;
};

type ModalState = {
  post: PodcastCardItem;
  meta: PodcastMeta;
} | null;

function formatDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const year = parsed.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

function resolveDescription(post: PodcastCardItem): string {
  const text = (post.excerpt ?? "").replace(/\s+/g, " ").trim();
  if (text) return text;
  return "Эпизодты ашып толық сипаттамасын оқыңыз.";
}

function resolveAuthor(post: PodcastCardItem): string {
  return post.author_name?.trim() || post.guests?.trim() || "Редакция";
}

function PodcastModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  if (!state) return null;

  const { post, meta } = state;

  return (
    <div
      className="podcast-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="podcast-modal-content"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
      >
        <button
          type="button"
          className="podcast-modal-close"
          onClick={onClose}
          aria-label="Жабу"
        >
          <X size={18} />
        </button>

        <div className="podcast-modal-title">{post.title}</div>

        {meta.platform === "youtube" && meta.embedUrl ? (
          <div className="podcast-modal-frame-wrap">
            <iframe
              src={meta.embedUrl}
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`${post.title} YouTube player`}
              style={{ border: 0 }}
            />
          </div>
        ) : null}

        {meta.platform === "spotify" && meta.embedUrl ? (
          <iframe
            src={meta.embedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title={`${post.title} Spotify player`}
            style={{ border: 0, borderRadius: 12 }}
          />
        ) : null}

        {meta.platform === "instagram" ? (
          <div className="podcast-modal-message">
            Instagram видеоны қарау үшін →{" "}
            {post.audio_url ? (
              <a href={post.audio_url} target="_blank" rel="noopener noreferrer">
                түпнұсқа сілтеме
              </a>
            ) : (
              <span>сілтеме табылмады</span>
            )}
          </div>
        ) : null}

        {meta.platform === "other" ? (
          <div className="podcast-modal-message">
            Контентті ашу үшін →{" "}
            {post.audio_url ? (
              <a href={post.audio_url} target="_blank" rel="noopener noreferrer">
                сыртқы сілтеме
              </a>
            ) : (
              <span>сілтеме табылмады</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PodcastsPageClient({ posts }: { posts: PodcastCardItem[] }) {
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  useEffect(() => {
    if (!activeModal) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeModal]);

  const cards = useMemo(
    () => posts.map((post) => ({ post, meta: getPodcastPlatform(post.audio_url ?? "") })),
    [posts],
  );

  return (
    <>
      <section className="podcasts-page-grid" aria-label="Подкасттар тізімі">
        {cards.map(({ post, meta }) => {
          const thumb = meta.thumbnailUrl ?? post.cover_url ?? null;
          const publishedDate = formatDate(post.published_at || post.created_at);

          return (
            <article key={post.id} className="podcast-card">
              <div className="podcast-thumb-wrap">
                <Link
                  href={`/podcasts/${post.slug}`}
                  className="podcast-thumb-link"
                  aria-label={`${post.title} бетіне өту`}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={post.title}
                      className="podcast-thumb-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="podcast-thumb-img podcast-thumb-fallback" aria-hidden="true" />
                  )}
                </Link>

                <div className="podcast-thumb-overlay" />

                <button
                  type="button"
                  className="podcast-card-play-btn"
                  onClick={() => setActiveModal({ post, meta })}
                  aria-label="Ойнату"
                >
                  <Play />
                </button>

                <PlatformBadge platform={meta.platform} />
                <span className="podcast-category-badge">ПОДКАСТ</span>
              </div>

              <div className="podcast-card-body">
                <Link href={`/podcasts/${post.slug}`} className="podcast-card-title-link">
                  <h3 className="podcast-card-title">{post.title}</h3>
                </Link>
                <p className="podcast-card-desc">{resolveDescription(post)}</p>
                <div className="podcast-card-meta">
                  <span>{resolveAuthor(post)}</span>
                  <span>{publishedDate}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <PodcastModal state={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}
