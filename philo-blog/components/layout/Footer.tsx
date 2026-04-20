"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  soon?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export default function Footer() {
  const year = new Date().getFullYear();

  const columns: FooterColumn[] = [
    {
      title: "ZERDE",
      links: [
        { label: "Басты бет", href: "/" },
        { label: "Мақалалар", href: "/category/maqalalar" },
        { label: "Цифр", href: "/category/cifr" },
        { label: "Этика", href: "/category/etika" },
      ],
    },
    {
      title: "ПЛАТФОРМА",
      links: [
        { label: "Біз туралы", href: "/about" },
        { label: "Мақалалар", href: "/category/maqalalar" },
        { label: "Форум", href: "/forum", soon: true },
        { label: "Подкасттар", href: "/podcasts" },
      ],
    },
    {
      title: "БАЙЛАНЫС",
      links: [
        {
          label: "Telegram",
          href: "https://t.me/zerde_philosophy",
          external: true,
        },
        {
          label: "Instagram",
          href: "https://instagram.com/zerde.philosophy",
          external: true,
        },
        {
          label: "YouTube",
          href: "https://youtube.com/@zerde",
          external: true,
        },
        { label: "Email", href: "mailto:zerde@kargu.kz", external: true },
      ],
    },
  ];

  return (
    <motion.footer
      style={{
        borderTop: "1px solid var(--color-divider)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(40px, 5vw, 64px) clamp(24px, 6vw, 80px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "clamp(32px, 4vw, 48px)",
        }}
      >
        {/* Brand column */}
        <div>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--color-text)",
              marginBottom: 4,
            }}
          >
            ZERDE
          </p>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #C5401A",
              marginBottom: 16,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              lineHeight: 1.7,
              color: "var(--color-text-muted)",
              maxWidth: 200,
            }}
          >
            Қазақстан философия студенттерінің платформасы. КарГУ · Ф-23-1К
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--color-text-faint)",
                marginBottom: 16,
              }}
            >
              {col.title}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-disabled={link.soon ? true : undefined}
                    className={`footer-link${link.soon ? " footer-link-soon" : ""}`}
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "color 180ms ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      if (link.soon) return;
                      e.currentTarget.style.color = "var(--color-text)";
                    }}
                    onMouseLeave={(e) => {
                      if (link.soon) return;
                      e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                  >
                    {link.label}
                    {link.soon ? <span className="soon-tag">Soon</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--color-divider)",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px clamp(24px, 6vw, 80px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            color: "var(--color-text-faint)",
            letterSpacing: "0.06em",
          }}
        >
          © {year} ZERDE · Е.А.Бөкетов атындағы КарГУ
        </p>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            color: "var(--color-text-faint)",
            letterSpacing: "0.06em",
          }}
        >
          КАЗ / РУС / ENG
        </p>
      </div>
    </motion.footer>
  );
}
