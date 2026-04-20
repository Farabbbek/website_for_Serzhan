"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Play, Pause, Volume2, Download, Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type PodcastPost = Database["public"]["Tables"]["posts"]["Row"] & {
  categories?: { name: string; slug: string } | null;
  season?: number | string | null;
  episode?: number | string | null;
};

function extractYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return id || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const watchId = parsed.searchParams.get("v")?.trim();
      if (watchId) return watchId;

      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const markerIndex = pathParts.findIndex((part) =>
        part === "embed" || part === "shorts" || part === "live",
      );

      if (markerIndex >= 0 && pathParts[markerIndex + 1]) {
        return pathParts[markerIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function extractInstagramEmbedPath(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host !== "instagram.com" && host !== "instagr.am") {
      return null;
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const markerIndex = pathParts.findIndex((part) =>
      part === "reel" || part === "p" || part === "tv",
    );

    if (markerIndex < 0 || !pathParts[markerIndex + 1]) {
      return null;
    }

    return `/${pathParts[markerIndex]}/${pathParts[markerIndex + 1]}`;
  } catch {
    return null;
  }
}

function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 32,
      }}
    >
      <div style={{ aspectRatio: "16/9", width: "100%", background: "#000" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </div>
  );
}

function InstagramPlayer({
  embedPath,
  title,
  fallbackText,
  directLinkText,
}: {
  embedPath: string;
  title: string;
  fallbackText: string;
  directLinkText: string;
}) {
  const postUrl = `https://www.instagram.com${embedPath}/`;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 32,
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          minHeight: 680,
          margin: "0 auto",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-offset)",
        }}
      >
        <iframe
          src={`https://www.instagram.com${embedPath}/embed`}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          style={{ width: "100%", height: 680, border: 0 }}
        />
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-muted)", textAlign: "center" }}>
        {fallbackText}{" "}
        <a href={postUrl} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)" }}>
          {directLinkText}
        </a>
      </div>
    </div>
  );
}

function AudioPlayer({ src, title }: { src: string; title: string }) {
  const { locale, m } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(false);
  const audioCopy = {
    kk: {
      failed: "⚠️ Аудио жүктелмеді.",
      openDirect: "Тікелей ашу →",
      pauseLabel: "Тоқтату",
      playLabel: "Ойнату",
    },
    ru: {
      failed: "⚠️ Аудио не загрузилось.",
      openDirect: "Открыть напрямую →",
      pauseLabel: "Пауза",
      playLabel: "Воспроизвести",
    },
    en: {
      failed: "⚠️ Audio failed to load.",
      openDirect: "Open directly →",
      pauseLabel: "Pause",
      playLabel: "Play",
    },
  }[locale];

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    void audio.play().then(
      () => setPlaying(true),
      () => setError(true),
    );
  }

  function onTimeUpdate() {
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  }

  function onLoadedMetadata() {
    setDuration(audioRef.current?.duration ?? 0);
  }

  function onEnded() {
    setPlaying(false);
  }

  function onError() {
    setError(true);
  }

  function seek(event: ChangeEvent<HTMLInputElement>) {
    const targetTime = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
    setCurrentTime(targetTime);
  }

  function changeVolume(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }
    setVolume(nextVolume);
  }

  function formatTime(seconds: number): string {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px 24px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 13,
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {audioCopy.failed}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-primary)", textDecoration: "underline" }}
        >
          {audioCopy.openDirect}
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        padding: "24px",
        marginBottom: 32,
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onError={onError}
        preload="metadata"
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <button
          type="button"
          aria-label={playing ? `${audioCopy.pauseLabel}: ${title}` : `${audioCopy.playLabel}: ${title}`}
          onClick={togglePlay}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(197,64,26,0.3)",
            transition: "transform 150ms, box-shadow 150ms",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          {playing ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={seek}
            style={{
              width: "100%",
              height: 4,
              accentColor: "var(--color-primary)",
              cursor: "pointer",
              marginBottom: 6,
              display: "block",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--color-text-muted)",
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Volume2 size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={changeVolume}
          style={{ width: 80, accentColor: "var(--color-primary)", cursor: "pointer" }}
        />
        <a
          href={src}
          download
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--color-text-muted)",
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 7,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          <Download size={13} /> {m.common.download}
        </a>
      </div>
    </div>
  );
}

