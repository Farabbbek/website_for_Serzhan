export type PodcastPlatform = "youtube" | "instagram" | "spotify" | "other";

export interface PodcastMeta {
  platform: PodcastPlatform;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  videoId: string | null;
}

const EMPTY_META: PodcastMeta = {
  platform: "other",
  embedUrl: null,
  thumbnailUrl: null,
  videoId: null,
};

function normalizeUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

export function getPodcastPlatform(url: string): PodcastMeta {
  if (!url?.trim()) return EMPTY_META;

  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) return EMPTY_META;

  const href = normalizedUrl.toString();

  const ytMatch = href.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];

    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
    };
  }

  const igMatch = href.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (igMatch?.[0]) {
    const cleanUrl = igMatch[0].endsWith("/") ? igMatch[0].slice(0, -1) : igMatch[0];

    return {
      platform: "instagram",
      embedUrl: `https://${cleanUrl}/embed`,
      thumbnailUrl: null,
      videoId: igMatch[2] ?? null,
    };
  }

  if (href.includes("spotify.com")) {
    const spotifyMatch = href.match(/spotify\.com\/(episode|track|show)\/([A-Za-z0-9]+)/);
    if (spotifyMatch?.[1] && spotifyMatch?.[2]) {
      return {
        platform: "spotify",
        embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`,
        thumbnailUrl: null,
        videoId: spotifyMatch[2],
      };
    }
  }

  return {
    platform: "other",
    embedUrl: href,
    thumbnailUrl: null,
    videoId: null,
  };
}
