"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const socials = [
  {
    name: "Telegram",
    handle: "@zerde_philosophy",
    desc: "Негізгі чат - жаңалықтар, пікірталастар",
    href: "https://t.me/zerde_philosophy",
    color: "#229ED9",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 13.944l-2.967-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.946l-.528-.331z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@zerde.philosophy",
    desc: "Визуалды контент, цитаталар, медиа",
    href: "https://instagram.com/zerde.philosophy",
    color: "#E1306C",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "ZERDE Philosophy",
    desc: "Лекциялар, подкасттар, видео материалдар",
    href: "https://youtube.com/@zerde",
    color: "#FF0000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Email",
    handle: "zerde@kargu.kz",
    desc: "Серіктестік және ресми ұсыныстар",
    href: "mailto:zerde@kargu.kz",
    color: "#C5401A",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function ConnectPage() {
  return (
    <main
      style={{
        background: "var(--color-bg)",
        minHeight: "100dvh",
        padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: 64 }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C5401A",
              marginBottom: 12,
            }}
          >
            Байланыс
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "var(--color-text)",
              marginBottom: 20,
            }}
          >
            ЖАЗЫЛУ
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              lineHeight: 1.8,
              color: "var(--color-text-muted)",
              maxWidth: 540,
            }}
          >
            Бізбен байланысу үшін әлеуметтік желілерімізге жазылыңыз немесе тікелей хабарлама жіберіңіз.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1,
            background: "var(--color-divider)",
          }}
        >
          {socials.map((s) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                display: "block",
                background: "var(--color-bg)",
                padding: "clamp(24px, 3vw, 36px)",
                textDecoration: "none",
                color: "var(--color-text)",
                transition: "background 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-offset)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-bg)";
              }}
            >
              <div style={{ color: s.color, marginBottom: 16 }}>{s.icon}</div>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: 4,
                }}
              >
                {s.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: s.color,
                  marginBottom: 12,
                }}
              >
                {s.handle}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--color-text-muted)",
                }}
              >
                {s.desc}
              </p>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-faint)",
                }}
              >
                → Өту
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
