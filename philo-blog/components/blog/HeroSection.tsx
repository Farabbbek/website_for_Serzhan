"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Earth,
  Globe,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const badges: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Globe, label: "Ашық ой" },
  { icon: HeartHandshake, label: "Бейбіт этика" },
  { icon: Earth, label: "Әлемдік контекст" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroSection() {
  return (
    <section aria-label="Featured articles" className="w-full">
      <div className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-[3fr_2fr] md:items-stretch">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          animate={prefersReducedMotion ? "visible" : undefined}
          viewport={{ once: true, amount: 0.3 }}
          className="order-2 flex flex-col gap-[var(--space-6)] md:order-1"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 border-b border-[var(--color-divider)] pb-[var(--space-6)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-wrap items-center gap-y-2">
                {badges.map(({ icon: Icon, label }, index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 ${
                      index > 0
                        ? "ml-4 border-l border-[var(--color-divider)] pl-4"
                        : ""
                    }`}
                  >
                    <Icon
                      size={14}
                      strokeWidth={1.8}
                      className="text-[color:var(--color-secondary)]"
                    />
                    <span className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="font-ui text-[length:var(--text-xs)] font-medium tracking-[0.14em] text-[color:var(--color-text-faint)]">
                18-04-2026
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.08] text-[color:var(--color-text)]">
                Цифровая среда и философия созерцания: как медленные мысли
                выживают в эпоху непрерывного потока
              </h1>
              <p className="max-w-[80ch] font-body text-[length:var(--text-base)] leading-8 text-[color:var(--color-text-muted)]">
                Блог о философии уже не может говорить только о книгах и
                канонах. Сегодня он должен разбирать интерфейсы, алгоритмы,
                формы внимания и новые языки публичной мысли, сохраняя при этом
                достоинство медленного чтения.
              </p>
              <Link
                href="/"
                className="font-ui text-[length:var(--text-sm)] font-bold tracking-[0.08em] text-[color:var(--color-primary)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary-hover)]"
              >
                Оқу...
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="section-rule">
              Второй материал
            </div>
            <h2 className="font-display text-[length:var(--text-xl)] leading-[1.12] text-[color:var(--color-text)]">
              Этика ЖАИ между утопией и осторожностью: можно ли делегировать
              машине моральное суждение
            </h2>
            <p className="max-w-[72ch] font-body text-[length:var(--text-sm)] leading-7 text-[color:var(--color-text-muted)]">
              Разбираем, почему разговор об искусственном интеллекте быстро
              становится разговором о человеческой ответственности, культурной
              памяти и политике решений.
            </p>
            <Link
              href="/"
              className="font-ui text-[length:var(--text-sm)] font-bold tracking-[0.08em] text-[color:var(--color-primary)] no-underline transition-colors duration-200 hover:text-[color:var(--color-primary-hover)]"
            >
              Оқу...
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          animate={prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, amount: 0.25 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
          className="order-1 md:order-2"
        >
          <div className="group relative h-full min-h-[24rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[color:var(--color-surface-2)] shadow-[var(--shadow-soft)] aspect-[3/4] md:aspect-auto">
            <Image
              src="https://picsum.photos/seed/philosophy/600/800"
              alt="Moody philosophical editorial portrait"
              width={600}
              height={800}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)]/10 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
