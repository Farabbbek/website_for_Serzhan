"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Tag,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type AdminShellProps = {
  children: React.ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Мақалалар", icon: FileText },
  { href: "/admin/posts/new", label: "Жаңа мақала", icon: PlusCircle },
  { href: "/admin/categories", label: "Категориялар", icon: Tag },
];

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  posts: "Мақалалар",
  new: "Жаңа мақала",
  categories: "Категориялар",
};

function AdminLogo() {
  return (
    <svg
      width="160"
      height="64"
      viewBox="0 0 220 88"
      role="img"
      aria-labelledby="admin-logo-title"
      className="h-auto w-[8rem]"
    >
      <title id="admin-logo-title">PHILO</title>
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
      <path d="M86 61H134L110 79L86 61Z" fill="var(--color-primary)" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-4 py-3 font-ui text-[length:var(--text-sm)] font-medium no-underline transition-colors duration-200 ${
        active
          ? "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]"
          : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
      }`}
      style={{ borderRadius: "999px" }}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { pageTitle, breadcrumbItems } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumb = segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        href,
        label: segmentLabels[segment] ?? segment,
      };
    });

    return {
      pageTitle: breadcrumb.at(-1)?.label ?? "Dashboard",
      breadcrumbItems: breadcrumb,
    };
  }, [pathname]);

  const handleLogout = () => {
    setIsDrawerOpen(false);
    router.push("/auth/login");
  };

  const Sidebar = (
    <div className="flex min-h-0 flex-col bg-[color:var(--color-surface)]">
      <div className="border-b border-[color:var(--color-divider)] px-6 py-6">
        <div className="flex items-center gap-3">
          <AdminLogo />
        </div>
        <p className="mt-3 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--color-text-faint)]">
          Admin Panel
        </p>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={() => setIsDrawerOpen(false)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center gap-3 px-4 py-3 font-ui text-[length:var(--text-sm)] font-medium text-[color:var(--color-primary)] transition-colors duration-200 hover:bg-[color:var(--color-surface-2)]"
          style={{ borderRadius: "999px" }}
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Шығу</span>
        </button>
      </nav>

      <div className="border-t border-[color:var(--color-divider)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] font-ui text-[length:var(--text-sm)] font-semibold text-[color:var(--color-primary)]">
            AP
          </div>
          <div className="min-w-0">
            <p className="truncate font-ui text-[length:var(--text-sm)] font-medium text-[color:var(--color-text)]">
              Admin User
            </p>
            <p className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.14em] text-[color:var(--color-text-faint)]">
              Редактор
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2"
      style={{ minHeight: "calc(100vh - 10rem)" }}
    >
      <div className="flex min-h-[calc(100vh-10rem)] bg-[color:var(--color-surface-2)]">
        <aside className="hidden w-[240px] shrink-0 border-r border-[color:var(--color-divider)] lg:block">
          {Sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[color:var(--color-divider)] bg-[color:var(--color-surface)] px-5 py-4 md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text)] lg:hidden"
                  aria-label="Open admin menu"
                >
                  <Menu size={18} />
                </button>

                <div>
                  <p className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
                    {pageTitle}
                  </p>
                  <nav
                    aria-label="Breadcrumb"
                    className="mt-1 flex flex-wrap items-center gap-2 font-ui text-[length:var(--text-xs)] uppercase tracking-[0.12em] text-[color:var(--color-text-faint)]"
                  >
                    {breadcrumbItems.map((item, index) => (
                      <span key={item.href} className="inline-flex items-center gap-2">
                        {index > 0 ? <span>/</span> : null}
                        <Link href={item.href} className="no-underline hover:text-[color:var(--color-primary)]">
                          {item.label}
                        </Link>
                      </span>
                    ))}
                  </nav>
                </div>
              </div>

              <ThemeToggle />
            </div>
          </div>

          <div className="flex-1 bg-[color:var(--color-surface)] p-[var(--space-8)]">
            {children}
          </div>
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-[color:var(--color-overlay)] backdrop-blur-sm"
            aria-label="Close admin menu"
          />

          <div className="absolute inset-x-0 bottom-0 z-10 max-h-[82vh] overflow-hidden rounded-t-[var(--radius-lg)] border-t border-[color:var(--color-divider)] bg-[color:var(--color-surface)] shadow-[var(--shadow-md)]">
            <div className="flex items-center justify-between border-b border-[color:var(--color-divider)] px-6 py-4">
              <p className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.18em] text-[color:var(--color-text-faint)]">
                Navigation
              </p>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text)]"
                aria-label="Close admin menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(82vh-73px)] overflow-y-auto">{Sidebar}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
