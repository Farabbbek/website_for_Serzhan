"use client";

import clsx from "clsx";

type CategoryBadgeVariant = "filled" | "outline" | "flat";

type CategoryBadgeProps = {
  name: string;
  slug?: string;
  variant?: CategoryBadgeVariant;
  className?: string;
};

const variantClasses: Record<CategoryBadgeVariant, string> = {
  filled:
    "bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]",
  outline:
    "border border-[color:var(--color-primary)] bg-transparent text-[color:var(--color-primary)]",
  flat: "bg-transparent text-[color:var(--color-primary)]",
};

export function CategoryBadge({
  name,
  slug,
  variant = "filled",
  className,
}: CategoryBadgeProps) {
  return (
    <span
      data-slug={slug}
      className={clsx(
        "inline-flex items-center font-ui text-[length:var(--text-xs)] uppercase tracking-[0.05em]",
        variant !== "flat" && "px-3 py-1.5",
        variantClasses[variant],
        className,
      )}
      style={variant === "flat" ? undefined : { borderRadius: "999px" }}
    >
      {name}
    </span>
  );
}
