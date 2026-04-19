"use client";

import { useEffect, useState } from "react";

type UnauthorizedToastProps = {
  message: string;
};

export default function UnauthorizedToast({ message }: UnauthorizedToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 120,
        background: "#b42318",
        color: "#ffffff",
        padding: "12px 16px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
    >
      {message}
    </div>
  );
}
