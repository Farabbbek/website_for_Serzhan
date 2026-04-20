"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const { m } = useLanguage();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorText(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorText(m.auth.missingSupabase);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setErrorText(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setErrorText(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorText(m.auth.missingSupabase);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorText(error.message);
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "46px 42px",
          boxShadow: "0 14px 34px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 34,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0.06em",
              color: "var(--color-text)",
            }}
          >
            ZERDE
          </p>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "8px solid #C5401A",
              margin: "6px auto 0",
            }}
          />
          <p
            style={{
              marginTop: 14,
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--color-text-muted)",
              letterSpacing: "0.02em",
            }}
          >
            {m.auth.googleFirst}
          </p>
        </div>

        {errorText ? (
          <p style={{ ...statusTextStyle, color: "#d45128", marginBottom: 12 }}>{errorText}</p>
        ) : null}

        <button
          type="button"
          style={{
            width: "100%",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            border: "1px solid var(--color-border)",
            background: "var(--color-text)",
            color: "var(--color-bg)",
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: "pointer",
            transition: "opacity 200ms ease",
          }}
          onClick={handleGoogleSignIn}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {m.auth.googleLogin}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0 16px",
            color: "var(--color-text-faint)",
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            letterSpacing: "0.1em",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
          {m.auth.or}
          <div style={{ flex: 1, height: 1, background: "var(--color-divider)" }} />
        </div>

        <button
          type="button"
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 600,
            textAlign: "left",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: 3,
            marginBottom: showEmailLogin ? 14 : 0,
          }}
          onClick={() => setShowEmailLogin((prev) => !prev)}
          aria-expanded={showEmailLogin}
          aria-controls="email-login-form"
        >
          {m.auth.emailLogin}
        </button>

        <AnimatePresence initial={false}>
          {showEmailLogin ? (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", paddingTop: 8 }}
              id="email-login-form"
            >
              <LoginForm
                email={loginEmail}
                password={loginPassword}
                onEmailChange={setLoginEmail}
                onPasswordChange={setLoginPassword}
                onSubmit={handleLoginSubmit}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

type LoginFormProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const { m } = useLanguage();

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        borderTop: "1px solid var(--color-divider)",
        paddingTop: 16,
      }}
      onSubmit={onSubmit}
    >
      <div>
        <label style={labelStyle}>{m.auth.email}</label>
        <input
          type="email"
          required
          style={inputStyle}
          placeholder="email@example.com"
          value={email}
          autoComplete="email"
          onChange={(event) => onEmailChange(event.target.value)}
        />
      </div>
      <div>
        <label style={labelStyle}>{m.auth.password}</label>
        <input
          type="password"
          required
          style={inputStyle}
          value={password}
          autoComplete="current-password"
          onChange={(event) => onPasswordChange(event.target.value)}
        />
      </div>
      <button type="submit" style={submitBtnStyle}>
        {m.auth.signIn}
      </button>
    </form>
  );
}

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--color-text-muted)",
  display: "block",
  marginBottom: 6,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  background: "var(--color-surface-offset)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  fontFamily: "var(--font-ui)",
  fontSize: 14,
  outline: "none",
  transition: "border-color 200ms ease",
};

const statusTextStyle: CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 11,
  letterSpacing: "0.05em",
};

const submitBtnStyle: CSSProperties = {
  width: "100%",
  padding: "13px",
  background: "#C5401A",
  color: "#ffffff",
  border: "none",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "background 200ms ease",
};
