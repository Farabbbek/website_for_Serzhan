export const LOCALE_COOKIE_NAME = "zerde_locale";

export const SUPPORTED_LOCALES = ["kk", "ru", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value === "ru" || value === "en" || value === "kk") {
    return value;
  }

  return "kk";
}

export const localeButtonLabels: Record<Locale, string> = {
  ru: "RUS",
  kk: "KAZ",
  en: "ENG",
};

