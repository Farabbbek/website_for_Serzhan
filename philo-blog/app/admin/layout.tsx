"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Newspaper,
  Mic2,
  BookOpen,
  Home,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [newPostOpen, setNewPostOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const navItemStyle = (href: string, accent?: string) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderRadius: 7,
    fontSize: 13,
    textDecoration: "none",
    cursor: "pointer",
    marginBottom: 2,
    background: isActive(href)
      ? (accent ? `${accent}18` : "rgba(197,64,26,0.1)")
      : "transparent",
    color: isActive(href)
      ? (accent || "var(--color-primary)")
      : "var(--color-text-muted)",
    fontWeight: isActive(href) ? 600 : 400,
  } as CSSProperties);

  const subItemStyle = (href: string, accent: string) => ({
    ...navItemStyle(href, accent),
    paddingLeft: 28,
    fontSize: 12,
  });

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-muted)",
    padding: "12px 12px 4px",
  };

  const divider = {
    height: 1,
    background: "var(--color-border)",
    margin: "6px 0",
  };

  return (
    <div
      className="admin-layout-root"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        overflowX: "hidden",
        background: "var(--color-bg)",
      }}
    >
      <style>{`
        /* Admin responsive */
        .admin-layout-root > main {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
        }

        .admin-sidebar {
          width: 220px;
          min-width: 220px;
          height: 100vh;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
          z-index: 50;
        }

        .admin-hamburger { display: none; }

        .admin-overlay {
          display: none;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .admin-sidebar.open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.12);
          }
          .admin-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 7px;
            border: 1px solid var(--color-border);
            background: var(--color-surface);
            cursor: pointer;
            color: var(--color-text);
            flex-shrink: 0;
          }
          .admin-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 40;
            backdrop-filter: blur(2px);
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .admin-sidebar {
            width: 100vw;
            min-width: 100vw;
          }
          .admin-main-content table {
            min-width: 600px;
          }
          .admin-main-content {
            padding: 20px 16px !important;
          }
          .admin-topbar {
            padding: 0 16px !important;
          }
        }

        @media (max-width: 767px) {
          .admin-page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
          .admin-filter-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          height: "100vh",
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 16px 12px" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "var(--color-text)",
            }}
          >
            ZERDE
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Admin Panel
          </div>
        </div>

        <div style={divider} />

        <nav style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
          <div style={sectionLabel}>Навигация</div>

          <Link href="/admin" style={navItemStyle("/admin")}>
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link href="/admin/posts" style={navItemStyle("/admin/posts")}>
            <FileText size={16} />
            Мақалалар
          </Link>
          <Link href="/admin/categories" style={navItemStyle("/admin/categories")}>
            <Tag size={16} />
            Категориялар
          </Link>

          <div style={divider} />
          <div style={sectionLabel}>Жаңа контент</div>

          <div
            onClick={() => setNewPostOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 7,
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: 13,
              marginBottom: 2,
              userSelect: "none",
            }}
          >
            <span>Жаңа жазба</span>
            <ChevronDown
              size={14}
              style={{
                transform: newPostOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>

          {newPostOpen && (
            <div>
              <Link
                href="/admin/posts/new/article"
                style={subItemStyle("/admin/posts/new/article", "#C5401A")}
              >
                <FileText size={14} />
                Мақала
              </Link>
              <Link
                href="/admin/posts/new/news"
                style={subItemStyle("/admin/posts/new/news", "#2563eb")}
              >
                <Newspaper size={14} />
                Жаңалық
              </Link>
              <Link
                href="/admin/posts/new/podcast"
                style={subItemStyle("/admin/posts/new/podcast", "#7c3aed")}
              >
                <Mic2 size={14} />
                Подкаст
              </Link>
              <Link
                href="/admin/posts/new/material"
                style={subItemStyle("/admin/posts/new/material", "#059669")}
              >
                <BookOpen size={14} />
                Материал
              </Link>
            </div>
          )}
        </nav>

        <div style={divider} />

        <div style={{ padding: 8 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 7,
              fontSize: 13,
              textDecoration: "none",
              color: "var(--color-text-muted)",
            }}
          >
            <Home size={16} />
            Сайтқа өту
          </Link>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "none",
          margin: 0,
          minWidth: 0,
          height: "100vh",
          overflow: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="admin-topbar"
          style={{
            height: 52,
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
            background: "var(--color-surface)",
            flexShrink: 0,
            fontSize: 13,
            color: "var(--color-text-muted)",
          }}
        >
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Меню"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              marginLeft: 8,
            }}
          >
            ZERDE Admin
          </span>
        </div>

        <div
          className="admin-main-content"
          style={{
            flex: 1,
            padding: "36px 40px",
            overflow: "auto",
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
