"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function ZerdeLogo() {
  return (
    <svg
      width="220"
      height="88"
      viewBox="0 0 220 88"
      role="img"
      aria-labelledby="auth-zerde-logo-title"
      className="h-auto w-[11rem]"
    >
      <title id="auth-zerde-logo-title">ZERDE</title>
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
        ZERDE
      </text>
      <path d="M86 61H134L110 79L86 61Z" fill="var(--color-primary)" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M23.04 12.26c0-.78-.07-1.53-.2-2.26H12v4.28h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2.02 3.42-5 3.42-8.4Z"
        fill="var(--color-google-blue)"
      />
      <path
        d="M12 24c3.1 0 5.7-1.03 7.6-2.8l-3.72-2.9c-1.03.7-2.34 1.12-3.88 1.12-2.98 0-5.5-2-6.4-4.7H1.76v2.97A12 12 0 0 0 12 24Z"
        fill="var(--color-google-green)"
      />
      <path
        d="M5.6 14.72A7.2 7.2 0 0 1 5.24 12c0-.94.16-1.85.36-2.72V6.3H1.76A12 12 0 0 0 0 12c0 1.94.46 3.78 1.76 5.7l3.84-2.98Z"
        fill="var(--color-google-yellow)"
      />
      <path
        d="M12 4.76c1.68 0 3.18.58 4.36 1.72l3.26-3.26C17.7 1.4 15.1 0 12 0A12 12 0 0 0 1.76 6.3l3.84 2.98c.9-2.7 3.42-4.52 6.4-4.52Z"
        fill="var(--color-google-red)"
      />
    </svg>
  );
}

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setError(
          "Supabase конфигурациясы әлі дайын емес. Жарамды орта айнымалыларын қосыңыз.",
        );
        return;
      }

      // TODO: Replace this temporary auth flow with the real admin redirect/session handling.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      }
    } catch {
      setError("Кіру кезінде қате пайда болды. Қайтадан көріңіз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
      className="auth-card-enter w-full max-w-[480px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-[var(--space-8)] md:p-[var(--space-10)]"
      style={{
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex flex-col items-center gap-[var(--space-5)] text-center">
        <ZerdeLogo />
        <h1 className="font-display text-[length:var(--text-xl)] text-[color:var(--color-text)]">
          Жүйеге кіру
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-[var(--space-8)] flex flex-col gap-[var(--space-5)]"
      >
        <label className="flex flex-col gap-2">
          <span className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="min-h-12 w-full border bg-transparent px-4 font-ui text-[length:var(--text-base)] text-[color:var(--color-text)] outline-none transition-shadow duration-200"
            style={{
              borderColor: "var(--color-border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 0 0 0 transparent",
            }}
            onFocus={(event) => {
              event.currentTarget.style.boxShadow =
                "0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)";
              event.currentTarget.style.borderColor = "var(--color-primary)";
            }}
            onBlur={(event) => {
              event.currentTarget.style.boxShadow = "0 0 0 0 transparent";
              event.currentTarget.style.borderColor = "var(--color-border)";
            }}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-ui text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
            Құпиясөз
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="min-h-12 w-full border bg-transparent px-4 pr-12 font-ui text-[length:var(--text-base)] text-[color:var(--color-text)] outline-none transition-shadow duration-200"
              style={{
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 0 0 0 transparent",
              }}
              onFocus={(event) => {
                event.currentTarget.style.boxShadow =
                  "0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                event.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onBlur={(event) => {
                event.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                event.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[color:var(--color-text-faint)] transition-colors duration-200 hover:text-[color:var(--color-primary)]"
              aria-label={
                showPassword ? "Құпиясөзді жасыру" : "Құпиясөзді көрсету"
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center bg-[color:var(--color-primary)] font-ui text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-inverse)] transition-colors duration-200 hover:bg-[color:var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {isSubmitting ? "Кіріп жатыр..." : "Кіру"}
        </button>

        {error ? (
          <p className="font-ui text-[length:var(--text-sm)] text-[color:var(--color-error)]">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-4 pt-[var(--space-2)]">
          <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
          <span className="font-ui text-[length:var(--text-xs)] uppercase tracking-[0.16em] text-[color:var(--color-text-faint)]">
            немесе
          </span>
          <div className="h-px flex-1 bg-[color:var(--color-divider)]" />
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-3 border border-[color:var(--color-border)] bg-transparent font-ui text-[length:var(--text-sm)] font-medium text-[color:var(--color-text)] transition-colors duration-200 hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <GoogleMark />
          Google арқылы кіру
        </button>
      </form>
    </motion.div>
  );
}
