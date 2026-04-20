"use client";

import Link from "next/link";

type CategoryKey = "posts" | "news" | "materials" | "podcasts" | "forum";

const categoryItems: Array<{ key: CategoryKey; label: string; href: string }> = [
  { key: "posts", label: "МАҚАЛАЛАР", href: "/posts" },
  { key: "forum", label: "ФОРУМ", href: "/forum" },
  { key: "news", label: "ЖАҢАЛЫҚТАР", href: "/news" },
  { key: "materials", label: "МАТЕРИАЛДАР", href: "/materials" },
  { key: "podcasts", label: "ПОДКАСТТАР", href: "/podcasts" },
];

export default function CategoryTabs({ active }: { active: CategoryKey }) {
  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-[color:var(--color-border)]"
      style={{ marginBottom: "var(--space-8)" }}
      aria-label="Category tabs"
    >
      {categoryItems.map((item) => {
        const isActive = item.key === active;

        return (
          <Link
            key={item.key}
            href={item.href}
            className="inline-flex items-center justify-center rounded-t-[10px]"
            style={{
              padding: "10px 14px",
              background: isActive ? "var(--color-text)" : "transparent",
              color: isActive ? "var(--color-bg)" : "var(--color-text-muted)",
              border: isActive ? "1px solid var(--color-text)" : "1px solid transparent",
              fontWeight: isActive ? 600 : 500,
              fontSize: "var(--text-sm)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition:
                "background 180ms ease, color 180ms ease, border-color 180ms ease",
            }}
            onMouseEnter={(event) => {
              if (isActive) return;
              event.currentTarget.style.background = "var(--color-surface-offset)";
              event.currentTarget.style.color = "var(--color-text)";
              event.currentTarget.style.borderColor = "var(--color-border)";
            }}
            onMouseLeave={(event) => {
              if (isActive) return;
              event.currentTarget.style.background = "transparent";
              event.currentTarget.style.color = "var(--color-text-muted)";
              event.currentTarget.style.borderColor = "transparent";
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
