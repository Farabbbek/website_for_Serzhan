"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Іздеу...",
  className,
}: SearchBarProps) {
  return (
    <div
      className={className}
      style={{ width: "100%" }}
    >
      <div
        className="flex w-full items-center gap-3 border bg-[color:var(--color-surface)] px-4 py-3 transition-[border-color,box-shadow] duration-[180ms] focus-within:border-[color:var(--color-primary)] focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
        style={{
          borderColor: "var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Search
          size={18}
          strokeWidth={1.8}
          className="shrink-0 text-[color:var(--color-text-faint)]"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSearch(value);
            }

            if (event.key === "Escape") {
              event.preventDefault();
              onChange("");
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent font-ui text-[length:var(--text-base)] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-faint)]"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--color-text-faint)] transition-colors duration-[180ms] hover:text-[color:var(--color-primary)]"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
