import { cookies } from "next/headers";
import { messages } from "@/lib/i18n/messages";
import { normalizeLocale, type Locale, LOCALE_COOKIE_NAME } from "@/lib/i18n/config";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
}

export async function getServerMessages() {
  const locale = await getServerLocale();
  return { locale, m: messages[locale] };
}

