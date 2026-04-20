"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import type { PodcastPlatform } from "@/lib/utils/getPodcastPlatform";

const config: Record<PodcastPlatform, { label: string; color: string; icon: string }> = {
  youtube: { label: "YouTube", color: "#FF0000", icon: "▶" },
  instagram: { label: "Instagram", color: "#E1306C", icon: "◉" },
  spotify: { label: "Spotify", color: "#1DB954", icon: "♫" },
  other: { label: "Link", color: "#888", icon: "🔗" },
};

export function PlatformBadge({ platform }: { platform: PodcastPlatform }) {
  const { locale } = useLanguage();
  const badge = config[platform];
  const otherLabel = {
    kk: "Сілтеме",
    ru: "Ссылка",
    en: "Link",
  }[locale];
  const label = platform === "other" ? otherLabel : badge.label;

  return (
    <span className="platform-badge" aria-hidden="true">
      <span style={{ color: badge.color }}>{badge.icon}</span>
      {label}
    </span>
  );
}
