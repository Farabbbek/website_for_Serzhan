"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)] hover:bg-[color:var(--color-primary-hover)]",
  secondary:
    "border border-[color:var(--color-border)] bg-transparent text-[color:var(--color-text)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]",
  ghost:
    "bg-transparent text-[color:var(--color-primary)] hover:underline",
  danger:
    "bg-[color:var(--color-error)] text-[color:var(--color-text-inverse)] hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-[length:var(--text-xs)]",
  md: "min-h-11 px-5 text-[length:var(--text-sm)]",
  lg: "min-h-12 px-6 text-[length:var(--text-base)]",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-ui font-semibold uppercase tracking-[0.08em] transition-all duration-[180ms]",
        variant !== "ghost" && "border border-transparent",
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && "pointer-events-none opacity-70",
        className,
      )}
      style={{ borderRadius: "var(--radius-md)" }}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