export default function PodcastDetailPage() {
  const { locale } = useLanguage();
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const [post, setPost] = useState<PodcastPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverAspectRatio, setCoverAspectRatio] = useState<number | null>(null);
  const detailCopy = {
    kk: {
      back: "← Подкасттарға оралу",
      loading: "Жүктелуде...",
      notFound: "Подкаст табылмады.",
      seasonEpisode: (season: PodcastPost["season"], episode: PodcastPost["episode"]) =>
        `Сезон ${season} · Эпизод ${episode}`,
      aboutEpisode: "Эпизод туралы",
      instagramFallback: "Instagram ашылмаса,",
      instagramDirect: "тікелей өтіңіз",
    },
    ru: {
      back: "← Назад к подкастам",
      loading: "Загрузка...",
      notFound: "Подкаст не найден.",
      seasonEpisode: (season: PodcastPost["season"], episode: PodcastPost["episode"]) =>
        `Сезон ${season} · Эпизод ${episode}`,
      aboutEpisode: "Об эпизоде",
      instagramFallback: "Если Instagram не открылся,",
      instagramDirect: "перейдите напрямую",
    },
    en: {
      back: "← Back to podcasts",
      loading: "Loading...",
      notFound: "Podcast not found.",
      seasonEpisode: (season: PodcastPost["season"], episode: PodcastPost["episode"]) =>
        `Season ${season} · Episode ${episode}`,
      aboutEpisode: "About the episode",
      instagramFallback: "If Instagram does not open,",
      instagramDirect: "open it directly",
    },
  }[locale];
  const youtubeVideoId = post?.audio_url ? extractYouTubeVideoId(post.audio_url) : null;
  const instagramEmbedPath = post?.audio_url ? extractInstagramEmbedPath(post.audio_url) : null;
  const hasInstagramSource = Boolean(instagramEmbedPath);
  const shouldUsePortraitCover =
    hasInstagramSource || (coverAspectRatio !== null && coverAspectRatio < 1);

  function handleCoverImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    if (!image.naturalWidth || !image.naturalHeight) return;

    setCoverAspectRatio(image.naturalWidth / image.naturalHeight);
  }

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadPost() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (active) {
          setPost(null);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select("*,categories(*)")
        .eq("type", "podcast")
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle();

      if (!active) return;

      setPost((data as PodcastPost | null) ?? null);
      setLoading(false);
    }

    void loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <section className="py-[clamp(var(--space-12),6vw,var(--space-24))]">
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
        <Link
          href="/podcasts"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--color-text-muted)",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          {detailCopy.back}
        </Link>

        {loading ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{detailCopy.loading}</p>
        ) : null}

        {!loading && !post ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{detailCopy.notFound}</p>
        ) : null}

        {post?.cover_url ? (
          <div
            style={{
              marginBottom: 32,
              borderRadius: 16,
              overflow: "hidden",
              aspectRatio: shouldUsePortraitCover
                ? coverAspectRatio && coverAspectRatio > 0
                  ? `${coverAspectRatio}`
                  : "9/16"
                : "16/9",
              background: shouldUsePortraitCover
                ? "var(--color-surface-offset)"
                : "var(--color-surface)",
              maxWidth: shouldUsePortraitCover ? 420 : undefined,
              marginInline: shouldUsePortraitCover ? "auto" : undefined,
              border: shouldUsePortraitCover ? "1px solid var(--color-border)" : "none",
            }}
          >
            <img
              src={post.cover_url}
              alt={post.title}
              onLoad={handleCoverImageLoad}
              style={{
                width: "100%",
                height: "100%",
                objectFit: shouldUsePortraitCover ? "contain" : "cover",
              }}
            />
          </div>
        ) : null}

        {post ? (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {post.season ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-primary)",
                  }}
                >
                  {detailCopy.seasonEpisode(post.season, post.episode)}
                </span>
              ) : null}
              {post.duration ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Clock size={12} />
                  {post.duration}
                </span>
              ) : null}
              {post.lang ? (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    background: "var(--color-surface-offset)",
                    borderRadius: 999,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {post.lang.toUpperCase()}
                </span>
              ) : null}
            </div>

            <h1
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "var(--color-text)",
                marginBottom: 16,
              }}
            >
              {post.title}
            </h1>

            {post.guests ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                  color: "var(--color-text-muted)",
                  fontSize: 13,
                }}
              >
                <Users size={15} />
                <span>{post.guests}</span>
              </div>
            ) : null}

            {post.excerpt ? (
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--color-text-muted)",
                  marginBottom: 32,
                  borderLeft: "3px solid var(--color-primary)",
                  paddingLeft: 16,
                }}
              >
                {post.excerpt}
              </p>
            ) : null}

            {post.audio_url ? (
              youtubeVideoId ? (
                <YouTubePlayer videoId={youtubeVideoId} title={post.title} />
              ) : instagramEmbedPath ? (
                <InstagramPlayer
                  embedPath={instagramEmbedPath}
                  title={post.title}
                  fallbackText={detailCopy.instagramFallback}
                  directLinkText={detailCopy.instagramDirect}
                />
              ) : (
                <AudioPlayer src={post.audio_url} title={post.title} />
              )
            ) : null}

            {post.content ? (
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 40,
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "var(--color-text)",
                  }}
                >
                  {detailCopy.aboutEpisode}
                </h2>
                <div
                  style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: "var(--color-text)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {post.content}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </main>
    </section>
  );
}
