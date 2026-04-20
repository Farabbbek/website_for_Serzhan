import type { PodcastPlatform } from "@/lib/utils/getPodcastPlatform";

const config: Record<PodcastPlatform, { label: string; color: string; icon: string }> = {
  youtube: { label: "YouTube", color: "#FF0000", icon: "▶" },
  instagram: { label: "Instagram", color: "#E1306C", icon: "◉" },
  spotify: { label: "Spotify", color: "#1DB954", icon: "♫" },
  other: { label: "Сілтеме", color: "#888", icon: "🔗" },
};

export function PlatformBadge({ platform }: { platform: PodcastPlatform }) {
  const badge = config[platform];

  return (
    <span className="platform-badge" aria-hidden="true">
      <span style={{ color: badge.color }}>{badge.icon}</span>
      {badge.label}
    </span>
  );
}
