"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bookmark,
  type LucideIcon,
  Menu,
  Rss,
  Share2,
  Star,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const leftNavLinks = [
  { href: "/", label: "БАСТЫ БЕТ" },
  { href: "/posts", label: "ЖУРНАЛ" },
];

const rightNavLinks = [
  { href: "/auth/login", label: "КІРУ" },
  { href: "/category/maqalalar", label: "ЖАЗЫЛУ" },
];

const categories = [
  { label: "БАРЛЫҒЫ", href: "/", match: "all" },
  { label: "МАҚАЛАЛАР", href: "/category/maqalalar", match: "maqalalar" },
  { label: "ФИЛОСОФИЯ", href: "/", match: "philosophy" },
  { label: "ЦИФРОВИЗАЦИЯ", href: "/category/cifr", match: "cifr" },
  { label: "ЭТИКА", href: "/category/etika", match: "etika" },
  { label: "ЖАИ", href: "/search?q=%D0%96%D0%90%D0%98", match: "zhai" },
];

const topBarActions = [
  { icon: Share2, label: "Share" },
  { icon: Bookmark, label: "Bookmark" },
  { icon: Rss, label: "RSS" },
];

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function PhiloLogo() {
  return (
    <Link
      href="/"
      aria-label="Philo home"
      className="flex items-center justify-center no-underline"
    >
      <svg
        width="220"
        height="88"
        viewBox="0 0 220 88"
        role="img"
        aria-labelledby="philo-logo-title"
        className="h-auto w-[8.75rem] sm:w-[10rem] md:w-[13.75rem]"
      >
        <title id="philo-logo-title">PHILO</title>
        <text
          x="110"
          y="44"
          textAnchor="middle"
          fill="var(--color-text)"
          fontFamily="var(--font-display)"
          fontSize="40"
          fontWeight="900"
          letterSpacing="6"
        >
          PHILO
        </text>
        <path
          d="M86 61H134L110 79L86 61Z"
          fill="var(--color-primary)"
        />
      </svg>
    </Link>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center font-ui text-[length:var(--text-sm)] font-medium uppercase tracking-[0.24em] text-[color:var(--color-text-muted)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary)]"
    >
      {label}
    </Link>
  );
}

function IconButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-transparent text-[color:var(--color-text-muted)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[color:var(--color-primary)]"
    >
      <Icon size={15} strokeWidth={1.75} />
    </button>
  );
}

function Rating() {
  return (
    <div className="flex items-center gap-2 text-[color:var(--color-secondary)]">
      <span className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-faint)]">
        4/5
      </span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            strokeWidth={1.7}
            className={
              index < 4
                ? "fill-[var(--color-primary)] text-[color:var(--color-primary)]"
                : "text-[color:var(--color-border)]"
            }
          />
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const activeCategory = (() => {
    if (pathname.startsWith("/category/cifr")) {
      return "cifr";
    }

    if (pathname.startsWith("/category/etika")) {
      return "etika";
    }

    if (pathname.startsWith("/category/maqalalar") || pathname.startsWith("/posts/")) {
      return "maqalalar";
    }

    if (pathname.startsWith("/search")) {
      return "zhai";
    }

    return "all";
  })();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-divider)] bg-[color:var(--color-surface)]">
      <div className="md:hidden">
        <div className="editorial-shell grid min-h-16 grid-cols-[44px_1fr_44px] items-center gap-3 py-3">
          <div aria-hidden="true" className="h-11 w-11" />
          <PhiloLogo />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-masthead"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[color:var(--color-text)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[color:var(--color-primary)]"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-masthead"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-[var(--color-divider)] md:block md:border-t-0`}
      >
        <div className="border-b border-[var(--color-divider)]">
          <div className="editorial-shell flex min-h-11 items-center justify-between gap-4 py-2 md:h-11 md:min-h-0 md:py-0">
            <div className="flex items-center gap-2">
              {topBarActions.map((action) => (
                <IconButton
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                />
              ))}
            </div>
            <Rating />
          </div>
        </div>

        <div className="editorial-shell py-4 md:py-6">
          <div className="flex flex-col gap-5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
            <nav
              aria-label="Primary"
              className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6"
            >
              {leftNavLinks.map((link) => (
                <NavLink key={link.label} href={link.href} label={link.label} />
              ))}
            </nav>

            <div className="hidden justify-center md:flex">
              <PhiloLogo />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
              {rightNavLinks.map((link) => (
                <NavLink key={link.label} href={link.href} label={link.label} />
              ))}
              <div className="flex md:flex">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label="Categories"
        className="border-t border-[var(--color-divider)] border-b border-[var(--color-divider)] bg-[color:var(--color-surface)]"
      >
        <div className="editorial-shell">
          <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = category.match === activeCategory;

              return (
                <Link
                  key={category.label}
                  href={category.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-ui relative inline-flex min-h-11 shrink-0 items-center rounded-full border bg-[color:var(--color-surface)] px-4 py-2.5 text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.14em] no-underline transition-colors duration-200 ${
                    isActive
                      ? "border-[var(--color-primary)] text-[color:var(--color-primary)]"
                      : "border-[var(--color-border)] text-[color:var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  }`}
                >
                  {category.label}
                  {isActive ? (
                    <motion.div
                      layoutId={prefersReducedMotion ? undefined : "nav-indicator"}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 30 }
                      }
                      className="absolute inset-x-4 -bottom-[0.45rem] h-0.5 rounded-full bg-[var(--color-primary)]"
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
