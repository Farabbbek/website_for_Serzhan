"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  Home,
  LayoutDashboard,
  Mic2,
  Newspaper,
  Tag,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const mainNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Мақалалар", icon: FileText },
  { href: "/admin/categories", label: "Категориялар", icon: Tag },
];

const newContentItems = [
  {
    href: "/admin/posts/new/article",
    label: "Мақала",
    icon: FileText,
    color: "#C5401A",
  },
  {
    href: "/admin/posts/new/news",
    label: "Жаңалық",
    icon: Newspaper,
    color: "#2563eb",
  },
  {
    href: "/admin/posts/new/podcast",
    label: "Подкаст",
    icon: Mic2,
    color: "#7c3aed",
  },
  {
    href: "/admin/posts/new/material",
    label: "Материал",
    icon: BookOpen,
    color: "#059669",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(true);

  const handleGoHome = () => {
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <motion.aside
        className="sticky top-0 h-screen shrink-0 border-r border-border bg-surface px-3 py-6"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        onFocusCapture={() => setIsSidebarExpanded(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsSidebarExpanded(false);
          }
        }}
        initial={false}
        animate={{ width: isSidebarExpanded ? 272 : 86 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="px-2">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-[10px] bg-(--color-primary-highlight) text-primary">
              <LayoutDashboard size={16} />
            </div>
            <AnimatePresence initial={false}>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="mb-1 font-display text-lg font-black tracking-widest text-foreground">
                    ZERDE
                  </div>
                  <div className="text-(--color-text-muted) text-[10px] uppercase tracking-[0.15em]">
                    Admin Panel
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-0.5">
          {isSidebarExpanded && (
            <div className="text-(--color-text-muted) px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
              БАСҚАРУ
            </div>
          )}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group flex items-center rounded-[7px] px-3 py-2.5 text-[13px] no-underline transition-colors ${
                  active
                    ? "bg-[rgba(197,64,26,0.08)] font-semibold text-primary"
                    : "text-(--color-text-muted) hover:bg-(--color-surface-offset) hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <AnimatePresence initial={false}>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          <div className="mx-2 my-3 h-px bg-border" />
          {isSidebarExpanded && (
            <div className="text-(--color-text-muted) px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
              ЖАҢА КОНТЕНТ
            </div>
          )}

          <div>
            <button
              onClick={() => setIsNewPostOpen(!isNewPostOpen)}
              title="Жаңа мақала"
              className="text-(--color-text-muted) flex w-full items-center justify-between rounded-[7px] border-none bg-transparent px-3 py-2.5 text-[13px] transition-colors hover:bg-(--color-surface-offset) hover:text-foreground"
            >
              <div className="flex items-center gap-2.5">
                <Edit2 size={16} />
                <AnimatePresence initial={false}>
                  {isSidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="whitespace-nowrap"
                    >
                      Жаңа мақала
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {isSidebarExpanded ? (
                isNewPostOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : null}
            </button>

            <AnimatePresence initial={false}>
              {isSidebarExpanded && isNewPostOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-0.5 flex flex-col gap-0.5 overflow-hidden"
                >
                  {newContentItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        className={`flex items-center gap-2 rounded-[7px] py-2 pl-7 pr-3 text-[12px] no-underline transition-colors ${
                          active
                            ? "bg-[rgba(197,64,26,0.08)] font-semibold text-primary"
                            : "text-(--color-text-muted) hover:bg-(--color-surface-offset) hover:text-foreground"
                        }`}
                      >
                        <Icon size={12} color={item.color} />
                        {item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <button
          onClick={handleGoHome}
          title="Басты бетке өту"
          className="text-(--color-text-muted) mt-auto flex items-center rounded-[7px] border-none bg-transparent px-3 py-2.5 text-[13px] transition-colors hover:bg-(--color-surface-offset) hover:text-foreground"
        >
          <Home size={16} />
          <AnimatePresence initial={false}>
            {isSidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="ml-2.5 whitespace-nowrap"
              >
                Басты бет
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>

      <main className="flex min-h-screen flex-1 flex-col bg-background">
        <div className="flex w-full justify-end px-5 pt-5 md:px-10 md:pt-6">
          <ThemeToggle />
        </div>
        <div className="flex-1 px-5 pb-8 pt-2 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
