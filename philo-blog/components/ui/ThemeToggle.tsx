"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-11 w-11 items-center justify-center border bg-[color:var(--color-surface)] text-[color:var(--color-text)] transition-colors duration-180 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
      style={{
        borderColor: "var(--color-border)",
        borderRadius: "999px",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0,
                  rotate: -90,
                }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 0,
                  scale: 0,
                  rotate: 90,
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.18, ease: "easeOut" }
          }
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
