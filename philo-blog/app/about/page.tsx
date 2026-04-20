"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-7"
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="block font-display text-[42px] leading-none text-[color:var(--color-text)]"
      >
        {displayValue}
        {suffix}
      </motion.span>
      <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
        {label}
      </p>
    </div>
  );
}

const teamMembers = [
  {
    name: "Marat Zhumageldinov",
    role: "Куратор",
  },
  {
    name: "Al-Farabi Tusup",
    role: "Редактор",
  },
  {
    name: "Daniyar Bekbol",
    role: "Контент координаторы",
  },
  {
    name: "Aigerim Nurtai",
    role: "Қоғамдастық менеджері",
  },
];

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const teamContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const teamItem = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export default function AboutPage() {
  return (
    <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}>
      <section
        className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] px-6 py-24 text-[color:var(--color-text)]"
      >
        <div className="mx-auto w-full max-w-[1120px]">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", fontWeight: 800, lineHeight: 0.96 }}
            className="font-display"
          >
            ZERDE туралы
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-6 max-w-[680px] font-ui text-[14px] uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]"
          >
            Қазақстан философия студенттерінің платформасы
          </motion.p>
        </div>
      </section>

      <section className="bg-[color:var(--color-bg)] px-6 py-24">
        <div className="mx-auto w-full max-w-[1120px]">
          <FadeUp>
            <h2 className="font-display text-[clamp(2rem,4.8vw,4.1rem)] text-[color:var(--color-text)]">
              Біздің миссия
            </h2>
            <p className="mt-7 max-w-[860px] font-ui text-[15px] leading-[1.9] uppercase tracking-[0.07em] text-[color:var(--color-text-muted)]">
              Философияны барлығына қолжетімді ету және Қазақстанның әр аймағындағы студенттерді бір ортаға жинау.
              Біз ашық пікірталасқа, академиялық еркіндікке және сапалы білім алмасуға негізделген цифрлық орта құрамыз.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="border-y border-[color:var(--color-divider)] bg-[color:var(--color-surface-2)] px-6 py-20">
        <div className="mx-auto w-full max-w-[1120px]">
          <FadeUp>
            <p className="mb-8 font-ui text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Қауымдастық статистикасы</p>
          </FadeUp>
          <div className="grid gap-4 md:grid-cols-3">
            <CountUp value={500} suffix="+" label="Студент" />
            <CountUp value={120} suffix="+" label="Талқылау тақырыбы" />
            <CountUp value={40} suffix="+" label="Автор" />
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-bg)] px-6 py-24">
        <div className="mx-auto w-full max-w-[1120px]">
          <FadeUp>
            <h3 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] text-[color:var(--color-text)]">
              Команда
            </h3>
          </FadeUp>

          <motion.div
            variants={teamContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 grid gap-5 md:grid-cols-2"
          >
            {teamMembers.map((member) => (
              <motion.article
                key={member.name}
                variants={teamItem}
                className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
              >
                <p className="font-display text-[30px] leading-[1.02] text-[color:var(--color-text)]">{member.name}</p>
                <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-primary)]">{member.role}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
