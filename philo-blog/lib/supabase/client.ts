"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

let browserClient:
  | ReturnType<typeof createBrowserClient<Database>>
  | null
  | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url === "placeholder" ||
    anonKey === "placeholder"
  ) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
