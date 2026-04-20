"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, CopyCheck, Link2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { TocItem } from "@/types/blog";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type ArticlePageShellProps = {
  title: string;
  toc: TocItem[];
  children: React.ReactNode;
};

export function ArticlePageShell({
  title,
  toc,
  children,
}: ArticlePageShellProps) {
  const { locale, m } = useLanguage();
  const ariaLabels = {
    kk: {
      mobileToc: "Мобильді мазмұн навигациясы",
      toc: "Мазмұн навигациясы",
    },
    ru: {
      mobileToc: "Мобильная навигация по содержанию",
      toc: "Навигация по содержанию",
    },
    en: {
      mobileToc: "Mobile table of contents",
      toc: "Table of contents",
    },
  }[locale];
  const [progress, setProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        documentHeight <= 0 ? 0 : Math.min(100, (scrollTop / documentHeight) * 100);

      setProgress(nextProgress);
    };

    updateProgress();
    setShareUrl(window.location.href);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const shareToXUrl = useMemo(() => {
    const params = new URLSearchParams({
      text: title,
      url: shareUrl,
    });

    return `https://x.com/intent/tweet?${params.toString()}`;
  }, [shareUrl, title]);

  const handleCopy = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-[color:var(--color-primary)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: "easeOut" }
        }
        className="grid grid-cols-1 gap-[var(--space-8)] lg:grid-cols-[minmax(0,65ch)_minmax(16rem,20rem)] lg:gap-[var(--space-10)] lg:justify-between"
      >
        <div className="min-w-0">
          {toc.length ? (
            <details className="mb-[var(--space-6)] border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] lg:hidden">
              <summary className="flex min-h-11 cursor-pointer items-center px-4 font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                {m.articleShell.mobileToc}
              </summary>
              <nav
                aria-label={ariaLabels.mobileToc}
                className="border-t border-[color:var(--color-divider)] px-4 py-4"
              >
                <ul className="flex flex-col gap-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`font-ui text-[length:var(--text-sm)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary)] ${
                          item.level === 3
                            ? "pl-4 text-[color:var(--color-text-faint)]"
                            : "text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          ) : null}
          {children}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-[var(--space-8)]">
            <section className="border-b border-[color:var(--color-divider)] pb-[var(--space-6)]">
              <h2 className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                {m.articleShell.contents}
              </h2>
              <nav aria-label={ariaLabels.toc} className="mt-[var(--space-4)]">
                <ul className="flex flex-col gap-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`font-ui text-[length:var(--text-sm)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary)] ${
                          item.level === 3
                            ? "pl-4 text-[color:var(--color-text-faint)]"
                            : "text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            <section className="border-b border-[color:var(--color-divider)] pb-[var(--space-6)]">
              <h2 className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                {m.articleShell.share}
              </h2>
              <div className="mt-[var(--space-4)] flex flex-col gap-3">
                <a
                  href={shareToXUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-ghost justify-start no-underline"
                >
                  <X size={16} />
                  X / Twitter
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="button-ghost justify-start"
                >
                  {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
                  {copied ? m.articleShell.copied : m.articleShell.copyLink}
                </button>
                <a href={shareUrl || "#"} className="button-ghost justify-start no-underline">
                  <Link2 size={16} />
                  {m.articleShell.openLink}
                </a>
              </div>
            </section>
          </div>
        </aside>
      </motion.div>
    </>
  );
}
