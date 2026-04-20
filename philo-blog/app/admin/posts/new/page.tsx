"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, Mic2, Newspaper } from "lucide-react";
import { useState } from "react";

const contentTypes = [
  {
    type: "article",
    href: "/admin/posts/new/article",
    icon: FileText,
    accent: "#C5401A",
    title: "Мақала жазу",
    desc: "Философиялық мақала, эссе немесе зерттеу жұмысы",
  },
  {
    type: "news",
    href: "/admin/posts/new/news",
    icon: Newspaper,
    accent: "#2563eb",
    title: "Жаңалық жариялау",
    desc: "Университет, ғылым немесе мәдени жаңалық",
  },
  {
    type: "podcast",
    href: "/admin/posts/new/podcast",
    icon: Mic2,
    accent: "#7c3aed",
    title: "Подкаст қосу",
    desc: "Аудио эпизод, сұхбат немесе дөңгелек үстел",
  },
  {
    type: "material",
    href: "/admin/posts/new/material",
    icon: BookOpen,
    accent: "#059669",
    title: "Материал жүктеу",
    desc: "Оқу материалы, кітап, дәріс немесе ресурс",
  },
] as const;

export default function NewPostPage() {
  const router = useRouter();
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <section className="flex max-w-[900px] flex-col gap-8">
      <header className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="w-fit border-0 bg-transparent p-0 text-[13px] font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          ← Артқа
        </button>
        <div>
          <h1 className="font-display text-[32px] font-bold text-[color:var(--color-text)]">
            Не жасаймыз?
          </h1>
          <p className="mt-2 text-[14px] text-[color:var(--color-text-muted)]">
            Контент түрін таңдаңыз
          </p>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "16px",
          maxWidth: "600px",
        }}
      >
        {contentTypes.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredType === item.type;

          return (
            <Link
              key={item.type}
              href={item.href}
              onMouseEnter={() => setHoveredType(item.type)}
              onMouseLeave={() => setHoveredType(null)}
              style={{
                padding: "28px 24px",
                background: isHovered ? `${item.accent}0d` : "var(--color-surface)",
                border: `2px solid ${isHovered ? item.accent : "var(--color-border)"}`,
                borderRadius: "14px",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "all 180ms ease",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isHovered ? `0 8px 24px ${item.accent}20` : "none",
              }}
            >
              <span
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: `${item.accent}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} color={item.accent} />
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
